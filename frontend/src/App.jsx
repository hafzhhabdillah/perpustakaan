
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

function MainApp() {
  const { isAuthenticated, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('home');
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
    <div className="min-h-screen bg-primary-50 dark:bg-neutral-600 flex flex-col">
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        onOpenAuth={handleOpenAuth}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-16">

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
      </main>

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
