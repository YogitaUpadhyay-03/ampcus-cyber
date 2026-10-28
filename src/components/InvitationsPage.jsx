// ============================================================
//  InvitationsPage – manage pending invitations
// ============================================================
import { useState, useMemo } from 'react';
import { IconMail, IconUserPlus, IconRefreshCw, IconX, IconAlertCircle, IconCheck } from './Icons';
import { fmtTime } from '../utils.js';

/* ── helpers ── */
function roleBadgeClass(role) {
  return { Admin: 'badge-admin', Manager: 'badge-manager', Viewer: 'badge-viewer' }[role] ?? 'badge-viewer';
}

/* ── Email delivery status pill ── */
function EmailStatusBadge({ status, sample }) {
  if (sample || !status) {
    return <span className="email-status-na">n/a</span>;
  }
  if (status === 'sending') {
    return (
      <span className="email-status email-status-sending" aria-label="Sending">
        <span className="spinner spinner-xs" aria-hidden="true" /> Sending…
      </span>
    );
  }
  if (status === 'sent') {
    return (
      <span className="email-status email-status-sent" aria-label="Delivered">
        <IconCheck size={11} /> Delivered
      </span>
    );
  }
  if (status === 'failed') {
    return (
      <span className="email-status email-status-failed" aria-label="Failed">
        <IconX size={11} /> Failed
      </span>
    );
  }
  return null;
}

/* ── Invitation status pill ── */
function InvStatusBadge({ status }) {
  const cls   = status === 'Pending'   ? 'inv-status-pending'
              : status === 'Cancelled' ? 'inv-status-cancelled'
              : 'inv-status-pending';
  const dot   = status === 'Pending'   ? 'status-pending'
              : status === 'Cancelled' ? 'status-suspended'
              : '';
  return (
    <span className={`inv-status-badge ${cls}`}>
      <span className={`status-dot ${dot}`} aria-hidden="true" />
      {status}
    </span>
  );
}

