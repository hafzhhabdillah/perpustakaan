<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\Category;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ApiFeatureTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_can_fetch_public_books_list(): void
    {
        $response = $this->getJson('/api/books');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'data' => [
                        '*' => ['id', 'title', 'author', 'category']
                    ]
                ]
            ]);
    }

    public function test_books_can_be_searched_and_filtered(): void
    {
        $category = Category::where('slug', 'teknologi-pemrograman')->first();

        $response = $this->getJson("/api/books?category_id={$category->id}&search=Python");

        $response->assertStatus(200);
        $books = $response->json('data.data');
        $this->assertNotEmpty($books);
        $this->assertStringContainsString('Python', $books[0]['title']);
    }

    public function test_user_can_login_and_receive_token(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'user@library.test',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'user' => [
                        'email' => 'user@library.test',
                        'role' => 'user',
                    ]
                ]
            ])
            ->assertJsonStructure([
                'data' => ['token', 'user']
            ]);
    }

    public function test_regular_user_cannot_access_admin_dashboard(): void
    {
        $user = User::where('role', 'user')->first();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/admin/dashboard');

        $response->assertStatus(403);
    }

    public function test_admin_can_access_admin_dashboard(): void
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/admin/dashboard');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'data' => [
                    'counts' => [
                        'total_books',
                        'total_categories',
                        'total_users',
                        'total_admins',
                        'total_favorites',
                    ]
                ]
            ]);
    }

    public function test_user_can_toggle_favorite_book(): void
    {
        $user = User::where('role', 'user')->first();
        $book = Book::first();

        $response = $this->actingAs($user, 'sanctum')->postJson("/api/favorites/toggle/{$book->id}");

        $response->assertStatus(200)
            ->assertJsonStructure(['success', 'is_favorited', 'message']);
    }

    public function test_admin_can_create_update_and_delete_book(): void
    {
        $admin = User::where('role', 'admin')->first();
        $category = Category::first();

        // 1. Create Book
        $createRes = $this->actingAs($admin, 'sanctum')->postJson('/api/admin/books', [
            'category_id' => $category->id,
            'title' => 'Test Novel Architecture',
            'author' => 'Test Author',
            'publisher' => 'Test Publisher',
            'published_year' => 2024,
            'isbn' => '9780000000001',
            'description' => 'Test book description.',
            'stock' => 10,
        ]);

        $createRes->assertStatus(201)
            ->assertJson(['success' => true]);

        $bookId = $createRes->json('data.id');
        $this->assertDatabaseHas('books', ['isbn' => '9780000000001']);

        // 2. Update Book
        $updateRes = $this->actingAs($admin, 'sanctum')->putJson("/api/admin/books/{$bookId}", [
            'category_id' => $category->id,
            'title' => 'Updated Novel Architecture',
            'author' => 'Updated Author',
            'stock' => 15,
        ]);

        $updateRes->assertStatus(200)
            ->assertJson(['success' => true]);
        $this->assertDatabaseHas('books', ['id' => $bookId, 'title' => 'Updated Novel Architecture']);

        // 3. Delete Book
        $deleteRes = $this->actingAs($admin, 'sanctum')->deleteJson("/api/admin/books/{$bookId}");
        $deleteRes->assertStatus(200)
            ->assertJson(['success' => true]);
        $this->assertDatabaseMissing('books', ['id' => $bookId]);
    }

    public function test_admin_can_create_update_and_delete_category(): void
    {
        $admin = User::where('role', 'admin')->first();

        // 1. Create Category
        $createRes = $this->actingAs($admin, 'sanctum')->postJson('/api/admin/categories', [
            'name' => 'Kategori Uji Coba',
            'description' => 'Deskripsi kategori uji coba.',
        ]);

        $createRes->assertStatus(201)
            ->assertJson(['success' => true]);

        $catId = $createRes->json('data.id');
        $this->assertDatabaseHas('categories', ['id' => $catId, 'slug' => 'kategori-uji-coba']);

        // 2. Update Category
        $updateRes = $this->actingAs($admin, 'sanctum')->putJson("/api/admin/categories/{$catId}", [
            'name' => 'Kategori Uji Coba Diperbarui',
            'description' => 'Deskripsi baru.',
        ]);

        $updateRes->assertStatus(200)
            ->assertJson(['success' => true]);

        // 3. Delete Category
        $deleteRes = $this->actingAs($admin, 'sanctum')->deleteJson("/api/admin/categories/{$catId}");
        $deleteRes->assertStatus(200)
            ->assertJson(['success' => true]);
        $this->assertDatabaseMissing('categories', ['id' => $catId]);
    }

    public function test_ai_status_endpoint_returns_model_info(): void
    {
        $response = $this->getJson('/api/ai/status');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => ['is_configured', 'model']
            ]);
    }

    public function test_open_library_search_with_mocked_http(): void
    {
        Http::fake([
            'https://openlibrary.org/search.json*' => Http::response([
                'numFound' => 1,
                'docs' => [
                    [
                        'key' => '/works/OL12345W',
                        'title' => 'Sample Python Book',
                        'author_name' => ['Guido van Rossum'],
                        'first_publish_year' => 2021,
                        'isbn' => ['9781234567890'],
                        'publisher' => ['Tech Press'],
                        'cover_i' => 9999,
                        'subject' => ['Python', 'Computer Science'],
                    ]
                ]
            ], 200),
        ]);

        $response = $this->getJson('/api/open-library/search?q=Python');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total' => 1,
                    'books' => [
                        [
                            'title' => 'Sample Python Book',
                            'author' => 'Guido van Rossum',
                            'isbn' => '9781234567890',
                            'is_already_in_library' => false,
                        ]
                    ]
                ]
            ]);
    }

    public function test_admin_can_import_book_from_open_library(): void
    {
        $admin = User::where('role', 'admin')->first();
        $category = Category::first();

        $payload = [
            'category_id' => $category->id,
            'title' => 'Imported Machine Learning Book',
            'author' => 'Dr. AI Researcher',
            'publisher' => 'Deep Press',
            'published_year' => 2024,
            'isbn' => '9789999888877',
            'description' => 'A great ML book imported via Open Library.',
            'stock' => 5,
            'open_library_key' => '/works/OL998877W',
        ];

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/admin/open-library/import', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'title' => 'Imported Machine Learning Book',
                    'isbn' => '9789999888877',
                ]
            ]);

        $this->assertDatabaseHas('books', ['isbn' => '9789999888877']);

        // Duplicate import should fail with 422
        $dupResponse = $this->actingAs($admin, 'sanctum')->postJson('/api/admin/open-library/import', $payload);
        $dupResponse->assertStatus(422);
    }
}
