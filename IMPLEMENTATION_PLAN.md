# Implementation Plan: AngularFire (v21) Documentation Website with AnalogJS

Build a documentation website specifically for **AngularFire (v21)** with full Markdown support using the **AnalogJS** meta-framework. As per the official [AnalogJS Getting Started guide](https://analogjs.org/docs/getting-started), the project **MUST be initialized using the npm package manager** (`npm create analog@latest`) to guarantee standard scaffolding, including `.gitignore`, `angular.json`, `index.html`, `tsconfig.*.json`, and Vite plugins.

---

## User Review Required

> [!IMPORTANT]
> **NPM Package Manager Scaffolding Workflow**:
>
> - We will scaffold the application using `npm create analog@latest` per the official [AnalogJS Getting Started](https://analogjs.org/docs/getting-started) documentation.
> - This automatically generates the official `.gitignore`, `angular.json`, `index.html`, `tsconfig.json`, and Vite structure.
> - Following initialization, we will integrate `@analogjs/content`, Tailwind CSS with typography, and establish the complete AngularFire v21 documentation structure.

---

## Architecture & Technology Stack

- **Scaffolding Tool**: `npm create analog@latest` (official package manager initializer)
- **Meta-framework**: [AnalogJS](https://analogjs.org/) (Vite + Angular SSR/SSG & file-based routing)
- **Framework Version**: Angular v21 / v22 (Signal-based state, standalone components, `inject()` patterns)
- **Content Engine**: `@analogjs/content` for Markdown parsing, YAML frontmatter, and code syntax highlighting
- **Styling**: Tailwind CSS with `@tailwindcss/typography` and sleek dark/light theme tokens
- **Target Audience & Scope**: AngularFire v21 modules with modern Angular Signals & standalone DI

---

## Route Layout & Structure

The documentation site will follow AnalogJS file-based routing connected to markdown content in `src/content/`:

```text
src/
├── content/
│   ├── overview.md                       # Core / Getting Started / Installation
│   ├── auth.md                           # Authentication
│   ├── analytics.md                      # Analytics & Screen Tracking
│   ├── firestore.md                      # Cloud Firestore
│   ├── functions.md                      # Cloud Functions
│   ├── storage.md                        # Cloud Storage
│   ├── messaging.md                      # Cloud Messaging (FCM)
│   ├── database.md                       # Realtime Database
│   ├── performance.md                    # Performance Monitoring
│   ├── remote-config.md                  # Remote Config
│   ├── app-check.md                      # App Check (reCAPTCHA, Play/App Attest)
│   └── ai.md                             # AI & Vertex AI for Firebase / Genkit
├── app/
│   ├── components/
│   │   ├── header.component.ts           # Navbar, brand logo, search trigger, theme switcher, GitHub link
│   │   ├── sidebar.component.ts          # Grouped navigation sidebar with active indicators
│   │   └── toc.component.ts              # "On this page" dynamic Table of Contents
│   ├── layouts/
│   │   └── docs-layout.component.ts      # Shared docs layout shell (Sidebar + Content + TOC)
│   └── pages/
│       ├── index.page.ts                 # Root route: Core docs, hero, & linked section routes
│       ├── auth.page.ts                  # /auth route
│       ├── analytics.page.ts             # /analytics route
│       ├── firestore.page.ts             # /firestore route
│       ├── functions.page.ts             # /functions route
│       ├── storage.page.ts               # /storage route
│       ├── messaging.page.ts             # /messaging route
│       ├── database.page.ts              # /database route
│       ├── performance.page.ts           # /performance route
│       ├── remote-config.page.ts         # /remote-config route
│       ├── app-check.page.ts             # /app-check route
│       └── ai.page.ts                    # /ai route
```

---

## Step-by-Step Implementation Sequence

### Phase 1: Initialize via NPM Package Manager (`create-analog`)

1. Scaffold the project via `npm create analog@latest` to establish the official project template, `.gitignore`, `angular.json`, `index.html`, and `tsconfig.json`.
2. Install required dependencies:
   - `@analogjs/platform`, `@analogjs/router`, `@analogjs/content`
   - `@angular/core`, `@angular/common`, `@angular/router`, `@angular/forms`, `@angular/platform-browser`, `@angular/platform-server`
   - `tailwindcss`, `@tailwindcss/typography`, `postcss`, `autoprefixer`
   - `prismjs` / `marked` for Markdown rendering and code formatting.

### Phase 2: Design System & Shared Layout Components

1. Configure `tailwind.config.js` with custom Firebase colors (`#FFCA28`, `#FFA000`, `#1A237E`) and typography styles.
2. Implement **`HeaderComponent`**: sticky top navigation bar with brand icon, version badge (`v21`), quick links, mobile hamburger menu, and GitHub repo link.
3. Implement **`SidebarComponent`**: categorized navigation groups with badges and active route highlighting for all 11 Firebase sections.
4. Implement **`TocComponent`**: right-side Table of Contents linking to in-page headings.
5. Implement **`DocsLayoutComponent`**: responsive 3-column layout container.

### Phase 3: Markdown Content Creation (`src/content/`)

Generate comprehensive, production-ready documentation for AngularFire v21:

- **`overview.md`**: Architecture, installation (`ng add @angular/fire`), `provideFirebaseApp`, emulator setup, Signals integration.
- **`auth.md`**: `provideAuth`, `user()`, `authState()`, social auth, email/password, `AuthGuard` route pipes.
- **`firestore.md`**: `provideFirestore`, `collectionData()`, `docData()`, queries, batched writes, transactions.
- **`database.md`**: `provideDatabase`, `listVal()`, `objectVal()`, real-time synchronisation.
- **`storage.md`**: `provideStorage`, `uploadBytesResumable`, `percentage()` progress signal, downloads.
- **`functions.md`**: `provideFunctions`, `httpsCallableData`, typed requests/responses.
- **`messaging.md`**: `provideMessaging`, push notification permissions, FCM tokens, real-time message handling.
- **`analytics.md`**: `provideAnalytics`, `ScreenTrackingService`, `UserTrackingService`, custom telemetry.
- **`performance.md`**: `providePerformance`, custom trace metrics, performance monitoring.
- **`remote-config.md`**: `provideRemoteConfig`, feature flags, parameter defaults.
- **`app-check.md`**: `provideAppCheck`, reCAPTCHA Enterprise, debug tokens.
- **`ai.md`**: `provideVertexAI`, Gemini 2.0 streaming completions, multimodal prompts.

### Phase 4: Page Routes Implementation (`src/app/pages/`)

Create standalone page components for each section route using `injectContent` and `<analog-markdown>` inside `DocsLayoutComponent`:

- `index.page.ts` (Root overview + quick cards + linked routes)
- `auth.page.ts`, `analytics.page.ts`, `firestore.page.ts`, `functions.page.ts`, `storage.page.ts`, `messaging.page.ts`, `database.page.ts`, `performance.page.ts`, `remote-config.page.ts`, `app-check.page.ts`, `ai.page.ts`.

---

## Verification Plan

### Automated Verification

- `npm run build`: Validate that Vite and Analog compile all routes and prerender all markdown files with zero errors.
- Type check: Ensure all Angular v21 signals and dependency injection patterns pass TypeScript strict mode.

### Manual Verification

- Run `npm run dev` and navigate through all routes (`/`, `/auth`, `/firestore`, `/functions`, `/storage`, `/messaging`, `/database`, `/analytics`, `/performance`, `/remote-config`, `/app-check`, `/ai`).
- Verify syntax highlighting on all TypeScript and Bash code blocks.
- Test mobile responsive navigation drawer and table of contents links.
