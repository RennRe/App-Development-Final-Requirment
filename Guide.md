# 📖 Tara! App — Complete Code Guide

> **Purpose:** This guide explains every file in the Tara! app so your team can confidently defend the code during your presentation.

---

## 📁 Project Overview

**Tara!** is a mobile app built with **React Native + Expo + TypeScript**. It helps Filipino friend groups plan events and split expenses together.

### Technology Stack

| Technology | What It Does |
|---|---|
| **React Native** | Build mobile apps using JavaScript/TypeScript (instead of Java/Swift) |
| **Expo** | A toolkit that makes React Native easier — handles builds, icons, splash screens |
| **TypeScript** | JavaScript with "types" — catches bugs before the app runs |
| **Expo Router** | File-based navigation — each file in `app/` becomes a screen |
| **React Navigation** | The library that powers tab bars and screen transitions |

### Folder Structure

```
AppDevFinal/
├── app/                    ← All screens live here (file-based routing)
│   ├── _layout.tsx         ← Root layout (wraps everything)
│   ├── sign-in.tsx         ← Sign-in screen
│   ├── modal.tsx           ← A pop-up modal screen
│   └── (tabs)/             ← Tab navigation group
│       ├── _layout.tsx     ← Tab bar configuration
│       ├── index.tsx       ← Home screen ("Kaganapan")
│       ├── event.tsx       ← Event detail ("Command Center")
│       ├── notifications.tsx ← Notifications screen
│       ├── profile.tsx     ← Profile + settings screen
│       └── explore.tsx     ← Default Expo template (hidden)
├── components/             ← Reusable UI pieces
├── constants/              ← App-wide values (colors, spacing)
├── contexts/               ← Shared state (auth, theme)
├── hooks/                  ← Custom React hooks
├── app.json                ← Expo configuration
└── package.json            ← Dependencies list
```

---

## 🔑 Key Concepts You Need to Know

### 1. What is a "Component"?
A **component** is a reusable piece of UI. Think of it like a LEGO block — you build screens by combining components.

```tsx
// This is a simple component
function MyButton() {
  return <Text>Click Me</Text>;
}
```

### 2. What is "State"?
**State** is data that can change over time. When state changes, the screen automatically re-renders (updates).

```tsx
const [count, setCount] = useState(0);
// count = the current value (starts at 0)
// setCount = the function to change it
```

### 3. What is "Context"?
**Context** is a way to share data across many screens without passing it one-by-one. It's like a global variable that any screen can read.

### 4. What is JSX/TSX?
It's HTML-like syntax inside JavaScript/TypeScript. Instead of `<div>` you use `<View>`, instead of `<p>` you use `<Text>`.

---

## 📄 File-by-File Breakdown

---

### 1. `constants/theme.ts` — The Design System

> **Purpose:** Defines ALL colors, fonts, spacing, and border radius values used across the app.

#### Brand Colors
```ts
export const Brand = {
  gold: '#E5A100',        // Primary brand color — used for buttons
  goldLight: '#F5C842',   // Lighter version — used in dark mode
  goldDark: '#C48900',    // Darker version — used for pressed states
  navy: '#1B2838',        // Dark blue — used for headers
  cream: '#FFF8E7',       // Warm white — light mode background
  // ... green, red, gray variants
};
```
**Why?** Centralizing colors means if you change `Brand.gold`, it updates EVERYWHERE. No hunting through files.

#### Light & Dark Mode Colors
```ts
export const Colors = {
  light: {
    text: '#1B2838',           // Dark text on light background
    background: '#FFF8E7',     // Cream background
    tint: Brand.gold,          // Active tab color = gold
    // ... 15+ color properties
  },
  dark: {
    text: '#ECEDEE',           // Light text on dark background
    background: '#0D1117',     // Very dark background
    tint: Brand.goldLight,     // Active tab = lighter gold
    // ... matching dark versions
  },
};
```
**How it works:** Each mode has the SAME property names (`text`, `background`, `tint`, etc.) but DIFFERENT color values. The app picks the right set based on `isDark`.

