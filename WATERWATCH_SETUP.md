# Mumbai WaterWatch — Project Documentation & Handover Guide

> **Sustainability Problem Statement (SUS-02):** Water Leakage & Wastage Reporting and Monitoring Platform for Colleges & Residential Buildings across Mumbai.

---

## 1. Project Overview

### What is Mumbai WaterWatch?
**Mumbai WaterWatch** is an interactive, civic-tech reporting and monitoring web platform engineered to identify, localize, and reduce potable water leakage and wastage across the Mumbai Metropolitan Region. 

Originally adapted from the **Mumbai Smart Civic Portal**, the entire frontend application has been repurposed into a focused water conservation management tool that targets two high-density urban environments:
1. **Educational Campuses & Colleges** (Academic blocks, laboratories, hostels, canteens, and sports grounds).
2. **Residential Housing Societies** (High-rise apartment risers, common overhead storage tanks, underground sumps, booster pump rooms, and podium irrigation).

### Why Was Mumbai WaterWatch Created?
In Mumbai, millions of liters of treated potable water are lost daily due to:
- Stripped faucets, jammed dual-flush valves, and dripping water coolers in colleges.
- Overflowing rooftop RCC/sintex tanks caused by defective mechanical float ball valves.
- Underground distribution ring main fractures and basement pump gland spray in housing complexes.
- Delayed reporting and lack of dedicated maintenance tracking.

Mumbai WaterWatch bridges this gap by providing an intuitive citizen reporting workflow for students, faculty, and residents, alongside an executive command dashboard for municipal hydraulic engineers and campus facility supervisors.

### Target Users
- **College Students & Faculty:** Report leaking restroom fixtures, condensation line wastage in chemistry labs, and canteen water cooler faults.
- **Housing Society Residents & Committee Members:** Report terrace tank overflows, damp plumbing shafts, and sub-surface main leaks.
- **Maintenance Squads & Estate Managers:** Receive instant dispatch notifications, prioritize critical high-loss incidents, log repair notes, and verify resolution evidence.
- **Municipal Water Authority (MCGM / BMC):** Monitor ward-level water loss trends, analyze hotspots, and measure total potable water saved.

---

## 2. Changes Made (Transformation Summary)

The transition from the general **Mumbai Smart Civic Portal** to **Mumbai WaterWatch** was achieved strictly within the `frontend/` directory. The FastAPI backend remains **100% untouched**.

### Functionality Comparison

| Area | Original Smart Civic Portal | Mumbai WaterWatch (SUS-02) | Status |
| :--- | :--- | :--- | :--- |
| **Domain Scope** | Potholes, garbage, sewage, streetlights | Water leakage & wastage in colleges & societies | **Transformed** |
| **Backend Dependency** | Required live FastAPI + MongoDB | Fully self-contained static prototype using localStorage | **Decoupled** |
| **Citizen Dashboard** | Generic civic issues & upvotes | Water metrics (Liters lost, Liters saved, Tanker equiv.) | **Transformed** |
| **Reporting Flow** | Generic issue form with categories | Dual-environment selector (College vs Residential) | **Newly Created** |
| **My Reports** | Simple complaint list | Lifecycle progress tracking with audit timeline | **Transformed** |
| **Geospatial Map** | Leaflet heatmap of civic complaints | Water leakage pin map with status colors & campus jump | **Transformed** |
| **Authority Dashboard** | General municipal officer view | Water command center with status updates & squad dispatch | **Transformed** |
| **Analytics** | Spatial density heatmap | Ward-wise water loss, monthly trend, & hotspot table | **Newly Created** |
| **Conservation Hub** | Not present | Interactive Water Wastage Calculator & campus protocols | **Newly Created** |
| **Authentication** | Backend JWT API calls | Client-side 1-click demo logins & instant role toggle | **Bypassed/Mocked** |

### Detailed List of Changes

1. **Reused Components & Layouts:**
   - **Glassmorphism CSS Design System** ([`frontend/src/index.css`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/src/index.css)): Maintained design tokens, responsive cards, glassmorphic overlays, theme switching (Dark/Light mode), and buttons.
   - **3D Auth Flip Architecture** ([`frontend/src/pages/AuthContainer.jsx`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/src/pages/AuthContainer.jsx)): Reused the 3D card flip animation between Login and Register with custom water backgrounds.
   - **Leaflet Map Wrapper** ([`frontend/src/components/MapComponent.jsx`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/src/components/MapComponent.jsx)): Enhanced with auto size-invalidation and water-themed markers.
   - **UI Primitives** ([`frontend/src/components/ui/`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/src/components/ui/)): `Button`, `InputField`, `Card`, `Badge`, `ThemeToggle`, `BackgroundSlideshow`.

