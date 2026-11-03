import { Heart, BookOpen, Tag } from 'lucide-react';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80';

export default function BookCard({ book, onSelect, onToggleFavorite, isFavoriteLoading }) {
  const cover = book.cover_image || PLACEHOLDER;
  const outOfStock = book.stock <= 0;

  return (
    <article className="group relative bg-white dark:bg-neutral-700 rounded-2xl border border-neutral-100 dark:border-neutral-600 hover:border-primary-300 dark:hover:border-primary-500 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer">

      {/* Cover */}
      <div
        className="relative aspect-[3/4] overflow-hidden bg-primary-100 dark:bg-neutral-600"
        onClick={() => onSelect(book)}
      >
        <img
          src={cover}
          alt={book.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = PLACEHOLDER; }}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-primary-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-white bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <BookOpen className="w-3.5 h-3.5" /> Lihat Detail
          </span>
        </div>

        {/* Stock badge */}
        <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm ${
          outOfStock
            ? 'bg-red-500/90 text-white'
            : 'bg-primary-500/90 text-white'
        }`}>
          {outOfStock ? 'Stok Habis' : `Stok ${book.stock}`}
        </span>

        {/* Favorite button */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(book); }}
          disabled={isFavoriteLoading}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm shadow transition-all duration-200 ${
            book.is_favorited
              ? 'bg-red-500 text-white scale-110'
              : 'bg-white/80 text-neutral-400 hover:text-red-500 hover:bg-white'
          }`}
          aria-label="Toggle favorit"
        >
          <Heart className={`w-3.5 h-3.5 ${book.is_favorited ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1" onClick={() => onSelect(book)}>
        <div className="flex items-center gap-1.5 mb-2">
          <Tag className="w-3 h-3 text-primary-500 shrink-0" />
          <span className="text-[11px] font-semibold text-primary-500 uppercase tracking-wide truncate">
            {book.category?.name || 'Umum'}
          </span>
        </div>

        <h4 className="font-heading font-bold text-sm text-primary-900 dark:text-white line-clamp-2 leading-snug group-hover:text-primary-500 transition-colors duration-200">
          {book.title}
        </h4>

        <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
          {book.author}{book.published_year ? ` · ${book.published_year}` : ''}
        </p>

        <div className="mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-600 flex items-center justify-between">
          <span className="text-[10px] font-mono text-neutral-300 dark:text-neutral-400 truncate max-w-[110px]">
            {book.isbn ? `ISBN ${book.isbn}` : '—'}
          </span>
          <span className="text-xs font-semibold text-primary-500">
            Buka →
          </span>
        </div>
      </div>
    </article>
  );
}
