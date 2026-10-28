// ============================================================
//  InviteModal – invite a team member
// ============================================================
import { useState } from 'react';
import { ROLES } from '../data/mockData';
import { IconX, IconAlertCircle } from './Icons';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function InviteModal({ onClose, onInvite, invitations = [] }) {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [role, setRole]       = useState('Viewer');
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [banner, setBanner]   = useState(null);

  function validate() {
    const errs = {};
    if (!name.trim())               errs.name  = 'Full name is required.';
    if (!email.trim())              errs.email = 'Work email is required.';
    else if (!isValidEmail(email))  errs.email = 'Enter a valid email address, e.g. name@example.com';
    else {
      const dup = invitations.find(
        i => i.email.toLowerCase() === email.trim().toLowerCase() && i.status === 'Pending'
      );
      if (dup) errs.email = 'A pending invitation for this email already exists.';
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      const count = Object.keys(errs).length;
      setBanner({
        type:  'error',
        title: `${count} field${count > 1 ? 's' : ''} need${count === 1 ? 's' : ''} attention`,
        sub:   'Fix the highlighted fields and try again.',
      });
      return;
    }

    setErrors({});
    setBanner(null);
    setLoading(true);

    // onInvite is now async and returns { ok, message }
    const result = await onInvite({ name: name.trim(), email: email.trim(), role });
    setLoading(false);

    if (result?.ok) {
      // Success — API accepted the send request
      onClose();
    } else {
      // Failure — show the error in the banner but keep the modal open
      setBanner({
        type:  'error',
        title: 'Could not send invitation email',
        sub:   result?.message ?? 'An unknown error occurred. The invitation was saved but the email may not have been delivered.',
      });
    }
  }


  function handleKeyDown(e) {
    if (e.key === 'Escape' && !loading) onClose();
  }

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-modal-title"
      onKeyDown={handleKeyDown}
    >
      <div className="modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title" id="invite-modal-title">Invite a team member</h2>
            <p className="modal-subtitle">Invitations are simulated – no email is sent.</p>
          </div>
          <button
            className="modal-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Close invite modal"
            id="invite-modal-close"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Body */}
        <form className="modal-body" onSubmit={handleSubmit} noValidate id="invite-form">
          {/* Error banner */}
          {banner && (
            <div className={`alert alert-${banner.type}`} role="alert">
              <IconAlertCircle size={16} />
              <div>
                <div className="alert-title">{banner.title}</div>
                <div className="alert-sub">{banner.sub}</div>
              </div>
              <button
                className="alert-close"
                type="button"
                onClick={() => setBanner(null)}
                aria-label="Dismiss"
              >
                <IconX size={14} />
              </button>
            </div>
          )}

          {/* Full name */}
          <div className="form-group">
            <label className="form-label" htmlFor="invite-name">Full name</label>
            <input
              id="invite-name"
              className={`form-input ${errors.name ? 'error' : ''}`}
              type="text"
              placeholder="e.g. Jordan Lee"
              value={name}
              onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); setBanner(null); }}
              autoComplete="off"
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'invite-name-err' : 'invite-name-hint'}
              autoFocus
            />
            {errors.name
              ? <div className="field-error" id="invite-name-err" role="alert"><IconAlertCircle size={12} />{errors.name}</div>
              : <p className="form-sublabel" id="invite-name-hint">As shown to other administrators</p>
            }
          </div>

          {/* Work email */}
          <div className="form-group">
            <label className="form-label" htmlFor="invite-email">Work email</label>
            <input
              id="invite-email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); setBanner(null); }}
              autoComplete="off"
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'invite-email-err' : 'invite-email-hint'}
            />
            {errors.email
              ? <div className="field-error" id="invite-email-err" role="alert"><IconAlertCircle size={12} />{errors.email}</div>
              : <p className="form-sublabel" id="invite-email-hint">Invitations are simulated – no real email is sent</p>
            }
          </div>

          {/* Role */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <div className="form-label">Role</div>
            <div className="role-options" role="radiogroup" aria-label="Select role">
              {ROLES.map(r => (
                <label
                  key={r.value}
                  className={`role-option ${role === r.value ? 'selected' : ''}`}
                  htmlFor={`invite-role-${r.value}`}
                >
                  <input
                    type="radio"
                    id={`invite-role-${r.value}`}
                    name="invite-role"
                    value={r.value}
                    checked={role === r.value}
                    onChange={() => setRole(r.value)}
                  />
                  <div>
                    <div className="role-option-name">{r.label}</div>
                    <div className="role-option-desc">{r.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="modal-footer">
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={loading}
            id="invite-cancel-btn"
            type="button"
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            form="invite-form"
            type="submit"
            disabled={loading}
            id="invite-submit-btn"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Sending email…
              </>
            ) : 'Send invitation'}
          </button>
        </div>
      </div>
    </div>
  );
}
