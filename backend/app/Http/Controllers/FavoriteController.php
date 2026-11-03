<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Favorite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    /**
     * Get all favorite books for the current user.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $favorites = Book::whereHas('favorites', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->with('category')
        ->latest('id')
        ->paginate(12);

        // Mark all as favorited since this is the favorites list
        $favorites->getCollection()->transform(function ($book) {
            $book->is_favorited = true;
            return $book;
        });

        return response()->json([
            'success' => true,
            'data' => $favorites,
        ]);
    }

    /**
     * Toggle favorite status for a book.
     */
    public function toggle(Request $request, $bookId): JsonResponse
    {
        $user = $request->user();
        $book = Book::find($bookId);

        if (!$book) {
            return response()->json([
                'success' => false,
                'message' => 'Buku tidak ditemukan.',
            ], 404);
        }

        $existing = Favorite::where('user_id', $user->id)
            ->where('book_id', $book->id)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json([
                'success' => true,
                'is_favorited' => false,
                'message' => "Buku \"{$book->title}\" dihapus dari daftar favorit.",
            ]);
        }

        Favorite::create([
            'user_id' => $user->id,
            'book_id' => $book->id,
        ]);

        return response()->json([
            'success' => true,
            'is_favorited' => true,
            'message' => "Buku \"{$book->title}\" ditambahkan ke daftar favorit.",
        ]);
    }

    /**
     * Remove a book from favorites explicitly.
     */
    public function destroy(Request $request, $bookId): JsonResponse
    {
        $user = $request->user();
        $deleted = Favorite::where('user_id', $user->id)
            ->where('book_id', $bookId)
            ->delete();

        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Buku tidak ada di dalam daftar favorit Anda.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'is_favorited' => false,
            'message' => 'Buku berhasil dihapus dari favorit.',
        ]);
    }
}
