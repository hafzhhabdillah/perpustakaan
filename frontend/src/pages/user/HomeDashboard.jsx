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
  MoveUpRight,
  Quote,
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

  const sectionHeading = (eyebrow, title, description, icon) => (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2 text-primary-600 dark:text-accent-500">
          {icon}
          <span className="text-[10px] font-bold uppercase tracking-[0.22em]">
            {eyebrow}
          </span>
        </div>

        <h2 className="font-heading text-2xl font-bold tracking-tight text-neutral-600 dark:text-white sm:text-3xl">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-neutral-400 dark:text-neutral-300">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onNavigate('catalog')}
        className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary-600 transition hover:text-primary-700 dark:text-accent-500"
      >
        Jelajahi semua
        <ArrowRight
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </button>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-16 pb-12">

      {/* HERO */}
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#F0F0E8] dark:bg-[#1B3029]">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#C9DCCB]/70 blur-3xl dark:bg-emerald-900/30" />
        <div className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-[#E5D8BD]/60 blur-3xl dark:bg-emerald-950/30" />

        <div className="relative grid min-h-[470px] items-center gap-8 px-7 py-12 sm:px-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-16 lg:py-14">

          <div className="relative z-10 max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary-600/15 bg-white/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-emerald-200">
              <Sparkles size={14} />
              A space for curious minds
            </div>

            <h1 className="font-heading text-[2.8rem] font-extrabold leading-[1.08] tracking-[-0.055em] text-[#23372E] dark:text-[#F0F5ED] sm:text-6xl lg:text-[4.5rem]">
              Dunia luas,
              <span className="mt-1 block font-medium italic text-primary-600 dark:text-[#A5D5B9]">
                dimulai dari
              </span>
              satu halaman.
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-7 text-[#64736A] dark:text-neutral-300 sm:text-base">
              Temukan cerita baru, perluas wawasan, dan jelajahi
              koleksi bacaan pilihan yang siap menemani setiap
              perjalanan pengetahuanmu.
            </p>

            <form
              onSubmit={handleSearchSubmit}
              className="mt-9 flex max-w-xl flex-col gap-2 rounded-2xl border border-black/5 bg-white p-2 shadow-[0_12px_40px_rgba(35,55,46,0.08)] dark:border-white/10 dark:bg-neutral-700 sm:flex-row"
            >
              <div className="relative flex min-w-0 flex-1 items-center">
                <Search
                  size={19}
                  className="absolute left-4 text-neutral-400"
                />
                <input
                  type="text"
                  placeholder="Cari buku, penulis, atau topik..."
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  className="w-full rounded-xl border-0 bg-transparent py-3.5 pl-12 pr-4 text-sm text-neutral-600 outline-none placeholder:text-neutral-300 focus:ring-0 dark:text-white dark:placeholder:text-neutral-300"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/20 active:translate-y-0"
              >
                Cari buku
                <ArrowRight size={17} />
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-[#718077] dark:text-neutral-300">
              <span className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-primary-600 dark:text-accent-500" />
                Koleksi terkurasi
              </span>
              <span className="flex items-center gap-2">
                <Sparkles size={15} className="text-primary-600 dark:text-accent-500" />
                AI Book Advisor
              </span>
              <span className="flex items-center gap-2">
                <BookOpen size={15} className="text-primary-600 dark:text-accent-500" />
                Digital Library
              </span>
            </div>
          </div>

          {/* EDITORIAL BOOK ART */}
          <div className="relative mx-auto hidden h-[390px] w-full max-w-[440px] items-center justify-center lg:flex">
            <div className="absolute h-[340px] w-[340px] rounded-full border border-primary-700/10" />
            <div className="absolute h-[270px] w-[270px] rounded-full border border-primary-700/10" />

            <div className="absolute right-5 top-8 rotate-[10deg] text-[10px] font-bold uppercase tracking-[0.35em] text-primary-700/50 dark:text-emerald-200/50">
              Read · Discover · Grow
            </div>

            <div className="relative z-10 flex h-[290px] w-[205px] -rotate-[8deg] flex-col justify-between rounded-r-xl rounded-l-sm border-l-[9px] border-[#193D30] bg-[#275B45] p-7 text-[#F2F0E4] shadow-2xl shadow-[#183B2C]/30 transition duration-700 hover:-rotate-3 hover:scale-105">
              <div>
                <BookOpen size={32} strokeWidth={1.4} className="mb-12 text-[#D7CBA8]" />
                <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#D7CBA8]">
                  The Libraria Edition
                </p>
                <h3 className="mt-4 font-heading text-[2rem] font-bold leading-[1.08]">
                  Art of
                  <br />
                  Reading
                </h3>
              </div>

              <div className="border-t border-white/20 pt-4">
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/70">
                  Knowledge begins here
                </p>
              </div>
            </div>

            <div className="absolute right-5 top-[100px] z-20 flex h-[165px] w-[112px] rotate-[12deg] flex-col justify-between rounded-r-lg border-l-[5px] border-[#835B36] bg-[#D5B58A] p-4 text-[#60452F] shadow-xl transition duration-500 hover:rotate-6">
              <Sparkles size={23} />
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.2em]">
                  Volume 02
                </p>
                <p className="mt-2 font-heading text-lg font-bold leading-tight">
                  New
                  <br />
                  Ideas
                </p>
              </div>
            </div>

            <div className="absolute bottom-9 left-5 z-20 flex h-[145px] w-[100px] -rotate-[13deg] flex-col justify-between rounded-r-lg border-l-[5px] border-[#283747] bg-[#475C68] p-4 text-white shadow-xl transition duration-500 hover:-rotate-6">
              <Quote size={22} className="text-[#E2C99B]" />
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/60">
                  Collection
                </p>
                <p className="mt-2 font-heading text-base font-bold leading-tight">
                  Your
                  <br />
                  Story
                </p>
              </div>
            </div>

            <div className="absolute -bottom-1 right-0 z-30 flex items-center gap-3 rounded-2xl border border-white/70 bg-white/90 p-3.5 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-neutral-700">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7EFE8] text-primary-600 dark:bg-emerald-900/50 dark:text-emerald-200">
                <Bookmark size={21} />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-600 dark:text-white">
                  Your next chapter
                </p>
                <p className="mt-1 text-[10px] text-neutral-400 dark:text-neutral-300">
                  Starts with one book.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 h-1 w-1/3 bg-primary-600 dark:bg-accent-500" />
      </section>

      {/* AI ADVISOR */}
      <section className="group relative overflow-hidden rounded-[1.75rem] bg-[#163B65] p-7 text-white shadow-lg shadow-[#163B65]/10 sm:p-10">
        <div className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full border border-white/10 transition-transform duration-700 group-hover:scale-125" />
        <div className="pointer-events-none absolute -right-4 -top-16 h-52 w-52 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute bottom-0 right-1/3 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">
          <div className="max-w-xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-[#D5C69E]">
                <Sparkles size={22} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D5C69E]">
                Meet your reading companion
              </span>
            </div>

            <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Buku yang tepat,
              <br />
              untuk rasa ingin tahu yang hebat.
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-7 text-emerald-100/70">
              Ceritakan minatmu kepada Libraria AI. Temukan rekomendasi
              bacaan yang sesuai dengan hal-hal yang ingin kamu pelajari.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('ai-advisor')}
            className="group/button inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-[#E9E8D9] px-6 py-4 text-sm font-bold text-[#163B65] transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl active:translate-y-0"
          >
            Explore AI Advisor
            <MoveUpRight
              size={17}
              className="transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5"
            />
          </button>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="space-y-7">
        {sectionHeading(
          'Explore by interest',
          'Jelajahi kategori.',
          'Temukan bacaan yang sesuai dengan hal yang kamu sukai.',
          <Layers size={17} />
        )}

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat, index) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onNavigate('catalog', { categoryId: cat.id })}
                className="group relative overflow-hidden rounded-2xl border border-neutral-100 bg-white p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/30 hover:shadow-xl hover:shadow-primary-900/5 dark:border-neutral-700 dark:bg-neutral-700 dark:hover:border-accent-500/40"
              >
                <span className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-primary-50 transition-transform duration-500 group-hover:scale-150 dark:bg-primary-900/30" />

                <div className="relative mb-8 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors duration-300 group-hover:bg-primary-600 group-hover:text-white dark:bg-primary-900/40 dark:text-accent-500 dark:group-hover:bg-primary-500 dark:group-hover:text-white">
                  <BookOpen size={20} strokeWidth={1.7} />
                </div>

                <div className="relative">
                  <h3 className="line-clamp-1 text-sm font-bold text-neutral-600 dark:text-white">
                    {cat.name}
                  </h3>
                  <p className="mt-1.5 text-[11px] text-neutral-400 dark:text-neutral-300">
                    {cat.books_count ?? 0} koleksi
                  </p>
                </div>

                <ArrowUpRight
                  size={15}
                  className="absolute bottom-5 right-5 text-neutral-300 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary-600 dark:group-hover:text-accent-500"
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-200 py-12 text-center dark:border-neutral-700">
            <Compass size={28} className="mx-auto mb-3 text-neutral-300" />
            <p className="text-sm text-neutral-400 dark:text-neutral-300">
              Belum ada kategori untuk ditampilkan.
            </p>
          </div>
        )}
      </section>

      {/* FEATURED BOOKS */}
      {featuredBooks.length > 0 && (
        <section className="space-y-7">
          <div className="flex items-center justify-between gap-4">
            {sectionHeading(
              'Curated collection',
              'Pilihan untukmu.',
              'Koleksi pilihan yang layak masuk daftar bacaanmu.',
              <Flame size={17} />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
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

      {/* RECENT BOOKS */}
      <section className="space-y-7">
        {sectionHeading(
          'Recently added',
          'Cerita yang baru hadir.',
          'Lihat koleksi terbaru yang baru saja ditambahkan ke perpustakaan.',
          <LibraryBig size={17} />
        )}

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="animate-pulse space-y-3 rounded-2xl border border-neutral-100 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-700"
              >
                <div className="aspect-[3/4] rounded-xl bg-neutral-100 dark:bg-neutral-600" />
                <div className="h-4 w-3/4 rounded bg-neutral-100 dark:bg-neutral-600" />
                <div className="h-3 w-1/2 rounded bg-neutral-100 dark:bg-neutral-600" />
              </div>
            ))}
          </div>
        ) : recentBooks.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
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
          <div className="rounded-2xl border border-dashed border-neutral-200 py-14 text-center dark:border-neutral-700">
            <BookOpen size={30} className="mx-auto mb-3 text-neutral-300" />
            <h3 className="font-heading font-bold text-neutral-600 dark:text-white">
              Belum ada koleksi terbaru
            </h3>
            <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-300">
              Buku yang baru ditambahkan akan muncul di sini.
            </p>
          </div>
        )}
      </section>

      {/* BOTTOM CTA */}
      <section className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-[#E7E4D9] bg-[#F6F4ED] p-7 dark:border-neutral-700 dark:bg-neutral-700 sm:flex-row sm:items-center sm:p-9">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600 dark:text-accent-500">
            Keep exploring
          </p>
          <h2 className="font-heading text-xl font-bold text-neutral-600 dark:text-white sm:text-2xl">
            Masih banyak cerita menunggumu.
          </h2>
          <p className="mt-2 text-sm text-neutral-400 dark:text-neutral-300">
            Temukan bacaan berikutnya di seluruh koleksi Libraria.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('catalog')}
          className="inline-flex shrink-0 items-center gap-3 rounded-xl bg-primary-600 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-700 hover:shadow-lg active:translate-y-0"
        >
          Lihat semua buku
          <ArrowRight size={17} />
        </button>
      </section>
    </div>
  );
}