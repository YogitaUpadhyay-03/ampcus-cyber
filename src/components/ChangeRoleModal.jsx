// ============================================================
//  ChangeRoleModal – two-step role-change flow
//
//  Step 1 "select"  – radio-button role picker (existing UX)
//  Step 2 "confirm" – Figma confirmation screen:
//    • Title: "Confirm role change" / subtitle: "This takes effect immediately."
//    • "Change <Name>'s role?" question
//    • OldRole → NewRole pill transition
//    • Dismissible blue "What changes" info box
//    • Cancel | Confirm change buttons
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { ROLES } from '../data/mockData';
import { IconX } from './Icons';

/* ── helpers ──────────────────────────────────────────────── */
function rolePillClass(role) {
  return (
    { Admin: 'crm-pill-admin', Manager: 'crm-pill-manager', Viewer: 'crm-pill-viewer' }[role]
    ?? 'crm-pill-viewer'
  );
}

/* ── component ────────────────────────────────────────────── */
export default function ChangeRoleModal({ user, onClose, onConfirm }) {
  const [step,         setStep]         = useState('select');   // 'select' | 'confirm'
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [showInfo,     setShowInfo]     = useState(true);
  const [loading,      setLoading]      = useState(false);

  const closeRef   = useRef(null);
  const confirmRef = useRef(null);

  const changed      = selectedRole !== user.role;
  const newRoleData  = ROLES.find(r => r.value === selectedRole);

  // Focus close button when modal first opens
  useEffect(() => { closeRef.current?.focus(); }, []);

  // Focus confirm button when stepping into confirmation
  useEffect(() => {
    if (step === 'confirm') {
      const t = setTimeout(() => confirmRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [step]);

  function handleKeyDown(e) {
    if (loading) return;
    if (e.key === 'Escape') {
      if (step === 'confirm') setStep('select');
      else onClose();
    }
  }

  function handleProceed() {
    if (!changed) { onClose(); return; }
    setShowInfo(true); // reset so info box is visible each time
    setStep('confirm');
  }

  async function handleConfirm() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 450));
    onConfirm(user.id, selectedRole);
    setLoading(false);
    onClose();
  }

  /* ══════════════════════════════════════════════════════════
     STEP 1 – Select role
  ═══════════════════════════════════════════════════════════ */
  if (step === 'select') {
    return (
      <div
        className="modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-modal-title"
        onKeyDown={handleKeyDown}
      >
        <div className="modal" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="modal-header">
            <div>
              <h2 className="modal-title" id="role-modal-title">Change role</h2>
              <p className="modal-subtitle">
                {user.name} · currently <strong>{user.role}</strong>
              </p>
            </div>
            <button
              className="modal-close"
              onClick={onClose}
              disabled={loading}
              aria-label="Close change-role modal"
              id="role-modal-close"
              ref={closeRef}
            >
              <IconX size={18} />
            </button>
          </div>

          {/* Body */}
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
          </div>

          {/* Footer */}
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
              onClick={handleProceed}
              disabled={!changed}
              id="role-next-btn"
              type="button"
            >
              {changed ? 'Continue' : 'Select a different role'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     STEP 2 – Confirm (matches Figma design exactly)
  ═══════════════════════════════════════════════════════════ */
  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crm-title"
      onKeyDown={handleKeyDown}
    >
      <div className="modal crm-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title" id="crm-title">Confirm role change</h2>
            <p className="modal-subtitle">This takes effect immediately.</p>
          </div>
          <button
            className="modal-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Close confirmation modal"
            id="crm-close"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body crm-body">
          {/* Question */}
          <p className="crm-question">
            Change <strong>{user.name}</strong>'s role?
          </p>

          {/* Role transition: OldRole → NewRole */}
          <div
            className="crm-transition"
            aria-label={`Role changing from ${user.role} to ${selectedRole}`}
          >
            <span className={`crm-pill ${rolePillClass(user.role)}`}>
              {user.role}
            </span>
            <span className="crm-arrow" aria-hidden="true">
              {/* Arrow SVG */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
            <span className={`crm-pill ${rolePillClass(selectedRole)}`}>
              {selectedRole}
            </span>
          </div>

          {/* "What changes" info box – dismissible */}
          {showInfo && (
            <div className="crm-info-box" role="note" aria-label="Permission changes">
              <div className="crm-info-header">
                <span className="crm-info-title">
                  {/* Info icon */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  What changes
                </span>
                <button
                  className="crm-info-dismiss"
                  onClick={() => setShowInfo(false)}
                  aria-label="Dismiss permission info"
                  type="button"
                >
                  <IconX size={13} />
                </button>
              </div>
              <p className="crm-info-text">
                {newRoleData?.desc} Permissions are simulated in this prototype.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            className="btn btn-ghost"
            onClick={() => setStep('select')}
            disabled={loading}
            id="crm-back-btn"
            type="button"
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={loading}
            ref={confirmRef}
            id="crm-confirm-btn"
            type="button"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Saving…
              </>
            ) : (
              'Confirm change'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
