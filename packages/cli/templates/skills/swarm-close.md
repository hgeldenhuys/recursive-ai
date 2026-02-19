---
name: swarm-close
description: Close phase — generate retrospective, extract knowledge, archive story
model: ""
allowed-tools:
  - "Read"
  - "Write"
  - "Edit"
  - "Bash"
  - "Glob"
  - "Grep"
---

# Skill: swarm-close

Transition a story from **done** to **archived** with retrospective and knowledge extraction.

## Inputs

- **Story file:** Path to a `.swarm/backlog/{ID}.md` file in `done` status

## Steps

### Step 1: Read Context

1. Read `.swarm/config.md` for project conventions.
2. Read the story file — gather all tasks, ACs, mini-retrospectives.
3. Read the WoW to check if knowledge_extraction is enabled.

### Step 2: Compute Metrics

1. Count tasks: total, completed, skipped.
2. Count ACs: total, passing, failing.
3. Count files changed (via `git diff --stat` or similar).
4. Count tests added.
5. Calculate cycle time from `execution.started_at` to `execution.completed_at`.

### Step 3: Extract Learnings per Agent

1. Parse each mini-retrospective from the story body.
2. Consolidate "What worked", "What to remember", and "Suggestion" items.
3. Group learnings by agent.

### Step 4: Generate Retrospective

1. Create the retrospective file at `.swarm/retrospectives/{ID}-retro.md`.
2. Fill in the template with:
   - Summary of what was accomplished
   - What went well / what could improve
   - Key decisions table
   - Effort analysis table
   - Learnings by agent
   - Knowledge items extracted (with dimension, scope, and title)
3. Update the retrospective frontmatter with metrics and `knowledge_extracted` references.

### Step 5: Extract Knowledge Items

Run the extract-knowledge command to programmatically extract knowledge:
```bash
bun $RECURSIVE_AI_PATH/packages/cli/src/index.ts extract-knowledge .swarm/retrospectives/${STORY_ID}-retro.md --story-id ${STORY_ID} --repo ${REPO_NAME}
```

This produces structured knowledge items at `.swarm/knowledge/`. Review the JSON output for the list of created files.

### Step 6: Update Agent Memory

1. For each agent involved, append key learnings to `.claude/agent-memory/{agent}.md`.
2. Include patterns, gotchas, and decisions relevant to that agent's role.

### Step 7: Transition to Archived

Run the transition command to archive the story:
```bash
bun $RECURSIVE_AI_PATH/packages/cli/src/index.ts transition .swarm/backlog/${STORY_ID}.md archived
```

Then move the story file:
1. Move the story file from `.swarm/backlog/{ID}.md` to `.swarm/archive/{ID}.md`.
2. Update the `updated` timestamp.

### Step 8: List Knowledge Items

Verify extracted knowledge with:
```bash
bun $RECURSIVE_AI_PATH/packages/cli/src/index.ts list .swarm/knowledge
```

## Outputs

- Retrospective file: `.swarm/retrospectives/{ID}-retro.md`
- Knowledge item files: `.swarm/knowledge/{ID}-{N}.md` (one per extracted item)
- Updated agent memory files
- Archived story: `.swarm/archive/{ID}.md`
- Story status: `archived`
