


FILEORA
Document Utility Platform
PROJECT BIBLE  —  v2.0  |  FOR ANTIGRAVITY AI AGENT


Sections: PRD  |  App Flow  |  Tech Stack  |  Frontend Guidelines  |  Backend Schema




  SECTION 1 — PRODUCT REQUIREMENTS DOCUMENT  

1. Product Requirements Document


1.1  Product Overview
Fileora is a web-based multi-functional document utility platform. It serves African professionals and job seekers — starting with Nigeria and expanding globally. It solves two core pain points: building a professional, ATS-ready CV without expensive software, and handling PDF/document file operations without paid desktop tools.

1.2  Problem Statement
Nigerian and African job seekers lack affordable, locally-relevant CV building tools that produce ATS-compliant, professionally designed resumes.
PDF conversion (PDF ↔ Word, Excel, PPT, JPG, HTML) typically requires paid tools like Adobe Acrobat or iLovePDF Pro.
PDF editing (merge, split, compress, remove pages) is scattered across multiple tools with file size limits and watermarks.
Users lose work because nothing saves their progress — no account system exists in free tools.

1.3  Product Vision
Fileora will be the go-to document platform for African professionals — a single, clean, fast, and free web app that combines a smart CV builder with a comprehensive document toolkit.

1.4  Core Features
Feature 1 — CV / Resume Builder
Template gallery with 4 options at launch: ATS Classic, Modern Professional, Nigerian Pro, Creative Minimal
Nigerian Pro template includes NYSC status field, WAEC/NECO education format
Step-by-step guided form: Personal Info → Work Experience → Education → Skills → Certifications → Summary
AI-assisted bullet point improvement using OpenAI gpt-4o-mini (triggered manually by user)
Live PDF preview — re-renders in real time as user fills in the form
One-click PDF download
Auto-save every 1.5 seconds to Convex database
All CVs saved to user account for future editing

Feature 2 — PDF Converter
Convert TO PDF: DOCX, XLSX, PPTX, JPG/PNG, HTML → PDF
Convert FROM PDF: PDF → DOCX, PDF → JPG/PNG, PDF → HTML (text extraction)
Drag-and-drop and click-to-browse file upload
Instant download after conversion

Feature 3 — PDF Editor Toolkit
Compress PDF — three quality levels: High / Medium / Low
Merge PDFs — combine multiple files, drag to reorder
Split PDF — by page range or extract individual pages
Remove Pages — visual thumbnail picker to select and remove pages

1.5  Authentication
Accounts required for all features — no anonymous usage
Provider: Clerk (free tier — 10,000 MAU)
Sign up via email/password or Google OAuth
Dashboard shows saved CVs and recent PDF activity

1.6  Non-Functional Requirements
Performance: page load under 3 seconds; file processing under 30 seconds for files up to 10MB
Security: files processed in memory only — never stored permanently on server
Responsiveness: fully functional on desktop and mobile
Free-tier constraint: all services must have a workable free plan
Accessibility: WCAG 2.1 AA basics — contrast ratios, keyboard nav, screen reader labels

1.7  Out of Scope — v1.0
Native mobile app (iOS/Android)
Real-time collaboration or shared documents
Payment / premium tiers (future roadmap)
OCR for scanned PDFs
LinkedIn profile import

  SECTION 2 — APP FLOW & NAVIGATION  

2. App Flow & Navigation


2.1  Site Map
Route
Page
Auth Required
/
Landing Page
No
/sign-in
Sign In (Clerk)
No
/sign-up
Sign Up (Clerk)
No
/dashboard
User Dashboard
Yes
/cv-builder
Template Selection
Yes
/cv-builder/[id]
CV Editor + Preview
Yes
/pdf/convert
PDF Converter
Yes
/pdf/edit
PDF Tools Hub
Yes
/pdf/merge
Merge PDFs
Yes
/pdf/split
Split PDF
Yes
/pdf/compress
Compress PDF
Yes
/pdf/remove-pages
Remove Pages
Yes
/settings
Account Settings
Yes


2.2  Landing Page
Hero: headline, subheading, [Get Started Free] CTA → /sign-up, [See Features] → scroll to features section
Features section: 3 cards — CV Builder, PDF Converter, PDF Editor — with icons and short descriptions
Footer: copyright, About, Privacy Policy, Terms of Service links

2.3  Auth Flow
Sign Up → Clerk form → on success → /dashboard
Sign In → Clerk form → on success → /dashboard
Any protected route visited while logged out → redirect to /sign-in?redirect=[original route]

2.4  Dashboard
Greeting with user first name
3 quick-action cards: Start New CV, Convert PDF, Edit PDF — each links to the relevant route
My CVs section: list of saved CVs with [Edit], [Download PDF], [Delete] actions
Recent Activity: last 5 PDF operations with file name, operation type, and timestamp

2.5  CV Builder Flow
Template Selection Page (/cv-builder)
Grid of 4 template cards with thumbnail, name, and description badge
[Use This Template] → creates resume in Convex → redirects to /cv-builder/[id]

