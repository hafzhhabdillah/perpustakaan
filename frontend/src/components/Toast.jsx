import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const CONFIG = {
  success: { Icon: CheckCircle, bar: 'bg-primary-500', bg: 'bg-white dark:bg-neutral-700', text: 'text-primary-600' },
  error:   { Icon: XCircle,     bar: 'bg-red-500',     bg: 'bg-white dark:bg-neutral-700', text: 'text-red-600'     },
  info:    { Icon: Info,         bar: 'bg-blue-500',    bg: 'bg-white dark:bg-neutral-700', text: 'text-blue-600'    },
  warning: { Icon: AlertTriangle,bar: 'bg-amber-500',   bg: 'bg-white dark:bg-neutral-700', text: 'text-amber-600'   },
};

export default function Toast({ toast, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toast) return;
    setVisible(true);
    const t = setTimeout(() => { setVisible(false); setTimeout(onClose, 300); }, 4000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!toast) return null;

  const { Icon, bar, bg, text } = CONFIG[toast.type] || CONFIG.info;

  return (
    <div className={`fixed bottom-6 right-6 z-[100] transition-all duration-300 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className={`${bg} flex items-start gap-3 rounded-2xl shadow-2xl border border-neutral-100 dark:border-neutral-600 overflow-hidden max-w-sm min-w-[280px]`}>
        <div className={`w-1 self-stretch ${bar} shrink-0`} />
        <div className="flex items-start gap-3 p-4 flex-1">
          <Icon className={`w-5 h-5 ${text} shrink-0 mt-0.5`} />
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-50 flex-1 leading-snug">
            {toast.message}
          </p>
          <button
            onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
            className="text-neutral-300 hover:text-neutral-400 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
