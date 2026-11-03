
import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Bookmark,
  Users,
  Tags,
  Settings,
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Library,
  Sparkles,
} from "lucide-react";

const adminMenu = [
  { label: "Dashboard", icon: LayoutDashboard, page: "dashboard" },
  { label: "Katalog Buku", icon: BookOpen, page: "books" },
  { label: "Kategori", icon: Tags, page: "categories" },
  { label: "Pengguna", icon: Users, page: "users" },
  { label: "AI Assistant", icon: Sparkles, page: "assistant" },
];

const userMenu = [
  { label: "Dashboard", icon: LayoutDashboard, page: "dashboard" },
  { label: "Jelajahi Buku", icon: BookOpen, page: "books" },
  { label: "Favorit Saya", icon: Bookmark, page: "favorites" },
  { label: "AI Assistant", icon: Sparkles, page: "assistant" },
];

export default function LibraryLayout({
  children,
  activePage = "dashboard",
  onNavigate = () => {},
  user = { name: "Pengguna", role: "User" },
  onLogout = () => {},
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(
    localStorage.getItem("libraria-theme") === "dark"
  );

  const isAdmin = user?.role?.toLowerCase() === "admin";
  const menus = isAdmin ? adminMenu : userMenu;

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("libraria-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }

  function navigate(page) {
    onNavigate(page);
    setSidebarOpen(false);
  }

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-[#F7F8F6] text-neutral-800 transition-colors dark:bg-[#101B1A] dark:text-neutral-100">

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col bg-[#173B35] text-white transition-transform duration-300 lg:tranneutral-x-0 ${
            sidebarOpen ? "tranneutral-x-0" : "-tranneutral-x-full"
          }`}
        >
          {/* Brand */}
          <div className="flex h-[84px] items-center justify-between border-b border-white/10 px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D9F0DF] text-[#173B35]">
                <Library size={22} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Libraria</h1>
                <p className="text-[10px] tracking-[2px] text-emerald-100/60">
                  YOUR DIGITAL LIBRARY
                </p>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X size={21} />
            </button>
          </div>

          {/* Profile */}
          <div className="mx-5 mt-7 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D9F0DF] font-bold text-[#173B35]">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{user?.name}</p>
                <p className="mt-0.5 text-xs text-emerald-100/60">
                  {user?.role || "User"}
                </p>
              </div>
              <ChevronDown size={16} className="text-white/50" />
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex-1 px-5">
            <p className="mb-3 px-3 text-[10px] font-semibold tracking-[2px] text-emerald-100/40">
              MENU UTAMA
            </p>

            <nav className="space-y-1.5">
              {menus.map((item) => {
                const Icon = item.icon;
                const active = activePage === item.page;

                return (
                  <button
                    key={item.page}
                    onClick={() => navigate(item.page)}
                    className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-all duration-200 ${
                      active
                        ? "bg-[#D9F0DF] font-semibold text-[#173B35] shadow-lg shadow-black/10"
                        : "text-emerald-50/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={19} />
                    <span>{item.label}</span>
                    {active && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#23856D]" />
                    )}
                  </button>
                );
              })}
            </nav>

            <p className="mb-3 mt-9 px-3 text-[10px] font-semibold tracking-[2px] text-emerald-100/40">
              PREFERENSI
            </p>

            <button
              onClick={() => navigate("settings")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                activePage === "settings"
                  ? "bg-[#D9F0DF] font-semibold text-[#173B35]"
                  : "text-emerald-50/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Settings size={19} />
              Pengaturan
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-white/10 p-5">
            <button
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-200 transition hover:bg-red-400/10 hover:text-red-100"
            >
              <LogOut size={19} />
              Keluar
            </button>
            <p className="mt-4 text-center text-[10px] text-white/30">
              © 2026 Libraria. All rights reserved.
            </p>
          </div>
        </aside>

        {/* Main area */}
        <main className="min-h-screen lg:ml-[270px]">

          {/* Navbar */}
          <header className="sticky top-0 z-30 flex h-[84px] items-center justify-between border-b border-neutral-200/70 bg-white/85 px-5 backdrop-blur-xl dark:border-white/10 dark:bg-[#142321]/90 md:px-9">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl p-2 hover:bg-neutral-100 dark:hover:bg-white/10 lg:hidden"
              >
                <Menu size={22} />
              </button>

              <div>
                <p className="text-xs text-neutral-400">Pages / Libraria</p>
                <h2 className="mt-1 text-lg font-bold capitalize">
                  {activePage.replace("-", " ")}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden items-center gap-2 rounded-xl border border-neutral-200 bg-[#F8FAF8] px-3 py-2.5 md:flex dark:border-white/10 dark:bg-white/5">
                <Search size={17} className="text-neutral-400" />
                <input
                  type="text"
                  placeholder="Cari sesuatu..."
                  className="w-36 bg-transparent text-sm outline-none placeholder:text-neutral-400"
                />
                <kbd className="rounded border border-neutral-200 px-1.5 py-0.5 text-[10px] text-neutral-400 dark:border-white/10">
                  /
                </kbd>
              </div>

              <button
                onClick={toggleTheme}
                className="rounded-xl border border-neutral-200 p-2.5 transition hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-white/10"
                title="Ganti tema"
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                className="relative rounded-xl border border-neutral-200 p-2.5 transition hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-white/10"
                title="Notifikasi"
              >
                <Bell size={18} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-emerald-500 dark:border-[#142321]" />
              </button>

              <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-[#D9F0DF] text-sm font-bold text-[#173B35] sm:flex">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>
          </header>

          {/* Page content */}
          <section className="p-5 md:p-9">
            <div className="mx-auto max-w-[1500px]">
              {children}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
