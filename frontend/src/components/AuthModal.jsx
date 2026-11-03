import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X, LogIn, UserPlus, Lock, Mail, User as UserIcon,
  Eye, EyeOff, BookOpen, ArrowRight, ShieldCheck,
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onNotify, defaultMode = 'login' }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(defaultMode);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', password_confirmation: '',
  });

  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setShowPassword(false);
    }
  }, [isOpen, defaultMode]);

  if (!isOpen) return null;

  const updateField = (field, value) => setFormData(current => ({ ...current, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'register' && formData.password !== formData.password_confirmation) {
      onNotify({ type: 'error', message: 'Konfirmasi password tidak cocok.' });
      return;
    }
    setLoading(true);
    try {
      const res = mode === 'login'
        ? await login(formData.email, formData.password)
        : await register(formData.name, formData.email, formData.password, formData.password_confirmation);

      if (res.success) {
        onNotify({
          type: 'success',
          message: mode === 'login'
            ? `Selamat datang kembali, ${res.user.name}!`
            : `Akun berhasil dibuat. Selamat datang, ${res.user.name}!`,
        });
        onClose();
        setFormData({ name: '', email: '', password: '', password_confirmation: '' });
      } else {
        onNotify({ type: 'error', message: res.message || (mode === 'login' ? 'Login gagal.' : 'Registrasi gagal.') });
      }
    } catch (err) {
      onNotify({ type: 'error', message: err.response?.data?.message || 'Terjadi kesalahan sistem. Silakan coba lagi.' });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full rounded-xl border border-neutral-200 bg-[#FFFFFF] py-3 pl-11 pr-4 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100 dark:placeholder:text-neutral-400 dark:focus:bg-neutral-700';
  const labelClass = 'mb-2 block text-xs font-bold tracking-wide text-neutral-700 dark:text-neutral-200';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-[#0F172A]/65 p-4 backdrop-blur-md animate-fade-in" onMouseDown={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}>
      <div className="relative my-auto w-full max-w-[440px] overflow-hidden rounded-[2rem] border border-white/60 bg-[#FFFFFF] shadow-2xl shadow-black/20 dark:border-neutral-700 dark:bg-neutral-800">
        <div className="relative overflow-hidden bg-[#163B65] px-7 pb-8 pt-7 text-white sm:px-9">
          <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full border-[24px] border-white/[0.07]" />
          <button type="button" onClick={onClose} disabled={loading} aria-label="Tutup" className="absolute right-5 top-5 z-10 rounded-xl p-2 text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-40"><X className="h-5 w-5" /></button>
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DBEAFE] text-[#163B65] shadow-lg"><BookOpen className="h-6 w-6" /></div>
          <p className="relative mt-5 text-[10px] font-bold tracking-[0.22em] text-[#BFDBFE]">LIBRARIA · DIGITAL LIBRARY</p>
          <h2 className="relative mt-2 text-2xl font-extrabold tracking-tight sm:text-[28px]">{mode === 'login' ? 'Senang melihatmu lagi.' : 'Mulai perjalanan membaca.'}</h2>
          <p className="relative mt-2 max-w-sm text-sm leading-6 text-white/70">{mode === 'login' ? 'Masuk untuk melanjutkan eksplorasi dan mengelola koleksi favoritmu.' : 'Buat akun Libraria dan temukan bacaan yang cocok untukmu.'}</p>
        </div>

        <div className="px-6 pb-7 pt-6 sm:px-9 sm:pb-9">
          <div className="mb-6 grid grid-cols-2 rounded-xl bg-[#EDF1E9] p-1 dark:bg-neutral-700">
            <button type="button" onClick={() => setMode('login')} className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition ${mode === 'login' ? 'bg-white text-primary-700 shadow-sm dark:bg-neutral-600 dark:text-white' : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-300'}`}>
              <LogIn className="h-4 w-4" /> Masuk
            </button>
            <button type="button" onClick={() => setMode('register')} className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition ${mode === 'register' ? 'bg-white text-primary-700 shadow-sm dark:bg-neutral-600 dark:text-white' : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-300'}`}>
              <UserPlus className="h-4 w-4" /> Daftar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className={labelClass}>Nama lengkap</label>
                <div className="relative"><UserIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input type="text" required autoComplete="name" placeholder="Nama kamu" value={formData.name} onChange={e => updateField('name', e.target.value)} className={inputClass} /></div>
              </div>
            )}
            <div>
              <label className={labelClass}>Alamat email</label>
              <div className="relative"><Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input type="email" required autoComplete="email" placeholder="nama@email.com" value={formData.email} onChange={e => updateField('email', e.target.value)} className={inputClass} /></div>
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <div className="relative"><Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input type={showPassword ? 'text' : 'password'} required autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder="Masukkan password" value={formData.password} onChange={e => updateField('password', e.target.value)} className={`${inputClass} pr-12`} /><button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-600 dark:hover:text-white">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
            </div>
            {mode === 'register' && (
              <div>
                <label className={labelClass}>Konfirmasi password</label>
                <div className="relative"><ShieldCheck className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input type={showPassword ? 'text' : 'password'} required autoComplete="new-password" placeholder="Ulangi password" value={formData.password_confirmation} onChange={e => updateField('password_confirmation', e.target.value)} className={inputClass} /></div>
                <p className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400">Pastikan kedua password sama.</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-primary-900/15 transition hover:-translate-y-0.5 hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <>{mode === 'login' ? 'Masuk ke Libraria' : 'Buat akun'} <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
            {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
            <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="font-extrabold text-primary-700 underline-offset-4 hover:underline dark:text-primary-300">{mode === 'login' ? 'Daftar sekarang' : 'Masuk di sini'}</button>
          </p>
        </div>
      </div>
    </div>
  );
}
