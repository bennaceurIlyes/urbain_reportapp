# Prompt for Claude: UI/UX Redesign of Urban Issue App

## System Role & Objective
You are an expert React Native developer and UI/UX Designer. Your objective is to completely redesign the "Urban Issue App", elevating it to a premium, production-grade, and visually stunning mobile experience. 

## Project Context
The Urban Issue App is a citizen reporting platform where:
1. **Citizens** can report urban problems (potholes, broken streetlights, etc.) by uploading photos and tagging their location.
2. **Team Leaders** are assigned these issues by an Admin (via a separate web platform). They use the mobile app to view their assigned tasks, start work, upload proof of completion, and mark the issue as resolved.
3. **Admins** manage the entire workflow exclusively on a separate web platform (do not build admin features in the mobile app).

## Tech Stack
- React Native (Expo)
- React Navigation (Native Stack & Bottom Tabs)
- UI Library: React Native Paper (currently used, but feel free to heavily customize or build custom components for a premium look)
- Backend: Supabase (Auth, Database, Storage)
- Icons: `@expo/vector-icons` (MaterialCommunityIcons)
- Maps/Location: `expo-location`, `Linking` (for Google Maps integration)
- Camera/Gallery: `expo-image-picker`
- Visual Effects: `expo-blur`, `expo-linear-gradient`

## Current App Structure
The app uses a role-based navigation flow in `navigation/AppNavigator.tsx`, conditionally rendering stacks based on `user.user_metadata.role`.

**1. Auth Flow**: 
- `LoginScreen`, `RegisterScreen`.

**2. Citizen Flow** (role: standard/null): 
- `HomeScreen`: Feed of the citizen's submitted reports.
- `ReportScreen`: Form to submit a new issue (Title, Description, Priority, Image, Location).
- `ReportDetailsScreen`: View details of a specific report (Timeline, Status, Clickable Location).
- `ProfileScreen`: User settings and logout.

**3. Team Leader Flow** (role: team_leader):
- `TeamLeaderHomeScreen`: Feed of reports explicitly assigned to them (`team_leader = auth.uid()`).
- `TeamLeaderReportDetailsScreen`: View report details with "Work Actions" (Start Work, Mark Completed, Approve Work).
- `TeamLeaderCompletionUploadScreen`: Upload multiple proof-of-completion images and submit notes.

## Database Schema (Supabase)
**Table: `reports`**
- `id` (uuid)
- `created_at` (timestamp)
- `title` (text)
- `description` (text)
- `priority` (number: 1=Low, 2=Medium, 3=High)
- `status` (string/number: pending, assigned, in_progress, completed, approved)
- `reporter_id` (uuid)
- `team_leader` (uuid)
- `location` (json string: `{ latitude, longitude }`)
- `assigned_to_at` (timestamp)
- `completion_images` (text array - URLs)
- `completed_at` (timestamp)
- `approved_at` (timestamp)

**Table: `attachments`** (Used for initial citizen photos)
- `id` (number)
- `issue_id` (uuid - references reports)
- `file_url` (string)
- `name` (string)

## Redesign Directives (Your Task)
I want you to rewrite the frontend UI/UX of this app. The current app works perfectly in terms of logic and API calls, but it looks basic. 

**Please implement the following design philosophy:**
1. **Premium Aesthetics**: Move away from standard generic layouts. Use a highly curated color palette, modern typography, and refined spacing.
2. **Glassmorphism & Gradients**: Use `expo-linear-gradient` and `expo-blur` to create stunning floating bottom tabs, translucent headers, and modern cards.
3. **Micro-interactions & Animations**: Add subtle feedback to buttons (scale on press using Reanimated or standard Animated API) and smooth transitions between states.
4. **Enhanced Empty States**: Make empty states (like "No reports yet") look beautiful with custom illustrations or beautifully styled icon layouts.
5. **Polished Cards**: The report feed cards should look like a modern social feed or a premium task manager (e.g., Linear or modern Apple apps).
6. **Unified Theming**: Create a robust `theme.ts` file that manages all colors, spacing, and typography cleanly. 

**Strict Rules:**
- Do NOT change the Supabase database schema or RLS policies.
- Do NOT break the existing logic in `services/api.ts` or `hooks/useAuth.ts`.
- Focus entirely on the `screens/`, `components/`, and `navigation/` files.
- Ensure the app remains highly performant.

Please start by suggesting a new Color Palette and Typography system, and then provide the code to rewrite the core UI components, `AppNavigator.tsx`, and the main Screens (`HomeScreen`, `TeamLeaderHomeScreen`, and `ReportDetailsScreen`) to reflect this new premium design.
