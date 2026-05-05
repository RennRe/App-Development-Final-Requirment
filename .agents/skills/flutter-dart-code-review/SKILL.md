---
name: flutter-dart-code-review
description: Library-agnostic Flutter/Dart code review checklist covering widget best practices, state management patterns (BLoC, Riverpod, Provider, GetX, MobX, Signals), Dart idioms, performance, accessibility, security, and clean architecture.
origin: Antigravity
---

# Flutter/Dart Code Review Best Practices

Comprehensive, beginner-friendly checklist for reviewing Flutter/Dart applications. Keep code clean, readable, and simple to ensure the **App Vision** rules are met.

---

## 1. General Project Health

- [ ] Project follows the designated simple folder structure.
- [ ] Proper separation of concerns: UI, and OpenCode API layers via Services.
- [ ] No excessive state engines (like Redux or Bloc) unless absolutely necessary.
- [ ] Code has been processed by `flutter format` and checked by `flutter analyze`.

---

## 2. Dart Language Readability

- [ ] **No dynamic**: Always type variables so learners can follow explicitly.
- [ ] **Null safety checked**: Do not spam `!` operator to force unwrap. Verify using conditionals first.
- [ ] **No unused `async`**: Functions marked `async` are actually awaiting futures.
- [ ] **Meaningful Comments**: Provide explanations for complex Dart 3 patterns.

---

## 3. Widget & UI Reviews

### Widget decomposition:
- [ ] Split massive screens into sensible, readable extracted Flutter Widgets.
- [ ] Keep Stateful widgets only where local mutable screen behavior dictates (like dragging the Float Sprite Character).

### Built-in Constants:
- [ ] `const` constructors are placed on Widgets dynamically to teach performance basics correctly.

### Float UI Checks:
- [ ] Does the Float UI block primary user inputs maliciously? Ensure behavior coaching interactions do not permanently block external app usability (unless specifically triggered by high screen time thresholds).

---

## 4. Behavior Coaching Testing

- [ ] Review how "tone" values from OpenCode reflect onto UI coloring or sprites. Ensure it actually meets the "Not Annoying/Aggressive" design goal.
- [ ] Assert that the automation integration triggers (like system notifications) work reliably before reviewing the underlying Dart code.
