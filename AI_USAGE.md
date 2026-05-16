# AI Usage Log — Tara! App

This file documents all AI-assisted code in the project.
Each entry contains the prompt and the files that were generated or modified.

---

## 1

**Prompt:**
> Identified a layout inconsistency where UI elements on the Home and Notifications screens are positioned too close to the top of the viewport, lacking sufficient spacing between the header and the scrollable content area. Requested a fix to introduce proper top padding to the scroll container on both screens to achieve a balanced and visually consistent layout.

**Files Modified:**
- `app/(tabs)/index.tsx` — Added `paddingTop: Spacing.xl` to `scrollContent` style
- `app/(tabs)/notifications.tsx` — Added `paddingTop: Spacing.xl` to `scrollContent` style

---

## 2

**Prompt:**
> Requested the implementation of screen transition animations to enhance the user experience when navigating between tabs. The animation should trigger consistently on every tab switch — not solely on initial component mount — to deliver a smooth, polished feel throughout the application.

**Files Created / Modified:**
- `components/AnimatedScreen.tsx` *(new)* — Reusable wrapper component utilizing `useFocusEffect` and `Animated.timing` to execute a fade-in transition on every tab activation
- `app/(tabs)/index.tsx` — Wrapped root View with `<AnimatedScreen>`
- `app/(tabs)/notifications.tsx` — Wrapped root View with `<AnimatedScreen>`
- `app/(tabs)/profile.tsx` — Wrapped root View with `<AnimatedScreen>`

---

## 3

**Prompt:**
> Requested the replacement of the existing binary dark mode toggle with a comprehensive visual theme selection interface. The new component should feature a three-option brightness mode segmented control (System / Light / Dark) alongside a set of selectable color palette preview cards (Default, Dynamic, Green Apple). All theme changes must propagate globally and reactively across all screens. The component should be accessible exclusively from the Profile tab.

**Files Created / Modified:**
- `constants/theme.ts` — Added `THEME_PALETTES` object, `buildColors()` helper function, and `ThemeName` type export
- `contexts/ThemeContext.tsx` — Refactored to support dual state management: `colorMode` for brightness and `themeName` for palette, exposing `setColorMode` and `setThemeName` setters
- `components/ThemePicker.tsx` *(new)* — Visual theme picker UI component with brightness segmented control and mini phone preview cards per palette
- `app/(tabs)/profile.tsx` — Removed `Switch` component, integrated `<ThemePicker />` under a dedicated APPEARANCE section

---

## 4

**Prompt:**
> Clarified that the intended behavior was page-level transition animations triggered on tab focus rather than a one-time mount animation. Requested an update to `AnimatedScreen` to utilize `useFocusEffect` for proper tab-switch transitions. Additionally, requested the creation of a dedicated Settings screen to centralize all application configuration — including appearance, preferences, legal, and account management — and the refactoring of the Profile screen to display only user-specific information with navigation to the new Settings screen.

**Files Created / Modified:**
- `components/AnimatedScreen.tsx` — Migrated from `useEffect` to `useFocusEffect` to trigger the fade animation on every tab focus event
- `app/(tabs)/settings.tsx` *(new)* — Dedicated settings screen organized into four sections: APPEARANCE, PREFERENCES, LEGAL, and ACCOUNT
- `app/(tabs)/_layout.tsx` — Registered `settings` as a hidden tab route using `href: null`
- `app/(tabs)/profile.tsx` — Refactored to display profile information and quick-access links only; added gear icon in the header for navigation to Settings

---

## 5

**Prompt:**
> Requested the creation of a comprehensive codebase documentation file (`Guide.md`) written in beginner-accessible language, covering the project's folder structure, React Context implementation, screen-by-screen breakdown, component behavior, navigation architecture, and recurring coding patterns. The document should also include anticipated examination questions with concise answers to assist the team during a professor-led project defense. Additionally, requested that both `Guide.md` and `AI_USAGE.md` be excluded from version control by adding them to `.gitignore`.

**Files Created / Modified:**
- `Guide.md` *(new)* — Full codebase study guide with annotated code snippets, concept explanations, and a professor Q&A reference table
- `.gitignore` — Appended `Guide.md` and `AI_USAGE.md` to prevent inclusion in the remote repository

---

## 6

**Prompt:**
> Requested a properly formatted GitLab issue title for the task of integrating `@react-native-async-storage` into the application. Also requested a beginner-friendly technical explanation of AsyncStorage — including its purpose, how it functions within a React Native context, a practical analogy, and its relevance to the project's grading rubric under the Data Persistence requirement.

**Output:**
- No code generated — documentation and issue scoping only
- Issue title provided: `feat: Implement AsyncStorage for local data persistence`

---