2. **Modified Pages & Components:**
   - [`App.jsx`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/src/App.jsx): Updated routes for Citizen and Authority workflows, added safe auth guards with default demo credentials.
   - [`Navbar.jsx`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/src/components/Navbar.jsx): Added **1-Click Role Switcher** ("Switch to Authority View" / "Switch to Citizen View") and current institution tag.
   - [`Sidebar.jsx`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/src/components/Sidebar.jsx): Updated navigation links and icons for WaterWatch.
   - [`Login.jsx`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/src/pages/Login.jsx) & [`Register.jsx`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/src/pages/Register.jsx): Added 1-click demo logins for Student, Resident, and Authority.
   - [`ReportDetailsModal.jsx`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/src/components/ReportDetailsModal.jsx): Displays water wastage rate (L/hr), water saved (L), location, before/after photos, and complete audit history.
   - [`NearbyIssueClusterLayer.jsx`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/src/components/NearbyIssueClusterLayer.jsx): Fixed missing `leaflet.markercluster` dependency by converting to standard Leaflet `layerGroup` with colored icons.
   - [`index.html`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/index.html): Updated title and SVG water droplet favicon.

3. **Newly Created Pages & Data Modules:**
   - [`frontend/src/data/wards.js`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/src/data/wards.js): 24 Mumbai Wards, 10 Mumbai Colleges, 8 Residential Societies, and environment-specific leakage categories.
   - [`frontend/src/data/leakages.js`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/src/data/leakages.js): 18 realistic sample leakage reports across Mumbai institutions.
   - [`frontend/src/data/maintenanceTeams.js`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/src/data/maintenanceTeams.js): Municipal and campus plumbing maintenance squads.
   - [`frontend/src/data/announcements.js`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/src/data/announcements.js): Civic advisories and water-audit circulars.
   - [`frontend/src/data/analytics.js`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/src/data/analytics.js): Ward-wise water metrics, monthly trends, and hotspot rankings.
   - [`frontend/src/services/waterWatchService.js`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/src/services/waterWatchService.js): State management service with `localStorage` persistence and event pub/sub.
   - [`frontend/src/pages/citizen/ReportLeakage.jsx`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/src/pages/citizen/ReportLeakage.jsx): Dedicated reporting form with environment toggle, photo upload/preview, GPS sync, and quick-fill presets.
   - [`frontend/src/pages/citizen/MyReports.jsx`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/src/pages/citizen/MyReports.jsx): Filterable reports list with card and table view modes.
   - [`frontend/src/pages/citizen/LeakageMap.jsx`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/src/pages/citizen/LeakageMap.jsx): Interactive Leaflet map with status filters and campus jump menu.
   - [`frontend/src/pages/citizen/WaterConservation.jsx`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/src/pages/citizen/WaterConservation.jsx): Conservation guide with interactive Water Wastage Calculator.
   - [`frontend/src/pages/citizen/Announcements.jsx`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/src/pages/citizen/Announcements.jsx): Civic notices and institutional directives.
   - [`frontend/src/pages/admin/Analytics.jsx`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/src/pages/admin/Analytics.jsx): Spatial charts, sector breakdown, and hotspot table.
   - [`frontend/src/pages/admin/ResolveComplaint.jsx`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/src/pages/admin/ResolveComplaint.jsx): Authority quick dispatch and resolution workbench.
   - [`frontend/vercel.json`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/vercel.json): Vercel SPA routing fallback configuration.

---

## 3. Technology Stack

All technologies listed below are based on [`frontend/package.json`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/package.json):

| Technology | Version | Purpose in Mumbai WaterWatch |
| :--- | :--- | :--- |
| **React** | `^18.3.1` | Core declarative UI library for all views, cards, and state-driven components. |
| **React DOM** | `^18.3.1` | DOM renderer for React components in the browser. |
| **Vite** | `^5.4.0` | Ultra-fast next-generation frontend bundler and development server. |
| **React Router DOM** | `^6.26.0` | Client-side routing with nested layouts (`/citizen/*`, `/admin/*`) and auth protection. |
| **Leaflet** | `^1.9.4` | Open-source interactive map engine rendering Mumbai geography and tile layers. |
| **React Leaflet** | `^4.2.1` | React bindings for Leaflet (`MapContainer`, `TileLayer`, `CircleMarker`, `Popup`). |
| **Leaflet.heat** | `^0.2.0` | Spatial density heat layer rendering support. |
| **React Icons** | `^5.3.0` | Material Design (`react-icons/md`) and Feather (`react-icons/fi`) icon sets. |
| **Axios** | `^1.7.0` | HTTP client configured with interceptors (retained for future backend integration). |
| **OGL** | `^1.0.11` | Minimal WebGL library for particle backgrounds and visual effects. |

