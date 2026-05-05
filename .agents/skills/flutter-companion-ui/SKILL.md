---
name: flutter-companion-ui
description: Frontend development patterns for React, Next.js, state management, performance optimization, and UI best practices.
origin: Antigravity
---

# Flutter UI Patterns for the AI Companion App

This skill enforces the exact design architecture required to keep the Flutter AI Companion App clean, motivating, and lightweight.

## The Design Goals

- **Simple and Clean**: The UI shouldn't be cluttered with excessive graphs or menus. Focus on tracking output and smart reminders.
- **Friendly Tone**: UI text should reflect an encouraging AI companion, not an aggressive alarm system.
- **Lightweight Float**: The character UI must be simple to render and easy to drag or interact with over the main screen content.

## Component Patterns

### 1. Floating AI Companion Avatar
When creating the Avatar presentation widget, use Flutter's built-in layering (like `Stack` or `OverlayEntry`). The UI block must be:
- Easily positionable (draggable).
- Responsive to OpenCode CLI inputs (i.e. changing the sprite animation based on the "tone" variable returned from the AI response).

### 2. Time Awareness Tracker Displays
When defining screen time stats:
- Never just dump data into a massive table. Instead, structure it simply into a visually friendly custom widget (like an interactive circular dial or simple bar) that emphasizes progress rather than "scolding" the user for extensive usage.

### 3. Smart Reminder Snacking
When integrating OpenCode AI coaching data to the UI:
- Build a generic un-intrusive container model (like a smooth-animated Toast notification) styled with soft colors instead of harsh red error screens.

## Beginner-Friendly Workflow

When suggesting patterns to the user:
- Explain what an `Overlay` widget is before using it. 
- Break down complex animations into simpler steps (e.g. use `AnimatedContainer` before trying to build Custom `Tween` controllers from scratch).
