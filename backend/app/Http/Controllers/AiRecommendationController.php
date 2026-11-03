<?php

namespace App\Http\Controllers;

use App\Services\GroqAiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;

class AiRecommendationController extends Controller
{
    public function __construct(protected GroqAiService $groqService) {}

    /**
     * Check AI integration configuration status.
     */
    public function status(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'is_configured' => $this->groqService->isConfigured(),
                'model' => config('services.groq.model', 'llama-3.3-70b-versatile'),
            ],
        ]);
    }

    /**
     * Get AI Book Recommendations based on prompt.
     */
    public function recommend(Request $request): JsonResponse
    {
        $request->validate([
            'prompt' => 'required|string|min:3|max:500',
            'limit' => 'nullable|integer|min:1|max:8',
        ], [
            'prompt.required' => 'Jelaskan buku atau topik yang ingin Anda baca.',
            'prompt.min' => 'Deskripsi minat membaca minimal 3 karakter.',
        ]);

        $prompt = $request->input('prompt');
        $limit = (int) $request->input('limit', 4);

        try {
            $recommendations = $this->groqService->recommendBooks($prompt, $limit);

            return response()->json([
                'success' => true,
                'data' => $recommendations,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Chat with AI Book Assistant.
     */
    public function chat(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string|min:2|max:1000',
            'history' => 'nullable|array|max:10',
            'history.*.role' => 'required|string|in:user,assistant',
            'history.*.content' => 'required|string',
        ], [
            'message.required' => 'Pesan untuk asisten AI wajib diisi.',
        ]);

        $message = $request->input('message');
        $history = $request->input('history', []);

        try {
            $reply = $this->groqService->chat($message, $history);

            return response()->json([
                'success' => true,
                'data' => [
                    'reply' => $reply,
                    'timestamp' => now()->toIso8601String(),
                ],
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
