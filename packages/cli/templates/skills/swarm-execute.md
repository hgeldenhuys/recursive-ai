---
name: "swarm-execute"
description: "Execution phase — implement tasks according to plan, coordinate agents"
model: ""
allowed-tools:
  - "Read"
  - "Write"
  - "Edit"
  - "Bash"
  - "Glob"
  - "Grep"
---

# Skill: swarm-execute

Transition a story from **planned** to **executing** and work through the task list.

## Inputs

- **Story file:** Path to a `.swarm/backlog/{ID}.md` file in `planned` status

## Steps

### Step 1: Read Context

1. Read `.swarm/config.md` for conventions and WoW.
2. Read the story file — understand tasks, ACs, and technical approach.
3. Read agent memory files from `.claude/agent-memory/` for assigned agents.
4. Read relevant knowledge items from `.swarm/knowledge/`.

### Step 2: Transition to Executing

Run the transition command to move the story to `executing`:
```bash
bun $RECURSIVE_AI_PATH/packages/cli/src/index.ts transition .swarm/backlog/${STORY_ID}.md executing
```

If `ok: false`, fix the issues (e.g., no tasks defined).

### Step 3: Check Dependencies

List other stories in progress to check for blockers:
```bash
bun $RECURSIVE_AI_PATH/packages/cli/src/index.ts list .swarm/backlog --status executing
```

### Step 4: Set Up Execution

1. Set `execution.started_at` to current timestamp.
2. Update the `updated` timestamp.

### Step 5: Execute Tasks In Order

For each task (respecting dependency order):

1. Read the task details and its AC coverage.
2. Identify the assigned agent and read their memory.
3. Implement the task:
   - Write code following project standards.
   - Write tests if the WoW requires test-first.
   - Run linting after changes: `bunx biome check .`
   - Run tests after changes: `bun test`
4. Update task status to `in_progress`, then `done`.
5. Update related AC statuses as evidence is gathered.
6. Update the `updated` timestamp.

### Step 6: Verify As You Go

If `auto_verify` is enabled in WoW:
1. Run tests after each task completes.
2. Run the type checker: `bun run typecheck`
3. If verification fails, fix issues before proceeding.

### Step 7: Write Mini-Retrospectives

After each task, the assigned agent appends a mini-retrospective:

```
## Mini-Retrospective: {agent}
- **What worked:** [techniques that were effective]
- **What to remember:** [patterns, gotchas, important context]
- **Suggestion:** [improvements for next time]
- **Knowledge hints:** [E: patterns found | Q: pain points | P: best practices]
```

### Step 8: Update Execution State

1. Once all tasks are done, set story status to `verifying` (or `done` if auto_verify handled it).
2. Set `execution.completed_at` to current timestamp.
3. Update the `updated` timestamp.

## Outputs

- Implemented code changes
- Updated story file with task statuses, AC evidence
- Mini-retrospectives appended to story
- Story status: `verifying` or `done`
