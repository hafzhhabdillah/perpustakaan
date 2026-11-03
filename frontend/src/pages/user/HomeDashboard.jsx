import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/api';
import BookCard from '../../components/BookCard';
import { Search, Sparkles, BookOpen, Layers, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

export default function HomeDashboard({ onSelectBook, onToggleFavorite, onNavigate, isFavoriteLoading }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quickSearch, setQuickSearch] = useState('');

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      const res = await dashboardService.getUserOverview();
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load user overview', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      onNavigate('catalog', { search: quickSearch });
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-slate-800">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Powered Library Discovery</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Temukan Wawasan Tanpa Batas di <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-300 via-indigo-200 to-violet-300">Libraria</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Jelajahi ribuan koleksi buku digital, nikmati rekomendasi cerdas dari asisten AI Groq, dan simpan daftar bacaan favorit Anda dengan mudah.
          </p>

          {/* Quick Search Input */}
          <form onSubmit={handleSearchSubmit} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Cari judul buku, nama penulis, atau topik..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:bg-white/15 transition"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-600/30 transition flex items-center justify-center gap-2"
            >
              Cari Buku <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Fast Features Tags */}
          <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Katalog Terverifikasi
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-4 h-4 text-violet-400" /> Groq Llama-3.3 AI
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <BookOpen className="w-4 h-4 text-indigo-400" /> Terintegrasi Open Library
            </span>
          </div>
        </div>
      </section>

      {/* 2. AI ADVISOR TEASER BANNER */}
      <section className="bg-gradient-to-r from-violet-600 via-indigo-600 to-brand-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-white/20 rounded-xl">✨</span>
            <h3 className="text-xl font-bold">Bingung Mau Baca Buku Apa?</h3>
          </div>
          <p className="text-sm text-violet-100 max-w-xl">
            Tanyakan kepada Asisten AI kami! Cukup ketik minat Anda (misal: "Saya ingin buku tentang kebiasaan baik dan psikologi"), dan AI kami akan memilihkan buku terbaik.
          </p>
        </div>
        <button
          onClick={() => onNavigate('ai-advisor')}
          className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm rounded-2xl shadow-lg transition flex items-center gap-2 flex-shrink-0"
        >
          Coba Rekomendasi AI <Sparkles className="w-4 h-4 text-violet-600" />
        </button>
      </section>

      {/* 3. CATEGORIES CAROUSEL / CHIPS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-600" /> Kategori Koleksi
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Pilih kategori untuk memfilter koleksi buku</p>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {data?.categories?.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('catalog', { categoryId: cat.id })}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-400 hover:shadow-md cursor-pointer transition group"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm mb-3 group-hover:scale-110 transition">
                📚
              </div>
              <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-brand-600 transition">
                {cat.name}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{cat.books_count} buku</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED BOOKS SECTION */}
      {data?.featured_books && data.featured_books.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500 fill-amber-500" /> Buku Pilihan & Unggulan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Rekomendasi buku paling diminati oleh anggota perpustakaan</p>
            </div>
            <button
              onClick={() => onNavigate('catalog')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Katalog Lengkap <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.featured_books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onSelect={onSelectBook}
                onToggleFavorite={onToggleFavorite}
                isFavoriteLoading={isFavoriteLoading}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. LATEST BOOKS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-600" /> Buku Koleksi Terbaru
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Koleksi buku yang baru saja ditambahkan ke perpustakaan</p>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-3">
                <div className="aspect-[3/4] bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {data?.recent_books?.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onSelect={onSelectBook}
                onToggleFavorite={onToggleFavorite}
                isFavoriteLoading={isFavoriteLoading}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

