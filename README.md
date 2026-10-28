# Ampcus Cyber — Customer Administration Portal

A modern, responsive Customer Administration Portal designed and developed as part of a **UI/UX Design and Frontend Development practical assessment**.

The application demonstrates how administrators can manage team members, invite colleagues, review roles and access, and monitor administrative activity through a clean enterprise-style interface.

## Project Links

| Deliverable | Link |
|---|---|
| Live Demo | [Ampcus Cyber Portal](https://ampcus-cyber.vercel.app/) |
| Figma Design File | [View Design in Figma](https://www.figma.com/design/lgiAAaSTFYltmMqkx2pmj5/ampcus-cyber?node-id=0-1&t=BqUBPvlckqZLb6Kp-1) |
| Interactive Prototype | [Explore the Figma Prototype](https://www.figma.com/proto/lgiAAaSTFYltmMqkx2pmj5/ampcus-cyber?node-id=1-312&p=f&viewport=237%2C169%2C0.05&t=252CyHaisnDvtPAB-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1) |

*Note: The Figma links require appropriate sharing permissions to be enabled.*

---

## Overview

The Ampcus Cyber Customer Administration Portal focuses on usability, clarity, and efficient administrative workflows.

The project includes a high-fidelity UI design, a clickable prototype, and a React-based frontend implementation. It uses mock data and browser local storage to demonstrate application behavior without requiring a backend or database.

### Project Goals

- Create a professional enterprise administration experience.
- Make user management and invitation workflows straightforward.
- Present role information and access-related details clearly.
- Provide meaningful feedback for user actions, validation errors, and empty states.
- Build a responsive frontend that can be demonstrated independently.
- Maintain consistency between the design, prototype, and implementation.

## Technology Stack

- **Frontend:** React 19
- **Build Tool:** Vite
- **Styling:** CSS
- **Data:** Mock data and browser `localStorage`
- **Design:** Figma
- **Development Assistance:** Antigravity AI coding assistant
- **Deployment:** Vercel

The application does not require a backend, database, or paid API service for its current demonstration.

## Features

### 1. Dashboard

- Summary cards for user and invitation statistics.
- Recent administrative activity.
- Quick access to key administration pages.
- Overview of the current workspace.

### 2. User Management

- View team members in a structured table.
- Search users by name or email.
- Filter users by role and status.
- Navigate through paginated user records.
- View user roles, account status, and last activity.
- Display appropriate empty states when no users match the filters.

### 3. Invitations

- Invite a colleague using their name, email address, and role.
- Validate required fields and email format.
- Detect duplicate pending invitations.
- Display pending invitations separately from existing users.
- Resend or cancel invitations in the simulated interface.
- Show feedback for successful actions and validation errors.

**Important:** Invitation delivery is simulated. No real email is sent.

### 4. Roles & Access

- View available roles: Admin, Manager, and Viewer.
- Understand the intended responsibilities of each role.
- Review role descriptions and permission information.
- Change a user's role through the available interface.
- Confirm role changes where supported by the implementation.

The permission information is demonstrative and does not constitute real server-side access control.

### 5. Activity Log

- View administrative activity records.
- Review actions such as invitations and role changes.
- Filter activity records where supported.
- Distinguish sample activity from actions performed during the demonstration.

### 6. Authentication

- Sign-in screen with a preconfigured demo account.
- Create-account flow for new simulated accounts.
- Password validation and sign-up feedback where implemented.
- Logout confirmation.
- Session handling through browser local storage.

Authentication is simulated on the frontend. It is not secure production authentication.

### 7. Three-Step Onboarding

New simulated accounts can go through a three-step onboarding flow:

1. **Organisation:** Enter organization details.
2. **Teammates:** Add teammate details if needed; this step is optional.
3. **Finish:** Complete the setup and continue to the dashboard.

The onboarding flow is intended to make the initial workspace setup clear and straightforward.

### 8. Workspace Data Separation

- The demo account displays preloaded sample data.
- Newly registered accounts are intended to start with a separate, clean workspace.
- Workspace records can be persisted in local storage.
- Returning to an account restores its saved browser-local data, subject to the current implementation.

This is a frontend demonstration. Data is stored in the current browser and is not shared across devices or users.

### 9. Responsive Interface

The layout is designed to adapt to different screen sizes, including desktop, laptop, tablet, and mobile.

Responsive behavior includes adaptive dashboard cards, a mobile navigation drawer where implemented, and adjustments to tables and page layouts.

## Demo Account

Use the following credentials if they match the current deployed demo configuration.

| Field | Value |
|---|---|
| Email | `alex.morgan@example.com` |
| Password | `password123` |

The demo account is intended to display preloaded sample data, including team members, pending invitations, and activity records.

If the credentials do not work on the live deployment, verify the current sign-in implementation before presenting the project.

## Getting Started

### Prerequisites

- Node.js 20.19 or newer
- npm
- Git

### Run Locally

Clone the repository:

```bash
git clone https://github.com/YogitaUpadhyay-03/ampcus-cyber.git
```

Navigate to the project directory:

```bash
cd ampcus-cyber
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

### Available Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Generate the production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run the configured linter, if available |

## Build for Production

Run:

```bash
npm run build
```

Vite generates the production files in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## Deployment

The project is intended to be deployed to Vercel as a Vite + React frontend.

Typical deployment settings:

| Setting | Value |
|---|---|
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

The project does not require environment variables for its mock-data demonstration, provided no unused API integration remains in the active codebase.

After deployment, open the live URL and verify sign-in, sign-up, onboarding, navigation, logout, and the main administrative workflows.

## Data and Security Limitations

This project is a frontend assessment demonstration, not a production-ready administration system.

- Authentication is simulated in the browser.
- No real backend or database is connected.
- Invitation emails are not sent.
- Data is stored locally in the browser and is not synchronized between devices.
- Local storage is not a secure storage mechanism for sensitive information.
- Role and permission descriptions do not enforce server-side authorization.
- Password recovery and other backend-dependent workflows may be placeholders.
- Browser data can be cleared, and local data may be lost.
- No claim of production security or real multi-user access control is made.

A production implementation would require secure authentication, server-side authorization, a persistent database, validated APIs, and a real invitation-delivery workflow.

## Design Deliverables

The Figma design file and prototype include the visual direction and interaction flows for the administration portal.

The design work focuses on:

- Information hierarchy and navigation.
- Reusable interface components.
- Dashboard and user-management layouts.
- Invitation and role-management workflows.
- Sign-in, sign-up, and three-step onboarding.
- Clear feedback, validation, and empty states.
- Consistent typography, spacing, and visual styling.

See the [Figma Design File](https://www.figma.com/design/lgiAAaSTFYltmMqkx2pmj5/ampcus-cyber?node-id=0-1&t=BqUBPvlckqZLb6Kp-1) and [Interactive Prototype](https://www.figma.com/proto/lgiAAaSTFYltmMqkx2pmj5/ampcus-cyber?node-id=1-312&p=f&viewport=237%2C169%2C0.05&t=252CyHaisnDvtPAB-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1).

## AI Tools and Contribution

AI-assisted development tools were used during the project.

- **Figma design and prototype:** Created with assistance from Claude and reviewed as part of the design workflow.
- **Frontend development:** Developed with assistance from Antigravity.
- **Project review:** The implementation and documentation should be reviewed and verified before final submission.

The final implementation should be understood and reviewed by the project author, who should be prepared to explain the design decisions, frontend behavior, data handling, and known limitations.

## Future Improvements

Potential future enhancements include:

- Secure authentication and account recovery.
- Backend APIs and persistent database storage.
- Real invitation emails with expiring invitation links.
- Server-side role-based access control.
- Suspend and reactivate user workflows.
- Automated unit and end-to-end tests.
- Improved modal focus management and accessibility testing.
- Shared workspace data across devices.
- Expanded audit logging and administrative controls.

These are future enhancements and are not claimed as implemented features.

## License

Created for educational and assessment purposes.

---

**Project:** Ampcus Cyber — Customer Administration Portal  
**Live Demo:** [ampcus-cyber.vercel.app](https://ampcus-cyber.vercel.app/)  
**Design:** [Figma](https://www.figma.com/design/lgiAAaSTFYltmMqkx2pmj5/ampcus-cyber?node-id=0-1&t=BqUBPvlckqZLb6Kp-1)  
**Prototype:** [Open Prototype](https://www.figma.com/proto/lgiAAaSTFYltmMqkx2pmj5/ampcus-cyber?node-id=1-312&p=f&viewport=237%2C169%2C0.05&t=252CyHaisnDvtPAB-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1)
