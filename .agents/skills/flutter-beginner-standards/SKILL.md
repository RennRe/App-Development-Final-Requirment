---
name: flutter-beginner-standards
description: Universal coding standards, best practices, and patterns for TypeScript, JavaScript, React, and Node.js development.
origin: Antigravity
---

# Beginner-Friendly Coding Standards

These standards ensure all Flutter/Dart code generated for the **Screen Time AI Companion App** perfectly matches the user's constraints: Simple, step-by-step, clean, and educational.

## Code Quality Principles

1. **Readability First**:
   - Write functions that explain themselves.
   - Example: Instead of `var r = getSTData()`, use `final int minutesSpentOnTiktok = await ScreenTimeTracker.getUsage()`.

2. **KISS (Keep It Simple, Stupid)**:
   - Built things one piece at a time.
   - Write standard Widget trees. Avoid excessive Riverpod/Bloc boilerplate unless the user asks to explicitly introduce a massive state management tool. Using standard `StatefulWidget` or lightweight `Provider` is preferred for educational context.

3. **Step-by-Step Task Focus**:
   - Only solve the current requested feature. Do not randomly add unrelated features just because they "might be useful later."

## The Flutter Ruleset

### 1. Variables and Functions
Always explicitly declare types. Do not rely heavily on `dynamic` or `var` when it obscures the purpose.

```dart
// PASS: CLEAR FOR BEGINNERS
final String aiResponseText = await OpenCodeCli.generateResponse();

// FAIL: CONFUSING
var output = await OpenCodeCli.run();
```

### 2. UI Widgets
Keep build methods small. If a build method gets complex, rip it out into a smaller Stateless Widget.

### 3. Comments and Explanations
Before presenting any block of code, start with a 1-paragraph simple definition of the concepts used.
Add comment lines above critical logic, e.g.
```dart
// Calling the Automation Integration here to trigger a smart reminder natively
await SystemNotifier.showOverlay(message);
```
