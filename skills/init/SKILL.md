---
name: init
description: Initialize SWARM SDLC in the current project
---

# Skill: init

Initialize the SWARM SDLC system in the current project directory.

## Steps

### Step 1: Check Current Status

Use the `swarm_status` tool with `project_dir` set to the current working directory to check if SWARM is already initialized.

If already fully initialized, report the status and skip initialization.

### Step 2: Initialize SWARM

Use the `swarm_init` tool with:
- `project_dir`: the current working directory (absolute path)
- `prefix`: optional story ID prefix (defaults to project name uppercase)

This creates the following structure:
- `.swarm/config.md` — project configuration
- `.swarm/backlog/` — story files
- `.swarm/archive/` — completed stories
- `.swarm/retrospectives/` — retrospective documents
- `.swarm/knowledge/` — extracted knowledge items (E/Q/P)
- `.swarm/templates/` — story, retrospective, and knowledge templates
- `.swarm/definition-of-ready.yaml` — quality gate: when is a story ready?
- `.swarm/definition-of-done.yaml` — quality gate: when is a story done?
- `.swarm/ways-of-working.yaml` — team conventions
- `.claude/agent-memory/{agent}/MEMORY.md` — per-agent tactical learnings

### Step 3: Verify

Use the `swarm_status` tool again to confirm everything was created successfully.

### Step 4: Next Steps

Tell the user:
- Run `/swarm:ideate` to create their first story
- Run `/swarm:run` to execute a full SDLC pipeline

## Outputs

- Complete `.swarm/` directory structure
- Agent memory files in `.claude/agent-memory/`
- Updated `.gitignore` with SWARM rules
