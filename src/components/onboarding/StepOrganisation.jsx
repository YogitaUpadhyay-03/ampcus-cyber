// ============================================================
//  StepOrganisation – Onboarding Step 1 (Screen 4)
//  "Tell us about your organisation"
// ============================================================
import { useState } from 'react';
import OnboardingLayout from './OnboardingLayout';

const INDUSTRIES = [
  'Cybersecurity', 'Technology', 'Finance', 'Healthcare',
  'Education', 'Retail', 'Manufacturing', 'Government', 'Other',
];

const TEAM_SIZES = [
  'Just me', '2–10', '11–50', '51–200', '201–500', '500+',
];

export default function StepOrganisation({ onNext, defaultValues = {} }) {
  const [orgName,  setOrgName]  = useState(defaultValues.orgName  || '');
  const [industry, setIndustry] = useState(defaultValues.industry || '');
  const [teamSize, setTeamSize] = useState(defaultValues.teamSize || '');
  const [errors,   setErrors]   = useState({});

  function validate() {
    const errs = {};
    if (!orgName.trim()) errs.orgName = 'Organisation name is required.';
    return errs;
  }

  function handleContinue(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onNext({ orgName: orgName.trim(), industry, teamSize });
  }

  return (
    <OnboardingLayout step={1} totalSteps={3}>
      <div className="ob-content">
        <h2 className="ob-heading">Tell us about your organisation</h2>
        <p className="ob-sub">This helps us personalise your portal for your team.</p>

        <form onSubmit={handleContinue} noValidate className="ob-form">
          <div className="ob-field">
            <label className="ob-label" htmlFor="ob-org-name">Organisation name</label>
            <input
              id="ob-org-name"
              type="text"
              className={`ob-input${errors.orgName ? ' ob-input-error' : ''}`}
              placeholder="e.g. Northwind Labs"
              value={orgName}
              onChange={e => { setOrgName(e.target.value); setErrors(p => ({ ...p, orgName: '' })); }}
              autoFocus
            />
            {errors.orgName && <p className="ob-field-error">{errors.orgName}</p>}
          </div>

          <div className="ob-field-row">
            <div className="ob-field">
              <label className="ob-label" htmlFor="ob-industry">Industry</label>
              <select
                id="ob-industry"
                className="ob-select"
                value={industry}
                onChange={e => setIndustry(e.target.value)}
              >
                <option value="">Select industry</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            <div className="ob-field">
              <label className="ob-label" htmlFor="ob-team-size">Team size</label>
              <select
                id="ob-team-size"
                className="ob-select"
                value={teamSize}
                onChange={e => setTeamSize(e.target.value)}
              >
                <option value="">Select size</option>
                {TEAM_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="ob-actions ob-actions-right">
            <button type="submit" className="btn-ob-primary" id="ob-step1-continue">
              Continue
            </button>
          </div>
        </form>
      </div>
    </OnboardingLayout>
  );
}
