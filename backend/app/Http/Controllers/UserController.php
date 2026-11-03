<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of registered users (Admin only).
     */
    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $role = $request->query('role');

        $query = User::withCount('favorites');

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if (!empty($role)) {
            $query->where('role', $role);
        }

        $users = $query->latest('id')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    /**
     * Update user role (Admin only).
     */
    public function updateRole(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'role' => 'required|in:admin,user',
        ]);

        // Prevent admin from demoting themselves
        if ($user->id === $request->user()->id && $validated['role'] !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak dapat mengubah role akun Anda sendiri.',
            ], 422);
        }

        $user->role = $validated['role'];
        $user->save();

        return response()->json([
            'success' => true,
            'message' => "Role untuk {$user->name} berhasil diubah menjadi {$user->role}.",
            'data' => $user,
        ]);
    }

    /**
     * Remove the specified user (Admin only).
     */
    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($user->id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak dapat menghapus akun Anda sendiri.',
            ], 422);
        }

        $name = $user->name;
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => "Pengguna \"{$name}\" berhasil dihapus.",
        ]);
    }
}
