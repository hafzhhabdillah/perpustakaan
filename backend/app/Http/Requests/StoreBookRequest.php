<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:200',
            'publisher' => 'nullable|string|max:200',
            'published_year' => 'nullable|integer|min:1000|max:' . (date('Y') + 1),
            'isbn' => 'nullable|string|max:50|unique:books,isbn',
            'description' => 'nullable|string|max:5000',
            'cover_image' => 'nullable|string|max:1000',
            'stock' => 'required|integer|min:0|max:10000',
            'open_library_key' => 'nullable|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Kategori buku wajib dipilih.',
            'category_id.exists' => 'Kategori yang dipilih tidak valid.',
            'title.required' => 'Judul buku wajib diisi.',
            'author.required' => 'Nama penulis wajib diisi.',
            'isbn.unique' => 'Buku dengan ISBN ini sudah tersimpan di perpustakaan.',
            'stock.required' => 'Jumlah stok buku wajib diisi.',
            'stock.min' => 'Stok buku minimal bernilai 0.',
        ];
    }
}
