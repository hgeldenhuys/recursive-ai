---
name: ideate
description: Ideation phase — decompose problem, define acceptance criteria, estimate complexity
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, mcp__plugin_swarm_swarm__swarm_validate, mcp__plugin_swarm_swarm__swarm_next_id
---

# Skill: ideate

Transition a story from **draft** to **ideating** and then to **planned** (or **awaiting_input** if clarification is needed).

## Inputs

- **Story file:** Path to a `.swarm/backlog/{ID}.md` file in `draft` status

## Steps

### Step 1: Read Context

1. Read `.swarm/config.md` for project conventions and DoR.
2. Read the story file and understand the problem statement.
3. Read relevant knowledge items from `.swarm/knowledge/` that may inform the approach.

### Step 2: Get Next Story ID

Use the `swarm_next_id` tool with `config_path` set to the absolute path of `.swarm/config.md`.

Parse the result to get the `id` field for the new story.

### Step 3: Decompose the Problem

1. Break the problem into sub-problems if needed.
2. Identify affected components, services, or modules.
3. Note any external dependencies or unknowns.

### Step 4: Define Acceptance Criteria

1. Write 3-7 testable acceptance criteria.
2. Each AC must be independently verifiable.
3. Use the format:
   ```yaml
   - id: "AC-1"
     description: "Given X, when Y, then Z"
     status: "pending"
     evidence: ""
   ```

### Step 5: Estimate Complexity

1. Assess complexity: trivial, simple, moderate, complex, or epic.
2. Consider unknowns, integration surface, and test effort.

### Step 6: Check Definition of Ready

1. Verify all DoR items from `.swarm/config.md` are satisfied.
2. If any item is not met, set status to `awaiting_input` and create a question file.

### Step 7: Update Story

1. Update the story frontmatter with ACs, complexity, and tags.
2. Set status to `ideating`.
3. Update the `updated` timestamp.

### Step 8: Validate Story

Use the `swarm_validate` tool with `path` set to the absolute path of `.swarm/backlog/${STORY_ID}.md`.

If `ok: false`, fix the issues listed in `details` before proceeding.

### Step 9: Handle Questions (if any)

If clarification is needed:
1. Create a question file at `.swarm/pending-questions/{ID}-ideate.md`:
   ```yaml
   ---
   story_id: "{ID}"
   phase: "ideate"
   status: "pending"
   created: "{TIMESTAMP}"
   questions:
     - id: "Q1"
       question: "What is the expected behavior when...?"
       type: "freetext"
   ---
   ```
2. Set story status to `awaiting_input`.

## Outputs

- Updated story file with ACs, complexity, tags
- Story status: `ideating` (or `awaiting_input`)
- Optional: question file in `.swarm/pending-questions/`
