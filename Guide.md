# 📚 Tara! App — Code Study Guide

This guide explains every important part of the codebase in simple terms.
Use this to prepare for your professor's questions.

---

## 📁 Folder Structure

```
AppDevFinal/
├── app/                   ← All screens live here (Expo Router reads this)
│   ├── _layout.tsx        ← Root layout: wraps the whole app
│   ├── sign-in.tsx        ← Login screen
│   └── (tabs)/            ← All tab screens
│       ├── _layout.tsx    ← Tab bar configuration
│       ├── index.tsx      ← Home screen ("Kaganapan")
│       ├── notifications.tsx
│       ├── profile.tsx
│       ├── settings.tsx
│       └── event.tsx      ← Event detail screen
│
├── components/            ← Reusable UI pieces
│   ├── AnimatedScreen.tsx ← Tab transition wrapper
│   └── ThemePicker.tsx    ← Appearance settings widget
│
├── contexts/              ← Global state shared across all screens
│   ├── AuthContext.tsx    ← Who is logged in?
│   └── ThemeContext.tsx   ← What theme/color mode is active?
│
└── constants/
    └── theme.ts           ← All colors, spacing, and radius values
```

---

## 🧠 Core Concept: React Context

Before diving in, you need to understand **Context**.

> **What is Context?**
> Imagine a group chat. Everyone in the chat can read and send messages without having to pass a note person-to-person. Context works the same way — it's a "shared space" where any component in the app can read data without passing it down manually through every parent.

The app uses **two Contexts**:
1. `AuthContext` — tracks if the user is signed in and their name
2. `ThemeContext` — tracks the selected color theme and brightness mode

---

## 🔐 AuthContext (`contexts/AuthContext.tsx`)

### What it does
Manages whether the user is logged in or not.

### Key parts explained

```tsx
// This defines WHAT data the context will hold
type AuthContextType = {
  isSignedIn: boolean;       // true = user is logged in
  userName: string;          // the user's display name
  signIn: (name?: string) => void;  // function to log in
  signOut: () => void;              // function to log out
};
```

```tsx
// createContext creates the "shared space"
// undefined is the default before the Provider wraps the app
const AuthContext = createContext<AuthContextType | undefined>(undefined);
```

```tsx
// AuthProvider is the "group chat room" — it holds the actual data
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);  // starts logged out
  const [userName, setUserName] = useState('Jhirick');  // default name

  const signIn = (name?: string) => {
    if (name) setUserName(name);  // optionally update name
    setIsSignedIn(true);          // mark as logged in
  };

  const signOut = () => {
    setIsSignedIn(false);         // mark as logged out
  };

  // value = the data all children can access
  return (
    <AuthContext.Provider value={{ isSignedIn, userName, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
```

```tsx
// useAuth is how any screen "reads from the group chat"
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
```

### How to use it in a screen
```tsx
const { userName, signOut } = useAuth();
// Now you can use userName and call signOut()
```

**Professor question you might get:**
> *"What does `useContext` do?"*
> It reads the current value from a Context. Instead of passing props through every component, any child can call `useContext` to get the shared data directly.

---

## 🎨 ThemeContext (`contexts/ThemeContext.tsx`)

### What it does
Manages two things the user can change in Settings:
1. **Color Mode** — System / Light / Dark
2. **Theme Name** — which color palette (Default, Dynamic, Green Apple)

### Key parts explained

```tsx
// ColorMode is a TypeScript "union type" — only these 3 values are allowed
export type ColorMode = 'system' | 'light' | 'dark';
```

```tsx
export function ThemeProvider({ children }: { children: ReactNode }) {
  // useColorScheme reads the phone's system setting (light or dark)
  const systemScheme = useSystemColorScheme();

  const [colorMode, setColorMode] = useState<ColorMode>('system');
  const [themeName, setThemeName] = useState<ThemeName>('Default');

  // isDark is CALCULATED — not stored directly
  // If mode is 'dark' → always dark
  // If mode is 'system' → follow the phone's setting
  // If mode is 'light' → always light
  const isDark =
    colorMode === 'dark' ||
    (colorMode === 'system' && systemScheme === 'dark');

  // Build the full color object based on palette + isDark
  const theme = buildColors(THEME_PALETTES[themeName], isDark);
  ...
}
```