#### Platform-Specific Fonts
```ts
export const Fonts = Platform.select({
  ios: { sans: 'system-ui', ... },       // Apple fonts
  default: { sans: 'normal', ... },      // Android fonts
  web: { sans: "system-ui, ...", ... },   // Browser fonts
});
```
**What is `Platform.select`?** It runs different code depending on whether the app is on iOS, Android, or Web.

#### Spacing & Radius
```ts
export const Spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 };
export const Radius = { sm: 8, md: 12, lg: 16, xl: 20, full: 999 };
```
**Why?** Consistent spacing makes the app look professional. `Spacing.lg` is always 16 pixels everywhere.

---

### 2. `contexts/AuthContext.tsx` — Authentication State

> **Purpose:** Tracks whether the user is signed in or not. Shares this info with all screens.

#### Step-by-step:

**1. Define what data the context holds (the "shape"):**
```ts
type AuthContextType = {
  isSignedIn: boolean;           // true = user is logged in
  userName: string;              // the user's display name
  signIn: (name?: string) => void;  // function to log in
  signOut: () => void;           // function to log out
};
```

**2. Create the context (an empty container):**
```ts
const AuthContext = createContext<AuthContextType | undefined>(undefined);
```
- `createContext` creates a "box" that can hold `AuthContextType` data
- It starts as `undefined` (empty) until a Provider fills it

**3. Build the Provider (the component that fills the box):**
```ts
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);    // starts logged out
  const [userName, setUserName] = useState('Jhirick');     // default name

  const signIn = (name?: string) => {
    if (name) setUserName(name);   // update name if provided
    setIsSignedIn(true);           // mark as logged in
  };

  const signOut = () => {
    setIsSignedIn(false);          // mark as logged out
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, userName, signIn, signOut }}>
      {children}   {/* All screens wrapped inside get access */}
    </AuthContext.Provider>
  );
}
```
- `{ children }` means "whatever components are wrapped inside this provider"
- `value={{ ... }}` is the data that all children can read

**4. Create a custom hook for easy access:**
```ts
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
```
- Any screen can call `const { isSignedIn, signIn } = useAuth();` to get auth data
- The error check ensures you don't accidentally use it outside the Provider

---

### 3. `contexts/ThemeContext.tsx` — Light/Dark Mode

> **Purpose:** Lets the user toggle between light and dark mode. Every screen reads the current theme from here.

#### How it works:

