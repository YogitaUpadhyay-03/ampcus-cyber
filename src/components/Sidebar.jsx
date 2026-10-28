// ============================================================
//  Sidebar – navigation for the Customer Admin Portal
// ============================================================
import {
  IconDashboard, IconUsers, IconMail,
  IconShield, IconActivity,
} from './Icons';

const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',     Icon: IconDashboard },
  { id: 'users',       label: 'Users',         Icon: IconUsers },
  { id: 'invitations', label: 'Invitations',   Icon: IconMail },
  { id: 'roles',       label: 'Roles & access', Icon: IconShield },
  { id: 'activity',    label: 'Activity log',  Icon: IconActivity },
];

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function Sidebar({ activePage, onNavigate, isOpen, onToggle, onLogout, currentUser }) {
  const displayName  = currentUser?.name  || currentUser?.email?.split('@')[0] || 'Admin';
  const displayEmail = currentUser?.email || '';
  const initials     = getInitials(displayName);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`sidebar-backdrop ${isOpen ? 'visible' : ''}`}
        onClick={onToggle}
        aria-hidden="true"
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="Main navigation">
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-logo" aria-hidden="true">AC</div>
          <div className="brand-text">
            <span className="brand-name">Ampcus Cyber</span>
            <span className="brand-sub">Customer Admin Portal</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`nav-item ${activePage === id ? 'active' : ''}`}
              onClick={() => { onNavigate(id); if (isOpen) onToggle(); }}
              aria-current={activePage === id ? 'page' : undefined}
              id={`nav-${id}`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        {/* Footer user chip */}
        <div className="sidebar-footer">
          <div className="user-chip">
            <div
              className="avatar"
              style={{ background: '#6c63ff' }}
              aria-hidden="true"
            >
              {initials}
            </div>
            <div className="user-info">
              <div className="user-name">{displayName}</div>
              <div className="user-role" title={displayEmail}>
                Admin · simulated session
              </div>
            </div>
          </div>
          <button className="btn btn-ghost logout-btn" onClick={onLogout} id="sidebar-logout">
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
