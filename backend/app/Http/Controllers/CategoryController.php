<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories with books count.
     */
    public function index(Request $request): JsonResponse
    {
        $categories = Category::withCount('books')
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Display the specified category with its books.
     */
    public function show($id): JsonResponse
    {
        $category = Category::withCount('books')->find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Kategori tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $category,
        ]);
    }

    /**
     * Store a newly created category (Admin only).
     */
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = Category::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil ditambahkan.',
            'data' => $category->loadCount('books'),
        ], 201);
    }

    /**
     * Update the specified category (Admin only).
     */
    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        $category->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil diperbarui.',
            'data' => $category->loadCount('books'),
        ]);
    }

    /**
     * Remove the specified category (Admin only).
     */
    public function destroy(Category $category): JsonResponse
    {
        $name = $category->name;
        $category->delete();

        return response()->json([
            'success' => true,
            'message' => "Kategori \"{$name}\" berhasil dihapus.",
        ]);
    }
}