```ts
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Check what the phone's system theme is (light or dark)
  const systemScheme = useSystemColorScheme();

  // Start with the system preference
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  // Pick the matching color palette from theme.ts
  const theme = isDark ? Colors.dark : Colors.light;

  // Flip between light ↔ dark
  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

**Key line:** `const theme = isDark ? Colors.dark : Colors.light;`
- This is a **ternary operator**: `condition ? valueIfTrue : valueIfFalse`
- If `isDark` is true → use dark colors. Otherwise → use light colors.

**How screens use it:**
```ts
const { theme, isDark, toggleTheme } = useAppTheme();
// theme.text → current text color (changes with mode)
// isDark → boolean to check mode
// toggleTheme → function to flip modes
```

---

### 4. `app/_layout.tsx` — Root Layout (The Brain)

> **Purpose:** The entry point of the app. Wraps everything with providers and decides: show Sign-In OR show the main app?

#### Structure:

```tsx
export default function RootLayout() {
  return (
    <ThemeProvider>          {/* Layer 1: theme available everywhere */}
      <AuthProvider>         {/* Layer 2: auth available everywhere */}
        <InnerLayout />      {/* Layer 3: the actual screen logic */}
      </AuthProvider>
    </ThemeProvider>
  );
}
```
**Think of it as layers of wrapping paper.** ThemeProvider wraps AuthProvider, which wraps the screens. Every screen inside can access both theme and auth.

#### The Decision Logic:
```tsx
function InnerLayout() {
  const { isDark } = useAppTheme();
  const { isSignedIn } = useAuth();

  // NOT signed in? Show the sign-in screen
  if (!isSignedIn) {
    return (
      <>
        <SignInScreen />
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </>
    );
  }

  // Signed in? Show the tab navigation
  return (
    <NavThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </NavThemeProvider>
  );
}
```

**Key concepts:**
- `<> </>` = **Fragment** — groups elements without adding an extra View
- `<Stack>` = screens stacked on top of each other (like a deck of cards)
- `headerShown: false` = hides the default navigation header
- `presentation: 'modal'` = the modal slides up from the bottom

---

### 5. `app/sign-in.tsx` — Sign-In Screen

> **Purpose:** The first screen users see. Offers Google sign-in and OTP (one-time-password) via phone number.

#### State Variables:
```tsx
const [phoneNumber, setPhoneNumber] = useState('');     // what user types
const [showOTP, setShowOTP] = useState(false);          // show OTP input?
const [otpCode, setOtpCode] = useState('');             // the OTP digits
```

#### Flow:
1. User types phone number → `setPhoneNumber` updates the value
2. User taps "Send OTP" → `handleSendOTP` checks if number is long enough, then shows OTP field
3. User types OTP → taps "Verify" → `handleVerifyOTP` calls `signIn()` → app switches to home

#### Important UI Patterns:

**Conditional rendering (show/hide OTP):**
```tsx
{!showOTP && (
  <TouchableOpacity onPress={handleSendOTP}>
    <Text>Send OTP Code</Text>
  </TouchableOpacity>
)}
{showOTP && (
  <View>
    <TextInput ... />
    <TouchableOpacity onPress={handleVerifyOTP}>
      <Text>Verify & Sign In</Text>
    </TouchableOpacity>
  </View>
)}
```
- `{!showOTP && (...)}` = "only show this if showOTP is false"
- `{showOTP && (...)}` = "only show this if showOTP is true"

**Dynamic styling (theme-aware colors):**
```tsx
<View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
```
- `styles.card` = static styles (always the same)
- `{ backgroundColor: theme.surface }` = dynamic style (changes with light/dark mode)
- Wrapping both in `[...]` merges them together

**`KeyboardAvoidingView`:** Pushes content up when the keyboard opens so inputs aren't hidden.

**`ScrollView` with `keyboardShouldPersistTaps="handled"`:** Lets users tap buttons even while the keyboard is open.

---

### 6. `app/(tabs)/_layout.tsx` — Tab Bar Configuration

> **Purpose:** Defines the bottom tab bar with Home, Notifications, and Profile tabs.

#### What `(tabs)` means:
The parentheses in `(tabs)` make it a **layout group** in Expo Router. It groups screens under a shared tab navigation without affecting the URL.

#### The Tab Setup:
```tsx
<Tabs
  screenOptions={{
    tabBarActiveTintColor: Brand.gold,        // selected tab = gold
    tabBarInactiveTintColor: theme.tabIconDefault, // unselected = gray
    headerShown: false,                        // hide screen headers
    tabBarButton: HapticTab,                   // custom button with vibration
    tabBarStyle: {
      backgroundColor: theme.tabBar,           // tab bar background
      borderTopColor: theme.divider,           // top border line
    },
  }}
>
```

#### Each Tab:
```tsx
<Tabs.Screen
  name="index"        // matches the file "index.tsx"
  options={{
    title: 'Home',    // label shown below icon
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="home" size={size ?? 24} color={color} />
    ),
  }}
/>
```
- `name="index"` links to `app/(tabs)/index.tsx`
- `tabBarIcon` receives `color` and `size` from the tab system automatically
- `size ?? 24` means "use size if provided, otherwise default to 24"

#### Hidden Tabs:
```tsx
<Tabs.Screen name="event" options={{ href: null }} />
<Tabs.Screen name="explore" options={{ href: null }} />
```
- `href: null` hides the tab from the tab bar, but the screen still exists and can be navigated to programmatically

---

### 7. `app/(tabs)/index.tsx` — Home Screen ("Kaganapan")

> **Purpose:** The main dashboard showing active events, past events, and quick actions.

#### Placeholder Data:
```tsx
const ACTIVE_EVENTS = [
  { id: '1', name: 'Puerto Galera 2026', emoji: '🏖️', date: '...', totalAmbagan: 4500, ... },
];
```
This is **hardcoded sample data** (not from a database yet). In production, you'd fetch this from an API.

#### Navigation:
```tsx
const router = useRouter();