CV Editor (/cv-builder/[id])
Split screen: Left 40% = form tabs | Right 60% = sticky PDF preview
Form tabs: Personal Info | Work Experience | Education | Skills | Certifications | Summary
All fields auto-save to Convex with 1.5s debounce
Right panel re-renders preview on every change (debounced 500ms)
[AI Assist] button on Work Experience bullet fields — calls OpenAI to improve content
[Download PDF] at top right — triggers @react-pdf/renderer PDF download
Mobile: tabs toggle between Form view and Preview view

2.6  PDF Converter Flow
Two tabs: [Convert TO PDF] and [Convert FROM PDF]
Upload zone → configure output format → [Convert] → progress indicator → [Download Result]

2.7  PDF Tools Flow
Hub at /pdf/edit: 4 tool cards (Compress, Merge, Split, Remove Pages)
All tools follow: upload → configure → [Process] → download
Merge: multiple upload + drag to reorder
Split: page range input
Remove Pages: visual thumbnail grid — click to select, [Remove Selected] to process

2.8  Navigation
Top Nav Bar (authenticated)
Left: Fileora logo → /dashboard
Centre: Dashboard | CV Builder | PDF Tools (dropdown: Convert, Merge, Split, Compress, Remove Pages)
Right: Clerk UserButton (avatar dropdown with Settings and Sign Out)
Mobile Nav
Hamburger → slide-out Sheet drawer with all links

  SECTION 3 — TECH STACK & DEPENDENCIES  

3. Tech Stack


3.1  Core
Layer
Technology
Notes
Framework
Next.js 14 — App Router, TypeScript
Strict mode enabled
Language
TypeScript
Never plain JS — always typed
Package Manager
npm
Comes with Node.js
Backend / DB
Convex
Real-time DB + serverless functions
Auth
Clerk
Free tier: 10,000 MAU
Deployment
Vercel
Hobby plan — free
Version Control
Git + GitHub
Private repository
Code Agent
Antigravity AI
Primary development tool


3.2  Frontend
Tool
Purpose
Free?
Tailwind CSS v3
Utility-first styling system
Yes
shadcn/ui
Component library — Tailwind-native
Yes
21st.dev
AI component generation (dev tool only)
Yes
Lucide React
Icon set
Yes
Sora + Inter
Fonts via next/font/google
Yes


⚠ DO NOT install Bootstrap. It conflicts with Tailwind and bloats the CSS bundle. Tailwind + shadcn/ui covers everything Bootstrap does.

3.3  Document Processing Libraries
Library
Purpose
Free?
@react-pdf/renderer
Generate CV PDFs from React components
Yes
pdf-lib
Merge, split, compress, remove pages
Yes
react-pdf
Render PDF preview in browser
Yes
mammoth.js
DOCX → HTML (for DOCX→PDF conversion)
Yes
xlsx (SheetJS)
Read Excel files for XLSX→PDF conversion
Yes
html2canvas + jsPDF
HTML/image → PDF conversion step
Yes
pdf-parse
Extract text from PDFs (FROM PDF flow)
Yes


3.4  AI
Service
Use Case
Notes
OpenAI gpt-4o-mini
CV bullet point improvement (AI Assist button)
Only called on user action — never automatic
21st.dev
UI component generation during development
Dev tool only — not in production


3.5  Environment Variables
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY — Clerk dashboard
CLERK_SECRET_KEY — Clerk dashboard
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_CONVEX_URL — Convex dashboard
CONVEX_DEPLOY_KEY — Convex dashboard
OPENAI_API_KEY — OpenAI dashboard
NEXT_PUBLIC_APP_URL — Your Vercel production URL

  SECTION 4 — FRONTEND DESIGN GUIDELINES  

4. Frontend Design Guidelines


4.1  Design Principles
Clarity over cleverness — every element has an obvious purpose
Mobile-first — design for 390px first, scale up to desktop
Trust signals — professional look builds confidence, especially for job seekers
Speed illusion — skeleton loaders and optimistic updates make the app feel instant

4.2  Colour Palette
Token
Hex Value
Usage
Primary (Navy)
#1E3A5F
Navigation, headings, primary buttons
Accent (Teal)
#0D9488
CTAs, highlights, links, progress indicators
Background
#F8FAFC
Page background
Surface
#FFFFFF
Cards, modals, input backgrounds
Text Primary
#1E293B
All body text
Text Muted
#64748B
Captions, labels, secondary text
Border
#CBD5E1
Card borders, dividers, input borders
Danger
#EF4444
Error states and destructive actions
Success
#22C55E
Success states and completed actions


4.3  Typography
Role
Font
Weights
Headings
Sora (Google Font)
600 and 700 only
Body / UI
Inter (Google Font)
400 and 500
Code / filenames
JetBrains Mono
400 only


Type scale: H1=2.25rem | H2=1.75rem | H3=1.25rem | Body=1rem | Small=0.875rem | Caption=0.75rem

