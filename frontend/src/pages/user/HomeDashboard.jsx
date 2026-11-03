
import { useEffect, useState } from 'react';
import { dashboardService } from '../../services/api';
import BookCard from '../../components/BookCard';

import {
  Search,
  Sparkles,
  BookOpen,
  Layers,
  ArrowRight,
  ShieldCheck,
  Flame,
  LibraryBig,
  ArrowUpRight,
  Compass,
  Bookmark,
} from 'lucide-react';

export default function HomeDashboard({
  onSelectBook,
  onToggleFavorite,
  onNavigate,
  isFavoriteLoading,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quickSearch, setQuickSearch] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadOverview = async () => {
      try {
        const res = await dashboardService.getUserOverview();

        if (isMounted && res.data?.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load user overview:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadOverview();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (quickSearch.trim()) {
      onNavigate('catalog', { search: quickSearch.trim() });
    }
  };

  const categories = data?.categories ?? [];
  const featuredBooks = data?.featured_books ?? [];
  const recentBooks = data?.recent_books ?? [];

  return (
    <div className="space-y-12 pb-16">

      {/* HERO SECTION */}
      <section className="relative isolate overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-[#F0F4EB] px-6 py-10 shadow-sm sm:px-10 sm:py-14 lg:px-14 lg:py-16">

        <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 h-80 w-80 rounded-full bg-lime-200/40 blur-3xl" />

        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">

          {/* HERO CONTENT */}
          <div className="relative z-10 space-y-7">

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-700/15 bg-white/80 px-4 py-2 text-xs font-bold tracking-wide text-emerald-800 shadow-sm">
              <Sparkles size={15} />
              YOUR PERSONAL DIGITAL LIBRARY
            </div>

            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-black leading-[1.12] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Temukan Wawasan,
                <span className="block text-emerald-700">
                  Tanpa Batas.
                </span>
              </h1>

              <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                Setiap buku punya cerita dan pengetahuan baru.
                Temukan bacaan favoritmu, jelajahi berbagai kategori,
                dan dapatkan rekomendasi cerdas bersama Libraria.
              </p>
            </div>

            {/* SEARCH */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex max-w-xl flex-col gap-3 rounded-2xl bg-white p-2 shadow-lg shadow-emerald-950/5 ring-1 ring-slate-200 sm:flex-row"
            >
              <div className="relative flex flex-1 items-center">
                <Search
                  size={19}
                  className="absolute left-4 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Cari judul, penulis, atau topik..."
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  className="w-full rounded-xl border-0 bg-transparent py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0"
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-900/20 active:scale-[0.98]"
              >
                Cari Buku
                <ArrowRight size={17} />
              </button>
            </form>

            {/* FEATURES */}
            <div className="flex flex-wrap gap-x-5 gap-y-3 pt-1 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-700" />
                Katalog Terverifikasi
              </span>

              <span className="flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-700" />
                AI Book Advisor
              </span>

              <span className="flex items-center gap-2">
                <BookOpen size={16} className="text-emerald-700" />
                Open Library
              </span>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="relative mx-auto hidden h-[370px] w-full max-w-md items-center justify-center lg:flex">

            <div className="absolute h-72 w-72 rounded-full border border-emerald-800/10" />
            <div className="absolute h-56 w-56 rounded-full border border-emerald-800/10" />

            <div className="relative z-10 flex h-64 w-48 -rotate-6 flex-col justify-between rounded-r-2xl rounded-l-md border-l-[7px] border-emerald-950 bg-emerald-800 p-6 text-white shadow-2xl shadow-emerald-950/25 transition-transform duration-500 hover:-rotate-2 hover:scale-105">
              <div>
                <BookOpen size={32} className="mb-8 text-emerald-200" />
                <p className="text-[10px] font-semibold tracking-[0.3em] text-emerald-200">
                  LIBRARIA COLLECTION
                </p>
                <h3 className="mt-3 text-2xl font-black leading-tight">
                  The Art
                  <br />
                  of Reading
                </h3>
              </div>

              <div className="flex items-center justify-between border-t border-white/20 pt-4">
                <span className="text-[9px] tracking-widest text-emerald-100">
                  KNOWLEDGE IS POWER
                </span>
                <LibraryBig size={19} />
              </div>
            </div>

            <div className="absolute right-2 top-10 z-20 flex h-40 w-28 rotate-12 flex-col justify-between rounded-r-xl rounded-l-sm border-l-4 border-amber-950 bg-[#D5A66B] p-3 text-amber-950 shadow-xl transition-transform duration-500 hover:rotate-6">
              <BookOpen size={22} />
              <div>
                <p className="text-[9px] font-bold tracking-widest">DISCOVER</p>
                <p className="mt-1 text-lg font-black leading-tight">New Ideas</p>
              </div>
            </div>

            <div className="absolute bottom-7 left-3 z-20 flex h-36 w-24 -rotate-12 flex-col justify-between rounded-r-xl rounded-l-sm border-l-4 border-slate-950 bg-slate-700 p-3 text-white shadow-xl transition-transform duration-500 hover:-rotate-6">
              <Sparkles size={20} className="text-amber-300" />
              <div>
                <p className="text-[9px] font-bold tracking-widest text-slate-300">
                  EXPLORE
                </p>
                <p className="mt-1 text-base font-black leading-tight">
                  Your Story
                </p>
              </div>
            </div>

            <div className="absolute -right-2 bottom-12 z-30 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                <Bookmark size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Your next chapter
                </p>
                <p className="text-[10px] text-slate-500">
                  Starts right here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI ADVISOR BANNER */}
      <section className="group relative overflow-hidden rounded-3xl bg-emerald-900 p-6 text-white shadow-lg shadow-emerald-950/10 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl transition-transform duration-700 group-hover:scale-125" />

        <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Sparkles size={21} className="text-emerald-200" />
              </span>

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">
                Libraria AI Assistant
              </span>
            </div>

            <h2 className="text-xl font-extrabold sm:text-2xl">
              Bingung Mau Baca Buku Apa?
            </h2>

            <p className="max-w-xl text-sm leading-6 text-emerald-100/80">
              Ceritakan minat dan topik yang kamu sukai.
              Asisten AI kami akan membantu menemukan bacaan
              yang sesuai dengan kebutuhanmu.
            </p>
          </div>

          <button
            onClick={() => onNavigate('ai-advisor')}
            className="flex shrink-0 items-center gap-3 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-emerald-900 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-50 hover:shadow-lg active:scale-95"
          >
            Coba AI Advisor
            <ArrowUpRight size={17} />
          </button>
        </div>
      </section>

      {/* CATEGORY SECTION */}
      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-emerald-700">
              <Layers size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">
                Explore Library
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
              Kategori Koleksi
            </h2>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Temukan buku berdasarkan minat dan topik favoritmu.
            </p>
          </div>

          <button
            onClick={() => onNavigate('catalog')}
            className="flex shrink-0 items-center gap-1 text-xs font-bold text-emerald-800 transition hover:gap-2"
          >
            Semua Kategori
            <ArrowRight size={15} />
          </button>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onNavigate('catalog', { categoryId: cat.id })}
                className="group rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-950/5"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 transition-all duration-300 group-hover:bg-emerald-800 group-hover:text-white">
                  <BookOpen size={19} />
                </div>

                <h3 className="line-clamp-1 text-sm font-bold text-slate-800 transition-colors group-hover:text-emerald-800">
                  {cat.name}
                </h3>

                <p className="mt-1 text-[11px] text-slate-400">
                  {cat.books_count ?? 0} buku
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 py-8 text-center">
            <Compass size={25} className="mx-auto mb-2 text-slate-400" />
            <p className="text-sm text-slate-500">
              Belum ada kategori untuk ditampilkan.
            </p>
          </div>
        )}
      </section>

      {/* FEATURED BOOKS */}
      {featuredBooks.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-amber-600">
                <Flame size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Handpicked for you
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                Buku Pilihan & Unggulan
              </h2>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Koleksi buku pilihan yang menarik untuk dijelajahi.
              </p>
            </div>

            <button
              onClick={() => onNavigate('catalog')}
              className="flex shrink-0 items-center gap-1 text-xs font-bold text-emerald-800 transition hover:gap-2"
            >
              Lihat Katalog
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {featuredBooks.map((book) => (
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

      {/* LATEST BOOKS */}
      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-emerald-700">
              <LibraryBig size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">
                Fresh from library
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
              Buku Koleksi Terbaru
            </h2>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Jelajahi koleksi terbaru yang tersedia di Libraria.
            </p>
          </div>

          <button
            onClick={() => onNavigate('catalog')}
            className="flex shrink-0 items-center gap-1 text-xs font-bold text-emerald-800 transition hover:gap-2"
          >
            Lihat Semua
            <ArrowRight size={15} />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="animate-pulse space-y-3 rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="aspect-[3/4] rounded-xl bg-slate-200" />
                <div className="h-4 w-3/4 rounded bg-slate-200" />
                <div className="h-3 w-1/2 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        ) : recentBooks.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {recentBooks.map((book) => (
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
          <div className="rounded-2xl border border-dashed border-slate-300 py-12 text-center">
            <BookOpen size={30} className="mx-auto mb-3 text-slate-400" />
            <h3 className="font-bold text-slate-700">
              Belum ada buku terbaru
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Koleksi buku akan muncul di sini setelah tersedia.
            </p>
          </div>
        )}
      </section>

    </div>
  );
}
