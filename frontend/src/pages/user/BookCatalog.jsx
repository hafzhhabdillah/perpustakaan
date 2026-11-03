import { useState, useEffect } from 'react';
import { bookService, categoryService } from '../../services/api';
import BookCard from '../../components/BookCard';
import { Search, Filter, ArrowUpDown, BookX, RotateCcw } from 'lucide-react';

export default function BookCatalog({
  initialSearch = '',
  initialCategoryId = '',
  onSelectBook,
  onToggleFavorite,
  isFavoriteLoading,
}) {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination State
  const [search, setSearch] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  // Load Categories once
  useEffect(() => {
    categoryService.getAll().then((res) => {
      if (res.data?.success) {
        setCategories(res.data.data);
      }
    }).catch(console.error);
  }, []);

  // Sync initial props if changed
  useEffect(() => {
    if (initialSearch !== undefined) setSearch(initialSearch);
    if (initialCategoryId !== undefined) setCategoryId(initialCategoryId);
  }, [initialSearch, initialCategoryId]);

  // Fetch books when filters change
  useEffect(() => {
    fetchBooks();
  }, [search, categoryId, sort, page]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await bookService.getAll({
        search: search || undefined,
        category_id: categoryId || undefined,
        sort,
        page,
        per_page: 12,
      });

      if (res.data?.success) {
        const paginatedData = res.data.data;
        setBooks(paginatedData.data || []);
        setTotalPages(paginatedData.last_page || 1);
        setTotalBooks(paginatedData.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch books', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategoryId('');
    setSort('latest');
    setPage(1);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Filter Controls */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Katalog Koleksi Buku
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Menampilkan {totalBooks} koleksi buku yang tersedia di perpustakaan
            </p>
          </div>

          {(search || categoryId || sort !== 'latest') && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 self-start sm:self-auto py-1 px-3 rounded-lg hover:bg-rose-50 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filter
            </button>
          )}
        </div>

        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Cari berdasarkan judul, penulis, atau ISBN..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition appearance-none cursor-pointer"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.books_count})
                </option>
              ))}
            </select>
          </div>

          {/* Sorting Dropdown */}
          <div className="relative">
            <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition appearance-none cursor-pointer"
            >
              <option value="latest">Buku Terbaru</option>
              <option value="oldest">Buku Terlama</option>
              <option value="title_asc">Judul (A - Z)</option>
              <option value="title_desc">Judul (Z - A)</option>
              <option value="year_desc">Tahun Terbit Baru</option>
            </select>
          </div>
        </div>
      </div>

      {/* Book Grid */}
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
      ) : books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onSelect={onSelectBook}
              onToggleFavorite={onToggleFavorite}
              isFavoriteLoading={isFavoriteLoading}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <BookX className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800">Buku Tidak Ditemukan</h4>
            <p className="text-xs text-slate-500 mt-1">
              Tidak ada buku yang cocok dengan kriteria pencarian atau filter yang Anda pilih.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            Tampilkan Semua Buku
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition"
          >
            ← Sebelumnya
          </button>

          <span className="text-xs font-semibold text-slate-600 px-3">
            Halaman {page} dari {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition"
          >
            Selanjutnya →
          </button>
        </div>
      )}
    </div>
  );
}