4.4  Spacing System
Base unit: 4px (Tailwind default). Use multiples: 8, 12, 16, 24, 32, 48, 64px
Page container max-width: 1200px — centred, horizontal padding: 16px (mobile), 48px (desktop)
Card padding: 24px all sides
Button padding: 12px vertical / 24px horizontal (default) | 8px / 16px (small)
Min touch target size: 44px height — applies to all buttons and interactive elements

4.5  Component Specs
Buttons
Primary: bg-[#1E3A5F] text-white rounded-lg — hover: opacity-90
Accent CTA: bg-[#0D9488] text-white — for download and key actions
Secondary: border border-[#1E3A5F] text-[#1E3A5F] — hover: bg-[#1E3A5F]/10
Destructive: bg-red-500 text-white — delete/remove actions only, always requires confirmation
Loading state: show spinner inside button, same size, disabled

Cards
bg-white border border-[#CBD5E1] rounded-xl shadow-sm
Interactive card hover: shadow-md + border-[#0D9488] transition-all
Loading: use shadcn/ui Skeleton with animate-pulse

File Upload Zones
Dashed border: border-2 border-dashed border-[#CBD5E1] rounded-xl p-8
Drag-over state: border-[#0D9488] bg-teal-50
Always show: accepted file types, max file size, icon

Forms
Use shadcn/ui Input — consistent height (44px min), border, focus ring
Error: red border + text-red-500 text-sm message below the field
Required fields: asterisk (*) in muted colour, explained once at the top of the form

  SECTION 5 — BACKEND SCHEMA (CONVEX)  

5. Backend Schema — Convex


5.1  Architecture
Fileora uses Convex as the complete backend: real-time database, server functions (queries/mutations/actions), and file metadata storage. Clerk handles authentication externally and passes a verified JWT to Convex. There is no custom Express or Node.js server.
Schema file: convex/schema.ts
Functions: convex/users.ts | convex/resumes.ts | convex/pdfOperations.ts
Clerk-Convex auth bridge: ConvexProviderWithClerk in root layout.tsx

5.2  Table: users
Field
Type
Description
_id
Id<"users">
Auto-generated Convex document ID
clerkId
string
Clerk user ID — primary link between auth and DB
email
string
User email synced from Clerk
name
string (optional)
Display name
imageUrl
string (optional)
Profile picture URL from Clerk
createdAt
number
Unix timestamp of account creation
plan
"free" | "pro"
Subscription tier — always free for MVP


5.3  Table: resumes
Field
Type
Description
_id
Id<"resumes">
Auto-generated document ID
userId
Id<"users">
Foreign key → users table
title
string
User-given CV name
templateId
string
"ats-classic" | "modern-pro" | "nigerian-pro" | "creative"
personalInfo
object
Name, email, phone, location, LinkedIn, website
workExperience
array
Array: { company, title, startDate, endDate, current, bullets[] }
education
array
Array: { school, degree, field, year, grade }
skills
array
Array of skill strings
certifications
array
Array: { name, issuer, year }
summary
string
Professional summary paragraph
nyscStatus
string (optional)
NYSC completion status — Nigerian market field
createdAt
number
Unix timestamp
updatedAt
number
Unix timestamp of last save


5.4  Table: pdf_operations
Field
Type
Description
_id
Id<"pdf_operations">
Auto-generated document ID
userId
Id<"users">
Foreign key → users table
operationType
string
"convert" | "compress" | "merge" | "split" | "remove-pages"
inputFileNames
array
Array of original file name strings
outputFileName
string
Generated output file name
status
string
"processing" | "complete" | "failed"
createdAt
number
Unix timestamp


5.5  Clerk + Convex Integration Flow
Step 1: User signs in via Clerk → Clerk issues a signed JWT
Step 2: ConvexProviderWithClerk in layout.tsx passes the JWT to Convex automatically
Step 3: Convex verifies JWT and exposes ctx.auth.getUserIdentity() in every function
Step 4: On first sign-in, createOrUpdateUser mutation upserts the users table with Clerk identity data
Step 5: All queries filter by authenticated userId — users can only see their own data

5.6  Security Rules
Every Convex function must call ctx.auth.getUserIdentity() and throw if null — no anonymous access
All reads must filter by the authenticated user's ID
OpenAI API calls happen in Convex actions (server-side) — API key never sent to the browser
Files are processed in memory only — no raw files stored permanently
Environment variables without NEXT_PUBLIC_ prefix stay server-side only

5.7  File Handling Strategy
To stay within Convex free tier limits, Fileora uses a process-and-discard pattern:
User uploads file → Next.js API route receives it as a Buffer in memory
Server processes the Buffer using the relevant library (pdf-lib, mammoth, etc.)
Processed file returned directly to user as a download response stream
Only metadata (file name, operation type, status) is saved to Convex — never the raw file

This approach works entirely within free tier limits and avoids storage and GDPR complexity.