/* ── Cancel confirmation modal ── */
function CancelConfirmModal({ invitation, onConfirm, onClose }) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    onConfirm(invitation.id);
    setLoading(false);
    onClose();
  }

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-inv-title"
      onKeyDown={e => e.key === 'Escape' && onClose()}
    >
      <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title" id="cancel-inv-title">Cancel invitation?</h2>
            <p className="modal-subtitle">This cannot be undone. You can send a new invitation later.</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close" id="cancel-inv-close">
            <IconX size={18} />
          </button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: 14, color: 'var(--neutral-700)', lineHeight: 1.6 }}>
            Cancel the pending invitation for{' '}
            <strong>{invitation.name}</strong>{' '}
            <span style={{ color: 'var(--neutral-500)' }}>({invitation.email})</span>?{' '}
            They will no longer be able to accept this invitation.
          </p>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={loading}
            id="cancel-inv-dismiss"
            type="button"
          >
            Keep invitation
          </button>
          <button
            className="btn btn-danger"
            onClick={handleConfirm}
            disabled={loading}
            id="cancel-inv-confirm"
            type="button"
            aria-busy={loading}
          >
            {loading ? <><span className="spinner" aria-hidden="true" />Cancelling…</> : 'Yes, cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function InvitationsPage({ invitations, onResend, onCancel, onToast, onInvite }) {
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [cancelTarget, setCancelTarget] = useState(null);

  const filtered = useMemo(() => {
    if (!statusFilter) return invitations;
    return invitations.filter(i => i.status === statusFilter);
  }, [invitations, statusFilter]);

  const totalPending = invitations.filter(i => i.status === 'Pending').length;

  return (
    <>
      <div className="main-content" id="main-content">

        {/* Page header */}
        <header className="page-header">
          <div>
            <h1 className="page-title">Invitations</h1>
            <p className="page-subtitle">
              Manage pending invitations.{' '}
              <span className="simulated-label">No real emails are sent.</span>
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={onInvite}
            id="inv-invite-btn"
            aria-label="Invite a new user"
          >
            <IconUserPlus size={15} />
            Invite user
          </button>
        </header>

        <div className="page-body">

          {/* Summary cards */}
          <div className="inv-summary-row">
            <div className="inv-stat-card">
              <span className="inv-stat-value">{totalPending}</span>
              <span className="inv-stat-label">Pending</span>
            </div>
            <div className="inv-stat-card">
              <span className="inv-stat-value">{invitations.filter(i => i.status === 'Cancelled').length}</span>
              <span className="inv-stat-label">Cancelled</span>
            </div>
            <div className="inv-stat-card">
              <span className="inv-stat-value">{invitations.length}</span>
              <span className="inv-stat-label">Total sent</span>
            </div>
          </div>

          {/* Filter toolbar */}
          <div className="toolbar">
            <div className="inv-filter-tabs" role="group" aria-label="Filter invitations by status">
              {['', 'Pending', 'Cancelled'].map(val => (
                <button
                  key={val}
                  className={`inv-filter-tab ${statusFilter === val ? 'active' : ''}`}
                  onClick={() => setStatusFilter(val)}
                  type="button"
                  aria-pressed={statusFilter === val}
                >
                  {val || 'All'}
                  <span className="inv-filter-count">
                    {val ? invitations.filter(i => i.status === val).length : invitations.length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Invitations table */}
          <div className="table-wrap">
            {filtered.length === 0 ? (
              <div className="empty-state" role="status" aria-live="polite">
                <IconMail size={40} />
                <div className="empty-state-title">No invitations found</div>
                <div className="empty-state-sub">
                  {statusFilter === 'Pending'
                    ? 'No pending invitations. Use "Invite user" to send one.'
                    : 'No invitations match the current filter.'}
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={onInvite}
                  style={{ marginTop: 12 }}
                  id="inv-empty-invite-btn"
                >
                  <IconUserPlus size={14} />
                  Invite user
                </button>
              </div>
            ) : (
              <table aria-label="Invitations table">
                <thead>
                  <tr>
                    <th scope="col">Recipient</th>
                    <th scope="col">Role</th>
                    <th scope="col">Status</th>
                    <th scope="col">Invited by</th>
                    <th scope="col">Sent</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(inv => (
                    <tr key={inv.id}>

                      {/* Recipient */}
                      <td>
                        <div className="user-cell">
                          <div
                            className="avatar-initials"
                            style={{ background: inv.color || '#6c63ff' }}
                            aria-hidden="true"
                          >
                            {inv.initials || inv.name?.[0] || '?'}
                          </div>
                          <div>
                            <div className="user-primary">{inv.name}</div>
                            <div className="user-secondary">{inv.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td>
                        <span className={`badge ${roleBadgeClass(inv.role)}`}>{inv.role}</span>
                      </td>

                      {/* Status */}
                      <td>
                        <InvStatusBadge status={inv.status} />
                      </td>

                      {/* Invited by */}
                      <td>
                        <span className="inv-invited-by">{inv.invitedBy}</span>
                      </td>

                      {/* Sent time */}
                      <td>
                        <div className="inv-time-cell">
                          <span className="inv-time">{fmtTime(inv.invitedAt)}</span>
                          {inv.sample && <span className="sample-tag">sample</span>}
                          <EmailStatusBadge status={inv.emailStatus} sample={inv.sample} />
                        </div>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="inv-actions-cell">
                          {inv.status === 'Pending' && (
                            <>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => onResend(inv.id)}
                                disabled={inv.emailStatus === 'sending'}
                                id={`resend-inv-${inv.id}`}
                                aria-label={`Resend invitation to ${inv.name}`}
                                title="Resend invitation email"
                              >
                                <IconRefreshCw size={12} />
                                Resend
                              </button>
                              <button
                                className="btn btn-sm btn-danger-soft"
                                onClick={() => setCancelTarget(inv)}
                                disabled={inv.emailStatus === 'sending'}
                                id={`cancel-inv-${inv.id}`}
                                aria-label={`Cancel invitation for ${inv.name}`}
                                title="Cancel this invitation"
                              >
                                <IconX size={12} />
                                Cancel
                              </button>
                            </>
                          )}
                          {inv.status === 'Cancelled' && (
                            <span className="inv-cancelled-label">Cancelled</span>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Footer row */}
            {filtered.length > 0 && (
              <div className="pagination">
                <span className="pagination-info">
                  Showing {filtered.length} of {invitations.length} invitation{invitations.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          {/* Info notice */}
          <div className="info-notice">
            <IconAlertCircle size={14} />
            <span>
              <strong>Demo mode:</strong> Invitations are stored in localStorage only.
              No emails are delivered to real recipients.
            </span>
          </div>

        </div>
      </div>

      {cancelTarget && (
        <CancelConfirmModal
          invitation={cancelTarget}
          onConfirm={onCancel}
          onClose={() => setCancelTarget(null)}
        />
      )}
    </>
  );
}
