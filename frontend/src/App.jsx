
import { useState, useCallback } from 'react';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/Navbar';
import Toast from './components/Toast';
import BookDetailModal from './components/BookDetailModal';
import AuthModal from './components/AuthModal';

// User Pages
import HomeDashboard from './pages/user/HomeDashboard';
import BookCatalog from './pages/user/BookCatalog';
import FavoritesPage from './pages/user/FavoritesPage';
import AiAdvisorPage from './pages/user/AiAdvisorPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import BookManager from './pages/admin/BookManager';
import CategoryManager from './pages/admin/CategoryManager';
import OpenLibrarySearch from './pages/admin/OpenLibrarySearch';
import UserManager from './pages/admin/UserManager';

import { favoriteService } from './services/api';
import { LayoutDashboard, BookCopy, Layers, Globe, Users, BookMarked, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from './context/ThemeContext';

function MainApp() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const adminNavigation = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-books', label: 'Manajemen Buku', icon: BookCopy },
    { id: 'admin-categories', label: 'Kategori', icon: Layers },
    { id: 'admin-open-library', label: 'Open Library', icon: Globe },
    { id: 'admin-users', label: 'Pengguna', icon: Users },
  ];

  const [activeTab, setActiveTab] = useState(() => isAdmin ? 'admin-dashboard' : 'home');
  const isAdminArea = isAdmin && activeTab.startsWith('admin-');
  const [catalogFilters, setCatalogFilters] = useState({
    search: '',
    categoryId: '',
  });

  const [toast, setToast] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const showToast = useCallback((data) => {
    setToast(data);
  }, []);

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setDetailModalOpen(true);
  };

  const handleNavigate = (tab, params = {}) => {
    if (tab === 'catalog') {
      setCatalogFilters({
        search: params.search || '',
        categoryId: params.categoryId || '',
      });
    }

    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = async (book) => {
    if (!isAuthenticated) {
      handleOpenAuth('login');

      showToast({
        type: 'info',
        message: 'Silakan masuk terlebih dahulu untuk menyimpan favorit.',
      });

      return;
    }

    setFavoriteLoading(true);

    try {
      const res = await favoriteService.toggle(book.id);

      if (res.data?.success) {
        showToast({
          type: 'success',
          message: res.data.message,
        });

        if (selectedBook?.id === book.id) {
          setSelectedBook({
            ...selectedBook,
            is_favorited: res.data.is_favorited,
          });
        }
      }
    } catch (err) {
      showToast({
        type: 'error',
        message:
          err.response?.data?.message ||
          'Gagal memperbarui favorit.',
      });
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleSetActiveTab = (tab) => {
    if (tab.startsWith('admin-') && !isAdmin) {
      showToast({
        type: 'error',
        message: 'Akses ditolak. Halaman khusus administrator.',
      });

      return;
    }

    setActiveTab(tab);
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#EFF6FF] text-[#1E293B] transition-colors duration-200 dark:bg-[#0F172A] dark:text-slate-100">
      <div className={isAdminArea ? "flex min-h-0 flex-1 overflow-hidden" : "flex min-h-0 flex-1 flex-col overflow-hidden"}>
      {!isAdminArea && <Navbar activeTab={activeTab} setActiveTab={handleSetActiveTab} onOpenAuth={handleOpenAuth} />}

      {isAdminArea && (
        <aside className="hidden h-full w-[264px] shrink-0 flex-col overflow-hidden bg-[#163B65] text-white lg:flex">
          <div className="flex h-[84px] items-center gap-3 border-b border-white/10 px-7">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#163B65]"><BookMarked className="h-5 w-5" /></span>
            <span><strong className="block text-lg font-extrabold tracking-tight">Libraria</strong><small className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/70">Admin workspace</small></span>
          </div>
          <div className="px-5 pt-7">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100/50">Workspace</p>
            <nav className="space-y-1.5">
              {adminNavigation.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" onClick={() => handleSetActiveTab(id)} className={"flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors " + (activeTab === id ? "bg-white text-[#163B65]" : "text-blue-50/80 hover:bg-white/10 hover:text-white")}>
                  <Icon className="h-[18px] w-[18px]" />{label}
                </button>
              ))}
            </nav>
          </div>
          <div className="mt-auto border-t border-white/10 p-5">
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-white/10 p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DBEAFE] text-sm font-bold text-[#163B65]">{user?.name?.charAt(0)?.toUpperCase() || "A"}</span>
              <span className="min-w-0"><strong className="block truncate text-sm">{user?.name || "Administrator"}</strong><small className="text-xs text-blue-100/70">Administrator</small></span>
            </div>
            <button type="button" onClick={toggleTheme} className="mb-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-blue-50/80 transition hover:bg-white/10 hover:text-white">{theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}{theme === "dark" ? "Mode terang" : "Mode gelap"}</button>
            <button type="button" onClick={() => { logout(); setActiveTab("home"); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-blue-100/80 transition hover:bg-white/10 hover:text-white"><LogOut className="h-4 w-4" />Keluar</button>
          </div>
        </aside>
      )}

      <div className={isAdminArea ? "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden" : "flex min-h-0 flex-1 flex-col overflow-hidden"}>
        {isAdminArea && (
          <header className="relative z-30 flex min-h-[84px] shrink-0 items-center justify-between border-b border-[#DBEAFE] bg-white/95 px-5 backdrop-blur md:px-9 dark:border-slate-700 dark:bg-[#1E293B]">
            <div><p className="text-xs font-medium text-[#64748B] dark:text-slate-400">Libraria / Administrator</p><h1 className="mt-1 text-xl font-bold text-[#163B65] dark:text-white">{adminNavigation.find(item => item.id === activeTab)?.label || "Dashboard"}</h1></div>
            <div className="flex items-center gap-3"><span className="hidden text-sm font-semibold text-slate-600 dark:text-slate-200 sm:block">{user?.name || "Administrator"}</span><button type="button" onClick={toggleTheme} className="inline-flex items-center gap-2 rounded-xl border border-[#DBEAFE] px-3 py-2 text-xs font-bold text-[#163B65] transition hover:bg-[#EFF6FF] dark:border-slate-600 dark:text-blue-200 dark:hover:bg-slate-700">{theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}<span>{theme === "dark" ? "Mode terang" : "Mode gelap"}</span></button></div>
          </header>
        )}
        {isAdminArea && (
          <nav className="flex shrink-0 gap-2 overflow-x-auto border-b border-[#DBEAFE] bg-white px-4 py-3 lg:hidden dark:border-slate-700 dark:bg-[#1E293B]">
            {adminNavigation.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => handleSetActiveTab(id)} className={"inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold " + (activeTab === id ? "bg-[#163B65] text-white" : "bg-[#EFF6FF] text-[#163B65] dark:bg-slate-700 dark:text-slate-200")}><Icon className="h-4 w-4" />{label}</button>)}
          </nav>
        )}

      <main className={isAdminArea ? "libraria-scroll-area min-h-0 w-full flex-1 overflow-y-auto overscroll-contain px-4 py-7 sm:px-6 lg:px-9" : "libraria-scroll-area mx-auto min-h-0 w-full max-w-7xl flex-1 overflow-y-auto overscroll-contain px-4 pt-8 pb-16 sm:px-6 lg:px-8"}>

        <div key={activeTab} className="libraria-page-enter">
        {/* USER PAGES */}
        {activeTab === 'home' && (
          <HomeDashboard
            onSelectBook={handleSelectBook}
            onToggleFavorite={handleToggleFavorite}
            onNavigate={handleNavigate}
            isFavoriteLoading={favoriteLoading}
          />
        )}

        {activeTab === 'catalog' && (
          <BookCatalog
            initialSearch={catalogFilters.search}
            initialCategoryId={catalogFilters.categoryId}
            onSelectBook={handleSelectBook}
            onToggleFavorite={handleToggleFavorite}
            isFavoriteLoading={favoriteLoading}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesPage
            onSelectBook={handleSelectBook}
            onToggleFavorite={handleToggleFavorite}
            onNavigate={handleNavigate}
            isFavoriteLoading={favoriteLoading}
          />
        )}

        {activeTab === 'ai-advisor' && (
          <AiAdvisorPage
            onSelectBook={handleSelectBook}
            onNotify={showToast}
          />
        )}

        {/* ADMIN PAGES */}
        {isAdmin && activeTab === 'admin-dashboard' && (
          <AdminDashboard
            onNavigate={handleNavigate}
            onSelectBook={handleSelectBook}
          />
        )}

        {isAdmin && activeTab === 'admin-books' && (
          <BookManager
            onSelectBook={handleSelectBook}
            onNotify={showToast}
          />
        )}

        {isAdmin && activeTab === 'admin-categories' && (
          <CategoryManager onNotify={showToast} />
        )}

        {isAdmin && activeTab === 'admin-open-library' && (
          <OpenLibrarySearch onNotify={showToast} />
        )}

        {isAdmin && activeTab === 'admin-users' && (
          <UserManager onNotify={showToast} />
        )}
        </div>
      {/* FOOTER */}
      <footer className="border-t border-neutral-100 dark:border-neutral-700 bg-white dark:bg-neutral-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">

          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-primary-500 flex items-center justify-center">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </span>

            <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-50">
              Libraria
            </span>

            <span className="text-xs text-neutral-300 dark:text-neutral-300 hidden sm:inline">
              · Laravel 11 + React 19 + Groq AI
            </span>
          </div>

          <p className="text-xs text-neutral-400 dark:text-neutral-300">
            © {new Date().getFullYear()} Libraria. All rights reserved.
          </p>
        </div>
      </footer>

      </main>
      </div>
      </div>

      {/* BOOK DETAIL MODAL */}
      <BookDetailModal
        book={selectedBook}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onToggleFavorite={handleToggleFavorite}
        isFavoriteLoading={favoriteLoading}
      />

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onNotify={showToast}
        defaultMode={authMode}
      />

      {/* TOAST */}
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
