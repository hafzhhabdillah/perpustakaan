import { useState, useEffect } from 'react';
import { bookService, categoryService } from '../../services/api';
import {
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  Eye,
  X,
  BookCopy,
} from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';

export default function BookManager({ onSelectBook, onNotify }) {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  // Form Modal State (Add / Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const initialForm = {
    category_id: '',
    title: '',
    author: '',
    publisher: '',
    published_year: new Date().getFullYear(),
    isbn: '',
    description: '',
    cover_image: '',
    stock: 5,
  };

  const [formData, setFormData] = useState(initialForm);

  // Delete Confirmation State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [search, page]);

  const loadCategories = async () => {
    try {
      const res = await categoryService.getAll();
      if (res.data?.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await bookService.getAll({ search, page, per_page: 10 });
      if (res.data?.success) {
        setBooks(res.data.data.data || []);
        setTotalPages(res.data.data.last_page || 1);
        setTotalBooks(res.data.data.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingBook(null);
    setFormData({
      ...initialForm,
      category_id: categories[0]?.id || '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (book) => {
    setEditingBook(book);
    setFormData({
      category_id: book.category_id || '',
      title: book.title,
      author: book.author,
      publisher: book.publisher || '',
      published_year: book.published_year || '',
      isbn: book.isbn || '',
      description: book.description || '',
      cover_image: book.cover_image || '',
      stock: book.stock || 0,
    });
    setModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      if (editingBook) {
        const res = await bookService.update(editingBook.id, formData);
        if (res.data?.success) {
          onNotify({ type: 'success', message: 'Buku berhasil diperbarui!' });
          setModalOpen(false);
          fetchBooks();
        }
      } else {
        const res = await bookService.create(formData);
        if (res.data?.success) {
          onNotify({ type: 'success', message: 'Buku baru berhasil ditambahkan!' });
          setModalOpen(false);
          fetchBooks();
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal menyimpan buku.';
      onNotify({ type: 'error', message: msg });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleOpenDelete = (book) => {
    setBookToDelete(book);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;
    setDeleteLoading(true);

    try {
      const res = await bookService.delete(bookToDelete.id);
      if (res.data?.success) {
        onNotify({ type: 'success', message: res.data.message });
        setDeleteModalOpen(false);
        fetchBooks();
      }
    } catch (err) {
      onNotify({ type: 'error', message: err.response?.data?.message || 'Gagal menghapus buku.' });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-neutral-200/80 dark:border-neutral-700 shadow-xs">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight flex items-center gap-2">
            <BookCopy className="w-6 h-6 text-primary-600" /> Kelola Koleksi Buku
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Tambah, edit, dan hapus katalog buku fisik perpustakaan ({totalBooks} buku)
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-primary-200 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Tambah Buku Baru
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Cari buku berdasarkan judul, penulis, ISBN..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
        />
      </div>

      {/* Table of Books */}
      <div className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200/80 dark:border-neutral-700 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-primary-50 dark:bg-neutral-700 border-b border-neutral-200/80 dark:border-neutral-700 text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              <tr>
                <th className="py-3.5 px-4">Buku</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Tahun / Penerbit</th>
                <th className="py-3.5 px-4">ISBN</th>
                <th className="py-3.5 px-4 text-center">Stok</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400 dark:text-neutral-500">
                    Memuat data buku...
                  </td>
                </tr>
              ) : books.length > 0 ? (
                books.map((b) => (
                  <tr key={b.id} className="hover:bg-primary-50 dark:bg-neutral-700/80 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={b.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=100&q=80'}
                          alt={b.title}
                          className="w-9 h-12 rounded object-cover border border-neutral-200 dark:border-neutral-700 flex-shrink-0"
                        />
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-neutral-50 line-clamp-1">{b.title}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">{b.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-700 font-semibold text-[11px] text-neutral-700 dark:text-neutral-200">
                        {b.category?.name || 'Umum'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300">
                      <p>{b.published_year || '-'}</p>
                      <p className="text-[11px] text-neutral-400 dark:text-neutral-500 line-clamp-1">{b.publisher || '-'}</p>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-600 dark:text-neutral-300">
                      {b.isbn || '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                        b.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {b.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectBook(b)}
                          title="Lihat Detail"
                          className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-primary-600 hover:bg-neutral-100 dark:bg-neutral-700 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(b)}
                          title="Edit Buku"
                          className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(b)}
                          title="Hapus Buku"
                          className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400 dark:text-neutral-500">
                    Belum ada buku yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-neutral-100 dark:border-neutral-700 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Halaman {page} dari {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-primary-50 dark:bg-neutral-700 disabled:opacity-40"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-primary-50 dark:bg-neutral-700 disabled:opacity-40"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-neutral-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-100 dark:border-neutral-700 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:text-neutral-200 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-6">
              {editingBook ? 'Edit Data Buku' : 'Tambah Buku Baru ke Perpustakaan'}
            </h3>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200 mb-1">Judul Buku *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200 mb-1">Penulis *</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200 mb-1">Kategori Buku *</label>
                  <select
                    required
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200 mb-1">Penerbit</label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200 mb-1">Tahun Terbit</label>
                    <input
                      type="number"
                      value={formData.published_year}
                      onChange={(e) => setFormData({ ...formData, published_year: e.target.value })}
                      className="w-full text-sm px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200 mb-1">Stok Fisik *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full text-sm px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200 mb-1">ISBN (Unik)</label>
                  <input
                    type="text"
                    value={formData.isbn}
                    placeholder="Contoh: 9780132350884"
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200 mb-1">URL Cover Buku</label>
                  <input
                    type="url"
                    value={formData.cover_image}
                    placeholder="https://images.unsplash.com/..."
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200 mb-1">Deskripsi / Sinopsis</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    placeholder="Sinopsis singkat tentang buku ini..."
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full text-sm p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:bg-neutral-700 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
                >
                  {formSubmitting && <span className="animate-spin">⏳</span>}
                  {editingBook ? 'Simpan Perubahan' : 'Tambahkan Buku'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Hapus Buku"
        message={`Apakah Anda yakin ingin menghapus buku "${bookToDelete?.title}" dari database perpustakaan?`}
        confirmText="Ya, Hapus Buku"
        isDanger={true}
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}

