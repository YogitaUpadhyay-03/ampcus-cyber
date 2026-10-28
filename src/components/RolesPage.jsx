// ============================================================
//  RolesPage – role overview and permission comparison
// ============================================================
import { ROLES } from '../data/mockData';
import { IconCheck, IconX, IconAlertCircle } from './Icons';

const PERMISSIONS = [
  'View dashboard',
  'View user list',
  'Invite users',
  'Change Viewer roles',
  'Change any role',
  'Manage users',
];

function PermCell({ allowed }) {
  return (
    <td className="perm-cell" aria-label={allowed ? 'Allowed' : 'Not allowed'}>
      {allowed
        ? <span className="perm-yes"><IconCheck size={14} /></span>
        : <span className="perm-no"><IconX size={14} /></span>
      }
    </td>
  );
}

function roleBadgeClass(role) {
  return { Admin: 'badge-admin', Manager: 'badge-manager', Viewer: 'badge-viewer' }[role] ?? 'badge-viewer';
}

export default function RolesPage() {
  return (
    <div className="main-content" id="main-content">
      <header className="page-header">
        <div>
          <h1 className="page-title">Roles &amp; access</h1>
          <p className="page-subtitle">Role definitions and permission overview for your organisation.</p>
        </div>
      </header>

      <div className="page-body">
        {/* Simulated notice */}
        <div className="info-notice" style={{ marginBottom: 24 }}>
          <IconAlertCircle size={14} />
          <span>
            <strong>Frontend simulation only.</strong> These permissions are enforced by the UI for demonstration purposes.
            They do not provide production-grade security without a backend access-control layer.
          </span>
        </div>

        {/* Role cards */}
        <div className="roles-overview-grid">
          {ROLES.map(role => (
            <div key={role.value} className="role-card card">
              <div className="role-card-header">
                <span className={`badge ${roleBadgeClass(role.value)}`}>{role.label}</span>
              </div>
              <p className="role-card-desc">{role.desc}</p>
              <ul className="role-perms-list" aria-label={`${role.label} permissions`}>
                {role.permissions.map(p => (
                  <li key={p.label} className={`role-perm-item ${p.allowed ? 'allowed' : 'denied'}`}>
                    {p.allowed
                      ? <span className="perm-yes"><IconCheck size={13} /></span>
                      : <span className="perm-no"><IconX size={13} /></span>
                    }
                    <span>{p.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Permission comparison table */}
        <div className="card" style={{ marginTop: 28 }}>
          <div style={{ padding: '20px 20px 0' }}>
            <div className="section-title">Permission comparison</div>
            <div className="section-sub">Side-by-side comparison of what each role can do</div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="perm-table" aria-label="Permission comparison table">
              <thead>
                <tr>
                  <th scope="col" style={{ textAlign: 'left', paddingLeft: 20 }}>Permission</th>
                  {ROLES.map(r => (
                    <th key={r.value} scope="col">
                      <span className={`badge ${roleBadgeClass(r.value)}`}>{r.label}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMISSIONS.map(perm => (
                  <tr key={perm}>
                    <td className="perm-label">{perm}</td>
                    {ROLES.map(role => {
                      const p = role.permissions.find(x => x.label === perm);
                      return <PermCell key={role.value} allowed={p?.allowed ?? false} />;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Usage guidance */}
        <div className="card" style={{ marginTop: 20, padding: 20 }}>
          <div className="section-title">Assigning roles</div>
          <div className="section-sub" style={{ marginBottom: 14 }}>Best practices for role assignment</div>
          <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8, color: 'var(--neutral-600)', fontSize: 13.5 }}>
            <li>Assign <strong>Admin</strong> only to trusted administrators who need full system access.</li>
            <li><strong>Manager</strong> is suitable for team leads who invite users and manage Viewer access.</li>
            <li><strong>Viewer</strong> is the default role for new members who only need read access.</li>
            <li>Roles can be changed at any time from the Users page via the <em>Change role</em> action.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
