import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/api';
import {
  BookCopy,
  Layers,
  Users,
  Heart,
  Boxes,
  PlusCircle,
  Globe,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function AdminDashboard({ onNavigate, onSelectBook }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await dashboardService.getAdminStats();
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  const counts = stats?.counts || {};

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard Manajemen Perpustakaan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ringkasan data, statistik koleksi, dan aktivitas operasional perpustakaan
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onNavigate('admin-books')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" /> Tambah Buku
          </button>
          <button
            onClick={() => onNavigate('admin-open-library')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Globe className="w-4 h-4" /> Cari Open Library
          </button>
        </div>
      </div>

      {/* 1. METRICS STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <BookCopy className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Buku</p>
            <h3 className="text-2xl font-black text-slate-900">{counts.total_books ?? 0}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Kategori</p>
            <h3 className="text-2xl font-black text-slate-900">{counts.total_categories ?? 0}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Pengguna</p>
            <h3 className="text-2xl font-black text-slate-900">{counts.total_users ?? 0}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Heart className="w-5 h-5 fill-rose-600" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Buku Terfavorit</p>
            <h3 className="text-2xl font-black text-slate-900">{counts.total_favorites ?? 0}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Stok Fisik</p>
            <h3 className="text-2xl font-black text-slate-900">{counts.total_stock ?? 0}</h3>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY BREAKDOWN & RECENT BOOKS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600" /> Distribusi Kategori
            </h3>
            <button
              onClick={() => onNavigate('admin-categories')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              Kelola →
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {stats?.category_breakdown?.map((cat) => (
              <div key={cat.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{cat.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">/{cat.slug}</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand-100 text-brand-700">
                  {cat.books_count} buku
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Books Added */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookCopy className="w-4 h-4 text-brand-600" /> Buku Baru Ditambahkan
            </h3>
            <button
              onClick={() => onNavigate('admin-books')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Semua Koleksi <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {stats?.recent_books?.map((b) => (
              <div key={b.id} className="py-3 flex items-center justify-between gap-4 group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-14 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                    <img
                      src={b.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=100&q=80'}
                      alt={b.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4
                      onClick={() => onSelectBook(b)}
                      className="text-sm font-bold text-slate-900 line-clamp-1 hover:text-brand-600 cursor-pointer transition"
                    >
                      {b.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {b.author} • <span className="text-brand-600 font-medium">{b.category?.name}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Stok: {b.stock}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

