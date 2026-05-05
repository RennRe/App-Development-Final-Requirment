---
name: verification-loop
description: A comprehensive verification system for Claude Code sessions.
origin: Antigravity
---

# Verification Loop Skill

This skill enforces the **Verification Architecture Phase**, guaranteeing that any generated UI or Flutter code actually compiles and adheres to clean standards before continuing to the next step.

## When to Use

Invoke this skill:
- Immediately after writing a new Flutter widget (like the floating companion).
- Before moving from the Screen Time tracking logic step to the UI connection step.
- After integrating the OpenCode CLI hook.

## The Simple Verification Rules

1. **Keep it Working**:
   Never output partial implementations. Always test logic completely before responding to the user.

2. **Run Basic Checks**:
   Because we prioritize simple, step-by-step progress, do not run incredibly complex test suites immediately. Focus on the core structural integrity of the Dart project:

   ```bash
   # Ensure dependencies are clean
   flutter pub get

   # Check for compile errors or basic style issues
   flutter analyze --fatal-infos
   ```

3. **Validate UI Visually**:
   If possible, use headless testing or basic logic outputs to ensure the AI sprite/overlay logic correctly triggers when screen time exceeds thresholds. Verify that the UI remains "Clean and Simple."

4. **Verify Beginner Constraints**:
   Before showing code, ask yourself:
   - "Does this avoid over-engineering?"
   - "Are variables named clearly for a learner?"
   - "Is there a short, helpful explanation attached?"
