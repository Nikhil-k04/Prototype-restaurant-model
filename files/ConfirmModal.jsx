import { useEffect, useRef } from 'react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  const cancelRef = useRef(null);

  // Focus trap — move focus to Cancel button when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => cancelRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="confirm-modal">
        <div className="confirm-modal-icon" aria-hidden="true">🗑️</div>
        <h2 id="confirm-title" className="confirm-modal-title">{title}</h2>
        <p id="confirm-message" className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-actions">
          <button
            ref={cancelRef}
            className="btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="btn-danger"
            onClick={onConfirm}
            aria-label="Confirm deletion"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
