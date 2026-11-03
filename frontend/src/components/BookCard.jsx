import { Heart, BookOpen, Tag, ArrowUpRight } from 'lucide-react';

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80';

export default function BookCard({
  book,
  onSelect,
  onToggleFavorite,
  isFavoriteLoading,
}) {
  const cover = book.cover_image || PLACEHOLDER;
  const outOfStock = Number(book.stock ?? 0) <= 0;

  return (
    <article className="group relative flex flex-col bg-white dark:bg-neutral-700 rounded-[22px] border border-[#DBEAFE] dark:border-neutral-600 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#163B65]/10 hover:border-[#BFDBFE]">

      {/* Book cover */}
      <div
        className="relative aspect-[3/4] overflow-hidden bg-[#EFF6FF] dark:bg-neutral-600 cursor-pointer"
        onClick={() => onSelect(book)}
      >
        <img
          src={cover}
          alt={book.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PLACEHOLDER;
          }}
        />

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#102B4A]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Detail button */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#163B65] text-xs font-bold shadow-lg">
            <BookOpen className="w-3.5 h-3.5" />
            Lihat Detail
          </span>
        </div>

        {/* Stock label */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold backdrop-blur-md shadow-sm ${
            outOfStock
              ? 'bg-red-500/90 text-white'
              : 'bg-[#163B65]/90 text-white'
          }`}>
            {outOfStock ? 'Stok Habis' : `Tersedia · ${book.stock}`}
          </span>
        </div>

        {/* Favorite button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(book);
          }}
          disabled={isFavoriteLoading}
          aria-label="Toggle favorit"
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
            book.is_favorited
              ? 'bg-red-500 text-white'
              : 'bg-white/90 text-neutral-500 hover:bg-white hover:text-red-500'
          }`}
        >
          <Heart
            className={`w-4 h-4 ${book.is_favorited ? 'fill-current' : ''}`}
          />
        </button>
      </div>

      {/* Book information */}
      <div
        className="flex flex-col flex-1 p-4 cursor-pointer"
        onClick={() => onSelect(book)}
      >
        <div className="flex items-center gap-1.5 mb-2.5">
          <Tag className="w-3.5 h-3.5 text-[#60A5FA] shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#60A5FA] truncate">
            {book.category?.name || 'Umum'}
          </span>
        </div>

        <h4 className="font-heading font-bold text-[15px] leading-snug text-[#163B65] dark:text-white line-clamp-2 min-h-[42px] group-hover:text-[#60A5FA] transition-colors">
          {book.title}
        </h4>

        <p className="text-xs text-neutral-400 mt-2 line-clamp-1">
          {book.author || 'Penulis tidak diketahui'}
        </p>

        {book.published_year && (
          <p className="text-[11px] text-neutral-400 mt-1">
            Tahun terbit · {book.published_year}
          </p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#EFF6FF] dark:border-neutral-600 mt-4">
          <span className="text-[10px] text-neutral-400 font-mono truncate max-w-[120px]">
            {book.isbn ? `ISBN ${book.isbn}` : 'ISBN —'}
          </span>

          <span className="flex items-center gap-1 text-xs font-bold text-[#60A5FA] group-hover:text-[#163B65] dark:text-sky-300 transition-colors">
            Detail
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}