---

## 4. Project Structure

```
vega-wd04/mumbai-smart-civic/frontend/
├── index.html                   # HTML entry point with WaterWatch branding & favicon
├── package.json                 # Dependencies, scripts (dev, build, preview)
├── vercel.json                  # SPA routing configuration for Vercel deployment
├── vite.config.js               # Vite build and plugin configuration
├── public/
│   ├── auth-bg/                 # Background photography assets
│   └── vite.svg                 # Static icons
└── src/
    ├── App.jsx                  # Main routing configuration & ProtectedRoute logic
    ├── index.css                # Glassmorphism design system & CSS design tokens
    ├── main.jsx                 # React root mount entry point
    ├── components/
    │   ├── AppLayout.jsx        # Responsive shell layout (Sidebar + Navbar + Content)
    │   ├── CameraCapture.jsx    # WebRTC live device camera capture component
    │   ├── HeatmapLayer.jsx     # Leaflet heat layer adapter
    │   ├── MapComponent.jsx     # Leaflet map container with auto-invalidation
    │   ├── Navbar.jsx           # Top navigation bar with 1-Click Role Switcher
    │   ├── NearbyIssueClusterLayer.jsx # LayerGroup markers with status-colored dots
    │   ├── ReportDetailsModal.jsx # Comprehensive leakage audit and progress modal
    │   ├── Sidebar.jsx          # Glassmorphic sidebar with citizen/authority links
    │   └── ui/                  # Reusable UI primitives (Button, InputField, etc.)
    ├── data/
    │   ├── analytics.js         # Static analytics datasets, monthly trends, hotspots
    │   ├── announcements.js     # Civic circulars, directives, and water notices
    │   ├── leakages.js          # 18 realistic sample leakage reports
    │   ├── maintenanceTeams.js  # Municipal and campus plumbing maintenance squads
    │   └── wards.js             # 24 Mumbai Wards, Colleges, Societies, and Categories
    ├── pages/
    │   ├── AuthContainer.jsx    # 3D perspective flip card container
    │   ├── Login.jsx            # 1-Click demo login interface
    │   ├── Register.jsx         # Campus reporter & resident onboarding form
    │   ├── admin/
    │   │   ├── Analytics.jsx    # Water conservation & spatial intelligence dashboard
    │   │   ├── Dashboard.jsx    # Authority command table with status update modal
    │   │   ├── ManageReports.jsx# Re-export of administrative management view
    │   │   └── ResolveComplaint.jsx # Rapid response squad dispatch workbench
    │   └── citizen/
    │       ├── Announcements.jsx# Official civic water directives & alerts
    │       ├── Dashboard.jsx    # Water monitoring dashboard with live KPIs
    │       ├── LeakageMap.jsx   # Interactive geospatial leakage map
    │       ├── MyReports.jsx    # Track progress and submitted reports (cards/table)
    │       ├── ReportLeakage.jsx# Dedicated reporting form with photo preview & GPS
    │       └── WaterConservation.jsx # Interactive Wastage Calculator & guides
    └── services/
        └── waterWatchService.js # Centralized state, localStorage persistence, & pub/sub
```

---

## 5. How to Run Locally

### Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ recommended).
- **npm:** v9.0.0 or higher.
- **Terminal:** Windows PowerShell, Command Prompt, or bash.
- **Backend:** FastAPI and MongoDB are **NOT** required. The prototype is completely standalone.

### Step-by-Step Instructions (PowerShell)

1. Open PowerShell and navigate to the frontend directory:
   ```powershell
   cd d:\vedant-coding\birla\vega-wd04\mumbai-smart-civic\frontend
   ```

2. Install dependencies (if not already installed):
   ```powershell
   npm install
   ```

3. Start the local Vite development server:
   ```powershell
   npm run dev
   ```

4. The terminal will display the local development server URL:
   ```
     VITE v5.4.21  ready in 320 ms

     ➜  Local:   http://localhost:5173/
     ➜  Network: use --host to expose
   ```

