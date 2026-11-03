<?php

namespace App\Services;

use App\Models\Book;
use App\Models\Category;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class OpenLibraryService
{
    protected string $baseUrl = 'https://openlibrary.org';

    /**
     * Search books on Open Library API by query, title, or author.
     */
    public function search(string $query, int $limit = 12, int $page = 1): array
    {
        try {
            $response = Http::timeout(15)
                ->withHeaders([
                    'User-Agent' => 'LibraryManagementSystem/1.0 (contact@library.test)'
                ])
                ->get("{$this->baseUrl}/search.json", [
                    'q' => $query,
                    'limit' => $limit,
                    'page' => $page,
                    'fields' => 'key,title,author_name,first_publish_year,isbn,publisher,cover_i,subject',
                ]);

            if ($response->failed()) {
                Log::error('Open Library API Search Failed', ['status' => $response->status(), 'body' => $response->body()]);
                throw new Exception('Gagal menghubungi Open Library API.');
            }

            $data = $response->json();
            $docs = $data['docs'] ?? [];
            $total = $data['numFound'] ?? 0;

            // Get all local ISBNs to identify books already in local database
            $allIsbns = collect($docs)->pluck('isbn')->flatten()->filter()->unique()->toArray();
            $existingIsbns = Book::whereIn('isbn', $allIsbns)->pluck('isbn')->toArray();

            $formattedBooks = array_map(function ($doc) use ($existingIsbns) {
                $isbns = $doc['isbn'] ?? [];
                $firstIsbn = !empty($isbns) ? $isbns[0] : null;
                $coverId = $doc['cover_i'] ?? null;

                $coverUrl = $coverId
                    ? "https://covers.openlibrary.org/b/id/{$coverId}-L.jpg"
                    : ($firstIsbn ? "https://covers.openlibrary.org/b/isbn/{$firstIsbn}-L.jpg" : null);

                $isAlreadyInLibrary = $firstIsbn ? in_array($firstIsbn, $existingIsbns, true) : false;

                return [
                    'open_library_key' => $doc['key'] ?? null,
                    'title' => $doc['title'] ?? 'Tanpa Judul',
                    'author' => !empty($doc['author_name']) ? implode(', ', (array) $doc['author_name']) : 'Penulis Tidak Diketahui',
                    'publisher' => !empty($doc['publisher']) ? $doc['publisher'][0] : 'Penerbit Umum',
                    'published_year' => $doc['first_publish_year'] ?? null,
                    'isbn' => $firstIsbn,
                    'cover_image' => $coverUrl,
                    'subjects' => array_slice($doc['subject'] ?? [], 0, 5),
                    'is_already_in_library' => $isAlreadyInLibrary,
                ];
            }, $docs);

            return [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'books' => $formattedBooks,
            ];
        } catch (Exception $e) {
            Log::error('OpenLibraryService Error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Import a book from Open Library payload into local library collection.
     */
    public function importBook(array $bookData, int $categoryId, int $stock = 5): Book
    {
        // 1. Check duplicate by ISBN if present
        if (!empty($bookData['isbn'])) {
            $existing = Book::where('isbn', $bookData['isbn'])->first();
            if ($existing) {
                throw new Exception("Buku dengan ISBN {$bookData['isbn']} (\"{$existing->title}\") sudah ada di perpustakaan.");
            }
        }

        // 2. Validate category exists
        $category = Category::find($categoryId);
        if (!$category) {
            // Fallback to first category if not found
            $category = Category::first() ?? Category::create([
                'name' => 'Umum',
                'slug' => 'umum',
                'description' => 'Kategori umum koleksi perpustakaan'
            ]);
        }

        // 3. Create book record
        return Book::create([
            'category_id' => $category->id,
            'title' => $bookData['title'],
            'author' => $bookData['author'] ?? 'Penulis Tidak Diketahui',
            'publisher' => $bookData['publisher'] ?? null,
            'published_year' => !empty($bookData['published_year']) ? (int) $bookData['published_year'] : null,
            'isbn' => $bookData['isbn'] ?? null,
            'description' => $bookData['description'] ?? ('Buku diimpor dari Open Library: ' . $bookData['title']),
            'cover_image' => $bookData['cover_image'] ?? null,
            'stock' => $stock,
            'open_library_key' => $bookData['open_library_key'] ?? null,
        ]);
    }
}

