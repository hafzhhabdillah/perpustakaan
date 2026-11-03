import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, LogIn, UserPlus, Lock, Mail, User as UserIcon } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onNotify, defaultMode = 'login' }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(defaultMode); // 'login' or 'register'
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(formData.email, formData.password);
        if (res.success) {
          onNotify({ type: 'success', message: `Selamat datang kembali, ${res.user.name}!` });
          onClose();
        } else {
          onNotify({ type: 'error', message: res.message || 'Login gagal.' });
        }
      } else {
        if (formData.password !== formData.password_confirmation) {
          onNotify({ type: 'error', message: 'Konfirmasi password tidak cocok.' });
          setLoading(false);
          return;
        }

        const res = await register(
          formData.name,
          formData.email,
          formData.password,
          formData.password_confirmation
        );
        if (res.success) {
          onNotify({ type: 'success', message: `Akun berhasil didaftarkan! Selamat datang, ${res.user.name}.` });
          onClose();
        } else {
          onNotify({ type: 'error', message: res.message || 'Registrasi gagal.' });
        }
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Terjadi kesalahan sistem.';
      onNotify({ type: 'error', message: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Header */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-4 h-4" /> Masuk
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4" /> Daftar Akun
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-extrabold text-slate-900">
            {mode === 'login' ? 'Masuk ke Akun Anda' : 'Buat Akun Perpustakaan'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'login'
              ? 'Akses koleksi buku favorit dan fitur cerdas perpustakaan'
              : 'Daftar sekarang untuk menyimpan favorit & konsultasi AI'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Pratama"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="nama@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Konfirmasi Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="Ulangi password"
                  value={formData.password_confirmation}
                  onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                />
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="p-3 bg-brand-50/60 rounded-xl border border-brand-100 text-[11px] text-brand-700 leading-relaxed">
              💡 <strong>Akun Demo Cepat:</strong><br/>
              • Admin: <code className="font-mono font-bold">admin@library.test</code> / <code className="font-mono font-bold">password123</code><br/>
              • User: <code className="font-mono font-bold">user@library.test</code> / <code className="font-mono font-bold">password123</code>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-200 transition flex items-center justify-center gap-2"
          >
            {loading && <span className="animate-spin">⏳</span>}
            {mode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun Baru'}
          </button>
        </form>
      </div>
    </div>
  );
}

