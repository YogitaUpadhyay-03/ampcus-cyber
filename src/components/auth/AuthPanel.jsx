// Shared left branding panel used by Sign In and Create Account
export default function AuthPanel() {
  return (
    <div className="auth-panel">
      <div className="auth-panel-inner">
        <div className="auth-brand">
          <div className="auth-brand-logo">AC</div>
          <div className="auth-brand-text">
            <span className="auth-brand-name">Ampcus Cyber</span>
            <span className="auth-brand-sub">Customer Admin Portal</span>
          </div>
        </div>

        <div className="auth-panel-hero">
          <h1 className="auth-panel-headline">
            Manage your team's access with confidence.
          </h1>
          <p className="auth-panel-desc">
            Invite colleagues, assign roles and keep a clear audit trail – all in one place.
          </p>
          <ul className="auth-feature-list">
            <li>
              <span className="auth-feature-check" aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              Role-based access: Admin, Manager, Viewer
            </li>
            <li>
              <span className="auth-feature-check" aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              Safe role changes with confirmation
            </li>
            <li>
              <span className="auth-feature-check" aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              A clear activity log of every admin action
            </li>
          </ul>
        </div>

        <p className="auth-panel-footer">
          © 2026 Ampcus Cyber · Demo portal · authentication is simulated
        </p>
      </div>
    </div>
  );
}
