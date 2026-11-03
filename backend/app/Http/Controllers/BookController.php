<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookRequest;
use App\Http\Requests\UpdateBookRequest;
use App\Models\Book;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookController extends Controller
{
    /**
     * Display a listing of books with search, filter, and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $categoryId = $request->query('category_id');
        $perPage = (int) $request->query('per_page', 12);
        $sort = $request->query('sort', 'latest');

        $query = Book::with('category')
            ->search($search)
            ->category($categoryId);

        // Sorting
        match ($sort) {
            'oldest' => $query->oldest('id'),
            'title_asc' => $query->orderBy('title', 'asc'),
            'title_desc' => $query->orderBy('title', 'desc'),
            'year_desc' => $query->orderBy('published_year', 'desc'),
            default => $query->latest('id'),
        };

        $books = $query->paginate($perPage);

        // Check favorite status for authenticated user
        $user = auth('sanctum')->user();
        if ($user) {
            $userFavoriteIds = $user->favorites()->pluck('book_id')->toArray();
            $books->getCollection()->transform(function ($book) use ($userFavoriteIds) {
                $book->is_favorited = in_array($book->id, $userFavoriteIds, true);
                return $book;
            });
        }

        return response()->json([
            'success' => true,
            'data' => $books,
        ]);
    }

    /**
     * Display the specified book.
     */
    public function show(Request $request, $id): JsonResponse
    {
        $book = Book::with('category')->find($id);

        if (!$book) {
            return response()->json([
                'success' => false,
                'message' => 'Buku tidak ditemukan.',
            ], 404);
        }

        $user = auth('sanctum')->user();
        $book->is_favorited = $user ? $user->favorites()->where('book_id', $book->id)->exists() : false;

        return response()->json([
            'success' => true,
            'data' => $book,
        ]);
    }

    /**
     * Store a newly created book (Admin only).
     */
    public function store(StoreBookRequest $request): JsonResponse
    {
        $book = Book::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Buku berhasil ditambahkan ke koleksi.',
            'data' => $book->load('category'),
        ], 201);
    }

    /**
     * Update the specified book (Admin only).
     */
    public function update(UpdateBookRequest $request, Book $book): JsonResponse
    {
        $book->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Informasi buku berhasil diperbarui.',
            'data' => $book->load('category'),
        ]);
    }

    /**
     * Remove the specified book (Admin only).
     */
    public function destroy(Book $book): JsonResponse
    {
        $title = $book->title;
        $book->delete();

        return response()->json([
            'success' => true,
            'message' => "Buku \"{$title}\" berhasil dihapus dari perpustakaan.",
        ]);
    }
}
