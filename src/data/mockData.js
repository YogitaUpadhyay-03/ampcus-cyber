// ============================================================
//  Mock Data – Ampcus Cyber Customer Admin Portal
// ============================================================
import { makeInitials } from '../utils.js';

export const CURRENT_USER = {
  id: 'u0',
  name: 'Alex Morgan',
  email: 'alex.morgan@ampcuscyber.com',
  role: 'Admin',
  initials: 'AM',
  color: '#6c63ff',
};

export const AVATAR_COLORS = [
  '#6c63ff','#3b82f6','#10b981','#f59e0b',
  '#ef4444','#8b5cf6','#06b6d4','#ec4899',
  '#14b8a6','#f97316','#84cc16','#6366f1',
];

export const INITIAL_USERS = [
  { id:'u1',  name:'Priya Sharma',     email:'priya.sharma@example.com',    role:'Viewer',  status:'Active',    lastActivity:'2 hours ago',    color:'#6c63ff' },
  { id:'u2',  name:'Daniel Okafor',    email:'daniel.okafor@example.com',   role:'Admin',   status:'Active',    lastActivity:'12 minutes ago', color:'#3b82f6' },
  { id:'u3',  name:'Mei Lin Chen',     email:'mei.chen@example.com',        role:'Manager', status:'Active',    lastActivity:'Yesterday',      color:'#10b981' },
  { id:'u5',  name:'Aisha Rahman',     email:'aisha.rahman@example.com',    role:'Manager', status:'Active',    lastActivity:'3 days ago',     color:'#8b5cf6' },
  { id:'u6',  name:'Lucas Meyer',      email:'lucas.meyer@example.com',     role:'Viewer',  status:'Suspended', lastActivity:'3 weeks ago',    color:'#6c63ff' },
  { id:'u7',  name:'Sofia Rossi',      email:'sofia.rossi@example.com',     role:'Admin',   status:'Active',    lastActivity:'1 hour ago',     color:'#ec4899' },
  { id:'u8',  name:'Tom Becker',       email:'tom.becker@example.com',      role:'Viewer',  status:'Active',    lastActivity:'5 days ago',     color:'#14b8a6' },
  { id:'u10', name:"James O'Connor",   email:'james.oconnor@example.com',   role:'Viewer',  status:'Active',    lastActivity:'Today, 09:14',   color:'#f97316' },
  { id:'u11', name:'Fatima Al-Rashid', email:'fatima.alrashid@example.com', role:'Manager', status:'Active',    lastActivity:'4 hours ago',    color:'#06b6d4' },
  { id:'u12', name:'Raj Patel',        email:'raj.patel@example.com',       role:'Viewer',  status:'Active',    lastActivity:'2 days ago',     color:'#84cc16' },
  { id:'u14', name:'Marcus Johnson',   email:'marcus.j@example.com',        role:'Admin',   status:'Active',    lastActivity:'30 minutes ago', color:'#3b82f6' },
  { id:'u15', name:'Yuki Tanaka',      email:'yuki.tanaka@example.com',     role:'Viewer',  status:'Active',    lastActivity:'1 week ago',     color:'#10b981' },
].map(u => ({ ...u, initials: makeInitials(u.name) }));

// Pending invitations are separate from the users array
export const INITIAL_INVITATIONS = [
  {
    id: 'inv1',
    name: 'Carlos Mendes',
    email: 'carlos.mendes@example.com',
    role: 'Viewer',
    status: 'Pending',
    invitedBy: 'Mei Lin Chen',
    invitedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    sample: true,
  },
  {
    id: 'inv2',
    name: 'Nina Kowalski',
    email: 'nina.kowalski@example.com',
    role: 'Manager',
    status: 'Pending',
    invitedBy: 'Daniel Okafor',
    invitedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    sample: true,
  },
  {
    id: 'inv3',
    name: 'Elena Volkov',
    email: 'elena.volkov@example.com',
    role: 'Viewer',
    status: 'Pending',
    invitedBy: 'Alex Morgan',
    invitedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    sample: true,
  },
];