**Professor question you might get:**
> *"Why is `isDark` calculated instead of stored in `useState`?"*
> Because it depends on two other values (`colorMode` and `systemScheme`). If we stored it separately, it could get out of sync. Calculating it on every render ensures it's always correct.

---

## 🎨 Theme Constants (`constants/theme.ts`)

### What it does
Stores all the color values, spacing sizes, and border radius values used everywhere in the app.

### Theme Palettes

```ts
export const THEME_PALETTES = {
  Default:    { primary: '#3ABFAD', secondary: '#E8845A' }, // teal + orange
  Dynamic:    { primary: '#8B5CF6', secondary: '#EC4899' }, // purple + pink
  GreenApple: { primary: '#22C55E', secondary: '#EF4444' }, // green + red
};
```

### `buildColors()` function

```ts
// This function takes a palette and whether we want dark mode
// and returns a FULL color object for the whole app
function buildColors(palette, dark: boolean) {
  if (dark) {
    return {
      background: '#0D1117',  // very dark background
      surface: '#161B22',     // slightly lighter card backgrounds
      text: '#ECEDEE',        // near-white text
      tabIconSelected: palette.primary, // accent color from chosen theme
      // ...etc
    };
  }
  return {
    background: '#FFF8E7',    // cream background
    surface: '#FFFFFF',       // white cards
    text: '#1B2838',          // dark text
    tabIconSelected: palette.primary,
    // ...etc
  };
}
```

### Spacing and Radius

```ts
// Instead of writing 16, 24, etc. everywhere, we use named sizes
export const Spacing = {
  xs: 4,   sm: 8,   md: 12,
  lg: 16,  xl: 20,  xxl: 24,  xxxl: 32,
};

export const Radius = {
  sm: 8,  md: 12,  lg: 16,  xl: 20,  full: 999,
};
```

> Using named spacing keeps the design consistent. If you want to change all button padding, you change `Spacing.lg` in one place.

---

## 📱 Root Layout (`app/_layout.tsx`)

### What it does
The root layout is the **outermost wrapper** of the entire app. It:
1. Wraps everything in `ThemeProvider` and `AuthProvider`
2. Handles the splash screen animation
3. Decides whether to show the Sign-In screen or the main tabs

### Key parts explained

```tsx
// Keep the splash screen showing while the app loads
SplashScreen.preventAutoHideAsync();
```

```tsx
function InnerLayout() {
  const { isDark } = useAppTheme();
  const { isSignedIn } = useAuth();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await new Promise(resolve => setTimeout(resolve, 1500)); // wait 1.5s
      setAppReady(true);
      await SplashScreen.hideAsync(); // hide the native splash
      // Then fade out our custom overlay
      Animated.timing(fadeAnim, { toValue: 0, duration: 600, useNativeDriver: true }).start();
    }
    prepare();
  }, []); // empty [] = runs once on first load only

  // If not signed in → show sign-in screen
  if (!isSignedIn) return <SignInScreen />;

  // If signed in → show the main tab navigation
  return (
    <NavThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </NavThemeProvider>
  );
}
```

```tsx
// RootLayout wraps EVERYTHING in the two providers
export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InnerLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}
```

**Professor question you might get:**
> *"Why is `InnerLayout` separate from `RootLayout`?"*
> `InnerLayout` needs to call `useAppTheme()` and `useAuth()`, which only work **inside** their Providers. If we tried to call them in `RootLayout` itself, the Providers wouldn't exist yet — so we use a child component instead.

---

## 🗂️ Tab Layout (`app/(tabs)/_layout.tsx`)

### What it does
Configures the **bottom tab bar** — which tabs are visible, their icons, and which screens are hidden from the bar but still navigable.

```tsx
<Tabs screenOptions={{
  tabBarActiveTintColor: Brand.teal,  // selected tab color
  headerShown: false,                  // hide the default header
}}>
  <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ... }} />
  <Tabs.Screen name="notifications" options={{ title: 'Notifications', ... }} />
  <Tabs.Screen name="profile" options={{ title: 'Profile', ... }} />

  {/* These screens exist but DON'T show in the tab bar */}
  <Tabs.Screen name="event" options={{ href: null }} />
  <Tabs.Screen name="settings" options={{ href: null }} />
</Tabs>
```

> `href: null` hides a screen from the tab bar but keeps it accessible via `router.push()`.

