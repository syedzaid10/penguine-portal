# Penguine: National Polar Data Archive & Content Studio

**One line:** Archive once, publish everywhere. A full-stack research portal that stores polar research (reports, datasets, publications, photos, videos, activities), presents it to the public, and generates website and social content from it, with editor approval and a cited source behind every claim.

---

## 🌟 Key Highlights & Architecture

1. **Polar Night Design System:** Deep abyss night theme (`#060B13`, `#0A111F`, `#0F172A`), Ice Cyan accents (`#00F0FF`), Aurora gradients (`#10B981`, `#A855F7`), Space Grotesk headings, and JetBrains Mono for telemetry data.
2. **Sub-second Text Search:** Multi-field index over titles, summaries, topic tags, and full extracted text returning in under 10ms.
3. **Cited AI Assistant (RAG):** In-memory cosine similarity over ~300-word chunks. Every response cites exact sources (Title, Station, Year). If an out-of-domain question is asked (e.g. cake recipes or general knowledge), it strictly refuses: *"Not found in the archive"*.
4. **AI Content Studio:** Takes a research document, generates Website Blurbs, Press Releases, and Posts for X (Twitter), LinkedIn, and Instagram in **both English and Hindi** without hallucinations, complete with **1200x630 HTML5 Canvas Branded Image Card export**!
5. **Strict Editorial Workflow & Audit Trail:** Status machine (`Draft` → `In review` → `Published` or `Rejected`). Every status mutation and content generation is recorded in an immutable `AuditLog`.
6. **Zero-Setup Database Architecture:** Seamlessly connects to MongoDB Atlas when `MONGODB_URI` is provided in `.env`, and automatically boots an in-memory MongoDB instance with pre-seeded data if no Atlas connection is specified.

---

## 🚀 Quick Start Guide

### 1. Requirements
- Node.js v18+ (tested on Node v24)
- npm v9+

### 2. Environment Configuration
Backend `.env` file is located at `backend/.env`:
```env
PORT=5000
MONGODB_URI=
JWT_SECRET=polar_portal_secret_key_prod_2026
GEMINI_API_KEY=
NODE_ENV=development
```
*(Leave `MONGODB_URI` blank for instant zero-dependency in-memory database, or paste your MongoDB Atlas connection string).*

### 3. Start Both Backend & Frontend
From the root directory:
```bash
npm run dev
```
- **Backend API:** `http://localhost:5000`
- **Frontend App:** `http://localhost:5173`

To reset and seed the database with all 16 papers, 4 CSV datasets, 20 gallery assets, 8 timeline activities, and 5 news stories:
```bash
npm run seed
```

---

## 👥 Demo Accounts & Credentials

Log in using the official institution accounts:

| Persona | Email | Password | Role Permissions |
|---|---|---|---|
| **Public Visitor** | `visitor@penguine.gov.in` | `Visitor@123` | Browse catalog, view datasets & Recharts curves, use cited assistant |
| **Scientist** | `scientist@penguine.gov.in` | `Scientist@123` | Ingest research reports, upload CSV datasets, submit items for review |
| **Editor** | `editor@penguine.gov.in` | `Editor@123` | Review queue (Approve/Reject with remarks), Content Studio (EN/HI generation) |
| **Admin** | `admin@penguine.gov.in` | `Admin@123` | Everything, plus user role management and complete immutable audit trail |

---

## ⏱️ Interactive Walkthrough & Demonstration

Follow these 6 steps to explore the full workflow:

### Step 1: Search & Filter the Public Archive (30 seconds)
1. Open `http://localhost:5173`. Notice the real-time **Active Station Telemetry Strip** displaying live metrics for Maitri, Bharati, Himadri, and IndARC.
2. Navigate to **Research Library** (`/library`).
3. Type `"ice core"` in the search bar. Observe the **sub-second query badge** (`⚡ 8ms`).
4. Filter by Station: **Maitri**, and Topic: **Glaciology**.
5. Click **View Record** to preview the abstract, extracted text, and official bibliographic citation.

