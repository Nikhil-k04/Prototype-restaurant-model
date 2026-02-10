import { useToast } from '../context/ToastContext';

const ICONS = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

export default function Toast() {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="toast-container" role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast--${toast.type}`} role="status">
          <span className="toast-icon" aria-hidden="true">{ICONS[toast.type] || '🔔'}</span>
          <span className="toast-message">{toast.message}</span>
          <button
            className="toast-close"
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
