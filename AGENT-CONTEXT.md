# ⚙ Agent Standing Orders

- Read this entire file before taking any action in this session
- Execute only the task you are explicitly told to execute
- Do NOT move to the next task without the user saying "approved" or "go ahead"
- After completing each task: mark it ✅ Done, update Current Status, add a Session Note
- Commit this file together with the task code in the same Git commit
- If you hit a blocker or error, stop and report clearly — do not attempt silent workarounds
- Never install packages without asking first
- Never expose secrets or API keys in code

## Tasks
- [x] T-01: Create GitHub Repository
- [x] T-02: Next.js 14 Setup
- [x] T-03: Install Core Dependencies
- [x] T-04: Setup shadcn/ui
- [x] T-05: Configure Clerk Authentication
- [x] T-06: Finalized Clerk authentication: added redirection variables to .env.local, updated middleware to include webhooks, and refactored layout to use standard Clerk components.
- [x] T-07: Created dedicated Sign-in and Sign-up pages with clean white background, centered Fileora logo, using Clerk auth components.

## Tech Stack Addendum
| Toast Notifications | sonner | replaces shadcn/ui toast |
| Authentication | Clerk  | Keyless Mode, App Router |

## Current Status
Executing T-07: Create Auth Pages (Sign-in / Sign-up) [COMPLETED]

## Session Notes
- Session 1 started.
- Initialized local Git repository with `README.md` and `.gitignore` for Node.js.
- Renamed GitHub repository from `Fileora` to `fileora` and synced local remote.
- Scaffolded Next.js 14 with Tailwind CSS, TypeScript, ESLint, App Router.
- Verified dev server runs on localhost:3000.
- Installed core dependencies using `--legacy-peer-deps`.
- shadcn/ui init succeeded (Radix + Nova preset). Added 9 essential components.
- Replaced deprecated shadcn/ui toast with `sonner`. Added `<Toaster />` to root `layout.tsx`.
- Updated `layout.tsx` to use Sora + Inter fonts per PRD design guidelines.
- Integrated Clerk Authentication (moved from Keyless Mode to using provided API keys).
- Configured `.env.local` with Clerk Publishable and Secret keys.
- Created `proxy.ts` middleware and added `<ClerkProvider>` and header to root layout.
