<?php

namespace App\Services;

use App\Models\Book;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class GroqAiService
{
    protected string $endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    protected string $model;
    protected ?string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.groq.api_key');
        $this->model = config('services.groq.model', 'llama-3.3-70b-versatile');
    }

    /**
     * Verify if Groq API Key is configured.
     */
    public function isConfigured(): bool
    {
        return !empty($this->apiKey);
    }

    /**
     * Feature 1: AI Book Recommendation based on reading interests/topics.
     */
    public function recommendBooks(string $userPrompt, int $limit = 4): array
    {
        if (!$this->isConfigured()) {
            throw new Exception('GROQ_API_KEY belum dikonfigurasi di file .env backend.');
        }

        // Fetch sample of local library books as reference context
        $localBooks = Book::with('category')
            ->select('id', 'category_id', 'title', 'author', 'published_year', 'description')
            ->take(30)
            ->get()
            ->map(fn($b) => [
                'id' => $b->id,
                'title' => $b->title,
                'author' => $b->author,
                'category' => $b->category?->name,
                'year' => $b->published_year,
            ])
            ->toArray();

        $localBooksJson = json_encode($localBooks, JSON_UNESCAPED_UNICODE);

        $systemPrompt = <<<EOT
Kamu adalah Asisten Kurator Buku & Pustakawan Cerdas untuk perpustakaan "Library Management System".
Tugasmu adalah memberikan rekomendasi buku terbaik dan relevan berdasarkan minat atau kebutuhan membaca pengguna.

DAFTAR BUKU YANG SAAT INI TERSEDIA DI KOLEKSI PERPUSTAKAAN KAMI:
{$localBooksJson}

ATURAN REKOMENDASI:
1. Prioritaskan merekomendasikan buku yang ADA di koleksi perpustakaan kami jika relevan dengan minat pengguna, dan sertakan "library_book_id"-nya.
2. Jika ada buku klasik/terkenal dunia di luar koleksi kami yang sangat cocok dengan kebutuhan pengguna, kamu boleh menyarankannya dengan "library_book_id": null.
3. Berikan alasan mengapa buku tersebut cocok dengan bahasa Indonesia yang inspiratif, santun, dan informatif.
4. Kembalikan HANYA format JSON valid berikut (tanpa markdown backticks di luar format JSON):
{
  "summary": "Ringkasan tanggapan atas minat pengguna dalam 2-3 kalimat ramah.",
  "topics": ["Topik 1", "Topik 2", "Topik 3"],
  "recommendations": [
    {
      "title": "Judul Buku",
      "author": "Nama Penulis",
      "reason": "Alasan rekomendasi yang jelas dan memotivasi.",
      "is_in_library": true,
      "library_book_id": 1
    }
  ]
}
EOT;

        try {
            $response = Http::withToken($this->apiKey)
                ->timeout(25)
                ->post($this->endpoint, [
                    'model' => $this->model,
                    'messages' => [
                        ['role' => 'system', 'content' => $systemPrompt],
                        ['role' => 'user', 'content' => "Minat membaca saya: \"{$userPrompt}\". Tolong berikan {$limit} rekomendasi buku terbaik."]
                    ],
                    'response_format' => ['type' => 'json_object'],
                    'temperature' => 0.3,
                ]);

            if ($response->failed()) {
                Log::error('Groq AI Recommendation Failed', [
                    'status' => $response->status(),
                    'error' => $response->json('error') ?? $response->body()
                ]);
                throw new Exception('Gagal menghubungi Groq AI: ' . ($response->json('error.message') ?? 'Terjadi kesalahan pada server AI.'));
            }

            $rawContent = $response->json('choices.0.message.content');
            $parsed = json_decode($rawContent, true);

            if (!$parsed || !isset($parsed['recommendations'])) {
                throw new Exception('Format respon AI tidak valid.');
            }

            // Hydrate local books details if library_book_id is present
            foreach ($parsed['recommendations'] as &$rec) {
                if (!empty($rec['library_book_id'])) {
                    $localBook = Book::with('category')->find($rec['library_book_id']);
                    if ($localBook) {
                        $rec['local_book'] = $localBook;
                        $rec['is_in_library'] = true;
                    } else {
                        $rec['is_in_library'] = false;
                        $rec['library_book_id'] = null;
                    }
                }
            }

            return $parsed;
        } catch (Exception $e) {
            Log::error('GroqAiService Error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Feature 2: AI Book Assistant Chat.
     */
    public function chat(string $userMessage, array $conversationHistory = []): string
    {
        if (!$this->isConfigured()) {
            throw new Exception('GROQ_API_KEY belum dikonfigurasi di file .env backend.');
        }

        $systemMessage = [
            'role' => 'system',
            'content' => 'Kamu adalah "Libraria", asisten virtual ramah dan cerdas di Library Management System. Tugasmu adalah membantu pengunjung perpustakaan mencari buku, memahami ringkasan cerita, memberi saran belajar, dan menjelaskan topik literatur dengan bahasa Indonesia yang bersahabat, terstruktur, dan edukatif.'
        ];

        $messages = [$systemMessage];

        // Append recent chat history (max 6 messages to keep context clean)
        foreach (array_slice($conversationHistory, -6) as $msg) {
            if (isset($msg['role'], $msg['content']) && in_array($msg['role'], ['user', 'assistant'])) {
                $messages[] = [
                    'role' => $msg['role'],
                    'content' => $msg['content']
                ];
            }
        }

        $messages[] = ['role' => 'user', 'content' => $userMessage];

        try {
            $response = Http::withToken($this->apiKey)
                ->timeout(25)
                ->post($this->endpoint, [
                    'model' => $this->model,
                    'messages' => $messages,
                    'temperature' => 0.6,
                    'max_tokens' => 800,
                ]);

            if ($response->failed()) {
                Log::error('Groq AI Chat Failed', ['body' => $response->body()]);
                throw new Exception('Gagal mendapatkan balasan dari AI: ' . ($response->json('error.message') ?? 'Error'));
            }

            return $response->json('choices.0.message.content') ?? 'Maaf, saya tidak dapat merespon saat ini.';
        } catch (Exception $e) {
            Log::error('GroqAiService Chat Error: ' . $e->getMessage());
            throw $e;
        }
    }
}

