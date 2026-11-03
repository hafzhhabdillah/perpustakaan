import { AlertTriangle } from 'lucide-react';

export default function ConfirmationModal({
  isOpen,
  title = 'Konfirmasi Tindakan',
  message = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
  confirmText = 'Hapus',
  cancelText = 'Batal',
  isDanger = true,
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-100 transform transition-all">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-xl ${isDanger ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">{title}</h3>
            <p className="text-xs text-neutral-500">Tindakan ini tidak dapat dibatalkan</p>
          </div>
        </div>

        <p className="text-sm text-neutral-600 mb-6 leading-relaxed">{message}</p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-xl transition"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-semibold rounded-xl text-white transition flex items-center gap-2 ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-200'
                : 'bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-200'
            }`}
          >
            {loading && <span className="animate-spin text-sm">⏳</span>}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

