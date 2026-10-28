// ============================================================
//  SignIn – Screen 1 & 2 (normal + error state)
//  - Demo account (alex.morgan@example.com) gets pre-seeded data
//  - Any other valid email/password combination is accepted as
//    a new simulated account (frontend-only, no real auth)
// ============================================================
import { useState } from 'react';
import AuthPanel from './AuthPanel';

export default function SignIn({ onSignIn, onCreateAccount, demoEmail }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error,    setError]    = useState('');
  const [fieldErr, setFieldErr] = useState(false);
  const [loading,  setLoading]  = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setFieldErr(false);

    if (!email.trim()) {
      setError('Please enter your work email.');
      setFieldErr(true);
      return;
    }
    if (!email.includes('@')) {
      setError('Enter a valid email address.');
      setFieldErr(true);
      return;
    }
    if (!password || password.length < 4) {
      setError('Incorrect email or password. Try again or reset your password.');
      setFieldErr(true);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSignIn({ email: email.trim().toLowerCase(), remember });
    }, 600);
  }

  function handleSso() {
    // SSO simulated: sign in as the demo account
    onSignIn({ email: demoEmail || 'alex.morgan@example.com', remember: false });
  }

  function fillDemo() {
    setEmail(demoEmail || 'alex.morgan@example.com');
    setPassword('password123');
    setError('');
    setFieldErr(false);
  }

  return (
    <div className="auth-layout">
      <AuthPanel />

      <main className="auth-form-side">
        <div className="auth-form-box">
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to your Customer Admin Portal.</p>

          {/* Demo hint */}
          <div className="auth-demo-hint">
            <span>Demo account:</span>
            <button type="button" className="auth-link" onClick={fillDemo}>
              {demoEmail || 'alex.morgan@example.com'}
            </button>
            <span>/ password123</span>
          </div>

          {/* Error banner */}
          {error && (
            <div className="auth-alert auth-alert-error" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div>
                <div className="auth-alert-title">Couldn't sign you in</div>
                <div className="auth-alert-sub">{error}</div>
              </div>
              <button className="auth-alert-close" onClick={() => { setError(''); setFieldErr(false); }} aria-label="Dismiss">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label className="auth-label" htmlFor="signin-email">Work email</label>
              <input
                id="signin-email"
                type="email"
                className={`auth-input${fieldErr && !error.includes('password') ? ' auth-input-error' : ''}`}
                placeholder="name@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); setFieldErr(false); }}
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="signin-password">Password</label>
              <input
                id="signin-password"
                type="password"
                className={`auth-input${fieldErr ? ' auth-input-error' : ''}`}
                placeholder="Enter your password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); setFieldErr(false); }}
                autoComplete="current-password"
                required
              />
              {fieldErr && error.includes('password') && (
                <p className="auth-field-error">Incorrect password.</p>
              )}
            </div>

            <div className="auth-row-between">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  className="auth-checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  id="signin-remember"
                />
                Remember me
              </label>
              <button type="button" className="auth-link">Forgot password?</button>
            </div>

            <button
              type="submit"
              className="btn-auth-primary"
              disabled={loading}
              id="signin-submit"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            <div className="auth-divider"><span>or</span></div>

            <button type="button" className="btn-auth-ghost" onClick={handleSso} id="signin-sso">
              Continue with SSO (simulated)
            </button>
          </form>

          <p className="auth-footer-text">
            New to Ampcus Cyber?{' '}
            <button className="auth-link" onClick={onCreateAccount} id="goto-create-account">
              Create an account
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