5. Open **`http://localhost:5173/`** in your browser (Google Chrome, Microsoft Edge, Firefox, or Safari).

6. To stop the server at any time, press **`Ctrl + C`** in your terminal window and type `Y`.

### Troubleshooting Common Local Issues
- **Port 5173 already in use:** Vite will automatically switch to `http://localhost:5174/`. Look at the terminal output for the active URL.
- **EPERM / Lock file issues on Windows:** If `npm install` reports permissions errors, run PowerShell as Administrator or delete `node_modules` and run `npm install` again.

---

## 6. Production Build & Preview

To verify that the application compiles without errors and test production performance:

1. Navigate to the frontend directory:
   ```powershell
   cd d:\vedant-coding\birla\vega-wd04\mumbai-smart-civic\frontend
   ```

2. Execute the production build:
   ```powershell
   npm run build
   ```
   **Output:** The compiled static bundle is generated inside `frontend/dist/`.

3. Preview the production build locally:
   ```powershell
   npm run preview
   ```
   Open the displayed URL (typically `http://localhost:4173/`) to test the production build.

---

## 7. How to Push to a New GitHub Repository

> [!IMPORTANT]
> The original **Mumbai Smart Civic Portal** repository must remain separate. Follow the steps below to push Mumbai WaterWatch to your own new, independent GitHub repository. **Never push directly to the original remote.**

### Step-by-Step GitHub Setup (Windows PowerShell)

