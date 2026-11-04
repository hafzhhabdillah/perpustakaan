import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  BookMarked, Sparkles, Heart, LayoutDashboard, BookCopy,
  Layers, Globe, Users, LogOut, LogIn, Menu, X,
  ShieldCheck, Home, Sun, Moon, ChevronDown, Library,
} from 'lucide-react';

const NAV_USER = [
  { id: 'home', label: 'Beranda', Icon: Home },
  { id: 'catalog', label: 'Katalog', Icon: BookCopy },
  { id: 'ai-advisor', label: 'AI Advisor', Icon: Sparkles },
];

const NAV_ADMIN = [
  { id: 'admin-dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'admin-books', label: 'Buku', Icon: BookCopy },
  { id: 'admin-categories', label: 'Kategori', Icon: Layers },
  { id: 'admin-open-library', label: 'Open Library', Icon: Globe },
  { id: 'admin-users', label: 'Users', Icon: Users },
];

function NavButton({ id, label, Icon, active, onClick, variant = 'default' }) {
  const styles = {
    default: active
      ? 'bg-[#163B65] text-white shadow-md shadow-[#163B65]/15'
      : 'text-neutral-500 hover:text-[#163B65] hover:bg-[#EFF6FF] dark:text-neutral-300 dark:hover:bg-neutral-700',
    admin: active
      ? 'bg-[#163B65] text-white shadow-md'
      : 'text-neutral-500 hover:text-[#163B65] hover:bg-[#EFF6FF] dark:text-neutral-300 dark:hover:bg-neutral-700',
    ai: active
      ? 'bg-[#DBEAFE] text-[#163B65] dark:bg-neutral-600 dark:text-white'
      : 'text-[#60A5FA] hover:bg-[#EFF6FF] dark:text-green-300 dark:hover:bg-neutral-700',
  };

  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-all duration-200 ${styles[variant]}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

export default function Navbar({ activeTab, setActiveTab, onOpenAuth, onRequestLogout }) {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const go = (tab) => {
    setActiveTab(tab);
    setMobileOpen(false);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    setMobileOpen(false);
    onRequestLogout?.();
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#DBEAFE] bg-[#FFFFFF]/95 backdrop-blur-xl dark:bg-neutral-800/95 dark:border-neutral-700">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-[76px] flex items-center justify-between gap-5">

          {/* Logo */}
          <button
            type="button"
            onClick={() => go('home')}
            className="flex items-center gap-3 shrink-0 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#163B65] flex items-center justify-center shadow-lg shadow-[#163B65]/15 group-hover:rotate-[-5deg] transition-transform duration-300">
              <BookMarked className="w-5 h-5 text-[#EFF6FF]" strokeWidth={2} />
            </div>

            <div className="text-left">
              <span className="block text-[21px] font-extrabold tracking-tight text-[#163B65] dark:text-white leading-none">
                Libraria<span className="text-[#60A5FA]">.</span>
              </span>
              <span className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-400 mt-1.5">
                {isAdmin ? 'Admin Portal' : 'Digital Library'}
              </span>
            </div>
          </button>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center overflow-x-auto">
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
              <div className="flex items-center gap-1 ml-3 pl-3 border-l border-[#DBEAFE] dark:border-neutral-600">
                {NAV_ADMIN.map(({ id, label, Icon }) => (
                  <NavButton
                    key={id}
                    id={id}
                    label={label}
                    Icon={Icon}
                    active={activeTab === id}
                    onClick={go}
                    variant="admin"
                  />
                ))}
              </div>
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
              aria-label={theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#DBEAFE] bg-white px-3 text-xs font-bold text-[#2563EB] transition-all hover:bg-[#EFF6FF] dark:border-neutral-600 dark:bg-neutral-700 dark:text-amber-300 dark:hover:bg-neutral-600"
            >
              {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
              <span className="hidden sm:inline">{theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}</span>
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-2xl border border-[#DBEAFE] hover:border-[#BFDBFE] bg-white dark:bg-neutral-700 dark:border-neutral-600 transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#163B65] text-white flex items-center justify-center font-bold text-sm uppercase">
                    {user?.name?.charAt(0) || 'U'}
                  </div>

                  <span className="hidden md:block text-[13px] font-semibold text-neutral-700 dark:text-neutral-100 max-w-[100px] truncate">
                    {user?.name}
                  </span>

                  <ChevronDown className={`hidden md:block w-4 h-4 text-neutral-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white dark:bg-neutral-700 border border-[#DBEAFE] dark:border-neutral-600 shadow-2xl shadow-black/10 overflow-hidden z-50 animate-fade-in">
                    <div className="p-4 bg-[#EFF6FF] dark:bg-neutral-800">
                      <p className="font-bold text-[#163B65] dark:text-white truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-neutral-400 mt-1 truncate">
                        {user?.email}
                      </p>
                      <div className="flex items-center gap-1.5 mt-3 text-[#60A5FA]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          {user?.role}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar dari akun
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#163B65] hover:bg-[#102B4A] text-white text-[13px] font-bold shadow-md shadow-[#163B65]/15 transition-all hover:-translate-y-0.5"
              >
                <LogIn className="w-4 h-4" />
                Masuk
              </button>
            )}


            

            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              aria-expanded={mobileOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#DBEAFE] text-[#2563EB] transition hover:bg-[#EFF6FF] dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700 lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 pt-[76px]"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

          <nav
            className="relative bg-[#FFFFFF] dark:bg-neutral-800 border-r border-[#DBEAFE] dark:border-neutral-700 h-full w-80 max-w-[88vw] p-5 overflow-y-auto shadow-2xl animate-slide-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-3">
                Menu Utama
              </p>
            </div>

            <div className="space-y-1">
              {NAV_USER.map(({ id, label, Icon }) => (
                <NavButton
                  key={id}
                  id={id}
                  label={label}
                  Icon={Icon}
                  active={activeTab === id}
                  onClick={go}
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
            </div>

            {isAdmin && (
              <>
                <div className="border-t border-[#DBEAFE] dark:border-neutral-600 my-5" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-3 mb-3">
                  Administrator
                </p>

                <div className="space-y-1">
                  {NAV_ADMIN.map(({ id, label, Icon }) => (
                    <NavButton
                      key={id}
                      id={id}
                      label={label}
                      Icon={Icon}
                      active={activeTab === id}
                      onClick={go}
                      variant="admin"
                    />
                  ))}
                </div>
              </>
            )}

            <div className="border-t border-[#DBEAFE] dark:border-neutral-600 my-5" />

            {!isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  onOpenAuth('login');
                  setMobileOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#163B65] text-white font-bold text-sm"
              >
                <LogIn className="w-4 h-4" />
                Masuk / Daftar
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-3 rounded-xl text-red-500 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            )}
          </nav>
        </div>
      )}
    </>
  );
}