// ============================================================
//  Toast notification system
// ============================================================
import { useEffect } from 'react';
import { IconCheck, IconAlertCircle, IconX } from './Icons';

export function Toast({ toast, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`toast toast-${toast.type}`}
      role="status"
      aria-live="polite"
      id={`toast-${toast.id}`}
    >
      {toast.type === 'success' ? <IconCheck size={16} /> : <IconAlertCircle size={16} />}
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: .7, display: 'flex' }}
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        <IconX size={14} />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div className="toast-container" aria-label="Notifications">
      {toasts.map(t => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
