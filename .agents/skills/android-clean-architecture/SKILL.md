---
name: android-clean-architecture
description: Clean Architecture patterns for Android and Kotlin Multiplatform projects — module structure, dependency rules, UseCases, Repositories, and data layer patterns.
origin: Antigravity
---

# Simple Flutter App Architecture

This defines the architectural structure for building the Flutter **Screen Time AI Companion App** without overwhelming the user with massive "Clean Architecture" abstraction layers (like UseCases or DTO mappers).

## The Recommended Folder Structure

```
lib/
├── main.dart
├── screens/              # UI screens (Home, Settings, Companion overlay testing)
├── widgets/              # Reusable UI parts (Floating sprite, charts)
├── services/             # API and System calls (OpenCode CLI triggers, Screen Time readers)
├── models/               # Simple data classes
└── utils/                # Constants, helpers, friendly formatters
```

## The Dependency Rules

- **Services** are completely separated from **Widgets**. If a Widget wants to trigger a Smart Reminder check, it calls a function in the `AppUsageService`.
- **UI is purely presentational**. 

## State Management

Keep it simple. Stick to built-in `setState` for small overlays or `Provider` for generic App State across the screens. **Do not introduce BLoC, Riverpod, or Redux unless explicitly shifting from the beginner-friendly track.**

## Screen Time Tracking Service Abstraction

- Step 1: When dealing with Android/iOS native screen tracking code, isolate all logical platform channels straight into `services/screentime_service.dart`.
- Step 2: Ensure the data is fed clearly into simple models before the UI attempts to show it to the user.
