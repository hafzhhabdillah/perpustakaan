import { useState, useEffect } from 'react';
import { openLibraryService, categoryService } from '../../services/api';
import {
  Globe,
  Search,
  PlusCircle,
  CheckCircle2,
  Calendar,
  Building,
  Hash,
  X,
  BookOpen,
} from 'lucide-react';

export default function OpenLibrarySearch({ onNotify }) {
  const [query, setQuery] = useState('Machine Learning');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalFound, setTotalFound] = useState(0);

  const [categories, setCategories] = useState([]);

  // Import Modal State
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [importCategoryId, setImportCategoryId] = useState('');
  const [importStock, setImportStock] = useState(5);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    categoryService.getAll().then((res) => {
      if (res.data?.success) {
        setCategories(res.data.data);
        if (res.data.data.length > 0) {
          setImportCategoryId(res.data.data[0].id);
        }
      }
    });
    // Auto search initial topic
    handleSearch('Machine Learning');
  }, []);

  const handleSearch = async (overrideQuery) => {
    const q = overrideQuery || query;
    if (!q.trim() || loading) return;

    setLoading(true);
    try {
      const res = await openLibraryService.search({ q, limit: 16 });
      if (res.data?.success) {
        setResults(res.data.data.books || []);
        setTotalFound(res.data.data.total || 0);
      }
    } catch (err) {
      onNotify({
        type: 'error',
        message: err.response?.data?.message || 'Gagal mencari buku di Open Library.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenImport = (book) => {
    setSelectedBook(book);
    setImportModalOpen(true);
  };

  const handleConfirmImport = async (e) => {
    e.preventDefault();
    if (!selectedBook || importing) return;

    setImporting(true);

    try {
      const payload = {
        category_id: importCategoryId,
        title: selectedBook.title,
        author: selectedBook.author,
        publisher: selectedBook.publisher,
        published_year: selectedBook.published_year,
        isbn: selectedBook.isbn,
        cover_image: selectedBook.cover_image,
        description: `Buku diimpor dari Open Library (${selectedBook.title} oleh ${selectedBook.author}). Topik: ${selectedBook.subjects?.join(', ') || '-'}`,
        stock: importStock,
        open_library_key: selectedBook.open_library_key,
      };

      const res = await openLibraryService.importToLibrary(payload);
      if (res.data?.success) {
        onNotify({ type: 'success', message: res.data.message });
        setImportModalOpen(false);

        // Mark this book as already in library
        setResults((prev) =>
          prev.map((b) => (b.isbn === selectedBook.isbn ? { ...b, is_already_in_library: true } : b))
        );
      }
    } catch (err) {
      onNotify({
        type: 'error',
        message: err.response?.data?.message || 'Gagal mengimpor buku ke koleksi.',
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
            <Globe className="w-3.5 h-3.5" />
            <span>Open Library REST API Integration</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Pencarian & Impor Buku Global
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
            Cari jutaan judul buku internasional secara langsung dan tambahkan buku terpilih ke database MySQL lokal perpustakaan dengan satu klik.
          </p>
        </div>

        {/* Search Bar in Banner */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex gap-2 w-full md:w-auto"
        >
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Ketik judul buku/penulis..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-1.5 flex-shrink-0"
          >
            {loading ? <span className="animate-spin">⏳</span> : <Search className="w-4 h-4" />}
            Cari
          </button>
        </form>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800">
          Hasil Pencarian untuk: <span className="text-indigo-600 font-extrabold">"{query}"</span>
        </h3>
        <span className="text-xs font-semibold text-slate-500">
          Ditemukan sekitar {totalFound} buku di Open Library
        </span>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-3">
              <div className="aspect-[3/4] bg-slate-200 rounded-xl" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((b, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden p-4 space-y-4"
            >
              <div className="space-y-3">
                {/* Cover Thumbnail */}
                <div className="aspect-[3/4] w-full rounded-xl bg-slate-100 overflow-hidden relative border border-slate-100">
                  <img
                    src={b.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80'}
                    alt={b.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80';
                    }}
                  />
                  {b.is_already_in_library && (
                    <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Ada di Koleksi
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-2" title={b.title}>
                    {b.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{b.author}</p>
                </div>

                {/* Metadata */}
                <div className="space-y-1 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Tahun: {b.published_year || '-'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">ISBN: {b.isbn || 'Tidak tersedia'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span className="line-clamp-1">Penerbit: {b.publisher}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {b.is_already_in_library ? (
                <button
                  disabled
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Sudah Tersimpan
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleOpenImport(b)}
                  className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" /> Tambahkan ke Koleksi
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-800">Tidak ada hasil dari Open Library</h4>
          <p className="text-xs text-slate-500 mt-1">Coba gunakan kata kunci lain dalam bahasa Inggris atau Indonesia.</p>
        </div>
      )}

      {/* IMPORT MODAL */}
      {importModalOpen && selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setImportModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Impor Buku ke Perpustakaan
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Pilih kategori perpustakaan lokal dan tentukan stok fisik awal untuk buku ini.
            </p>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3 mb-6">
              <img
                src={selectedBook.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=100&q=80'}
                alt=""
                className="w-10 h-14 rounded object-cover border border-slate-200"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{selectedBook.title}</h4>
                <p className="text-[11px] text-slate-500">{selectedBook.author}</p>
                <p className="text-[10px] text-slate-400 font-mono">ISBN: {selectedBook.isbn || '-'}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmImport} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori Perpustakaan *
                </label>
                <select
                  required
                  value={importCategoryId}
                  onChange={(e) => setImportCategoryId(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jumlah Stok Awal *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={500}
                  value={importStock}
                  onChange={(e) => setImportStock(parseInt(e.target.value) || 1)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setImportModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={importing}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
                >
                  {importing && <span className="animate-spin">⏳</span>}
                  Simpan ke Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

