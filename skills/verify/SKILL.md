---
name: "verify"
description: "Verification phase — run all checks, validate ACs, confirm Definition of Done"
model: ""
allowed-tools:
  - "Read"
  - "Write"
  - "Edit"
  - "Bash"
  - "Glob"
  - "Grep"
  - "mcp__swarm__swarm_validate"
  - "mcp__swarm__swarm_transition"
---

# Skill: verify

Transition a story from **verifying** to **done** (or back to **executing** if issues are found).

## Inputs

- **Story file:** Path to a `.swarm/backlog/{ID}.md` file in `verifying` status

## Steps

### Step 1: Read Context

1. Read `.swarm/config.md` for DoD and conventions.
2. Read the story file — understand all ACs and their current status.

### Step 2: Validate Story Structure

Use the `swarm_validate` tool with `path` set to the absolute path of `.swarm/backlog/${STORY_ID}.md`.

### Step 3: Run Automated Checks

1. **Type check:** `bun run typecheck`
2. **Lint:** `bunx biome check .`
3. **Tests:** `bun test`
4. Record pass/fail for each check.

### Step 4: Verify Acceptance Criteria

For each AC:
1. Check if evidence has been provided.
2. If automated, run the verification command.
3. If manual, review the implementation against the criterion.
4. Update AC status to `passing` or `failing`.

### Step 5: Check Definition of Done

1. Walk through each DoD item from `.swarm/config.md`.
2. Run automated DoD commands where available.
3. Record which items pass and which fail.

### Step 6: Handle Failures

If any check fails:
1. Set story status back to `executing`.
2. Create new tasks for the failing items.
3. Document the failures in the story body.
4. Update the `updated` timestamp.

### Step 7: Transition to Done

If all checks pass, use the `swarm_transition` tool with `path` set to the absolute path of `.swarm/backlog/${STORY_ID}.md` and `target_status` set to `done`.

If the transition is blocked (e.g., ACs not passing), fix the issues first.

## Outputs

- Updated story file with AC evidence and statuses
- Story status: `done` or `executing` (if issues found)
- Verification report appended to story body