const openEvent = (eventId: string) => {
  router.push(`/(tabs)/event?id=${eventId}`);
};
```
- `useRouter()` gives you the navigation object
- `router.push(...)` navigates to the event screen
- `?id=${eventId}` passes the event ID as a **query parameter**

#### FlatList (Horizontal Scrolling Events):
```tsx
<FlatList
  data={ACTIVE_EVENTS}              // the array to display
  horizontal                         // scroll left-right instead of up-down
  showsHorizontalScrollIndicator={false}  // hide scrollbar
  keyExtractor={(item) => item.id}   // unique key for each item
  renderItem={({ item }) => (        // how to display each item
    <TouchableOpacity onPress={() => openEvent(item.id)}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  )}
/>
```
**Why FlatList instead of ScrollView?** FlatList is optimized for lists — it only renders items currently visible on screen, saving memory.

#### Overlapping Avatars:
```tsx
{item.members.map((m, i) => (
  <View style={[styles.miniAvatar, {
    backgroundColor: AVATAR_COLORS[i],
    marginLeft: i > 0 ? -8 : 0     // overlap by 8 pixels
  }]}>
    <Text>{m}</Text>
  </View>
))}
```
- `.map()` loops through each member and creates a circle
- `i > 0 ? -8 : 0` = first avatar has no offset, the rest shift left by 8px to overlap

---

### 8. `app/(tabs)/event.tsx` — Event Detail ("Command Center")

> **Purpose:** The most complex screen. Shows event details with 3 internal tabs: To-Do Board, Ambagan (expense split), and Chika (chat).

#### Internal Tab System:
```tsx
type TabName = 'board' | 'ambagan' | 'chika';
const [activeTab, setActiveTab] = useState<TabName>('ambagan');
```
- `TabName` is a **union type** — the variable can only be one of those 3 strings
- `useState<TabName>` tells TypeScript what types are allowed

#### Tab Buttons:
```tsx
{(['board', 'ambagan', 'chika'] as TabName[]).map((tab) => {
  const isActive = activeTab === tab;
  return (
    <TouchableOpacity
      style={[styles.tab, isActive && { borderBottomColor: Brand.gold, borderBottomWidth: 3 }]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={{ color: isActive ? Brand.gold : theme.textSecondary }}>
        {labels[tab]}
      </Text>
    </TouchableOpacity>
  );
})}
```
- Maps over the 3 tab names and creates a button for each
- `isActive && { ... }` = only apply the gold underline style if this tab is active

#### Expense Calculation:
```tsx
const totalCost = EXPENSES.reduce((sum, e) => sum + e.price, 0);
const perPerson = Math.round(totalCost / MEMBERS.length);
const userBalance = 1000 - perPerson;
```
- `.reduce()` adds up all expense prices into one total
- `Math.round()` rounds to nearest whole number
- `userBalance` = how much the user paid minus their share

#### Conditional Content (showing the right tab):
```tsx
{activeTab === 'ambagan' && ( <> ...expense content... </> )}
{activeTab === 'board' && ( <> ...todo content... </> )}
{activeTab === 'chika' && ( <> ...chat content... </> )}
```
Only the matching tab's content renders. The others are completely hidden.

#### FAB (Floating Action Button):
```tsx
{activeTab !== 'chika' && (
  <TouchableOpacity style={[styles.fab, { backgroundColor: Brand.gold }]}>
    <Ionicons name="add" size={28} color="#FFF" />
  </TouchableOpacity>
)}
```
- `position: 'absolute'` makes it float over content
- Hidden on the Chika tab (chat has its own input instead)

#### Checkbox with Strikethrough:
```tsx
<Text style={[
  styles.todoText,
  { color: theme.text },
  item.done && { textDecorationLine: 'line-through', opacity: 0.5 },
]}>
```
- If `item.done` is true, adds strikethrough text and makes it semi-transparent

---

### 9. `app/(tabs)/notifications.tsx` — Notifications Screen

> **Purpose:** Shows event invites, payment reminders, and system updates.

#### Unread Highlight:
```tsx
backgroundColor: notif.unread
  ? (isDark ? '#1A2030' : '#FFF8E7')   // highlighted background
  : theme.surface,                      // normal background
```
- This is a **nested ternary**: first checks `unread`, then checks `isDark`
- Unread notifications get a tinted background to stand out

#### Unread Dot:
```tsx
{notif.unread && <View style={styles.unreadDot} />}
```
- A small gold circle that only appears on unread notifications

---

### 10. `app/(tabs)/profile.tsx` — Profile Screen

> **Purpose:** Shows user info, stats, settings, and sign-out button.

#### Stats Row with Dividers:
```tsx
{stats.map((stat, i) => (
  <View style={[
    styles.statItem,
    i > 0 && { borderLeftWidth: 1, borderLeftColor: theme.divider }
  ]}>
    <Text>{stat.value}</Text>
    <Text>{stat.label}</Text>
  </View>
))}
```
- `i > 0 &&` = add a left border to all items except the first (creates divider lines)

#### Dark Mode Toggle with Switch:
```tsx
<Switch
  value={isDark}                    // ON = dark mode is active
  onValueChange={toggleTheme}       // flip when toggled
  trackColor={{ false: '#D0D0D0', true: Brand.goldDark }}
  thumbColor={isDark ? Brand.gold : '#fff'}
/>
```
- `Switch` is a native toggle component
- `trackColor` = the bar color; `thumbColor` = the circle color

#### Settings List (Dynamic):
```tsx
{[
  { icon: 'notifications-outline', label: 'Notifications' },
  { icon: 'language-outline', label: 'Language / Wika' },
  // ...
].map((item, i) => (
  <TouchableOpacity key={i} ...>
    <Ionicons name={item.icon} ... />
    <Text>{item.label}</Text>
    <Ionicons name="chevron-forward" ... />  {/* arrow → */}
  </TouchableOpacity>
))}
```
Instead of writing 4 separate buttons, we define the data in an array and `.map()` generates them all — much cleaner!

---

### 11. `components/haptic-tab.tsx` — Haptic Feedback Tab Button

> **Purpose:** Adds a subtle vibration when tapping a tab (iOS only).

```tsx
export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}                        // pass all original button props
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);          // call the original handler too
      }}
    />
  );
}
```
- `{...props}` = **spread operator** — passes ALL properties from the parent
- `props.onPressIn?.(ev)` = **optional chaining** — only calls the function if it exists

---

### 12. `components/themed-text.tsx` & `themed-view.tsx` — Theme-Aware Components

> **Purpose:** Reusable Text and View components that automatically use the right colors for light/dark mode.

**ThemedText** supports different styles via a `type` prop:
```tsx
<ThemedText type="title">Big Bold Text</ThemedText>
<ThemedText type="link">Blue Link Text</ThemedText>
<ThemedText>Default body text</ThemedText>
```

**ThemedView** automatically sets the background color:
```tsx
<ThemedView>  {/* background auto-matches theme */}
  <Text>Content here</Text>
