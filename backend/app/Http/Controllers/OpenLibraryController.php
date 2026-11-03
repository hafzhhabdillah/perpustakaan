<?php

namespace App\Http\Controllers;

use App\Services\OpenLibraryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;

class OpenLibraryController extends Controller
{
    public function __construct(protected OpenLibraryService $openLibraryService) {}

    /**
     * Search books in Open Library API.
     */
    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'q' => 'required|string|min:2|max:100',
            'limit' => 'nullable|integer|min:1|max:30',
            'page' => 'nullable|integer|min:1|max:50',
        ], [
            'q.required' => 'Kata kunci pencarian buku wajib diisi.',
            'q.min' => 'Kata kunci pencarian minimal 2 karakter.',
        ]);

        $query = $request->input('q');
        $limit = (int) $request->input('limit', 12);
        $page = (int) $request->input('page', 1);

        try {
            $result = $this->openLibraryService->search($query, $limit, $page);

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data dari Open Library: ' . $e->getMessage(),
            ], 502);
        }
    }

    /**
     * Import a book from Open Library to local database (Admin only).
     */
    public function import(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:200',
            'publisher' => 'nullable|string|max:200',
            'published_year' => 'nullable|integer',
            'isbn' => 'nullable|string|max:50',
            'cover_image' => 'nullable|string|max:1000',
            'description' => 'nullable|string|max:5000',
            'stock' => 'required|integer|min:1|max:10000',
            'open_library_key' => 'nullable|string|max:100',
        ], [
            'category_id.required' => 'Pilih kategori untuk buku ini.',
            'title.required' => 'Judul buku wajib tersedia.',
            'author.required' => 'Nama penulis wajib tersedia.',
            'stock.required' => 'Jumlah stok buku wajib diisi.',
        ]);

        try {
            $book = $this->openLibraryService->importBook(
                $validated,
                (int) $validated['category_id'],
                (int) $validated['stock']
            );

            return response()->json([
                'success' => true,
                'message' => "Buku \"{$book->title}\" berhasil ditambahkan ke koleksi perpustakaan.",
                'data' => $book->load('category'),
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
