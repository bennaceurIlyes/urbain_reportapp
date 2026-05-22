# ADE Béchar Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand and reskin the "Algérie Urbaine" mobile app into the "ADE Béchar" official water utility application.

**Architecture:** Use Approach B (theme-driven semantic mapping) to define colors, typography, and helper methods centrally in `theme.ts`. Align the visual design using water wave elements, AliceBlue surfaces, and deep water blues while keeping all functional and query logic completely untouched.

**Tech Stack:** React Native, Expo SDK 54, Expo Canvas, SVG vector components, TypeScript, i18n translation maps.

---

### Task 1: Redesign the Color Theme and Typography in `theme.ts`

**Files:**
- Modify: `theme.ts`

- [ ] **Step 1: Replace all primary, status, priority, and utility color tokens in theme.ts**
- [ ] **Step 2: Add Cairo and Montserrat typography tokens**
- [ ] **Step 3: Keep legacy green color aliases for backwards compatibility**
- [ ] **Step 4: Update custom helper methods `getStatusColor` and `getPriorityColor` to utilize the new water-blue semantic keys**

---

### Task 2: Redesign the Header in `components/GovHeader.tsx`

**Files:**
- Modify: `components/GovHeader.tsx`

- [ ] **Step 1: Replace republicGreen and activeGreen gradient with deep Saharan blue gradient (`#0D4F75` → `#1A7DB8`)**
- [ ] **Step 2: Swap the Zellij SVG grid with a custom repeating water sine-wave SVG Pattern**
- [ ] **Step 3: Update the subtitle text based on current language context (Arabic: "وحدة بشار — الجزائرية للمياه" | French: "ADE Béchar — Algérienne Des Eaux")**
- [ ] **Step 4: Set typography styling to Cairo-Bold/Regular and Montserrat-SemiBold**

---

### Task 3: Programmatically Generate PNG Assets

**Files:**
- Create: `generate_assets.js`
- Generate: `assets/logo.png`, `assets/splash.png`, `assets/icon.png`, `assets/adaptive-icon.png`

- [ ] **Step 1: Write a Node.js Canvas drawing script to render the ADE water drop logo**
- [ ] **Step 2: Execute the Node.js script to create/overwrite PNG assets in `/assets/`**
- [ ] **Step 3: Clean up the generator script**

---

### Task 4: Reskin Common Core Components

**Files:**
- Modify: `components/StatusBadge.tsx`
- Modify: `components/PriorityBadge.tsx`
- Modify: `components/SkeletonCard.tsx`
- Modify: `components/EmptyState.tsx`
- Modify: `components/LanguageToggle.tsx`
- Modify: `components/ReportCard.tsx`

- [ ] **Step 1: Update StatusBadge.tsx with the 5 new STATUS_STYLES colors**
- [ ] **Step 2: Update PriorityBadge.tsx with the 4 new PRIORITY_STYLES colors**
- [ ] **Step 3: Modify SkeletonCard.tsx to feature blue-tinted shimmers**
- [ ] **Step 4: Reskin EmptyState.tsx with water icons, Cairo/Montserrat fonts, and updated water messages**
- [ ] **Step 5: Apply theme-consistent color mappings to LanguageToggle.tsx**
- [ ] **Step 6: Reskin ReportCard.tsx with AliceBlue backgrounds, sky blue borders, and blue-tinted shadows**

---

### Task 5: Complete Bilingual Translation and Notification Updates

**Files:**
- Modify: `i18n/strings.ts`
- Modify: `hooks/useReportNotifications.ts`

- [ ] **Step 1: Replace branding/organization strings in `strings.ts` (e.g. "انشغالاتي" to "الجزائرية للمياه")**
- [ ] **Step 2: Update notification headers in `useReportNotifications.ts` to show "الجزائرية للمياه — وحدة بشار" and "ADE Béchar"**

---

### Task 6: Reskin app.json Expo Identity Settings

**Files:**
- Modify: `app.json`

- [ ] **Step 1: Update app.json `name`, `slug`, `package`, `bundleIdentifier`, and color specifications**

---

### Task 7: Reskin Citizen-Facing Screens

**Files:**
- Modify: `screens/LoginScreen.tsx`
- Modify: `screens/RegisterScreen.tsx`
- Modify: `screens/HomeScreen.tsx`
- Modify: `screens/ReportScreen.tsx`
- Modify: `screens/ReportDetailsScreen.tsx`
- Modify: `screens/ProfileScreen.tsx`

- [ ] **Step 1: Reskin LoginScreen.tsx and RegisterScreen.tsx (Backgrounds, inputs, buttons, and logos)**
- [ ] **Step 2: Reskin HomeScreen.tsx (Stats cards, floating action button, refresh indicators)**
- [ ] **Step 3: Reskin ReportScreen.tsx (Water categories, photo upload dotted areas, location pin tags)**
- [ ] **Step 4: Reskin ReportDetailsScreen.tsx (Hero overlay gradient, progress timeline nodes)**
- [ ] **Step 5: Reskin ProfileScreen.tsx (Profile gradient, avatar icons, watermark logo)**

---

### Task 8: Reskin Team Leader Screens

**Files:**
- Modify: `screens/TeamLeaderHomeScreen.tsx`
- Modify: `screens/TeamLeaderReportDetailsScreen.tsx`
- Modify: `screens/TeamLeaderCompletionUploadScreen.tsx`

- [ ] **Step 1: Reskin TeamLeaderHomeScreen.tsx (Tabs, task cards, counts badges)**
- [ ] **Step 2: Reskin TeamLeaderReportDetailsScreen.tsx (Action buttons, details cards)**
- [ ] **Step 3: Reskin TeamLeaderCompletionUploadScreen.tsx (Photo upload slots, notes inputs, completion submit button)**
