// ============================================================
//  InvitationsPage – manage pending invitations
// ============================================================
import { useState, useMemo } from 'react';
import { IconMail, IconUserPlus, IconRefreshCw, IconX, IconAlertCircle, IconCheck } from './Icons';
import { fmtTime } from '../utils.js';

function roleBadgeClass(role) {
  return { Admin: 'badge-admin', Manager: 'badge-manager', Viewer: 'badge-viewer' }[role] ?? 'badge-viewer';
}

function statusBadgeClass(s) {
  return { Pending: 'status-badge-pending', Cancelled: 'status-badge-suspended' }[s] ?? 'badge-viewer';
}

// ── Email delivery status badge ──────────────────────────────
function EmailStatusBadge({ status, sample }) {
  // Sample invitations were never sent via real email
  if (sample || !status) {
    return <span style={{ fontSize: 12, color: 'var(--neutral-400)' }}>n/a</span>;
  }
  if (status === 'sending') {
    return (
      <span className="email-status email-status-sending" aria-label="Sending…">
        <span className="spinner spinner-xs" aria-hidden="true" /> Sending…
      </span>
    );
  }
  if (status === 'sent') {
    return (
      <span className="email-status email-status-sent" aria-label="Accepted for delivery">
        <IconCheck size={12} /> Accepted
      </span>
    );
  }
  if (status === 'failed') {
    return (
      <span className="email-status email-status-failed" aria-label="Delivery failed">
        <IconX size={12} /> Failed
      </span>
    );
  }
  return null;
}

// ── Cancel confirmation modal ────────────────────────────────
function CancelConfirmModal({ invitation, onConfirm, onClose }) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
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
      <div className="modal confirm-modal" onClick={e => e.stopPropagation()}>
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
            <strong>{invitation.name}</strong> ({invitation.email})?
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
            className="btn"
            style={{ background: 'var(--red-500)', color: '#fff' }}
            onClick={handleConfirm}
            disabled={loading}
            id="cancel-inv-confirm"
            type="button"
            aria-busy={loading}
          >
            {loading ? (
              <><span className="spinner" aria-hidden="true" />Cancelling…</>
            ) : 'Yes, cancel invitation'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InvitationsPage({ invitations, onResend, onCancel, onToast, onInvite }) {
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [cancelTarget, setCancelTarget] = useState(null);

  const filtered = useMemo(() => {
    if (!statusFilter) return invitations;
    return invitations.filter(i => i.status === statusFilter);
  }, [invitations, statusFilter]);

  function handleResend(invId) {
    onResend(invId);
  }

  function handleCancelConfirmed(invId) {
    onCancel(invId);
  }

  return (
    <>
      <div className="main-content" id="main-content">
        <header className="page-header">
          <div>
            <h1 className="page-title">Invitations</h1>
            <p className="page-subtitle">
              Manage pending invitations.{' '}
              <span className="simulated-label">Delivery is simulated — no real emails are sent.</span>
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
          {/* Filter toolbar */}
          <div className="toolbar">
            <select
              id="inv-status-filter"
              className="filter-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              aria-label="Filter by invitation status"
            >
              <option value="">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Live count badge */}
            <span className="count-badge" aria-live="polite">
              {filtered.length} invitation{filtered.length !== 1 ? 's' : ''}
            </span>
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
                    <th scope="col">Email delivery</th>
                    <th scope="col">Invited by</th>
                    <th scope="col">Sent</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(inv => (
                    <tr key={inv.id}>
                      <td>
                        <div>
                          <div className="user-primary">{inv.name}</div>
                          <div className="user-secondary">{inv.email}</div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${roleBadgeClass(inv.role)}`}>{inv.role}</span>
                      </td>
                      <td>
                        <span className={`badge ${statusBadgeClass(inv.status)}`}>
                          <span
                            className={`status-dot ${inv.status === 'Pending' ? 'status-pending' : 'status-suspended'}`}
                            aria-hidden="true"
                          />
                          {inv.status}
                        </span>
                      </td>
                      <td>
                        <EmailStatusBadge status={inv.emailStatus} sample={inv.sample} />
                      </td>
                      <td style={{ color: 'var(--neutral-500)', fontSize: 13 }}>{inv.invitedBy}</td>
                      <td style={{ color: 'var(--neutral-400)', fontSize: 13 }}>
                        {fmtTime(inv.invitedAt)}
                        {inv.sample && <span className="sample-tag">sample</span>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {inv.status === 'Pending' && (
                            <>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleResend(inv.id)}
                                disabled={inv.emailStatus === 'sending'}
                                id={`resend-inv-${inv.id}`}
                                aria-label={`Resend invitation to ${inv.name}`}
                                title="Resend invitation"
                              >
                                <IconRefreshCw size={13} />
                                Resend
                              </button>
                              <button
                                className="btn btn-sm"
                                style={{ background: 'var(--red-100)', color: 'var(--red-700)', border: '1px solid #fca5a5' }}
                                onClick={() => setCancelTarget(inv)}
                                disabled={inv.emailStatus === 'sending'}
                                id={`cancel-inv-${inv.id}`}
                                aria-label={`Cancel invitation for ${inv.name}`}
                                title="Cancel invitation"
                              >
                                <IconX size={13} />
                                Cancel
                              </button>
                            </>
                          )}
                          {inv.status === 'Cancelled' && (
                            <span style={{ fontSize: 12, color: 'var(--neutral-400)' }}>Cancelled</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {filtered.length > 0 && (
              <div className="pagination">
                <span className="pagination-info">
                  Showing {filtered.length} of {invitations.length} invitation{invitations.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          {/* Simulated-mode notice */}
          <div className="info-notice" style={{ marginTop: 16 }}>
            <IconAlertCircle size={14} />
            <span>
              <strong>Mock mode:</strong> Invitations are stored in browser memory and localStorage only.
              No emails are sent to real recipients.
            </span>
          </div>
        </div>
      </div>

      {/* Cancel confirmation modal */}
      {cancelTarget && (
        <CancelConfirmModal
          invitation={cancelTarget}
          onConfirm={handleCancelConfirmed}
          onClose={() => setCancelTarget(null)}
        />
      )}
    </>
  );
}
