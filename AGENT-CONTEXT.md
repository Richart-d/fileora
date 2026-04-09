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
- [x] T-23: Wire PDF Preview and Download
- [x] T-24: Add AI Assist Button
- [x] T-25: Add Nigerian Pro and Creative Minimal CV Templates
- [x] T-26: Build Reusable File Upload Component
- [x] T-27: PDF Converter — Convert TO PDF
- [x] T-28: PDF Converter — Convert FROM PDF
- [x] T-29: PDF Merge Tool
- [x] T-30: PDF Split Tool
- [x] T-31: PDF Compress Tool
- [x] T-32: PDF Remove Pages Tool

## Tech Stack Addendum
| Toast Notifications | sonner | replaces shadcn/ui toast |
| Authentication | Clerk  | Keyless Mode, App Router |

## Current Status
✅ T-24: Add AI Assist Button [COMPLETED]
✅ T-25: Add Remaining CV Templates (Nigerian Pro, Creative Minimal) [COMPLETED]
✅ T-26: Build Reusable File Upload Component [COMPLETED]
✅ T-27: PDF Converter — Convert TO PDF [COMPLETED]
✅ T-28: PDF Converter — Convert FROM PDF [COMPLETED]
✅ T-29: PDF Merge Tool [COMPLETED]
✅ T-30: PDF Split Tool [COMPLETED]
✅ T-31: PDF Compress Tool [COMPLETED]
✅ T-32: PDF Remove Pages Tool [COMPLETED]
Phase 5 is complete. Proceed to Phase 6 or next steps.

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
- Executed Task T-23: Wired the PDF Preview into `/cv-builder/[id]` right panel using dynamic import, `@react-pdf/renderer` PDFViewer, and configured PDFDownloadLink with customized filename.
- Executed Task T-24: Added an [AI Assist ✨] button to `WorkExperienceTab.tsx` bullet points. Created API route `/api/ai/improve-bullets` using `openai` and `gpt-4o-mini` to intelligently rewrite and quantify bullets. Installed `openai` dependency.
- Executed Task T-25: Created `nigerian-pro.tsx` and `creative-minimal.tsx` templates in `src/lib/cv-templates`. Integrated both new templates in `CVPreview.tsx` ensuring their compatibility with `ResumeData`. Validated correct styling per brand guidelines.
- Executed Task T-26 (Phase 5): Created `FileUploadZone.tsx` in `src/components/pdf/`. Features native drag-and-drop file upload, file format and size validation based on dynamic props, and a UI matching the specified Teal/Navy styling with Lucide icons.
- Executed Task T-27: Created `/api/pdf/convert-to` API route using mammoth (DOCX), SheetJS (XLSX), and pdf-lib (images, text rendering). Built `/pdf/convert` page with Convert TO PDF tab, FileUploadZone integration, progress bar, and download flow. Convert FROM PDF tab stubbed as disabled.
- Executed Task T-28: Created `/api/pdf/convert-from` API route using pdf-parse (text extraction) and docx package (Word generation). Supports PDF→HTML, PDF→DOCX, and PDF→JPG/PNG (client-side canvas rendering). Installed `docx` package. Enabled the FROM PDF tab with output format selector and formatting-not-preserved warning.
- Executed Task T-29: Built the PDF Merge tool (/api/pdf/merge and /pdf/merge). Implemented native HTML5 drag-and-drop array reordering for optimal UI list sortability without extra dependencies. Used pdf-lib `copyPages` for robust merging up to 10 files. Modified FileUploadZone to support list hiding logic (`hideFileList` prop).
- Executed Task T-30: Built PDF Split Tool (`/api/pdf/split` and `/pdf/split`). API parses string input (e.g. '1-3,5,7-9'), validates 0-indexed bounds using pdf-lib, and creates a clean sub-document containing only matching pages. UI provides a visual guide for the page format and extracts to a unified download blob.
- Executed Task T-31 (Compress Tool): Built PDF Compress Tool (`/api/pdf/compress` and `/pdf/compress`). API uses `pdf-lib` configuration optimizations across three tiers (Standard, Recommended, Maximum Check). Clears unused metadata, flattens form streams, handles object streams dynamically, and purges orphaned objects by rewriting document trees securely. UI provides comparative UI (Original Bytes vs Compiled Bytes) to visualize direct optimization savings properly.
- Executed Task T-32 (Remove Pages Tool): Built `/api/pdf/remove-pages` receiving array mapping to wipe specified components. Created visual interface bounding `react-pdf` with intuitive interactive page grids. Allowed individual selection states with Select-All handling, preventing complete destruction (removing 100% of pages), rendering PDF securely before committing to modification.
