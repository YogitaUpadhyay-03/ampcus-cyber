// ============================================================
//  StepTeammates – Onboarding Step 2 (Screen 5)
//  "Invite your first teammates"
// ============================================================
import { useState } from 'react';
import OnboardingLayout from './OnboardingLayout';

const ROLES = ['Viewer', 'Manager', 'Admin'];

function emptyRow() {
  return { email: '', role: 'Viewer' };
}

export default function StepTeammates({ onNext, onSkip }) {
  const [rows, setRows] = useState([emptyRow(), emptyRow()]);

  function setRow(idx, field, value) {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  }

  function addRow() {
    setRows(prev => [...prev, emptyRow()]);
  }

  function removeRow(idx) {
    if (rows.length <= 1) return;
    setRows(prev => prev.filter((_, i) => i !== idx));
  }

  function handleContinue(e) {
    e.preventDefault();
    // Filter out completely empty rows
    const filled = rows.filter(r => r.email.trim());
    onNext(filled);
  }

  return (
    <OnboardingLayout step={2} totalSteps={3}>
      <div className="ob-content">
        <h2 className="ob-heading">Invite your first teammates</h2>
        <p className="ob-sub">
          Optional. Invitations are simulated – no email is sent. New members default to Viewer.
        </p>

        <form onSubmit={handleContinue} noValidate className="ob-form">
          {rows.map((row, idx) => (
            <div key={idx} className="ob-invite-row">
              <div className="ob-field ob-invite-email">
                <input
                  type="email"
                  className="ob-input"
                  placeholder="teammate@example.com"
                  value={row.email}
                  onChange={e => setRow(idx, 'email', e.target.value)}
                  id={`ob-invite-email-${idx}`}
                  aria-label={`Teammate ${idx + 1} email`}
                />
              </div>
              <div className="ob-field ob-invite-role">
                <select
                  className="ob-select"
                  value={row.role}
                  onChange={e => setRow(idx, 'role', e.target.value)}
                  id={`ob-invite-role-${idx}`}
                  aria-label={`Teammate ${idx + 1} role`}
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              {rows.length > 1 && (
                <button
                  type="button"
                  className="ob-remove-row"
                  onClick={() => removeRow(idx)}
                  aria-label="Remove teammate row"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          ))}

          <button type="button" className="ob-add-row" onClick={addRow} id="ob-add-teammate">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add another teammate
          </button>

          <div className="ob-actions ob-actions-between">
            <button type="button" className="btn-ob-ghost" onClick={onSkip} id="ob-skip">
              Skip for now
            </button>
            <button type="submit" className="btn-ob-primary" id="ob-step2-continue">
              Continue
            </button>
          </div>
        </form>
      </div>
    </OnboardingLayout>
  );
}
