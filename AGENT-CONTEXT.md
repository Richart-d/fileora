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
- [x] T-13: Configure Tailwind Theme & Fonts (extended theme with Fileora palette and font variables)
- [x] T-14: Build the Navigation Bar Component (Responsive layout, Center Nav + PDF Tools dropdown, Mobile Sheet)
- [x] T-15: Build the Authenticated App Layout (created `(dashboard)/layout.tsx` with Navbar and main wrapper, removed from root)
- [x] T-16: Build the Landing Page (Hero section, Features with cards and icons, footer, and brand colours)
- [x] T-17: Build the Dashboard Page (Welcome greeting, 3 quick-action cards, Convex resume queries & layout)
- [x] T-18: Create Convex Resume Mutations (createResume, updateResume, getUserResumes, getResume, deleteResume)
- [x] T-19: Build CV Template Selection Page
- [x] T-20: Build CV Editor Split-Screen Layout
- [x] T-21: Build All CV Form Tabs with Auto-Save
- [x] T-22: Build CV PDF Templates (ats-classic, modern-pro)

## Tech Stack Addendum
| Toast Notifications | sonner | replaces shadcn/ui toast |
| Authentication | Clerk  | Keyless Mode, App Router |

## Current Status
✅ T-22: Build CV PDF Templates [COMPLETED]
Next: Wire PDF preview into CV editor & add remaining templates.

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
- Session 2 (Task T-13): Configured `tailwind.config.ts` with brand palette (Navy, Teal, Surface, Text tokens). Verified layout applies font variables to HTML tag.
- Session 2 (Task T-14): Built `Navbar.tsx` incorporating Shadcn/UI DropdownMenu, Sheet, and Lucide icons. Replaced inline layout header with responsive Navbar.
- Session 2 (Task T-15): Created `(dashboard)/layout.tsx` to handle authenticated routing templates. Cleaned `RootLayout` by shifting navbar rendering to the new layout.
- Session 2 (Task T-16): Built `page.tsx` landing page featuring Fileora logo, Hero selection with call-to-actions, features section with Lucide icons/cards, and fully themed footer.
- Session 2 (Task T-17): Built the `/dashboard` authenticated portal mapping quick actions and Convex resume queries. Created `convex/resumes.ts` to power My CVs backend section safely.
- Phase 4 started. Executed Task T-18: Implemented Convex resume mutations (`createResume`, `updateResume`, `getUserResumes`, `getResume`, `deleteResume`). Refactored dashboard to use `getUserResumes`.
- Executed Task T-19: Built the CV Builder template selection page at `/cv-builder` with 4 stylized cards. Included mutation logic to create empty resumes and navigate.
- Executed Task T-20: Created `/cv-builder/[id]` displaying a robust split-screen CV Editor layout. Includes mobile toggling with floating CTA button, query fetching from Convex, and Shadcn/UI integration.
- Executed Task T-21: Built all 6 form tab components (PersonalInfo, WorkExperience, Education, Skills, Certifications, Summary) with 1.5s debounced auto-save via useAutoSave hook. Created shared types in src/types/resume.ts. Added inline title editing and save status indicator.
- Executed Task T-22: Created two @react-pdf/renderer templates in src/lib/cv-templates/. ATS Classic (single-column, B&W, Helvetica) and Modern Professional (navy header band, teal accents, two-column header). Both accept full ResumeData as props.
