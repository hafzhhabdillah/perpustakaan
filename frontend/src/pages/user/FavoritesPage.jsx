import { useState, useEffect } from 'react';
import { favoriteService } from '../../services/api';
import BookCard from '../../components/BookCard';
import { Heart, BookHeart, Sparkles } from 'lucide-react';

export default function FavoritesPage({
  onSelectBook,
  onToggleFavorite,
  onNavigate,
  isFavoriteLoading,
}) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const res = await favoriteService.getAll();
      if (res.data?.success) {
        setFavorites(res.data.data?.data || []);
      }
    } catch (err) {
      console.error('Failed to load favorites', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (book) => {
    await onToggleFavorite(book);
    // Reload favorites list to update UI
    loadFavorites();
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="bg-gradient-to-r from-rose-500/10 via-brand-500/10 to-transparent p-6 sm:p-8 rounded-3xl border border-rose-100 flex items-center justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600">
            <Heart className="w-4 h-4 fill-rose-600" />
            <span>Koleksi Pribadi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Daftar Buku Favorit Anda
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Buku yang Anda simpan untuk referensi bacaan di masa mendatang ({favorites.length} buku)
          </p>
        </div>
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
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onSelect={onSelectBook}
              onToggleFavorite={handleToggle}
              isFavoriteLoading={isFavoriteLoading}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
            <BookHeart className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800">Belum Ada Buku Favorit</h4>
            <p className="text-xs text-slate-500 mt-1">
              Jelajahi katalog buku dan klik ikon hati pada buku yang Anda minati untuk menyimpannya di sini.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => onNavigate('catalog')}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Jelajahi Katalog Buku
            </button>
            <button
              onClick={() => onNavigate('ai-advisor')}
              className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Minta Saran AI
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

