// ============================================================
//  StepFinish – Onboarding Step 3 (Screen 6)
//  "You're all set"
// ============================================================
import OnboardingLayout from './OnboardingLayout';

export default function StepFinish({ orgName, inviteCount, onGoToDashboard }) {
  return (
    <OnboardingLayout step={3} totalSteps={3}>
      <div className="ob-content ob-finish">
        <h2 className="ob-heading">You're all set</h2>
        <p className="ob-sub">Your workspace is ready.</p>

        <div className="ob-summary">
          <div className="ob-summary-row">
            <span className="ob-summary-key">Organisation</span>
            <span className="ob-summary-val">{orgName || 'My Organisation'}</span>
          </div>
          <div className="ob-summary-row">
            <span className="ob-summary-key">Invitations</span>
            <span className="ob-summary-val">
              {inviteCount > 0
                ? `${inviteCount} pending (simulated delivery)`
                : 'None sent'}
            </span>
          </div>
          <div className="ob-summary-row">
            <span className="ob-summary-key">Your role</span>
            <span className="ob-summary-val">
              <span className="ob-role-badge">Admin</span>
            </span>
          </div>
        </div>

        <div className="ob-actions ob-actions-right">
          <button
            className="btn-ob-primary"
            onClick={onGoToDashboard}
            id="ob-go-dashboard"
          >
            Go to dashboard
          </button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
