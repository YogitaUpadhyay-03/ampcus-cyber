// ============================================================
//  ActivityLogPage – full audit trail timeline
// ============================================================
import { useState, useMemo } from 'react';
import {
  IconActivity, IconUserPlus, IconUserCheck,
  IconShield, IconMail, IconClock,
} from './Icons';
import { fmtTime } from '../utils.js';

function ActivityIcon({ type, size = 14 }) {
  const map = {
    invite:  <IconUserPlus  size={size} />,
    role:    <IconUserCheck size={size} />,
    suspend: <IconShield    size={size} />,
    resend:  <IconMail      size={size} />,
    join:    <IconUserCheck size={size} />,
    cancel:  <IconMail      size={size} />,
  };
  return map[type] ?? <IconClock size={size} />;
}

function typeBadge(type) {
  const map = {
    invite:  { label: 'Invite',       cls: 'badge-manager' },
    role:    { label: 'Role change',  cls: 'badge-admin' },
    suspend: { label: 'Suspended',    cls: 'badge-suspended' },
    resend:  { label: 'Resend',       cls: 'badge-viewer' },
    join:    { label: 'Join',         cls: 'badge-manager' },
    cancel:  { label: 'Cancel',       cls: 'badge-suspended' },
  };
  return map[type] ?? { label: type, cls: 'badge-viewer' };
}

const TYPE_OPTIONS = [
  { value: '',        label: 'All types' },
  { value: 'invite',  label: 'Invite' },
  { value: 'role',    label: 'Role change' },
  { value: 'resend',  label: 'Resend' },
  { value: 'cancel',  label: 'Cancel' },
  { value: 'suspend', label: 'Suspend' },
  { value: 'join',    label: 'Join' },
];

export default function ActivityLogPage({ activity }) {
  const [typeFilter, setTypeFilter] = useState('');

  const filtered = useMemo(() => {
    if (!typeFilter) return activity;
    return activity.filter(a => a.type === typeFilter);
  }, [activity, typeFilter]);

  return (
    <div className="main-content" id="main-content">
      <header className="page-header">
        <div>
          <h1 className="page-title">Activity log</h1>
          <p className="page-subtitle">Full audit trail of administrative actions during this session.</p>
        </div>
      </header>

      <div className="page-body">
        {/* Filter toolbar */}
        <div className="toolbar" style={{ marginBottom: 20 }}>
          <select
            id="activity-type-filter"
            className="filter-select"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            aria-label="Filter by action type"
          >
            {TYPE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <span className="count-badge" aria-live="polite">
            {filtered.length} event{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Activity table */}
        <div className="table-wrap">
          {filtered.length === 0 ? (
            <div className="empty-state" role="status" aria-live="polite">
              <IconActivity size={40} />
              <div className="empty-state-title">No activity found</div>
              <div className="empty-state-sub">
                {typeFilter
                  ? 'No events match the selected filter. Try clearing it.'
                  : 'Actions performed in the portal will appear here.'}
              </div>
              {typeFilter && (
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: 12 }}
                  onClick={() => setTypeFilter('')}
                >
                  Clear filter
                </button>
              )}
            </div>
          ) : (
            <table aria-label="Activity log table">
              <thead>
                <tr>
                  <th scope="col">Time</th>
                  <th scope="col">Type</th>
                  <th scope="col">Actor</th>
                  <th scope="col">Action</th>
                  <th scope="col">Affected</th>
                  <th scope="col">Details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => {
                  const badge = typeBadge(item.type);
                  return (
                    <tr key={item.id}>
                      <td style={{ color: 'var(--neutral-400)', whiteSpace: 'nowrap', fontSize: 12.5 }}>
                        {fmtTime(item.ts)}
                        {item.sample && <span className="sample-tag">sample</span>}
                      </td>
                      <td>
                        <span className={`badge ${badge.cls}`} style={{ display: 'inline-flex', gap: 5 }}>
                          <ActivityIcon type={item.type} size={12} />
                          {badge.label}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500, color: 'var(--neutral-800)' }}>{item.actor}</td>
                      <td style={{ color: 'var(--neutral-600)' }}>{item.action}</td>
                      <td style={{ color: 'var(--neutral-700)', fontWeight: 500 }}>
                        {item.target || <span style={{ color: 'var(--neutral-400)' }}>—</span>}
                      </td>
                      <td style={{ color: 'var(--neutral-500)', fontSize: 12.5 }}>
                        {item.detail || <span style={{ color: 'var(--neutral-300)' }}>—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {filtered.length > 0 && (
            <div className="pagination">
              <span className="pagination-info">
                Showing {filtered.length} of {activity.length} event{activity.length !== 1 ? 's' : ''}
                {activity.some(a => a.sample) && (
                  <span style={{ marginLeft: 10, fontSize: 12 }}>
                    — <span className="sample-tag">sample</span> entries are pre-loaded demonstration data
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
