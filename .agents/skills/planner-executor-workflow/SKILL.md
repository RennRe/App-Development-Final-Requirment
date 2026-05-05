---
name: planner-executor-workflow
description: The core architecture skill detailing how the Planner agent breaks down AI companion app features and how the Executor implements them step-by-step.
origin: Antigravity
---

# Planner-Executor Workflow Architecture

This skill defines the operational workflow for building the **AI Assistant Companion App**. It ensures that complex features (like Screen Time Awareness, Smart Reminders, or the Floating AI Avatar) are always built using clear, beginner-friendly, and simple steps.

## The Architecture Rules

1. **Planner Phase**:
   - The Planner agent must break down large user requests into small, actionable steps.
   - Example Goal: "Add behavior coaching."
     - Planner Step 1: Create a basic UI scaffold for coaching messages.
     - Planner Step 2: Integrate mock behavior data.
     - Planner Step 3: Implement the real coaching logic and OpenCode CLI trigger.

2. **Executor Phase**:
   - The Executor strictly follows the Planner's steps one by one.
   - The Executor writes **simple, clean Flutter code** that a learner can easily understand.
   - The Executor **does not over-engineer**. It prioritizes getting a working feature first before attempting any optimizations.
   - The Executor must include brief, inline explanations of *why* certain Flutter widgets or logic structures are used (as per `<RULE[beginner-friendly.md]>`).

3. **Coordination**:
   - Both the Planner and Executor must defer all complex AI response generation to the **OpenCode CLI**.
   - After completing a task, the Executor MUST initiate the Verification step to ensure clean, working code.
