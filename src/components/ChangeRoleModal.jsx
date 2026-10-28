// ============================================================
//  ChangeRoleModal – confirm & apply a role change
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { ROLES } from '../data/mockData';
import { IconX } from './Icons';

export default function ChangeRoleModal({ user, onClose, onConfirm }) {
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [loading, setLoading]           = useState(false);
  const firstFocusRef = useRef(null);

  const changed = selectedRole !== user.role;

  // Move focus into the modal when it opens (accessibility)
  useEffect(() => {
    firstFocusRef.current?.focus();
  }, []);

  async function handleConfirm() {
    if (!changed) { onClose(); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    onConfirm(user.id, selectedRole);
    setLoading(false);
    onClose();
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape' && !loading) onClose();
  }

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="role-modal-title"
      onKeyDown={handleKeyDown}
    >
      <div className="modal confirm-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title" id="role-modal-title">Change role</h2>
            <p className="modal-subtitle">{user.name} · currently <strong>{user.role}</strong></p>
          </div>
          <button
            className="modal-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Close change-role modal"
            id="role-modal-close"
            ref={firstFocusRef}
          >
            <IconX size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="role-options" role="radiogroup" aria-label="Select new role">
            {ROLES.map(r => (
              <label
                key={r.value}
                className={`role-option ${selectedRole === r.value ? 'selected' : ''}`}
                htmlFor={`role-opt-${r.value}`}
              >
                <input
                  type="radio"
                  id={`role-opt-${r.value}`}
                  name="change-role"
                  value={r.value}
                  checked={selectedRole === r.value}
                  onChange={() => setSelectedRole(r.value)}
                />
                <div>
                  <div className="role-option-name">{r.label}</div>
                  <div className="role-option-desc">{r.desc}</div>
                </div>
              </label>
            ))}
          </div>

          {changed && (
            <p className="role-change-hint" aria-live="polite">
              This will update <strong>{user.name}</strong>'s role from{' '}
              <strong>{user.role}</strong> to <strong>{selectedRole}</strong> immediately.
            </p>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={loading}
            id="role-cancel-btn"
            type="button"
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={loading || !changed}
            id="role-confirm-btn"
            type="button"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Saving…
              </>
            ) : (
              changed ? `Change to ${selectedRole}` : 'No change'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
