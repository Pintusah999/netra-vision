import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />,
          warning: <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />,
          error: <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />,
          info: <Info className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />,
        };

        const borderColors = {
          success: 'border-emerald-500/30',
          warning: 'border-amber-500/30',
          error: 'border-rose-500/30',
          info: 'border-sky-500/30',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 rounded-lg border bg-[#172033] p-3.5 shadow-xl transition-all animate-in fade-in slide-in-from-bottom-2 ${borderColors[toast.type]}`}
          >
            <div className="flex items-start gap-2.5">
              {icons[toast.type]}
              <div>
                <div className="text-xs font-semibold text-white">{toast.title}</div>
                {toast.description && (
                  <div className="text-[11px] text-slate-300 mt-0.5">{toast.description}</div>
                )}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
