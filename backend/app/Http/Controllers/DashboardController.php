<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Category;
use App\Models\Favorite;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get Admin dashboard metrics and recent statistics.
     */
    public function adminStats(): JsonResponse
    {
        $totalBooks = Book::count();
        $totalCategories = Category::count();
        $totalUsers = User::where('role', 'user')->count();
        $totalAdmins = User::where('role', 'admin')->count();
        $totalFavorites = Favorite::count();
        $totalStock = (int) Book::sum('stock');

        // Categories breakdown with book count
        $categoryBreakdown = Category::withCount('books')
            ->orderBy('books_count', 'desc')
            ->take(6)
            ->get(['id', 'name', 'slug', 'books_count']);

        // Recent 5 books added
        $recentBooks = Book::with('category')
            ->latest('id')
            ->take(5)
            ->get();

        // Recent users registered
        $recentUsers = User::latest('id')
            ->take(5)
            ->get(['id', 'name', 'email', 'role', 'created_at']);

        return response()->json([
            'success' => true,
            'data' => [
                'counts' => [
                    'total_books' => $totalBooks,
                    'total_categories' => $totalCategories,
                    'total_users' => $totalUsers,
                    'total_admins' => $totalAdmins,
                    'total_favorites' => $totalFavorites,
                    'total_stock' => $totalStock,
                ],
                'category_breakdown' => $categoryBreakdown,
                'recent_books' => $recentBooks,
                'recent_users' => $recentUsers,
            ],
        ]);
    }

    /**
     * Get User dashboard summary: recent books, favorite books, categories.
     */
    public function userOverview(Request $request): JsonResponse
    {
        $user = $request->user();

        // Latest 6 books
        $recentBooks = Book::with('category')
            ->latest('id')
            ->take(6)
            ->get();

        // Featured books (e.g. highest stock or curated)
        $featuredBooks = Book::with('category')
            ->inRandomOrder()
            ->take(4)
            ->get();

        // User's favorites (latest 4)
        $myFavorites = [];
        $userFavoriteIds = [];

        if ($user) {
            $userFavoriteIds = $user->favorites()->pluck('book_id')->toArray();
            $myFavorites = Book::whereIn('id', $userFavoriteIds)
                ->with('category')
                ->latest('id')
                ->take(4)
                ->get();
        }

        // Attach is_favorited flag
        $attachFavoriteFlag = function ($collection) use ($userFavoriteIds) {
            return $collection->map(function ($book) use ($userFavoriteIds) {
                $book->is_favorited = in_array($book->id, $userFavoriteIds, true);
                return $book;
            });
        };

        // Categories summary
        $categories = Category::withCount('books')
            ->orderBy('name', 'asc')
            ->get(['id', 'name', 'slug', 'books_count']);

        return response()->json([
            'success' => true,
            'data' => [
                'recent_books' => $attachFavoriteFlag($recentBooks),
                'featured_books' => $attachFavoriteFlag($featuredBooks),
                'my_favorites' => $attachFavoriteFlag($myFavorites),
                'categories' => $categories,
                'total_library_books' => Book::count(),
            ],
        ]);
    }
}
