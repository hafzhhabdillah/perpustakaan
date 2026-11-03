import { useState, useEffect } from 'react';
import { categoryService } from '../../services/api';
import { Layers, PlusCircle, Edit2, Trash2, X } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';

export default function CategoryManager({ onNotify }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getAll();
      if (res.data?.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description || '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingCategory) {
        const res = await categoryService.update(editingCategory.id, formData);
        if (res.data?.success) {
          onNotify({ type: 'success', message: 'Kategori berhasil diperbarui!' });
          setModalOpen(false);
          fetchCategories();
        }
      } else {
        const res = await categoryService.create(formData);
        if (res.data?.success) {
          onNotify({ type: 'success', message: 'Kategori baru berhasil ditambahkan!' });
          setModalOpen(false);
          fetchCategories();
        }
      }
    } catch (err) {
      onNotify({ type: 'error', message: err.response?.data?.message || 'Gagal menyimpan kategori.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDelete = (cat) => {
    setCategoryToDelete(cat);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setDeleteLoading(true);

    try {
      const res = await categoryService.delete(categoryToDelete.id);
      if (res.data?.success) {
        onNotify({ type: 'success', message: res.data.message });
        setDeleteModalOpen(false);
        fetchCategories();
      }
    } catch (err) {
      onNotify({ type: 'error', message: err.response?.data?.message || 'Gagal menghapus kategori.' });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-neutral-200/80 dark:border-neutral-700 shadow-xs">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-primary-600" /> Manajemen Kategori
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Kelola kategori untuk klasifikasi buku di perpustakaan ({categories.length} kategori)
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-primary-200 transition flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Tambah Kategori
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200/80 dark:border-neutral-700 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-primary-50 dark:bg-neutral-700 border-b border-neutral-200/80 dark:border-neutral-700 text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              <tr>
                <th className="py-3.5 px-6">Nama Kategori</th>
                <th className="py-3.5 px-6">Slug</th>
                <th className="py-3.5 px-6">Deskripsi</th>
                <th className="py-3.5 px-6 text-center">Jumlah Buku</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-400 dark:text-neutral-500">
                    Memuat kategori...
                  </td>
                </tr>
              ) : categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-primary-50 dark:bg-neutral-700/80 transition">
                  <td className="py-4 px-6 font-bold text-neutral-900 dark:text-neutral-50">{cat.name}</td>
                  <td className="py-4 px-6 font-mono text-xs text-neutral-500 dark:text-neutral-400">/{cat.slug}</td>
                  <td className="py-4 px-6 text-neutral-600 dark:text-neutral-300 max-w-xs truncate">{cat.description || '-'}</td>
                  <td className="py-4 px-6 text-center">
                    <span className="px-3 py-1 rounded-full font-bold text-xs bg-primary-50 text-primary-700">
                      {cat.books_count} buku
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(cat)}
                        className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-neutral-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-neutral-100 dark:border-neutral-700 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:text-neutral-200 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-6">
              {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200 mb-1">Nama Kategori *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kecerdasan Buatan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200 mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  placeholder="Penjelasan ringkas tentang cakupan kategori ini..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-sm p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
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
                  disabled={submitting}
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
                >
                  {submitting && <span className="animate-spin">⏳</span>}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Hapus Kategori"
        message={`Apakah Anda yakin ingin menghapus kategori "${categoryToDelete?.name}"? Buku dalam kategori ini akan ikut terhapus.`}
        confirmText="Ya, Hapus Kategori"
        isDanger={true}
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}

