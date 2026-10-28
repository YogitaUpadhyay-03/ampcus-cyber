// ============================================================
//  App – root component; auth, onboarding, routing, state
//  Workspace data is fully scoped per-account via localStorage
// ============================================================
import { useState, useCallback, useEffect, useRef } from 'react';

// Auth screens
import SignIn        from './components/auth/SignIn';
import CreateAccount from './components/auth/CreateAccount';

// Onboarding screens
import StepOrganisation from './components/onboarding/StepOrganisation';
import StepTeammates    from './components/onboarding/StepTeammates';
import StepFinish       from './components/onboarding/StepFinish';

// Portal
import Sidebar          from './components/Sidebar';
import Dashboard        from './components/Dashboard';
import UsersPage        from './components/UsersPage';
import InvitationsPage  from './components/InvitationsPage';
import RolesPage        from './components/RolesPage';
import ActivityLogPage  from './components/ActivityLogPage';
import InviteModal      from './components/InviteModal';
import { ToastContainer } from './components/Toast';

import {
  INITIAL_USERS, INITIAL_INVITATIONS, INITIAL_ACTIVITY,
  AVATAR_COLORS,
} from './data/mockData';
import { makeInitials } from './utils.js';
import { IconMenu } from './components/Icons';

// ── module-level counters ──────────────────────────────────
let _id       = 1000;
let _colorIdx = 0;
function uid(prefix)  { return `${prefix}-${++_id}`; }
function nextColor()  { return AVATAR_COLORS[_colorIdx++ % AVATAR_COLORS.length]; }

// ── Demo account (pre-seeded with sample data) ────────────
export const DEMO_EMAIL = 'alex.morgan@example.com';
function isDemoEmail(email) {
  return (email || '').trim().toLowerCase() === DEMO_EMAIL;
}

// ── Workspace-scoped localStorage helpers ─────────────────
// Every key is namespaced by the account email so that
// multiple accounts can coexist without overwriting each other.
function safeEmail(email) {
  return (email || '').toLowerCase().replace(/[^a-z0-9]/g, '_');
}
function wsKey(email, type) {
  return `ampcus_ws_${safeEmail(email)}_${type}`;
}

const LS_SESSION = 'ampcus_auth'; // { email, name } – current session only

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    // If expecting array, reject non-array shapes
    if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// Load the full workspace for a given account email.
// Demo account falls back to INITIAL_* seed data on first visit.
// New accounts start with empty arrays.
function loadWorkspace(email) {
  const isDemo   = isDemoEmail(email);
  const usersKey = wsKey(email, 'users');
  const invsKey  = wsKey(email, 'invitations');
  const actKey   = wsKey(email, 'activity');
  const orgKey   = wsKey(email, 'org');
  const obKey    = wsKey(email, 'onboarded');

  return {
    users:       readJSON(usersKey,  isDemo ? INITIAL_USERS       : []),
    invitations: readJSON(invsKey,   isDemo ? INITIAL_INVITATIONS : []),
    activity:    readJSON(actKey,    isDemo ? INITIAL_ACTIVITY    : []),
    org:         readJSON(orgKey,    {}),
    onboarded:   localStorage.getItem(obKey) === 'true',
  };
}

function loadSession() {
  return readJSON(LS_SESSION, null);
}

