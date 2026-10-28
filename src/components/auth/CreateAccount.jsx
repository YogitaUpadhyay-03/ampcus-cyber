// ============================================================
//  CreateAccount – Screen 3
// ============================================================
import { useState } from 'react';
import AuthPanel from './AuthPanel';

function passwordStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: 'Weak – use 8+ characters with a number', color: '#ef4444' };
  if (score === 2) return { score, label: 'Fair – add uppercase or a symbol', color: '#f59e0b' };
  if (score === 3) return { score, label: 'Good – use 8+ characters with a number', color: '#22c55e' };
  return { score, label: 'Strong', color: '#16a34a' };
}

export default function CreateAccount({ onAccountCreated, onSignIn }) {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [agreed,   setAgreed]   = useState(false);
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);

  const strength = passwordStrength(password);

  function validate() {
    const errs = {};
    if (!name.trim())               errs.name     = 'Full name is required.';
    if (!email.trim())              errs.email    = 'Work email is required.';
    else if (!email.includes('@'))  errs.email    = 'Enter a valid email address.';
    if (!password)                  errs.password = 'Password is required.';
    else if (password.length < 8)   errs.password = 'Password must be at least 8 characters.';
    if (!agreed)                    errs.agreed   = 'You must agree to the Terms of Service.';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onAccountCreated({ name: name.trim(), email: email.trim() });
    }, 600);
  }

  return (
    <div className="auth-layout">
      <AuthPanel />

      <main className="auth-form-side">
        <div className="auth-form-box">
          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">Start managing your team in minutes.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label className="auth-label" htmlFor="ca-name">Full name</label>
              <input
                id="ca-name"
                type="text"
                className={`auth-input${errors.name ? ' auth-input-error' : ''}`}
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
                autoComplete="name"
                autoFocus
              />
              {errors.name && <p className="auth-field-error">{errors.name}</p>}
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="ca-email">Work email</label>
              <input
                id="ca-email"
                type="email"
                className={`auth-input${errors.email ? ' auth-input-error' : ''}`}
                placeholder="name@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                autoComplete="email"
              />
              {errors.email && <p className="auth-field-error">{errors.email}</p>}
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="ca-password">Password</label>
              <input
                id="ca-password"
                type="password"
                className={`auth-input${errors.password ? ' auth-input-error' : ''}`}
                placeholder="••••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                autoComplete="new-password"
              />
              {password && (
                <div className="pw-strength">
                  <div className="pw-strength-bar">
                    {[1,2,3,4].map(n => (
                      <div
                        key={n}
                        className="pw-strength-seg"
                        style={{ background: n <= strength.score ? strength.color : '#e5e7eb' }}
                      />
                    ))}
                  </div>
                  <p className="pw-strength-label" style={{ color: strength.color }}>
                    Password strength: {strength.label}
                  </p>
                </div>
              )}
              {errors.password && <p className="auth-field-error">{errors.password}</p>}
            </div>

            <div className="auth-field">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  className="auth-checkbox"
                  id="ca-terms"
                  checked={agreed}
                  onChange={e => { setAgreed(e.target.checked); setErrors(p => ({ ...p, agreed: '' })); }}
                />
                I agree to the{' '}
                <button type="button" className="auth-link">Terms of Service</button>
                {' '}and{' '}
                <button type="button" className="auth-link">Privacy Policy</button>
              </label>
              {errors.agreed && <p className="auth-field-error">{errors.agreed}</p>}
            </div>

            <button
              type="submit"
              className="btn-auth-primary"
              disabled={loading}
              id="ca-submit"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account?{' '}
            <button className="auth-link" onClick={onSignIn} id="goto-signin">Sign in</button>
          </p>
        </div>
      </main>
    </div>
  );
}