</ThemedView>
```

---

### 13. `hooks/use-theme-color.ts` — Color Picker Hook

> **Purpose:** Returns the correct color for the current theme mode.

```tsx
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;      // use the custom color if provided
  } else {
    return Colors[theme][colorName];  // otherwise use the default
  }
}
```
- First priority: custom colors passed via props
- Fallback: default colors from `theme.ts`

---

## ⚙️ Configuration Files

### `app.json` — Expo Settings
| Setting | What It Does |
|---|---|
| `"orientation": "portrait"` | App only works in portrait (vertical) mode |
| `"scheme": "appdevfinal"` | Deep link URL scheme |
| `"newArchEnabled": true` | Uses React Native's new architecture for better performance |
| `"typedRoutes": true` | TypeScript checks your navigation routes |
| `"reactCompiler": true` | Experimental optimization for faster re-renders |

### `package.json` — Dependencies
| Package | Purpose |
|---|---|
| `expo` | Core Expo framework |
| `expo-router` | File-based navigation |
| `react-native` | The UI framework |
| `@expo/vector-icons` | Icon library (Ionicons, etc.) |
| `expo-haptics` | Vibration feedback |
| `react-native-reanimated` | Smooth animations |
| `react-native-gesture-handler` | Touch gesture handling |
| `react-native-safe-area-context` | Avoid notch/status bar overlap |

---

## 🔄 How the App Flows

```
App Starts
    │
    ▼
