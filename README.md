<div align="center">

# 🇩🇿 الجزائر الحضرية — Algérie Urbaine

### منصة الإبلاغ عن المشاكل الحضرية
### Plateforme de Signalement Urbain

**الجمهورية الجزائرية الديمقراطية الشعبية**
**République Algérienne Démocratique et Populaire**

---

*A government-grade citizen reporting application for urban issues across Algeria*

[![React Native](https://img.shields.io/badge/React_Native-Expo_54-61DAFB?logo=react)](https://reactnative.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-Private-red)]()
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-green)]()

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Design System](#-design-system)
- [Bilingual Support](#-bilingual-support-arabicfrench)
- [Security](#-security)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [Screenshots & Screens](#-screens)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)

---

## 🏛️ Overview

**Algérie Urbaine** is a production-grade mobile platform that connects citizens with municipal services across Algerian wilayas. Citizens report urban issues — potholes, broken streetlights, illegal dumping, water leaks — by uploading geotagged photos. Team leaders receive assigned tasks, manage workflows, and upload proof of completion.

The application is designed to meet the visual and functional standards of an official Algerian government digital public service (خدمة رقمية عمومية).

### Key Objectives

| Goal | Status |
|------|--------|
| Government-grade visual identity (Republic Green / Gold) | ✅ |
| Full Arabic/French bilingual support with RTL | ✅ |
| Role-based workflows (Citizen & Team Leader) | ✅ |
| Geotagged photo reporting with GPS coordinates | ✅ |
| Real-time status tracking (5-step timeline) | ✅ |
| Proof-of-completion upload workflow | ✅ |
| Comprehensive security hardening | ✅ |
| Supabase backend with Row Level Security | ✅ |

---

## ✨ Features

### 👤 Citizen Flow
- **Submit Reports** — Title, description, priority selection (Low/Medium/High), camera/gallery photo upload, GPS location tagging
- **Track Progress** — 5-step visual timeline: Pending → Assigned → In Progress → Completed → Approved
- **My Reports** — Dashboard with stats cards (Total / Pending / Resolved), pull-to-refresh, skeleton loading
- **Report Details** — Hero image, status/priority badges, Google Maps integration, completion evidence photos

### 👷 Team Leader Flow
- **Task Dashboard** — Filterable tabs (All / Pending / In Progress) with assigned task count badge
- **Start Work** — One-tap status transition from Assigned → In Progress
- **Upload Proof** — Multi-image (up to 6) completion evidence with notes
- **Approve Work** — Final approval workflow with gold accent button

### 🌐 Platform Features
- **Bilingual UI** — Complete Arabic (RTL) and French (LTR) support with instant toggle
- **Offline Awareness** — Custom empty states with SVG illustrations
- **Micro-Animations** — Spring-based press feedback on cards, buttons, and FAB
- **Government Identity** — Algerian flag, official republic name, Zellij geometric patterns

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    React Native (Expo)                    │
│  ┌─────────┐  ┌─────────────┐  ┌──────────────────────┐ │
│  │ Screens │  │ Components  │  │  Navigation (Tabs +  │ │
│  │ (8 UI)  │  │ (7 shared)  │  │  Stack, role-based)  │ │
│  └────┬────┘  └──────┬──────┘  └──────────┬───────────┘ │
│       │              │                     │             │
│  ┌────┴──────────────┴─────────────────────┴──────────┐  │
│  │          Theme / i18n / Language Context            │  │
│  └────────────────────────┬───────────────────────────┘  │
│                           │                              │
│  ┌────────────────────────┴───────────────────────────┐  │
│  │              Services Layer (api.ts)               │  │
│  │     ┌──────────────────────────────────┐           │  │
│  │     │   Security Module (security.ts)  │           │  │
│  │     │  • Input sanitization (XSS/SQLi) │           │  │
│  │     │  • File validation & rate limit  │           │  │
│  │     │  • Auth guards & role checks     │           │  │
│  │     └──────────────────────────────────┘           │  │
│  └────────────────────────┬───────────────────────────┘  │
└───────────────────────────┼──────────────────────────────┘
                            │ HTTPS only
                ┌───────────┴───────────┐
                │   Supabase Backend    │
                │  ┌─────────────────┐  │
                │  │   PostgreSQL    │  │
                │  │  + RLS Policies │  │
                │  ├─────────────────┤  │
                │  │    Storage      │  │
                │  │  (Attachments)  │  │
                │  ├─────────────────┤  │
                │  │   Auth (JWT)    │  │
                │  └─────────────────┘  │
                └───────────────────────┘
```

---

## 🎨 Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `republicGreen` | `#006233` | Primary — headers, buttons, FAB |
| `activeGreen` | `#00A651` | Gradient endpoints, active states |
| `surfaceGreen` | `#E8F5E9` | Light green backgrounds |
| `governmentGold` | `#D4AF37` | Authority accents, role badges, dividers |
| `offWhite` | `#F5F5F0` | Page backgrounds |
| `cardWhite` | `#FFFFFF` | Card surfaces |
| `deepNavy` | `#1A1A2E` | Primary text |
| `textSecondary` | `#5A6072` | Body text |
| `textMuted` | `#9BA3B8` | Captions, timestamps |

### Status Colors

| Status | Arabic | French | Color |
|--------|--------|--------|-------|
| Pending | معلق | En attente | `#F57F17` Amber |
| Assigned | مُسنَد | Assigné | `#1565C0` Blue |
| In Progress | قيد التنفيذ | En cours | `#6A1B9A` Purple |
| Completed | مكتمل | Terminé | `#2E7D32` Green |
| Approved | مُعتمَد | Approuvé | `#006233` Republic Green |

### Typography
- **Arabic**: Noto Naskh Arabic (system fallback)
- **Latin**: Inter / System default
- **Scale**: 8pt grid spacing system (4, 8, 16, 24, 32, 48)

### Visual Identity
- **Algerian Flag** — SVG rendered per Law No. 63-145 proportions
- **Zellij Patterns** — Geometric diamond overlays on gradient headers
- **Gold Dividers** — Decorative separators for institutional authority
- **Light Mode Only** — High-contrast, accessible, government-appropriate

---

## 🌍 Bilingual Support (Arabic/French)

### Architecture

```
i18n/strings.ts          — 130+ translation keys
hooks/useLanguage.tsx     — Context provider + AsyncStorage persistence
components/LanguageToggle — AR|FR pill toggle
```

### How It Works

1. **`LanguageProvider`** wraps the entire app, loading saved preference from `AsyncStorage`
2. **`useLanguage()`** hook provides `{ lang, isRTL, setLanguage, t }` to all components
3. **`t('key')`** returns the localized string for the current language
4. **RTL** is handled via `I18nManager.forceRTL()` — all layouts flip automatically
5. **Arabic numerals** — `toArabicNumeral()` converts `123` → `١٢٣` when `lang === 'ar'`

### Switching Language

```tsx
const { t, setLanguage } = useLanguage();

// Toggle
await setLanguage('ar'); // Arabic + RTL
await setLanguage('fr'); // French + LTR
```

---

## 🔒 Security

### Threat Model & Protections

| Attack Vector | Protection | File |
|---------------|-----------|------|
| **SQL Injection** | Supabase parameterized queries + input sanitization | `security.ts` |
| **XSS** | HTML/script tag stripping, event handler removal | `security.ts` |
| **CSRF** | Supabase JWT auth with auto-refresh tokens | `supabaseConfig.ts` |
| **Path Traversal** | Filename sanitization (`../../` stripping) | `security.ts` |
| **File Upload Attacks** | Extension allowlist (jpg/png/webp/heic only), 10MB size limit | `security.ts` |
| **Impersonation** | `userId` always derived from `auth.getUser()`, never from client input | `api.ts` |
| **Unauthorized Access** | `requireAuth()` on every endpoint, `requireRole()` for team leaders | `api.ts` |
| **Broken Access Control** | Ownership verification before status updates | `api.ts` |
| **Rate Limiting** | 5 reports/min, 3 completion uploads/min (client-side) | `security.ts` |
| **Data Leak** | All `console.log` removed from production API code | `api.ts` |
| **Unnecessary Permissions** | Only camera, gallery, and location — no audio/contacts/etc. | `app.json` |
| **Cleartext Traffic** | HTTPS enforced via Supabase client | `supabaseConfig.ts` |

### Row Level Security (Supabase)

```sql
-- Citizens can only read their own reports
CREATE POLICY "citizens_read_own" ON reports
  FOR SELECT USING (auth.uid() = reporter_id);

-- Team leaders can only read reports assigned to them
CREATE POLICY "tl_read_assigned" ON reports
  FOR SELECT USING (auth.uid() = team_leader);

-- Citizens can only insert reports with their own ID
CREATE POLICY "citizens_insert_own" ON reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React Native (Expo SDK 54) |
| **Navigation** | React Navigation 7 (Stack + Bottom Tabs) |
| **UI Library** | React Native Paper (Material Design 3) |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **State** | React Context API + Hooks |
| **Forms** | Formik + Yup validation |
| **Visuals** | expo-linear-gradient, react-native-svg, expo-blur |
| **Media** | expo-image-picker, expo-file-system |
| **Location** | expo-location |
| **Storage** | @react-native-async-storage |
| **Language** | TypeScript |

---

## 📁 Project Structure

```
urban-issue-app/
├── App.tsx                          # Entry point (providers: Paper, SafeArea, Language, Navigation)
├── theme.ts                         # Design tokens: colors, typography, spacing, shadows
├── app.json                         # Expo configuration & permissions
├── package.json                     # Dependencies
│
├── i18n/
│   └── strings.ts                   # 130+ bilingual strings (Arabic/French) + t() helper
│
├── hooks/
│   ├── useAuth.ts                   # Supabase auth state listener
│   └── useLanguage.tsx              # Language context provider (AR/FR + RTL)
│
├── services/
│   ├── supabaseConfig.ts            # Supabase client initialization
│   ├── api.ts                       # All API functions (CRUD, uploads) — security-hardened
│   └── security.ts                  # Input sanitization, validation, rate limiting, auth guards
│
├── components/
│   ├── GovHeader.tsx                # Government gradient header with Zellij SVG overlay
│   ├── ReportCard.tsx               # Report list card with priority bar + press animation
│   ├── StatusBadge.tsx              # Colored status pill badge
│   ├── PriorityBadge.tsx            # Priority dot + label
│   ├── EmptyState.tsx               # Custom SVG illustrations for empty/error states
│   ├── LanguageToggle.tsx           # AR|FR pill toggle switch
│   └── SkeletonCard.tsx             # Shimmer loading placeholder
│
├── screens/
│   ├── LoginScreen.tsx              # Algerian flag, republic name, gradient header, form
│   ├── RegisterScreen.tsx           # Registration with bilingual labels
│   ├── HomeScreen.tsx               # Citizen dashboard: stats, report list, FAB
│   ├── ReportScreen.tsx             # New report form: info, priority, photos, location
│   ├── ReportDetailsScreen.tsx      # Hero image, timeline, info cards, maps link
│   ├── ProfileScreen.tsx            # Avatar, stats, language toggle, settings, logout
│   ├── TeamLeaderHomeScreen.tsx     # Task list with filter tabs
│   ├── TeamLeaderReportDetailsScreen.tsx  # Work actions + status management
│   └── TeamLeaderCompletionUploadScreen.tsx  # Multi-image proof upload
│
├── navigation/
│   └── AppNavigator.tsx             # Role-based routing (Citizen tabs / TL tabs / Auth stack)
│
└── types/
    └── database.ts                  # Supabase TypeScript schema types
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **Expo CLI** (`npm install -g expo-cli`)
- **Expo Go** app on your phone (iOS/Android)
- **Supabase** account with a project set up

### Installation

```bash
# Clone the repository
git clone https://github.com/bennaceurIlyes/urbain_reportapp.git
cd urbain_reportapp

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your Supabase credentials

# Start the development server
npx expo start
```

### Running on Device

1. Scan the QR code with **Expo Go** (Android) or the Camera app (iOS)
2. The app defaults to **Arabic (RTL)** — toggle to French via the AR|FR switch

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> ⚠️ **Never commit `.env` to version control.** The `.gitignore` already excludes it.

---

## 🗄️ Database Schema

### `reports` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` (PK) | Auto-generated unique report ID |
| `created_at` | `timestamptz` | Report creation timestamp |
| `title` | `text` | Sanitized report title (3-200 chars) |
| `description` | `text` | Sanitized description (10-2000 chars) |
| `priority` | `integer` | 1 (Low), 2 (Medium), 3 (High) |
| `status` | `text/integer` | pending → assigned → in_progress → completed → approved |
| `reporter_id` | `uuid` (FK) | References `auth.users.id` |
| `location` | `jsonb` | `{ latitude, longitude }` GPS coordinates |
| `team_leader` | `uuid` (FK) | Assigned team leader's user ID |
| `assigned_to_at` | `timestamptz` | When the report was assigned |
| `completion_images` | `text[]` | Array of public URLs for proof photos |
| `completed_at` | `timestamptz` | When marked complete |
| `approved_at` | `timestamptz` | When approved by admin |

### `attachments` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | `serial` (PK) | Auto-incremented attachment ID |
| `issue_id` | `uuid` (FK) | References `reports.id` |
| `file_url` | `text` | Storage path in Supabase bucket |
| `name` | `text` | Sanitized filename |
| `uploaded_at` | `timestamptz` | Upload timestamp |

---

## 📱 Screens

### Authentication
| Screen | Description |
|--------|-------------|
| **Login** | Algerian flag + republic name header, green gradient with Zellij overlay, email/password form, AR/FR toggle |
| **Register** | Same green header, 3-field form (email, password, confirm), bilingual validation errors |

### Citizen
| Screen | Description |
|--------|-------------|
| **Home** | GovHeader with badge count, 3 stat cards, report FlatList with pull-to-refresh, skeleton loading, FAB |
| **New Report** | Sectioned form: title/description card, priority pills, camera/gallery photo, GPS location card |
| **Report Details** | Hero image with gradient overlay, status+priority badges, 5-step timeline, info cards, Google Maps link |
| **Profile** | Avatar with gold role badge, stats row, language toggle section, settings menu, logout |

### Team Leader
| Screen | Description |
|--------|-------------|
| **Tasks Home** | Filter tabs (All/Pending/In Progress), assigned task list with time indicators |
| **Task Details** | Work Actions card (Start Work / Upload Proof / Approve), status management, location info |
| **Completion Upload** | Multi-image grid (max 6), camera + gallery, completion notes, submit with validation |

---

## 📚 API Reference

### `submitReport(data: ReportData): Promise<string>`
Creates a new citizen report with image and location. Returns the report ID.
- **Auth**: Required (citizen)
- **Rate limit**: 5/min
- **Validation**: Title (3-200 chars), Description (10-2000 chars), Priority (1-3), Location (valid GPS), File (image only, ≤10MB)

### `getUserReports(): Promise<ReportWithAttachments[]>`
Fetches all reports for the authenticated citizen, newest first.
- **Auth**: Required

### `getTeamLeaderReports(): Promise<ReportWithAttachments[]>`
Fetches all reports assigned to the authenticated team leader.
- **Auth**: Required (team_leader role)

### `updateReportStatus(reportId: string, status: string | number): Promise<void>`
Updates report status. Verifies caller is the assigned team leader.
- **Auth**: Required (assigned team leader only)
- **Validation**: UUID format, valid status value, ownership check

### `uploadCompletionImages(reportId: string, imageUris: string[]): Promise<string[]>`
Uploads proof-of-completion images and marks report as completed.
- **Auth**: Required (assigned team leader only)
- **Rate limit**: 3/min
- **Validation**: UUID, max 6 images, image type only, ≤10MB each, ownership check

---

## 👥 Contributing

This is a private government project. Contributions are managed internally.

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -m "feat: description"`
3. Push: `git push origin feature/my-feature`
4. Open a Pull Request

### Commit Convention

- `feat:` — New feature
- `fix:` — Bug fix  
- `security:` — Security improvement
- `docs:` — Documentation
- `style:` — UI/styling changes (no logic)
- `refactor:` — Code restructuring

---

<div align="center">

**بلدية — ولاية**

*Built for the service of Algerian citizens*

🇩🇿

</div>