### Step 2: Cited AI Assistant & Grounded Querying (45 seconds)
1. Navigate to **Ask Polar Archive** (`/ask`).
2. Click the sample prompt: *"What is IndARC and where is it deployed?"*
   - Assistant returns an answer citing `[Source 1: Long-term Fjord Dynamics in Kongsfjorden using IndARC Mooring Observations, IndARC, 2023]`.
   - Click the source card to open the verified paper.
3. Test a Hindi question: *"मैत्री स्टेशन पर किस प्रकार के मौसम संबंधी अध्ययन किए जाते हैं?"*
   - Assistant answers in Hindi, citing Maitri meteorology records.
4. Test an off-topic question: *"How do I bake a chocolate cake?"*
   - Assistant strictly refuses: *"Not found in the archive. I can only answer questions backed by Indian polar research documents and datasets."*

### Step 3: Scientist Report Ingestion & Review Submission (30 seconds)
1. In the top navbar, click the **Role Switcher** and select **Scientist** (`Dr. Ananya Sen`).
2. Go to **Staff Console → Upload Item** (`/console/upload`).
3. Title: `51st Indian Antarctic Expedition Glaciological Survey`.
4. Summary: `High-frequency GPS stake ablation and ice thickness radar soundings across Schirmacher Oasis.`.
5. Station: `Maitri`, Year: `2024`.
6. Click **Save Draft Item**.
7. On the success screen, click **Submit for Editor Review Now →**. Item transitions to `In review`.

### Step 4: Editor Content Studio & Social Card Export (45 seconds)
1. In the top navbar, switch role to **Editor** (`Priya Narayanan`).
2. Open **Review Queue** (`/console/review-queue`).
3. Click **Open in Content Studio** on the pending report.
4. Click **Generate Content Studio**:
   - Inspect the generated **Website Blurb**, **Press Release**, **X (Twitter)** post (under 280 characters with hashtags), **LinkedIn**, and **Instagram** caption in both English and Hindi.
5. Click **Download Social Card (.PNG)**: generates an instant 1200x630 high-resolution branded polar card via HTML5 Canvas.
6. Click **Approve & Publish Item to Archive**.

### Step 5: Verification on Public Site (15 seconds)
1. Switch back to **Public Visitor** or open the **Research Library** (`/library`).
2. Notice the newly submitted item is now live and indexed in the public catalog.

### Step 6: Immutable Audit Trail (15 seconds)
1. Switch role to **Admin** (`Dr. Rameshwar Sharma`).
2. Navigate to **Staff Console → Audit Trail** (`/console/audit-log`).
3. Highlight the timestamped audit log showing the exact chronological lifecycle:
   - `UPLOAD` (Scientist) → `STATUS_CHANGE: Draft to In review` → `CONTENT_GENERATE` → `STATUS_CHANGE: In review to Published` (Editor).

---

## 📊 Seed Content Overview

- **16 Research Documents:** Glaciology, aerosol optical depth, fjord hydrography, bedrock radar sounding, ozone hole recovery, paleolimnology, and historical Dakshin Gangotri archives.
- **4 Numerical CSV Datasets:**
  1. `Maitri AWS Hourly Telemetry` (Temp, Wind speed, Pressure)
  2. `Bharati Solar UV Flux` (UV-A, UV-B, Solar irradiance)
  3. `IndARC Kongsfjorden CTD Profile` (0-180m Water depth, Salinity, Temperature)
  4. `Central Dronning Maud Land Ice Core Records` (Depth, Age BP, CO2 ppm, δ18O)
- **20 Curated Media:** High-resolution photos & video previews of stations, auroras, ice cores, and expedition vessels.
- **8 Activity Milestones:** 1981 1st Expedition to 2024 Maitri-II sanction.
- **5 News Stories:** Bilingual press releases and research milestones.
- **Student Zone:** 3 illustrated explainers and 1 interactive 7-question Polar Quiz with score certificate.

---

## 🎯 Project Vision

> *"Archive once, publish everywhere: every expedition report, dataset and photo becomes website and social content in one click, approved by an editor, with a cited source behind every claim."*