RootLayout wraps everything in ThemeProvider + AuthProvider
    │
    ▼
InnerLayout checks: isSignedIn?
    │
    ├── NO  → Show SignInScreen
    │           │
    │           ▼
    │         User taps "Google" or "Verify OTP"
    │           │
    │           ▼
    │         signIn() is called → isSignedIn becomes true
    │           │
    │           ▼
    │         InnerLayout re-renders → now shows tabs ──┐
    │                                                    │
    └── YES → Show Tab Navigation ◄─────────────────────┘
                │
                ├── Home tab (index.tsx)
                │     └── Tap event card → navigates to event.tsx
                │
                ├── Notifications tab (notifications.tsx)
                │
                └── Profile tab (profile.tsx)
                      └── Tap Sign Out → signOut() → back to SignInScreen
```

---

## 🎨 Styling Pattern Used Throughout

Every screen follows this exact pattern:

```tsx
// 1. Import theme tools
import { useAppTheme } from '@/contexts/ThemeContext';
import { Brand, Spacing, Radius } from '@/constants/theme';

// 2. Get current theme inside the component
const { theme, isDark } = useAppTheme();

// 3. Apply theme colors dynamically in JSX
<View style={[styles.card, { backgroundColor: theme.surface }]}>
  <Text style={[styles.title, { color: theme.text }]}>Hello</Text>
</View>

// 4. Define static styles at the bottom
const styles = StyleSheet.create({
  card: { borderRadius: Radius.lg, padding: Spacing.lg },
  title: { fontSize: 18, fontWeight: '800' },
});
```

**Why this pattern?**
- Static styles (size, layout) go in `StyleSheet.create` → optimized by React Native
- Dynamic styles (colors) go inline → change when theme switches

---

## 💡 Common Syntax Cheat Sheet

| Syntax | Meaning | Example |
|---|---|---|
| `useState(false)` | Create a state variable | `const [on, setOn] = useState(false)` |
| `condition && <JSX>` | Show element only if condition is true | `{isLoggedIn && <Text>Hi</Text>}` |
| `condition ? A : B` | If true → A, if false → B | `isDark ? 'white' : 'black'` |
| `[style1, style2]` | Combine multiple styles | `style={[styles.base, { color: 'red' }]}` |
| `{...props}` | Pass all properties through | `<Button {...props} />` |
| `?.` | Optional chaining (safe access) | `user?.name` (won't crash if user is null) |
| `??` | Nullish coalescing (default value) | `size ?? 24` (use 24 if size is null) |
| `.map()` | Loop through array and return JSX | `items.map(i => <Text>{i}</Text>)` |
| `.reduce()` | Combine array into single value | `prices.reduce((sum, p) => sum + p, 0)` |
| `export default` | Main export of a file | Screens use this |
| `export function` | Named export | Contexts/hooks use this |

---

> **Good luck with your presentation! 🎉** Remember: the key points to emphasize are the **Context pattern** for global state, the **file-based routing** system, and the **dynamic theming** approach.