// ── App ────────────────────────────────────────────────────
export default function App() {
  // ── Session (who is logged in) ─────────────────────────────
  const [auth, setAuth] = useState(() => loadSession());

  // ── Screen router ──────────────────────────────────────────
  // 'signin' | 'create-account' | 'ob-org' | 'ob-teammates' | 'ob-finish' | 'portal'
  const [screen, setScreen] = useState(() => {
    const session = loadSession();
    if (!session) return 'signin';
    const ws = loadWorkspace(session.email);
    return ws.onboarded ? 'portal' : 'ob-org';
  });

  // ── Workspace state (scoped to current account) ────────────
  const [users,       setUsers]       = useState(() => {
    const s = loadSession();
    return s ? loadWorkspace(s.email).users : [];
  });
  const [invitations, setInvitations] = useState(() => {
    const s = loadSession();
    return s ? loadWorkspace(s.email).invitations : [];
  });
  const [activity,    setActivity]    = useState(() => {
    const s = loadSession();
    return s ? loadWorkspace(s.email).activity : [];
  });

  // ── Onboarding transient data ──────────────────────────────
  const [obOrg,     setObOrg]     = useState(() => {
    const s = loadSession();
    return s ? loadWorkspace(s.email).org : {};
  });
  const [obInvites, setObInvites] = useState(0);

  // ── Portal UI state ────────────────────────────────────────
  const [activePage,    setActivePage]    = useState('dashboard');
  const [inviteOpen,    setInviteOpen]    = useState(false);
  const [toasts,        setToasts]        = useState([]);
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  // ── Save workspace state (scoped) whenever it changes ─────
  // We use a ref to avoid triggering effects while auth is null
  const authRef = useRef(auth);
  useEffect(() => { authRef.current = auth; }, [auth]);

  useEffect(() => {
    if (authRef.current?.email)
      writeJSON(wsKey(authRef.current.email, 'users'), users);
  }, [users]);

  useEffect(() => {
    if (authRef.current?.email)
      writeJSON(wsKey(authRef.current.email, 'invitations'), invitations);
  }, [invitations]);

  useEffect(() => {
    if (authRef.current?.email)
      writeJSON(wsKey(authRef.current.email, 'activity'), activity);
  }, [activity]);

  // ── Toast helpers ──────────────────────────────────────────
  const addToast = useCallback(({ type, message }) => {
    const id = uid('toast');
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ── Activity logger ────────────────────────────────────────
  function logActivity({ type, actor, action, target, detail }) {
    const defaultActor = auth?.name
      || (auth?.email ? auth.email.split('@')[0].replace('.', ' ') : 'Admin');
    const entry = {
      id:     uid('act'),
      type,
      actor:  actor  || defaultActor,
      action,
      target: target || '',
      detail: detail || '',
      ts:     new Date().toISOString(),
      sample: false,
    };
    setActivity(prev => [entry, ...prev]);
  }

  // ── Switch workspace (re-hydrate state for a given email) ──
  function switchWorkspace(email, name) {
    const ws = loadWorkspace(email);
    const session = { email, name: name || email.split('@')[0] };
    writeJSON(LS_SESSION, session);
    setAuth(session);
    authRef.current = session;
    setUsers(ws.users);
    setInvitations(ws.invitations);
    setActivity(ws.activity);
    setObOrg(ws.org);
    setObInvites(0);
    setActivePage('dashboard');
    setSidebarOpen(false);
    setInviteOpen(false);
    setToasts([]);
    return ws.onboarded;
  }

  // ── Auth handlers ──────────────────────────────────────────
  function handleSignIn({ email }) {
    const onboarded = switchWorkspace(email);
    setScreen(onboarded ? 'portal' : 'ob-org');
  }

  function handleAccountCreated({ name, email }) {
    // Seed an EMPTY workspace for this new account (don't inherit demo data)
    // Only write the scoped keys if they don't already exist
    const usersKey = wsKey(email, 'users');
    const invsKey  = wsKey(email, 'invitations');
    const actKey   = wsKey(email, 'activity');
    if (!localStorage.getItem(usersKey))       writeJSON(usersKey, []);
    if (!localStorage.getItem(invsKey))        writeJSON(invsKey,  []);
    if (!localStorage.getItem(actKey))         writeJSON(actKey,   []);
    switchWorkspace(email, name);
    setScreen('ob-org');
  }

  // ── Logout ─────────────────────────────────────────────────
  function handleLogoutConfirm() {
    // Only clear the session pointer – workspace data is preserved under scoped keys
    localStorage.removeItem(LS_SESSION);
    setAuth(null);
    authRef.current = null;
    setLogoutConfirm(false);
    // Reset UI state (not workspace data)
    setUsers([]);
    setInvitations([]);
    setActivity([]);
    setObOrg({});
    setToasts([]);
    setScreen('signin');
  }

  // ── Onboarding handlers ────────────────────────────────────
  function handleObOrgNext(data) {
    const org = { ...obOrg, ...data };
    if (auth?.email) writeJSON(wsKey(auth.email, 'org'), org);
    setObOrg(org);
    setScreen('ob-teammates');
  }

  function handleObTeammatesNext(rows) {
    const filled = rows.filter(r => r.email.trim());
    if (filled.length) {
      const newInvites = filled.map(r => ({
        id:          uid('inv'),
        name:        r.email.split('@')[0],
        email:       r.email.trim(),
        role:        r.role,
        status:      'Pending',
        invitedBy:   auth?.name || auth?.email || 'Admin',
        invitedAt:   new Date().toISOString(),
        emailStatus: 'sent',
        sample:      false,
        color:       nextColor(),
        initials:    makeInitials(r.email.split('@')[0]),
      }));
      setInvitations(newInvites); // starts from empty for new accounts
      setObInvites(filled.length);
    } else {
      setObInvites(0);
    }
    setScreen('ob-finish');
  }

  function handleObSkipTeammates() {
    setObInvites(0);
    setScreen('ob-finish');
  }

  function handleObFinish() {
    if (auth?.email) {
      localStorage.setItem(wsKey(auth.email, 'onboarded'), 'true');
    }
    setActivePage('dashboard');
    setScreen('portal');
  }

  // ── Invite (portal) ────────────────────────────────────────
  async function handleInvite({ name, email, role }) {
    const duplicate = invitations.find(
      inv => inv.email.toLowerCase() === email.trim().toLowerCase()
          && inv.status === 'Pending'
    );
    if (duplicate) {
      addToast({ type: 'error', message: `A pending invitation for ${email} already exists.` });
      return { ok: false, message: `A pending invitation for ${email} already exists.` };
    }

    const inv = {
      id:          uid('inv'),
      name:        name.trim(),
      email:       email.trim(),
      role,
      status:      'Pending',
      invitedBy:   auth?.name || 'Admin',
      invitedAt:   new Date().toISOString(),
      emailStatus: 'sent',
      sample:      false,
      color:       nextColor(),
      initials:    makeInitials(name.trim()),
    };
    setInvitations(prev => [inv, ...prev]);

    logActivity({
      type:   'invite',
      action: 'invited',
      target: inv.name,
      detail: `as ${role} — simulated (no email sent)`,
    });

    addToast({ type: 'success', message: `Invitation sent to ${email} (simulated).` });
    return { ok: true, message: 'Mock invitation created' };
  }

  // ── Resend invitation ──────────────────────────────────────
  function handleResendInvite(invId) {
    const inv = invitations.find(i => i.id === invId);
    if (!inv) return;
    setInvitations(prev =>
      prev.map(i => i.id === invId ? { ...i, emailStatus: 'sent' } : i)
    );
    logActivity({
      type:   'resend',
      action: 'resent invite',
      target: inv.name,
      detail: `to ${inv.email} — simulated`,
    });
    addToast({ type: 'success', message: `Invitation resent to ${inv.email} (simulated).` });
  }

  // ── Cancel invitation ──────────────────────────────────────
  function handleCancelInvite(invId) {
    const inv = invitations.find(i => i.id === invId);
    if (!inv) return;
    setInvitations(prev =>
      prev.map(i => i.id === invId ? { ...i, status: 'Cancelled' } : i)
    );
    logActivity({
      type:   'cancel',
      action: 'cancelled invite',
      target: inv.name,
      detail: `(${inv.email})`,
    });
    addToast({ type: 'success', message: `Invitation for ${inv.email} cancelled.` });
  }

  // ── Change role ────────────────────────────────────────────
  function handleRoleChange(userId, newRole) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const oldRole = user.role;
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    logActivity({
      type:   'role',
      action: 'changed role',
      target: user.name,
      detail: `from ${oldRole} to ${newRole}`,
    });
    addToast({ type: 'success', message: `${user.name}'s role updated to ${newRole}.` });
  }

  // ── Page renderer ──────────────────────────────────────────
  function renderPortalPage() {
    const openInvite = { onInvite: () => setInviteOpen(true) };
    switch (activePage) {
      case 'users':
        return (
          <UsersPage
            users={users}
            onRoleChange={handleRoleChange}
            onToast={addToast}
            {...openInvite}
          />
        );
      case 'invitations':
        return (
          <InvitationsPage
            invitations={invitations}
            onResend={handleResendInvite}
            onCancel={handleCancelInvite}
            onToast={addToast}
            {...openInvite}
          />
        );
      case 'roles':
        return <RolesPage />;
      case 'activity':
        return <ActivityLogPage activity={activity} />;
      default:
        return (
          <Dashboard
            users={users}
            invitations={invitations}
            activity={activity}
            {...openInvite}
          />
        );
    }
  }

  // ── Screen router ──────────────────────────────────────────
  if (screen === 'signin') {
    return (
      <SignIn
        onSignIn={handleSignIn}
        onCreateAccount={() => setScreen('create-account')}
        demoEmail={DEMO_EMAIL}
      />
    );
  }

  if (screen === 'create-account') {
    return (
      <CreateAccount
        onAccountCreated={handleAccountCreated}
        onSignIn={() => setScreen('signin')}
      />
    );
  }

  if (screen === 'ob-org') {
    return <StepOrganisation onNext={handleObOrgNext} defaultValues={obOrg} />;
  }

  if (screen === 'ob-teammates') {
    return <StepTeammates onNext={handleObTeammatesNext} onSkip={handleObSkipTeammates} />;
  }

  if (screen === 'ob-finish') {
    return (
      <StepFinish
        orgName={obOrg.orgName}
        inviteCount={obInvites}
        onGoToDashboard={handleObFinish}
      />
    );
  }

  // ── Portal ─────────────────────────────────────────────────
  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={page => { setActivePage(page); setSidebarOpen(false); }}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(p => !p)}
        onLogout={() => setLogoutConfirm(true)}
        currentUser={auth}
      />

      {/* Right-side column */}
      <div className="page-column">
        {/* Mobile top bar */}
        <div className="mobile-header" role="banner">
          <button
            className="hamburger"
            onClick={() => setSidebarOpen(p => !p)}
            aria-label="Toggle navigation menu"
            aria-expanded={sidebarOpen}
            id="hamburger-btn"
          >
            <IconMenu size={22} />
          </button>
          <span className="mobile-header-title">Ampcus Cyber</span>
        </div>

        {/* Page content */}
        {renderPortalPage()}
      </div>

      {/* Invite modal */}
      {inviteOpen && (
        <InviteModal
          invitations={invitations}
          onClose={() => setInviteOpen(false)}
          onInvite={handleInvite}
        />
      )}

      {/* Logout confirmation */}
      {logoutConfirm && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="logout-dialog-title">
          <div className="modal logout-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title" id="logout-dialog-title">Log out?</h2>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--neutral-600)', lineHeight: '1.6' }}>
                You'll be returned to the sign-in screen. Your workspace data is saved and will be restored when you sign back in.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setLogoutConfirm(false)} id="logout-cancel">
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleLogoutConfirm} id="logout-confirm">
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