1. Go to [github.com/new](https://github.com/new) and create a **new empty repository** named:
   `mumbai-waterwatch`
   *(Do NOT initialize with a README, .gitignore, or license — leave it completely empty).*

2. Open PowerShell in the project directory:
   ```powershell
   cd d:\vedant-coding\birla\vega-wd04
   ```

3. Check your current remotes and current branch:
   ```powershell
   git remote -v
   git branch --show-current
   ```
   *(Notice your branch name — typically `master` or `main`).*

4. Rename the old remote to `upstream` (so you keep reference to original code without overwriting it):
   ```powershell
   git remote rename origin upstream
   ```
   *(If `origin` did not exist, simply skip to step 5).*

5. Add your new repository as `origin`:
   ```powershell
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/mumbai-waterwatch.git
   ```

6. Confirm the new remote setup:
   ```powershell
   git remote -v
   ```
   *(Output should show `origin` pointing to your new repository, and `upstream` pointing to the old one).*

7. Check that no sensitive files or backend files are staged:
   ```powershell
   git status
   ```

8. Stage all WaterWatch frontend additions:
   ```powershell
   git add .
   ```

9. Commit the transformation:
   ```powershell
   git commit -m "feat: transform frontend into Mumbai WaterWatch water leakage platform (SUS-02)"
   ```

10. If you wish to rename your local branch to `main`:
    ```powershell
    git branch -M main
    ```

11. Push your code to your new GitHub repository:
    ```powershell
    git push -u origin main
    ```

---

## 8. Deploying Frontend on Vercel

Vercel provides automatic deployments and instant global CDN hosting for Vite + React applications.

### Step-by-Step Vercel Deployment

1. **Sign In to Vercel:**
   Visit [vercel.com](https://vercel.com) and log in with your GitHub account.

2. **Import Repository:**
   Click **"Add New..."** ➔ **"Project"**, then select your newly created `mumbai-waterwatch` repository.

3. **Configure Project Settings:**
   - **Framework Preset:** `Vite` (automatically detected).
   - **Root Directory:** Click "Edit" and choose:
     `mumbai-smart-civic/frontend` *(or `frontend` depending on repository root)*.
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Environment Variables:**
   No environment variables are needed for the static prototype. Leave this section blank.

5. **SPA Route Handling ([`vercel.json`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/vercel.json)):**
   A pre-configured `vercel.json` file is already included in `frontend/`:
   ```json
   {
     "version": 2,
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
   This ensures that refreshing deep URLs like `/citizen/dashboard`, `/citizen/report`, `/admin/analytics`, etc., routes back to `/index.html` without triggering a 404 error.

6. **Deploy:**
   Click **"Deploy"**. Vercel will build the project in ~30–45 seconds and provide a live production URL (e.g., `https://mumbai-waterwatch.vercel.app`).

---

## 9. Environment Variables

- **Required Variables:** **None.**
- The static prototype operates completely client-side using initial data from `frontend/src/data/` and browser `localStorage`.
- The optional `VITE_API_BASE` in [`frontend/src/utils/api.js`](file:///d:/vedant-coding/birla/vega-wd04/mumbai-smart-civic/frontend/src/utils/api.js) defaults to `/api/v1` but is bypassed by the mock service architecture.
- No API keys, credentials, or secrets are exposed or required.

---

## 10. Known Limitations

1. **Local Storage Scope:**
   - Newly submitted reports and status updates are saved to the browser's `localStorage`.
   - Data persists across browser refreshes and page navigation on the same device.
   - Data is not synced across different devices or separate browsers because no live database is connected.

2. **Simulated File Storage:**
   - Uploaded photos in the reporting form are converted into base64 Data URLs and stored in browser memory/localStorage for instant preview.
   - In a production cloud system, images would be uploaded to AWS S3, Cloudinary, or Google Cloud Storage.

3. **Mock Geospatial Pinning:**
   - Map coordinates for colleges and societies are statically referenced to real Mumbai coordinates (e.g., VJTI Matunga: `19.0223, 72.8561`; IIT Bombay Powai: `19.1334, 72.9133`).
   - Browser geolocation (`navigator.geolocation`) will request real device location if permitted, with fallback to the selected campus coordinates.

---

## 11. Functional Testing Results

All features were systematically tested against the production build:

| Workflow / Component | Test Performed | Result | Details |
| :--- | :--- | :---: | :--- |
| **Production Build** | `npm run build` | **PASSED** | Compiled in 2.69s with 0 errors; generated `dist/` bundle. |
| **Authentication Screen** | 3D Flip Card & 1-Click Logins | **PASSED** | Instant login for Student, Resident, and Authority profiles. |
| **Role Switcher** | Navbar 1-click switch pill | **PASSED** | Flawlessly toggles between Citizen and Authority views. |
| **Citizen Dashboard** | Stats counters & feed | **PASSED** | Displays 18 reports, Liters saved, tanker equivalents, and alerts. |
| **Leakage Reporting** | Dual-environment form & photo preview | **PASSED** | College and Residential categories dynamically switch; photo preview works; submission generates report `WW-MUM-2026-XXXX`. |
| **My Reports** | Table & Card views, search, filters | **PASSED** | Filtering by Open, In Progress, Resolved; search by ID & title. |
| **Leakage Map** | Leaflet rendering & marker styles | **PASSED** | Color-coded markers (Red=Open, Amber=In Progress, Green=Resolved); marker popups display correct info; Campus Jump pans map. |
| **Authority Dashboard** | KPI cards & Management Table | **PASSED** | Displays critical leak count, total water loss, and management table. |
| **Status Update Workflow** | Status transition modal & notes | **PASSED** | Can transition Open ➔ In Progress ➔ Resolved; auto-calculates saved water; adds timeline audit entry. |
| **Team Assignment** | Squad selection dropdown | **PASSED** | Dispatches selected squad from `maintenanceTeams.js` and updates report. |
| **Analytics Dashboard** | Charts, ward breakdowns, hotspots | **PASSED** | Pure CSS/HTML5 bars render without external chart library crashes; sector comparison functions correctly. |
| **Water Conservation** | Interactive Wastage Calculator | **PASSED** | Sliders dynamically calculate daily, monthly, yearly loss and tanker equivalents. |
| **Announcements** | Directives and notice cards | **PASSED** | Displays pre-monsoon directives and inter-college audit circulars. |
| **SPA Route Fallback** | `vercel.json` rewrites | **PASSED** | Catch-all redirect configured to prevent 404 on deep links. |
| **Backend Integrity** | Directory inspection | **PASSED** | `backend/` remains completely unmodified and untouched. |

---

## 12. Future Improvements (Post-Prototype Roadmap)

Without requiring immediate backend changes, the following frontend enhancements can be added:
1. **Multilingual Support (i18n):** Add Marathi (मराठी) and Hindi (हिंदी) language toggles to accommodate all Mumbai municipal residents and staff.
2. **PWA (Progressive Web App):** Add a service worker and `manifest.json` so students and society security guards can install Mumbai WaterWatch on their Android/iOS home screens.
3. **Export Reports to PDF/CSV:** Add client-side CSV or PDF export (using `jspdf`) so society committees can present water audit reports at Annual General Meetings (AGM).
4. **IoT Flow Sensor Webhook Viewer:** Add an interface to visualize live telemetry data from ultrasonic flow sensors installed in campus hostel supply lines.
5. **Interactive Before/After Photo Comparison Slider:** Add an image slider showing the leak before repair and the certified fixed plumbing post-repair.
