---
name: "swarm-plan"
description: "Planning phase — create task breakdown, assign agents, estimate effort"
model: ""
allowed-tools:
  - "Read"
  - "Write"
  - "Edit"
  - "Bash"
  - "Glob"
  - "Grep"
---

# Skill: swarm-plan

Transition a story from **ideating** to **planned**.

## Inputs

- **Story file:** Path to a `.swarm/backlog/{ID}.md` file in `ideating` status

## Steps

### Step 1: Read Context

1. Read `.swarm/config.md` for agent roles, WoW, and effort model.
2. Read the story file — understand ACs and the problem.
3. Review the codebase structure to understand where changes are needed.
4. Read relevant knowledge items from `.swarm/knowledge/`.

### Step 2: Validate Story

Run the validation command to ensure the story is ready for planning:
```bash
bun $RECURSIVE_AI_PATH/packages/cli/src/index.ts validate .swarm/backlog/${STORY_ID}.md
```

If `ok: false`, fix the issues listed in `details` before proceeding.

### Step 3: Design Technical Approach

1. Sketch the technical approach in the story body.
2. Identify files to create, modify, or delete.
3. Note architectural patterns to follow.

### Step 4: Create Task Breakdown

1. Create tasks that collectively satisfy all ACs.
2. Each task should map to one or more ACs via `ac_coverage`.
3. Assign each task to the appropriate agent.
4. Estimate effort using the project's effort model (T-shirt sizes by default).
5. Define task dependencies via `depends_on`.
6. Use the format:
   ```yaml
   - id: "T-1"
     title: "Implement API endpoint for..."
     agent: "backend-dev"
     status: "pending"
     depends_on: []
     effort_estimate: "M"
     ac_coverage: ["AC-1", "AC-2"]
   ```

### Step 5: Validate Coverage

1. Ensure every AC is covered by at least one task.
2. Ensure no circular dependencies exist in the task graph.
3. Check that total effort is reasonable for the complexity estimate.

### Step 6: Transition to Planned

Run the transition command to move the story to `planned`:
```bash
bun $RECURSIVE_AI_PATH/packages/cli/src/index.ts transition .swarm/backlog/${STORY_ID}.md planned
```

If `ok: false`, fix the issues listed in `details` (e.g., missing acceptance criteria or problem statement).

### Step 7: Handle Questions (if any)

If clarification is needed during planning:
1. Create a question file at `.swarm/pending-questions/{ID}-plan.md`.
2. Set story status to `awaiting_input`.

## Outputs

- Updated story file with tasks, technical approach
- Story status: `planned` (or `awaiting_input`)
- Optional: question file in `.swarm/pending-questions/`
