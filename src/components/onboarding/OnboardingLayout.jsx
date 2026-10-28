// ============================================================
//  OnboardingLayout – shared shell for steps 1-3
//  Top bar: logo left, step counter right
//  Centre: card with step progress + content
// ============================================================
export default function OnboardingLayout({ step, totalSteps, children }) {
  const steps = [
    { n: 1, label: 'Organisation' },
    { n: 2, label: 'Teammates' },
    { n: 3, label: 'Finish' },
  ];

  return (
    <div className="ob-shell">
      {/* Top bar */}
      <header className="ob-topbar">
        <div className="ob-brand">
          <div className="ob-brand-logo" aria-hidden="true">AC</div>
          <div className="ob-brand-text">
            <span className="ob-brand-name">Ampcus Cyber</span>
            <span className="ob-brand-sub">Customer Admin Portal</span>
          </div>
        </div>
        <span className="ob-step-counter">Step {step} of {totalSteps}</span>
      </header>

      {/* Card */}
      <main className="ob-main">
        <div className="ob-card">
          {/* Step progress */}
          <div className="ob-progress" role="list" aria-label="Onboarding progress">
            {steps.map((s, idx) => {
              const done    = s.n < step;
              const active  = s.n === step;
              return (
                <div key={s.n} className="ob-progress-item" role="listitem">
                  {/* connector left */}
                  {idx > 0 && (
                    <div className={`ob-connector${done || active ? ' ob-connector-done' : ''}`} />
                  )}
                  <div className={`ob-step-badge${done ? ' ob-step-done' : active ? ' ob-step-active' : ' ob-step-future'}`}>
                    {done ? (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : s.n}
                  </div>
                  <span className={`ob-step-label${active ? ' ob-step-label-active' : done ? ' ob-step-label-done' : ''}`}>
                    {s.label}
                  </span>
                  {/* connector right */}
                  {idx < steps.length - 1 && (
                    <div className={`ob-connector${done ? ' ob-connector-done' : ''}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step content */}
          {children}
        </div>
      </main>
    </div>
  );
}