---

## 🏠 Home Screen (`app/(tabs)/index.tsx`)

### What it does
The main dashboard showing:
- A greeting header with logo, notification bell, and avatar
- "Create Event" and "Join by QR" quick action buttons
- Horizontally scrollable active event cards
- List of past events with settle-up status

### Key techniques used

**`useSafeAreaInsets`** — adapts to different phone screen sizes:
```tsx
const insets = useSafeAreaInsets();
// Used as: paddingTop: insets.top + 12
// insets.top = the height of the status bar (varies by phone)
```

**`FlatList` for horizontal scrolling:**
```tsx
<FlatList
  data={ACTIVE_EVENTS}
  horizontal                          // scroll left-right
  showsHorizontalScrollIndicator={false}
  keyExtractor={(item) => item.id}    // unique key for each item
  renderItem={({ item }) => <EventCard item={item} />}
/>
```

**Dynamic styling with theme:**
```tsx
<View style={[styles.container, { backgroundColor: theme.background }]}>
// styles.container has the base styles (flex: 1)
// { backgroundColor: theme.background } overrides just the color
// This is how every screen changes color when the theme changes
```

---

## 🔔 Notifications Screen (`app/(tabs)/notifications.tsx`)

### What it does
Shows a list of notifications: event invites, payment nudges, item updates.

### Key technique — mapping data to UI:
```tsx
// NOTIFICATIONS is an array of objects defined at the top of the file
{NOTIFICATIONS.map((notif) => {
  // For each notification, look up the right icon from NOTIF_ICONS
  const iconConfig = NOTIF_ICONS[notif.type];
  return (
    <TouchableOpacity key={notif.id} style={...}>
      ...
    </TouchableOpacity>
  );
})}
```

> `.map()` loops through an array and returns a new array of JSX elements. React renders each one as a list item.

---

## 👤 Profile Screen (`app/(tabs)/profile.tsx`)

### What it does
Shows the user's avatar, name, stats, and quick navigation links. A gear icon in the header navigates to Settings.

```tsx
// Navigate to Settings when gear icon is tapped
<TouchableOpacity onPress={() => router.push('/(tabs)/settings')}>
  <Ionicons name="settings-outline" size={22} color={theme.text} />
</TouchableOpacity>
```

---

## ⚙️ Settings Screen (`app/(tabs)/settings.tsx`)

### What it does
A dedicated page for all app configuration, organized into 4 sections:
- **APPEARANCE** — ThemePicker component
- **PREFERENCES** — Notifications, Language
- **LEGAL** — Privacy, Help
- **ACCOUNT** — Sign Out

### Reusable `SettingRow` component inside the file:
```tsx
// A component defined INSIDE settings.tsx (not exported separately)
// This avoids repeating the same card layout for every setting
function SettingRow({ icon, label, iconBg, iconColor, onPress }) {
  const { theme } = useAppTheme();
  return (
    <TouchableOpacity style={[styles.settingCard, ...]} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIconWrap, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        <Text style={[styles.settingText, { color: theme.text }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
    </TouchableOpacity>
  );
}
```

---

## 🎬 AnimatedScreen (`components/AnimatedScreen.tsx`)

### What it does
A wrapper component that plays a **fade-in animation every time you switch tabs**.

### How it works step by step:

```tsx
export default function AnimatedScreen({ children, style }: Props) {
  // useRef creates a value that persists across renders without causing re-renders
  // Animated.Value(0) starts at 0 (invisible)
  const opacity = useRef(new Animated.Value(0)).current;

  // useFocusEffect fires every time this screen becomes the active tab
  useFocusEffect(
    useCallback(() => {
      opacity.setValue(0);  // reset to invisible

      Animated.timing(opacity, {
        toValue: 1,          // animate to fully visible
        duration: 220,       // 220 milliseconds
        useNativeDriver: true, // runs on the native thread = smoother
      }).start();
    }, [opacity])
  );

  return (
    // Animated.View is like a regular View but can animate its style
    <Animated.View style={[styles.wrapper, { opacity }]}>
      {children}
    </Animated.View>
  );
}
```

**Professor questions you might get:**
> *"What is `useRef` used for here?"*
> `useRef` stores the `Animated.Value` without re-rendering the component when it changes. If we used `useState`, every animation tick would cause a re-render.

