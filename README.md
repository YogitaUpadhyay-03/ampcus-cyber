# Ampcus Cyber – Customer Administration Portal

A complete React/Vite frontend with real email invitation delivery via [Resend](https://resend.com),
deployed as a full-stack application on [Vercel](https://vercel.com).

---

## Quick start (local, no real email)

```bash
npm install
npm run dev          # Vite dev server at http://localhost:5173
```

The UI works fully in this mode. Invitation emails will **fail gracefully** 
(the invitation is saved in state, email status shows "Failed") because there 
is no `/api` server running. This is expected and clearly shown in the UI.

---

## Local development with real email

You need the **Vercel CLI** to run the serverless API functions locally.

### 1. Install Vercel CLI (once)

```bash
npm install -g vercel
vercel login
```

### 2. Set up environment variables

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and fill in your real values:

```env
RESEND_API_KEY=re_YourRealKeyHere
RESEND_FROM_EMAIL=onboarding@resend.dev
APP_URL=http://localhost:3000
```

> **NEVER commit `.env` to Git.** It is already listed in `.gitignore`.

### 3. Start the full dev environment

```bash
vercel dev
```

`vercel dev` starts **both** the Vite frontend and the Node.js serverless functions
on port `3000`. The Vite proxy (`vite.config.js`) forwards `/api/*` requests there.

> If `vercel dev` prompts you to link a project, choose "No" or link to your Vercel project.

### 4. Test an invitation email

1. Open http://localhost:3000
2. Click **Invite user**, fill in your own email address, select a role, and click Send.
3. The invitation appears in the **Invitations** page with status **Accepted**.
4. Check your inbox. The email is sent via Resend.

> **Important:** With a free Resend account and the sandbox sender
> (`onboarding@resend.dev`), you can only send to your own verified email address
> until you verify a domain. See [Resend docs → Domain verification](https://resend.com/docs/dashboard/domains/introduction).

---

## Resend account setup

1. Sign up at https://resend.com
2. Go to **API Keys** → **Create API Key** → copy the key.
3. Add the key to your `.env` as `RESEND_API_KEY`.
4. The sandbox sender `onboarding@resend.dev` works for testing without domain verification.
5. To send to any recipient, go to **Domains** → **Add Domain** → verify DNS records for your domain.
6. Once your domain is verified, set `RESEND_FROM_EMAIL=noreply@yourdomain.com`.

> ⚠️ **Regenerate your API key** if you ever accidentally expose it in a public location
> (e.g., a chat message, a public Git commit, a screenshot). Do this in the Resend dashboard
> under **API Keys → Revoke → Create new**.

---

## Deployment to Vercel

### First deployment

```bash
vercel --prod
```

Vercel will detect the project, run `npm run build`, deploy `dist/` as the frontend,
and deploy `api/send-invitation.js` as a serverless function.

### Set environment variables on Vercel

**Method 1 – Vercel dashboard (recommended):**

1. Open your project on https://vercel.com
2. Go to **Settings → Environment Variables**
3. Add each of the following:

| Variable | Value |
|----------|-------|
| `RESEND_API_KEY` | Your Resend API key (starts with `re_`) |
| `RESEND_FROM_EMAIL` | `onboarding@resend.dev` (or your verified domain sender) |
| `APP_URL` | `https://your-project.vercel.app` |

4. Set them for **Production**, **Preview**, and **Development** environments as appropriate.
5. Redeploy: Vercel dashboard → **Deployments** → **Redeploy** (or push a new commit).

**Method 2 – Vercel CLI:**

```bash
vercel env add RESEND_API_KEY
vercel env add RESEND_FROM_EMAIL
vercel env add APP_URL
vercel --prod
```

### Subsequent deployments

```bash
vercel --prod
# or simply push to your connected Git branch
```

---

## Project structure

```
├── api/
│   └── send-invitation.js   # Vercel serverless function (server-side only)
├── src/
│   ├── utils.js             # fmtTime, makeInitials
│   ├── data/mockData.js     # Initial users, invitations, roles, localStorage helpers
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── UsersPage.jsx
│   │   ├── InvitationsPage.jsx  ← shows email delivery status
│   │   ├── RolesPage.jsx
│   │   ├── ActivityLogPage.jsx
│   │   ├── InviteModal.jsx      ← calls /api/send-invitation
│   │   ├── ChangeRoleModal.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Toast.jsx
│   │   └── Icons.jsx
│   ├── App.jsx              ← shared state, routing, API call handlers
│   ├── main.jsx
│   └── index.css
├── .env.example             ← copy to .env and fill in values
├── .gitignore               ← .env is excluded
├── vercel.json              ← Vercel build + function config
├── vite.config.js           ← Vite + /api proxy for local dev
└── package.json
```

---

## How the email flow works

```
Browser                     Vite/Vercel               Resend API
   │                            │                          │
   │── POST /api/send-invitation ──►                        │
   │   { name, email, role,     │                          │
   │     invitedBy }            │                          │
   │                       reads RESEND_API_KEY            │
   │                       from process.env                │
   │                            │── resend.emails.send() ──►│
   │                            │◄── { id } or { error } ──│
   │◄── { ok, emailId } or ─────│                          │
   │    { error: "..." }        │                          │
   │                            │                          │
```

- The API key is **never** sent to the browser.
- `emailStatus` on each invitation reflects whether Resend accepted the request:
  - `sending` — API call in progress
  - `sent` — Resend accepted the send request (not a delivery confirmation)
  - `failed` — Resend returned an error (shown in UI and toast)
- Actual delivery (inbox placement, bounce, spam) is handled asynchronously by Resend.
  This app does **not** claim an email was delivered, only that it was accepted.

---

## Invitation acceptance flow — why there are no acceptance links

A functional invitation acceptance link (`/accept?token=xxx`) requires:

1. A **persistent database** to store `(token → invitation)` mappings.
2. A **server-side route** to validate the token and mark the invitation as accepted.
3. **Session management** or an authentication system for the accepting user.

This project uses `localStorage` only — there is no database or auth system. Adding
fake acceptance links that don't actually work would be misleading and is intentionally
omitted. The email instead instructs the recipient to contact their administrator.

To implement a real acceptance flow, add:
- A database (e.g. Vercel Postgres, PlanetScale, Supabase)
- A `api/accept-invitation.js` function that validates the token
- An `/accept` page in the React app

---

## Known limitations

| Area | Notes |
|------|-------|
| Email delivery guarantee | Resend accepting the request ≠ inbox delivery. Bounces happen asynchronously. |
| Sender address | Free accounts can only send to your own verified email unless a domain is verified. |
| Invitation acceptance | No self-service acceptance flow — requires a database. |
| Suspend/unsuspend action | Lucas Meyer is seeded as Suspended; the UI action is not implemented. |
| Authentication | Alex Morgan is a simulated session; no real login/logout. |
| Multi-user state | All state is in `localStorage` — changes are per-browser, not shared across users. |

---

## Commands reference

| Command | What it does |
|---------|-------------|
| `npm run dev` | Vite dev server only (no API) |
| `vercel dev` | Full dev: Vite frontend + serverless functions |
| `npm run build` | Production build to `dist/` |
| `vercel --prod` | Deploy to Vercel production |

---

## AI disclosure

Built with **Antigravity (Google DeepMind AI assistant)**.
Human operator provided: design screenshots, assessment brief, Resend account, review.
All code was executed and tested in a live development environment.
