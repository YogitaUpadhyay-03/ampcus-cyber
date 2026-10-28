// ============================================================
//  Dashboard Page – live stats from shared state
// ============================================================
import {
  IconUsers, IconMail, IconShield, IconUserPlus,
  IconUserCheck, IconClock,
} from './Icons';
import { fmtTime } from '../utils.js';

// ── Activity icon map ────────────────────────────────────────
function ActivityIcon({ type }) {
  const map = {
    invite:  <IconUserPlus  size={14} />,
    role:    <IconUserCheck size={14} />,
    suspend: <IconShield    size={14} />,
    resend:  <IconMail      size={14} />,
    join:    <IconUserCheck size={14} />,
    cancel:  <IconMail      size={14} />,
  };
  return map[type] ?? <IconClock size={14} />;
}

function activitySentence(item) {
  const parts = [item.actor, item.action, item.target, item.detail].filter(Boolean);
  return parts.join(' ');
}

// ── Stat card ────────────────────────────────────────────────
function StatCard({ icon, label, value, sub }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <div className="stat-icon" aria-hidden="true">{icon}</div>
        <span className="stat-label">{label}</span>
      </div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

export default function Dashboard({ users, invitations, activity, onInvite }) {
  // Live stats derived from shared state
  const totalUsers     = users.length;
  const activeUsers    = users.filter(u => u.status === 'Active').length;
  const pendingInvites = invitations.filter(i => i.status === 'Pending').length;
  const adminCount     = users.filter(u => u.role === 'Admin').length;
  const pct = totalUsers > 0 ? Math.round(activeUsers / totalUsers * 100) : 0;

  // Show most recent 6 activity entries on dashboard
  const recentActivity = activity.slice(0, 6);

  return (
    <div className="main-content" id="main-content">
      <header className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your organisation's users and recent administrative activity.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={onInvite}
          id="dashboard-invite-btn"
          aria-label="Invite a new user"
        >
          <IconUserPlus size={15} />
          Invite user
        </button>
      </header>

      <div className="page-body">
        {/* Summary cards */}
        <div className="stats-grid" role="region" aria-label="Summary statistics">
          <StatCard
            icon={<IconUsers size={17} />}
            label="Total users"
            value={totalUsers}
            sub={`${adminCount} admin${adminCount !== 1 ? 's' : ''}`}
          />
          <StatCard
            icon={<IconUserCheck size={17} />}
            label="Active users"
            value={activeUsers}
            sub={`${pct}% of all users`}
          />
          <StatCard
            icon={<IconMail size={17} />}
            label="Pending invitations"
            value={pendingInvites}
            sub={pendingInvites === 0 ? 'None pending' : `${pendingInvites} awaiting acceptance`}
          />
          <StatCard
            icon={<IconShield size={17} />}
            label="Admins"
            value={adminCount}
            sub={`of ${totalUsers} users`}
          />
        </div>

        {/* Dashboard grid */}
        <div className="dashboard-grid">
          {/* Activity feed */}
          <div className="card" style={{ padding: '20px' }}>
            <div className="section-title">Recent administrative activity</div>
            <div className="section-sub">Last 7 days</div>

            {recentActivity.length === 0 ? (
              <div className="empty-state" style={{ padding: '32px 0' }}>
                <IconClock size={32} />
                <div className="empty-state-title">No activity yet</div>
                <div className="empty-state-sub">Actions you take will appear here.</div>
              </div>
            ) : (
              <ul className="activity-list" aria-label="Recent activity">
                {recentActivity.map(item => (
                  <li key={item.id} className="activity-item">
                    <div className="activity-icon" aria-hidden="true">
                      <ActivityIcon type={item.type} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className="activity-text">
                        {activitySentence(item)}
                        {item.sample && (
                          <span className="sample-tag">sample</span>
                        )}
                      </div>
                      <div className="activity-time">{fmtTime(item.ts)}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Roles at a glance */}
          <div className="card roles-card">
            <div className="section-title">Roles at a glance</div>
            <div className="section-sub">Simulated permissions (frontend only)</div>

            <div className="role-entry">
              <span className="badge badge-admin">Admin</span>
              <p className="role-desc">Full access: manage users, change any role, invite anyone.</p>
            </div>
            <div className="role-entry">
              <span className="badge badge-manager">Manager</span>
              <p className="role-desc">Invite users and change Viewer roles. Cannot edit Admins.</p>
            </div>
            <div className="role-entry">
              <span className="badge badge-viewer">Viewer</span>
              <p className="role-desc">Read-only: view the dashboard and user list.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