> *"What is `useNativeDriver: true`?"*
> It tells React Native to run the animation on the device's native UI thread instead of JavaScript. This makes animations much smoother because JavaScript is busy doing other things.

> *"What is `useCallback` for?"*
> `useCallback` memoizes (remembers) a function so it isn't recreated every render. `useFocusEffect` requires this to avoid infinite loops.

---

## 🖌️ ThemePicker (`components/ThemePicker.tsx`)

### What it does
A UI widget in Settings that lets the user pick:
1. **Brightness mode** (System / Light / Dark) via a segmented control
2. **Color theme** (Default / Dynamic / Green Apple) via tappable preview cards

### Inner component pattern:
```tsx
// ThemePreviewCard is a private component — only used inside this file
function ThemePreviewCard({ name, isSelected, onPress }) {
  const palette = THEME_PALETTES[name]; // get colors for this theme

  return (
    <TouchableOpacity
      style={[
        styles.previewCard,
        // Only apply blue border if this card is selected
        isSelected && { borderColor: palette.primary, borderWidth: 2 },
      ]}
      onPress={onPress}
    >
      {/* Show checkmark only on selected card */}
      {isSelected && (
        <View style={[styles.checkBadge, { backgroundColor: palette.primary }]}>
          <Ionicons name="checkmark" size={10} color="#fff" />
        </View>
      )}
      {/* Mini phone mockup showing the palette colors */}
      ...
    </TouchableOpacity>
  );
}
```

> The `&&` operator in JSX is a conditional render shortcut.
> `{isSelected && <View />}` means: "only render this View if isSelected is true."

---

## 🧭 Navigation with Expo Router

### How routing works
Expo Router uses the **file system as navigation**. The file name = the route.

| File | Route |
|---|---|
| `app/(tabs)/index.tsx` | The Home tab (shown first) |
| `app/(tabs)/notifications.tsx` | The Notifications tab |
| `app/(tabs)/settings.tsx` | `/settings` (pushed from Profile) |
| `app/sign-in.tsx` | The sign-in screen |

### Navigating programmatically
```tsx
const router = useRouter();

// Push a new screen on top (can go back)
router.push('/(tabs)/settings');

// Go back to the previous screen
router.back();
```

### Stack vs Tabs

| Stack | Tabs |
|---|---|
| Screens stack on top of each other | Screens switch side by side |
| Has a back button | Has a tab bar at the bottom |
| Used for detail pages | Used for main sections |

In this app: the Tab bar shows Home, Notifications, Profile. When you tap an event or open Settings, it uses Stack navigation (pushes on top, you can go back).

---

## 🛠️ Common Patterns Used Throughout

### Pattern 1 — StyleSheet with dynamic overrides
```tsx
// Base styles (static) are in StyleSheet.create()
const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 16 }
});

// Dynamic values (change with theme) are added inline
<View style={[styles.card, { backgroundColor: theme.surface }]}>
```

### Pattern 2 — Conditional style
```tsx
// Apply a style only when a condition is true
<View style={[
  styles.button,
  isActive && styles.buttonActive   // only applies when isActive is true
]}>
```

### Pattern 3 — Conditional rendering
```tsx
// Show different UI based on a condition
{isSignedIn ? <HomeScreen /> : <SignInScreen />}

// Or: only show something when a condition is true
{hasError && <ErrorMessage />}
```

### Pattern 4 — Spreading styles
```tsx
// StyleSheet.absoluteFillObject is a shorthand for:
// { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  }
});
```

---

## ❓ Quick Reference: Common Professor Questions

| Question | Short Answer |
|---|---|
| What is Context? | A way to share data across components without passing props everywhere |
| What is useState? | A hook that stores data and re-renders the component when it changes |
| What is useEffect? | A hook that runs code after the component renders (e.g., on load) |
| What is useRef? | Stores a value that persists across renders without causing re-renders |
| What is useFocusEffect? | Like useEffect, but runs every time the screen becomes active |
| What is useCallback? | Memoizes a function so it isn't recreated on every render |
| What is Expo Router? | A file-based navigation system for React Native / Expo apps |
| What is `useNativeDriver`? | Makes animations run on the native thread for better performance |
| What does `href: null` do? | Hides a screen from the tab bar while keeping it navigable via code |
| What is a Provider? | A component that wraps children and gives them access to Context data |
