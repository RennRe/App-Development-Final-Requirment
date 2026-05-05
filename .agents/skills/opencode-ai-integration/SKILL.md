---
name: opencode-ai-integration
description: The pattern detailing how the Antigravity Executor integrates with the OpenCode CLI to act as the AI Layer for the Companion app.
origin: Antigravity
---

# OpenCode AI Integration Skill

This skill defines the integration pathway between the core Flutter app logic and the **OpenCode CLI** which handles the AI Layer generation.

## When to Activate

- Defining the personality, tone, and emotional responses of the AI animated companion.
- Setting up the Behavior Coaching prompts (e.g., how to request encouraging remarks when detecting heavy screen time usage).
- Generating dynamic text for Smart Reminders.

## The OpenCode CLI Workflow

Since the OpenCode integration is still being conceptually mapped out, adhere to these structural integrations within Flutter:

1. **Service Layer Abstraction**:
   Always wrap the OpenCode CLI calls inside a dedicated Dart service abstraction. Do not litter UI files with raw CLI invocation code.
   - Example: `AiResponseService` handles the logic to format user context (e.g., app usage duration) and triggers the OpenCode backend/CLI to get the character's response.

2. **Tone Enforcement**:
   Ensure the prompt schemas sent to OpenCode consistently instruct the AI model to maintain a "friendly, non-aggressive, and motivating" tone to fit the design goals.

3. **Step-by-Step Build Constraints**:
   - Step 1: Mock the OpenCode response (e.g., static string delay) so the floating companion UI can be tested immediately.
   - Step 2: Implement the real shell/process execution call to OpenCode CLI once the UI logic is verified.
