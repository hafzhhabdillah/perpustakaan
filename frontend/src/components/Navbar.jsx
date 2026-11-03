import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  BookMarked, Sparkles, Heart, LayoutDashboard, BookCopy,
  Layers, Globe, Users, LogOut, LogIn, Menu, X,
  ShieldCheck, Home, Sun, Moon, ChevronDown,
} from 'lucide-react';

const NAV_USER = [
  { id: 'home',       label: 'Beranda',   Icon: Home },
  { id: 'catalog',    label: 'Katalog',   Icon: BookCopy },
  { id: 'ai-advisor', label: 'AI Advisor', Icon: Sparkles },
];

const NAV_ADMIN = [
  { id: 'admin-dashboard',    label: 'Dashboard',    Icon: LayoutDashboard },
  { id: 'admin-books',        label: 'Buku',         Icon: BookCopy },
  { id: 'admin-categories',   label: 'Kategori',     Icon: Layers },
  { id: 'admin-open-library', label: 'Open Library', Icon: Globe },
  { id: 'admin-users',        label: 'Users',        Icon: Users },
];

function NavButton({ id, label, Icon, active, onClick, variant = 'default' }) {
  const base = 'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200';
  const styles = {
    default: active
      ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/30'
      : 'text-neutral-400 hover:text-neutral-500 hover:bg-primary-50 dark:text-neutral-300 dark:hover:bg-neutral-700',
    admin: active
      ? 'bg-primary-900 text-white shadow-sm'
      : 'text-neutral-400 hover:text-primary-900 hover:bg-primary-100 dark:text-neutral-300 dark:hover:bg-neutral-700',
    ai: active
      ? 'bg-gradient-to-r from-violet-500 to-primary-500 text-white shadow-sm'
      : 'text-violet-500 hover:bg-violet-50 dark:hover:bg-neutral-700',
  };

  return (
    <button onClick={() => onClick(id)} className={`${base} ${styles[variant]}`}>
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

export default function Navbar({ activeTab, setActiveTab, onOpenAuth }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const go = (tab) => { setActiveTab(tab); setMobileOpen(false); setDropdownOpen(false); };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-neutral-700/90 backdrop-blur-lg border-b border-neutral-100 dark:border-neutral-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <button
            onClick={() => go('home')}
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center shadow-md shadow-primary-500/20 group-hover:scale-105 transition duration-200">
              <BookMarked className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block">
              <span className="font-heading font-bold text-lg leading-none text-primary-900 dark:text-white tracking-tight">
                Libraria
              </span>
              <p className="text-[10px] text-neutral-300 dark:text-neutral-300 font-medium mt-0.5 leading-none">
                {isAdmin ? 'Admin Portal' : 'Digital Library'}
              </p>
            </div>
          </button>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {NAV_USER.map(({ id, label, Icon }) => (
              <NavButton
                key={id}
                id={id}
                label={label}
                Icon={Icon}
                active={activeTab === id}
                onClick={go}
                variant={id === 'ai-advisor' ? 'ai' : 'default'}
              />
            ))}

            {isAuthenticated && (
              <NavButton
                id="favorites"
                label="Favorit"
                Icon={Heart}
                active={activeTab === 'favorites'}
                onClick={go}
              />
            )}

            {isAdmin && (
              <div className="flex items-center gap-1 ml-3 pl-3 border-l border-neutral-100 dark:border-neutral-600">
                {NAV_ADMIN.map(({ id, label, Icon }) => (
                  <NavButton key={id} id={id} label={label} Icon={Icon} active={activeTab === id} onClick={go} variant="admin" />
                ))}
              </div>
            )}
          </nav>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-neutral-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-neutral-600 transition duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 py-1.5 pl-1.5 pr-3 rounded-xl border border-neutral-100 dark:border-neutral-600 hover:border-primary-200 dark:hover:border-neutral-500 transition duration-200 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center font-bold text-sm uppercase shadow-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-50 hidden md:block max-w-[100px] truncate">
                    {user?.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 hidden md:block" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-neutral-700 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-600 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-600">
                      <p className="text-sm font-bold text-primary-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-xs text-neutral-400 truncate mt-0.5">{user?.email}</p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <ShieldCheck className="w-3 h-3 text-primary-500" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary-500">
                          {user?.role}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => { setDropdownOpen(false); logout(); go('home'); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition"
                    >
                      <LogOut className="w-4 h-4" /> Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold shadow-sm shadow-primary-500/20 transition duration-200"
              >
                <LogIn className="w-4 h-4" /> Masuk
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-neutral-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-neutral-600 transition"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 pt-16" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <nav
            className="relative bg-white dark:bg-neutral-700 border-r border-neutral-100 dark:border-neutral-600 h-full w-72 max-w-[85vw] p-4 space-y-1 overflow-y-auto animate-slide-left shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-300 px-3 mb-3">Menu</p>
            {NAV_USER.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => go(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  activeTab === id
                    ? 'bg-primary-500 text-white'
                    : 'text-neutral-500 dark:text-neutral-200 hover:bg-primary-50 dark:hover:bg-neutral-600'
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
            {isAuthenticated && (
              <button
                onClick={() => go('favorites')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  activeTab === 'favorites'
                    ? 'bg-primary-500 text-white'
                    : 'text-neutral-500 dark:text-neutral-200 hover:bg-primary-50 dark:hover:bg-neutral-600'
                }`}
              >
                <Heart className="w-4 h-4" /> Favorit
              </button>
            )}
            {isAdmin && (
              <>
                <hr className="border-neutral-100 dark:border-neutral-600 my-2" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-300 px-3 mb-2">Admin</p>
                {NAV_ADMIN.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => go(id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                      activeTab === id
                        ? 'bg-primary-900 text-white'
                        : 'text-neutral-500 dark:text-neutral-200 hover:bg-primary-100 dark:hover:bg-neutral-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </button>
                ))}
              </>
            )}

            <hr className="border-neutral-100 dark:border-neutral-600 my-2" />
            {!isAuthenticated ? (
              <button
                onClick={() => { onOpenAuth('login'); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-primary-500 text-white"
              >
                <LogIn className="w-4 h-4" /> Masuk / Daftar
              </button>
            ) : (
              <button
                onClick={() => { logout(); go('home'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                <LogOut className="w-4 h-4" /> Keluar
              </button>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