export const INITIAL_ACTIVITY = [
  { id:'a1', type:'invite',  actor:'Daniel Okafor', action:'invited',       target:'Nina Kowalski',  detail:'as Manager',               ts: new Date(Date.now() - 12*60*1000).toISOString(),           sample: true },
  { id:'a2', type:'role',    actor:'Alex Morgan',   action:'changed role',  target:'Priya Sharma',   detail:'from Viewer to Manager',   ts: new Date(Date.now() - 60*60*1000).toISOString(),           sample: true },
  { id:'a3', type:'suspend', actor:'Sofia Rossi',   action:'suspended',     target:'Lucas Meyer',    detail:'',                         ts: new Date(Date.now() - 3*60*60*1000).toISOString(),         sample: true },
  { id:'a4', type:'resend',  actor:'Mei Lin Chen',  action:'resent invite', target:'Carlos Mendes',  detail:'',                         ts: new Date(Date.now() - 24*60*60*1000).toISOString(),        sample: true },
  { id:'a5', type:'role',    actor:'Daniel Okafor', action:'changed role',  target:'Tom Becker',     detail:'from Manager to Viewer',   ts: new Date(Date.now() - 2*24*60*60*1000).toISOString(),      sample: true },
  { id:'a6', type:'join',    actor:'Aisha Rahman',  action:'joined',        target:'',               detail:'accepted invitation, joined as Manager', ts: new Date(Date.now() - 3*24*60*60*1000).toISOString(), sample: true },
];

export const ROLES = [
  {
    value: 'Admin',
    label: 'Admin',
    desc: 'Full access: manage users, change any role, invite anyone.',
    permissions: [
      { label: 'View dashboard',      allowed: true  },
      { label: 'View user list',      allowed: true  },
      { label: 'Invite users',        allowed: true  },
      { label: 'Change Viewer roles', allowed: true  },
      { label: 'Change any role',     allowed: true  },
      { label: 'Manage users',        allowed: true  },
    ],
  },
  {
    value: 'Manager',
    label: 'Manager',
    desc: 'Invite users and change Viewer roles. Cannot edit Admins.',
    permissions: [
      { label: 'View dashboard',      allowed: true  },
      { label: 'View user list',      allowed: true  },
      { label: 'Invite users',        allowed: true  },
      { label: 'Change Viewer roles', allowed: true  },
      { label: 'Change any role',     allowed: false },
      { label: 'Manage users',        allowed: false },
    ],
  },
  {
    value: 'Viewer',
    label: 'Viewer',
    desc: 'Read-only: view the dashboard and user list.',
    permissions: [
      { label: 'View dashboard',      allowed: true  },
      { label: 'View user list',      allowed: true  },
      { label: 'Invite users',        allowed: false },
      { label: 'Change Viewer roles', allowed: false },
      { label: 'Change any role',     allowed: false },
      { label: 'Manage users',        allowed: false },
    ],
  },
];

export const PAGE_SIZE = 10;

// ── localStorage helpers ─────────────────────────────────────
const LS_KEY_USERS    = 'ampcus_users';
const LS_KEY_INVITES  = 'ampcus_invitations';
const LS_KEY_ACTIVITY = 'ampcus_activity';

export const LS = {
  USERS:    LS_KEY_USERS,
  INVITES:  LS_KEY_INVITES,
  ACTIVITY: LS_KEY_ACTIVITY,
};

/**
 * Load state from localStorage.
 * Returns `fallback` when:
 *  - key is absent
 *  - JSON is malformed
 *  - stored value is not an array (guards against corrupted data)
 */
export function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    // Ensure we always get an array; reject any other shape silently
    if (!Array.isArray(parsed)) {
      console.warn(`[loadState] "${key}" contained non-array data – using fallback.`);
      return fallback;
    }
    return parsed;
  } catch (err) {
    console.warn(`[loadState] Could not parse "${key}":`, err.message);
    return fallback;
  }
}

export function saveState(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // Ignore quota errors etc.
    console.warn(`[saveState] Could not save "${key}":`, err.message);
  }
}
