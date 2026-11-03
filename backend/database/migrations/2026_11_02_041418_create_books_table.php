<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->string('title', 255);
            $table->string('author', 200);
            $table->string('publisher', 200)->nullable();
            $table->unsignedSmallInteger('published_year')->nullable();
            $table->string('isbn', 50)->nullable()->unique();
            $table->text('description')->nullable();
            $table->text('cover_image')->nullable();
            $table->unsignedInteger('stock')->default(1);
            $table->string('open_library_key', 100)->nullable();
            $table->timestamps();

            // Indexes for fast search & filtering
            $table->index('title');
            $table->index('author');
            $table->index('published_year');
            $table->index('category_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
