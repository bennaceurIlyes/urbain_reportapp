# Design Specification: ADE Béchar App Redesign
## Complete Visual Identity & Theme Migration Spec

---

## 🎯 Project Overviewa
* **Target Brand**: ADE Béchar (الجزائرية للمياه — وحدة بشار)
* **Application**: React Native (Expo SDK 54) Mobile Application
* **Objective**: Rebrand and reskin the generic Algerian urban reporting application to the official Saharan-wilaya regional unit of the Algerian Water Utility.
* **Core Principle**: ZERO changes to functionality, database queries (Supabase), navigation logic, or security policies. Purely visual, branding, and localization string updates.

---

## 🎨 Color System & Token Definition

We will perform a full replacement of the color tokens in `theme.ts` to implement **Approach B (Theme-driven semantic mapping)**.

### Semantic Color Definitions
* **Primary Brand Accent (`adeDeepBlue` - `#1A5F8A`)**: Deep water blue, used for headers, primary buttons, and critical UI anchors.
* **Secondary Brand Accent (`adeMediumBlue` - `#2980B9`)**: Medium blue, used for active states, active tab indicators, and location tags.
* **Highlight Accent (`adeSkyBlue` - `#4BAAD3`)**: Sky blue, used for category chips, card borders, and key borders.
* **Tint / Pale Surface (`adePaleBlue` - `#D6EAF8`)**: Light water-blue, used for statistics containers and light page blocks.
* **Background Surface (`adeIceBlue` - `#EBF5FB`)**: Ultra-light ice blue, used for input backgrounds and list spaces.

### `theme.ts` Token Replacements
The file `theme.ts` will declare these primary colors, map them to standard React Native Paper properties, and define legacy aliases for safety:
* `republicGreen` mapped to `colors.adeDeepBlue`
* `activeGreen` mapped to `colors.headerGradientEnd`
* `pendingYellow` mapped to `colors.statusPending`
* `resolvedGreen` mapped to `colors.statusCompleted`

---

## 🖋️ Typography & Icons

* **Arabic Font**: Cairo (`Cairo-Regular` & `Cairo-Bold`)
* **French/Latin Font**: Montserrat (`Montserrat-Regular` & `Montserrat-SemiBold`)
* **Water-Specific Category Pickers**:
  1. *Fuite d'eau / تسرب مياه*: `water-pump`
  2. *Coupure d'eau / انقطاع المياه*: `pipe-disconnected`
  3. *Faible pression / ضغط ضعيف*: `gauge-low`
  4. *Eau contaminée / تلوث المياه*: `water-alert`
  5. *Compteur défectueux / عطل عداد*: `gauge`
  6. *Assainissement / صرف صحي*: `pipe`
  7. *Réseau endommagé / تلف شبكة*: `pipe-leak`
  8. *Autre / أخرى*: `dots-horizontal`

---

## 🏛️ GovHeader Redesign

* Replace gradient colors with Saharan Navy to water blue (`#0D4F75` → `#1A7DB8`).
* Replace the classic Algerian Zellij SVG pattern with a repeating double sine-wave pattern representing flowing water waves.
* Dynamically render regional unit titles underneath the page name:
  * **AR**: `وحدة بشار — الجزائرية للمياه`
  * **FR**: `ADE Béchar — Algérienne Des Eaux`

---

## 🖼️ Programmatic Asset Generation

We will create a Node.js canvas script that programmatically draws a high-resolution ADE water drop logo:
* **Background**: AliceBlue (#F0F8FF) or brand gradient (#0D4F75 → #1A5F8A → #1A7DB8).
* **Drop shape**: Sky Blue teardrop with double wave lines in the middle.
* **Branding text**: Cairo and Montserrat stylized typography.
* Outputs written directly to `/assets/logo.png`, `/assets/splash.png`, `/assets/icon.png`, and `/assets/adaptive-icon.png`.

---

## 📱 Screen-by-Screen Reskin Mapping

1. **Login & Register Screens**:
   * Change gradients from green-national to brand water blue gradient.
   * Add ADE Béchar Arabic & French subtitles.
   * Update text fields and primary buttons.
2. **Citizen Dashboard (HomeScreen)**:
   * AliceBlue page background.
   * Tinted stats cards with sky blue borders.
   * Water-themed empty states and custom FAB.
3. **Report Submission Form (ReportScreen)**:
   * Updated category selector chips.
   * Dotted Sky Blue upload card area.
4. **Report Details Screen**:
   * Hero image blue-brand overlay gradient.
   * Timeline progress indicators featuring updated status colors.
5. **Profile Screen**:
   * Gradient background profile header.
   * Muted list separators.
6. **Team Leader Screens**:
   * Water-themed stats, task filter tabs, and photo upload blocks.

---

## ✅ Consistency & Review Checklist
- [x] No green colors remain except for Algeria flag accent dots.
- [x] Wave patterns successfully substitute Zellij patterns.
- [x] Semantic mappings protect legacy code bindings.
- [x] Assets generated and correctly packaged.
