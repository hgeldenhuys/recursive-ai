---
name: swarm-run
description: Full pipeline — run ideate → plan → execute → verify → close with phase gating
model: ""
allowed-tools:
  - "Read"
  - "Write"
  - "Edit"
  - "Bash"
  - "Glob"
  - "Grep"
---

# Skill: swarm-run

Full SWARM SDLC pipeline with phase gating. Runs all phases in sequence with confirmation between each phase. If any phase fails, reports the failure and stops.

## Inputs

- **Story file:** Path to a `.swarm/backlog/{ID}.md` file in `draft` status
- **Optional:** `--auto` flag to skip confirmations between phases

## Steps

### Phase 1: Ideate

1. Execute the `swarm-ideate` skill on the story.
2. **Gate check:** Validate the story:
   ```bash
   bun $RECURSIVE_AI_PATH/packages/cli/src/index.ts validate .swarm/backlog/${STORY_ID}.md
   ```
   Verify the story has:
   - At least 3 acceptance criteria defined
   - Complexity estimated
   - Status is `ideating` (not `awaiting_input`)
3. If the gate fails:
   - Report what is missing.
   - If status is `awaiting_input`, stop and tell the user to answer questions in `.swarm/pending-questions/`.
   - Exit with failure.
4. If the gate passes and `--auto` is not set, ask for confirmation to proceed.

### Phase 2: Plan

1. Execute the `swarm-plan` skill on the story.
2. **Gate check:** Run transition validation:
   ```bash
   bun $RECURSIVE_AI_PATH/packages/cli/src/index.ts transition .swarm/backlog/${STORY_ID}.md planned
   ```
   Verify the story has:
   - At least one task defined
   - All ACs covered by at least one task
   - No circular task dependencies
   - Status is `planned` (not `awaiting_input`)
3. If the gate fails:
   - Report what is missing.
   - Exit with failure.
4. If the gate passes and `--auto` is not set, ask for confirmation to proceed.

### Phase 3: Execute

1. Execute the `swarm-execute` skill on the story.
2. **Gate check:** Verify:
   - All tasks are `done` or `skipped`
   - Code compiles: `bun run typecheck`
   - Tests pass: `bun test`
   - Linting passes: `bunx biome check .`
3. Validate transition:
   ```bash
   bun $RECURSIVE_AI_PATH/packages/cli/src/index.ts transition .swarm/backlog/${STORY_ID}.md verifying
   ```
4. If the gate fails:
   - Report which checks failed.
   - Exit with failure.
5. If the gate passes and `--auto` is not set, ask for confirmation to proceed.

### Phase 4: Verify

1. Execute the `swarm-verify` skill on the story.
2. **Gate check:** Validate transition to done:
   ```bash
   bun $RECURSIVE_AI_PATH/packages/cli/src/index.ts transition .swarm/backlog/${STORY_ID}.md done
   ```
   Verify:
   - All ACs have status `passing`
   - Story status is `done`
3. If the gate fails:
   - Report which ACs are not passing.
   - Exit with failure.
4. If the gate passes and `--auto` is not set, ask for confirmation to proceed.

### Phase 5: Close

1. Execute the `swarm-close` skill on the story.
2. **Gate check:** Verify:
   - Retrospective file exists at `.swarm/retrospectives/{ID}-retro.md`
   - Story has been moved to `.swarm/archive/{ID}.md`
   - Knowledge items extracted (if knowledge_extraction enabled in WoW)
3. If the gate fails:
   - Report what is missing.
   - Exit with failure.

### Final Report

Output a summary:

```
## SWARM Pipeline Complete: {ID}

| Phase | Status | Duration |
|-------|--------|----------|
| Ideate | PASS | Xs |
| Plan | PASS | Xs |
| Execute | PASS | Xs |
| Verify | PASS | Xs |
| Close | PASS | Xs |

**Total time:** X minutes
**ACs:** N/N passing
**Tasks:** N/N completed
**Knowledge items:** N extracted
```

## Outputs

- Fully processed story from draft to archived
- Retrospective file with metrics
- Knowledge items extracted and filed
- Agent memory updated
- Pipeline summary report
