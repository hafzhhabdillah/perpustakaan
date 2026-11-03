import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/api';
import {
  BookCopy, Layers, Users, Heart, Boxes, PlusCircle, Globe,
  ArrowRight, TrendingUp, Library, Sparkles,
} from 'lucide-react';

const statItems = [
  { key: 'total_books', label: 'Total Buku', icon: BookCopy, tone: 'green' },
  { key: 'total_categories', label: 'Kategori', icon: Layers, tone: 'sage' },
  { key: 'total_users', label: 'Pengguna', icon: Users, tone: 'blue' },
  { key: 'total_favorites', label: 'Favorit', icon: Heart, tone: 'rose' },
  { key: 'total_stock', label: 'Stok Fisik', icon: Boxes, tone: 'amber' },
];

const toneClasses = {
  green: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200',
  sage: 'bg-[#DBEAFE] text-[#163B65] dark:bg-[#1E293B] dark:text-[#BFDBFE]',
  blue: 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
};

export default function AdminDashboard({ onNavigate, onSelectBook }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadStats = async () => {
      try {
        const res = await dashboardService.getAdminStats();
        if (mounted && res.data?.success) setStats(res.data.data);
      } catch (err) {
        console.error('Failed to load admin dashboard stats', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadStats();
    return () => { mounted = false; };
  }, []);

  const counts = stats?.counts || {};

  return (
    <div className="space-y-7 pb-12">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#163B65] px-6 py-8 text-white shadow-xl shadow-primary-900/10 sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full border-[36px] border-white/[0.06]" />
        <div className="pointer-events-none absolute -bottom-28 right-44 h-64 w-64 rounded-full bg-[#93C5FD]/10 blur-2xl" />
        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-[#DBEAFE]">
              <Sparkles className="h-3.5 w-3.5" /> LIBRARIA ADMINISTRATION
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Dashboard Perpustakaan</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
              Pantau koleksi, kategori, pengguna, dan aktivitas perpustakaan dari satu tempat.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => onNavigate('admin-books')} className="inline-flex items-center gap-2 rounded-xl bg-[#DBEAFE] px-4 py-3 text-sm font-bold text-[#163B65] shadow-lg transition hover:-translate-y-0.5 hover:bg-white">
              <PlusCircle className="h-4 w-4" /> Tambah Buku
            </button>
            <button onClick={() => onNavigate('admin-open-library')} className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
              <Globe className="h-4 w-4" /> Open Library
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-600 dark:text-primary-300">Overview</p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">Ringkasan Perpustakaan</h2>
          </div>
          <span className="hidden rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 sm:inline-flex">
            Data terbaru
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {statItems.map(({ key, label, icon: Icon, tone }) => (
            <article key={key} className="group rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClasses[tone]}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="mt-1 h-2 w-2 rounded-full bg-primary-400 opacity-70" />
              </div>
              <p className="mt-5 text-xs font-semibold text-neutral-500 dark:text-neutral-400">{label}</p>
              <p className="mt-1 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                {loading ? <span className="inline-block h-8 w-14 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-700" /> : (counts[key] ?? 0).toLocaleString('id-ID')}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <article className="rounded-3xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 xl:col-span-2 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-600 dark:text-primary-300">Koleksi</p>
              <h3 className="mt-1 text-lg font-extrabold text-neutral-900 dark:text-neutral-50">Distribusi Kategori</h3>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-200"><TrendingUp className="h-5 w-5" /></span>
          </div>
          <div className="mt-5 space-y-3">
            {loading ? <p className="py-8 text-center text-sm text-neutral-400">Memuat kategori...</p> :
              stats?.category_breakdown?.length ? stats.category_breakdown.map((cat, index) => {
                const total = Math.max(...stats.category_breakdown.map(item => Number(item.books_count) || 0), 1);
                const percent = Math.round(((Number(cat.books_count) || 0) / total) * 100);
                return (
                  <div key={cat.id} className="rounded-2xl bg-primary-50/70 p-3.5 dark:bg-neutral-700/60">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0"><p className="truncate text-sm font-bold text-neutral-800 dark:text-neutral-100">{cat.name}</p><p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">/{cat.slug}</p></div>
                      <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-primary-700 dark:bg-neutral-800 dark:text-primary-200">{cat.books_count} buku</span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-primary-100 dark:bg-neutral-600"><div className="h-full rounded-full bg-primary-500" style={{ width: `${percent}%` }} /></div>
                  </div>
                );
              }) : <div className="rounded-2xl border border-dashed border-neutral-200 py-10 text-center dark:border-neutral-700"><Layers className="mx-auto h-7 w-7 text-neutral-300" /><p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Belum ada data kategori.</p></div>}
          </div>
          <button onClick={() => onNavigate('admin-categories')} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary-700 transition hover:gap-3 dark:text-primary-300">Kelola kategori <ArrowRight className="h-4 w-4" /></button>
        </article>

        <article className="rounded-3xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 xl:col-span-3 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-600 dark:text-primary-300">Aktivitas koleksi</p><h3 className="mt-1 text-lg font-extrabold text-neutral-900 dark:text-neutral-50">Buku Terbaru</h3></div>
            <button onClick={() => onNavigate('admin-books')} className="inline-flex items-center gap-1 text-xs font-bold text-primary-700 hover:text-primary-900 dark:text-primary-300">Lihat semua <ArrowRight className="h-3.5 w-3.5" /></button>
          </div>
          <div className="mt-4 divide-y divide-neutral-100 dark:divide-neutral-700">
            {loading ? <p className="py-10 text-center text-sm text-neutral-400">Memuat buku...</p> :
              stats?.recent_books?.length ? stats.recent_books.map(book => (
                <button key={book.id} onClick={() => onSelectBook(book)} className="flex w-full items-center gap-3 rounded-xl py-3 text-left transition hover:bg-primary-50/70 dark:hover:bg-neutral-700/50 sm:px-2">
                  <img src={book.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=100&q=80'} alt={book.title} className="h-14 w-10 shrink-0 rounded-lg border border-neutral-200 object-cover dark:border-neutral-600" />
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-neutral-900 dark:text-neutral-100">{book.title}</span><span className="mt-1 block truncate text-xs text-neutral-500 dark:text-neutral-400">{book.author} <span className="text-primary-600 dark:text-primary-300">· {book.category?.name || 'Umum'}</span></span></span>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${book.stock > 0 ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'}`}>Stok {book.stock}</span>
                </button>
              )) : <div className="py-12 text-center"><Library className="mx-auto h-8 w-8 text-neutral-300" /><p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Belum ada buku yang ditambahkan.</p></div>}
          </div>
        </article>
      </section>
    </div>
  );
}
