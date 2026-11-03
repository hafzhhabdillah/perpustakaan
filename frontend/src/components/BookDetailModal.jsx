import { X, Heart, Calendar, Building, BookCheck, Hash, Layers } from 'lucide-react';

export default function BookDetailModal({ book, isOpen, onClose, onToggleFavorite, isFavoriteLoading }) {
  if (!isOpen || !book) return null;

  const cover = book.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-neutral-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-600">
            <Layers className="w-4 h-4" />
            <span>{book.category?.name || 'Katalog Buku'}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cover & Quick Actions */}
          <div className="flex flex-col items-center">
            <div className="aspect-[3/4] w-full max-w-[220px] rounded-2xl overflow-hidden shadow-lg border border-neutral-200 bg-neutral-100">
              <img
                src={cover}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80';
                }}
              />
            </div>

            <button
              onClick={() => onToggleFavorite(book)}
              disabled={isFavoriteLoading}
              className={`w-full mt-4 py-2.5 px-4 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm ${
                book.is_favorited
                  ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                  : 'bg-neutral-900 text-white hover:bg-neutral-800'
              }`}
            >
              <Heart className={`w-4 h-4 ${book.is_favorited ? 'fill-rose-600 text-rose-600' : ''}`} />
              {book.is_favorited ? 'Disimpan di Favorit' : 'Tambah ke Favorit'}
            </button>

            <div className="mt-3 text-center">
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                book.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {book.stock > 0 ? `Tersedia: ${book.stock} eksemplar` : 'Stok Kosong'}
              </span>
            </div>
          </div>

          {/* Details Content */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-tight">
                {book.title}
              </h2>
              <p className="text-sm font-medium text-brand-600 mt-1">
                Ditulis oleh <span className="font-bold">{book.author}</span>
              </p>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-100 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-neutral-400" />
                <div>
                  <p className="text-[10px] text-neutral-400 uppercase font-semibold">Penerbit</p>
                  <p className="font-medium text-neutral-800">{book.publisher || '-'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <div>
                  <p className="text-[10px] text-neutral-400 uppercase font-semibold">Tahun Terbit</p>
                  <p className="font-medium text-neutral-800">{book.published_year || '-'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-neutral-400" />
                <div>
                  <p className="text-[10px] text-neutral-400 uppercase font-semibold">ISBN</p>
                  <p className="font-mono font-medium text-neutral-800">{book.isbn || '-'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <BookCheck className="w-4 h-4 text-neutral-400" />
                <div>
                  <p className="text-[10px] text-neutral-400 uppercase font-semibold">Kategori</p>
                  <p className="font-medium text-neutral-800">{book.category?.name || '-'}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Sinopsis & Deskripsi
              </h4>
              <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line bg-white p-3.5 rounded-xl border border-neutral-100">
                {book.description || 'Tidak ada deskripsi detail untuk buku ini.'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-100 rounded-xl transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

