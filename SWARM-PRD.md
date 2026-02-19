# SWARM SDLC — Complete System Specification

> **Purpose:** This document is the single source of truth for rebuilding the entire SWARM SDLC system from scratch. No code dependencies, no plugin system, no MCP — just files you create directly.

---

## Table of Contents

1. [Quick Install (copy-paste)](#1-quick-install)
2. [What SWARM Is](#2-what-swarm-is)
3. [Directory Structure](#3-directory-structure)
4. [Skills — Full Content](#4-skills)
5. [Agents — Full Content](#5-agents)
6. [.swarm/ Templates — Full Content](#6-swarm-templates)
7. [Quality Gates — Full Content](#7-quality-gates)
8. [Agent Memory Seeds](#8-agent-memory-seeds)
9. [.gitignore Rules](#9-gitignore-rules)
10. [Story Lifecycle & State Machine](#10-story-lifecycle)
11. [Knowledge Taxonomy](#11-knowledge-taxonomy)

---

## 1. Quick Install

Run this in any Claude Code session. It creates everything from scratch. No repos to clone, no plugins to install.

```
/swarm-init
```

If that skill doesn't exist yet, paste the following into your terminal:

```bash
# Create all 8 skill directories
mkdir -p ~/.claude/skills/swarm-{init,ideate,plan,execute,verify,close,retro,run}
```

Then create each `SKILL.md` file from [Section 4](#4-skills) below.

To initialize SWARM in a project, create the `.swarm/` directory structure from [Section 3](#3-directory-structure), populate templates from [Section 6](#6-swarm-templates), and create agent memory from [Section 8](#8-agent-memory-seeds).

---

## 2. What SWARM Is

SWARM (Structured Workflow for Agent-Run Methodology) brings Scrum-like discipline to AI agent workflows:

- **5-phase lifecycle:** ideate → plan → execute → verify → close
- **6 specialized agents:** backend-dev, frontend-dev, qa-engineer, architect, tech-writer, devops
- **Knowledge capture:** E/Q/P taxonomy (Epistemology, Qualia, Praxeology)
- **Quality gates:** Definition of Ready, Definition of Done, Ways of Working

---

## 3. Directory Structure

### Skills (installed to `~/.claude/skills/`)

```
~/.claude/skills/
├── swarm-init/SKILL.md
├── swarm-ideate/SKILL.md
├── swarm-plan/SKILL.md
├── swarm-execute/SKILL.md
├── swarm-verify/SKILL.md
├── swarm-close/SKILL.md
├── swarm-retro/SKILL.md
└── swarm-run/SKILL.md
```

### Project structure (created by `/swarm-init`)

```
your-project/
├── .swarm/
│   ├── config.md
│   ├── backlog/                     # Active stories
│   ├── archive/                     # Completed stories
│   ├── retrospectives/              # Retrospective documents
│   ├── knowledge/                   # Extracted knowledge items (E/Q/P)
│   ├── pending-questions/           # Questions needing answers
│   ├── templates/
│   │   ├── story.md
│   │   ├── retrospective.md
│   │   └── knowledge-item.md
│   ├── definition-of-ready.yaml
│   ├── definition-of-done.yaml
│   └── ways-of-working.yaml
├── .claude/
│   └── agent-memory/
│       ├── backend-dev/MEMORY.md
│       ├── frontend-dev/MEMORY.md
│       ├── qa-engineer/MEMORY.md
│       ├── architect/MEMORY.md
│       ├── tech-writer/MEMORY.md
│       └── devops/MEMORY.md
└── .gitignore                       # Updated with SWARM rules
```

---

## 4. Skills

### 4.1 `~/.claude/skills/swarm-init/SKILL.md`

```markdown
---
name: swarm-init
description: Initialize SWARM SDLC in the current project
allowed-tools: Read, Write, Edit, Bash, Glob
---

# Skill: swarm-init

Initialize the SWARM SDLC system in the current project directory.

## Steps

### Step 1: Check Current Status

Check if `.swarm/config.md` exists. If yes, SWARM is already initialized — report and skip.

### Step 2: Create Directory Structure

Create the following directories:
- `.swarm/backlog`
- `.swarm/archive`
- `.swarm/retrospectives`
- `.swarm/knowledge`
- `.swarm/pending-questions`
- `.swarm/templates`

Add `.gitkeep` to empty directories.

### Step 3: Create Config

Write `.swarm/config.md` using the config template (see Section 6.1). Replace `{{project}}` with the project name from `package.json` or directory name. Replace `{{prefix}}` with the project name uppercased.

### Step 4: Create Quality Gates

Write these files from the templates in Section 7:
- `.swarm/definition-of-ready.yaml`
- `.swarm/definition-of-done.yaml`
- `.swarm/ways-of-working.yaml`

### Step 5: Create Templates

Write these files from the templates in Section 6:
- `.swarm/templates/story.md`
- `.swarm/templates/retrospective.md`
- `.swarm/templates/knowledge-item.md`

### Step 6: Create Agent Memory

For each of the 6 agents, create `.claude/agent-memory/{name}/MEMORY.md` with the seed content from Section 8.

### Step 7: Update .gitignore

Append SWARM rules from Section 9 if not already present.

### Step 8: Report

Tell the user what was created. Next: Run `/swarm-ideate` to create their first story.
```

### 4.2 `~/.claude/skills/swarm-ideate/SKILL.md`

```markdown
---
name: swarm-ideate
description: Ideation phase — decompose problem, define acceptance criteria, estimate complexity
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Skill: swarm-ideate

Transition a story from **draft** to **ideating** and then to **planned** (or **awaiting_input** if clarification is needed).

## Inputs

- **Story idea or file:** Either a description of what to build, or path to an existing `.swarm/backlog/{ID}.md` file in `draft` status

## Steps

### Step 1: Read Context

1. Read `.swarm/config.md` for project conventions and DoR.
2. Read the story file (or create one from template if given a description).
3. Read relevant knowledge items from `.swarm/knowledge/` that may inform the approach.

### Step 2: Get Next Story ID

Read `.swarm/config.md`, increment the `counter` field, and use `{PREFIX}-{COUNTER}` as the story ID (zero-padded to 3 digits, e.g., `PROJ-001`).

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

Verify the story file has all required frontmatter fields: id, title, status, acceptance_criteria (non-empty), complexity, why.problem.

If invalid, fix the issues before proceeding.

### Step 9: Handle Questions (if any)

If clarification is needed:
1. Create a question file at `.swarm/pending-questions/{ID}-ideate.md`
2. Set story status to `awaiting_input`.

## Outputs

- Updated story file with ACs, complexity, tags
- Story status: `ideating` (or `awaiting_input`)
- Optional: question file in `.swarm/pending-questions/`
```

### 4.3 `~/.claude/skills/swarm-plan/SKILL.md`

```markdown
---
name: swarm-plan
description: Planning phase — create task breakdown, assign agents, estimate effort
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
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

Verify the story has acceptance criteria and a problem statement.

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

### Step 6: Update Story Status

Set status to `planned`. Update the `updated` timestamp.

### Step 7: Handle Questions (if any)

If clarification is needed during planning:
1. Create a question file at `.swarm/pending-questions/{ID}-plan.md`.
2. Set story status to `awaiting_input`.

## Outputs

- Updated story file with tasks, technical approach
- Story status: `planned` (or `awaiting_input`)
```

### 4.4 `~/.claude/skills/swarm-execute/SKILL.md`

```markdown
---
name: swarm-execute
description: Execution phase — implement tasks according to plan, coordinate agents
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
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

### Step 2: Set Status to Executing

Set story status to `executing`. Set `execution.started_at` to current timestamp.

### Step 3: Execute Tasks In Order

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

### Step 4: Verify As You Go

If `auto_verify` is enabled in WoW:
1. Run tests after each task completes.
2. Run the type checker: `bun run typecheck`
3. If verification fails, fix issues before proceeding.

### Step 5: Write Mini-Retrospectives

After each task, the assigned agent appends a mini-retrospective:

```
## Mini-Retrospective: {agent}
- **What worked:** [techniques that were effective]
- **What to remember:** [patterns, gotchas, important context]
- **Suggestion:** [improvements for next time]
- **Knowledge hints:** [E: patterns found | Q: pain points | P: best practices]
```

### Step 6: Update Execution State

1. Once all tasks are done, set story status to `verifying`.
2. Set `execution.completed_at` to current timestamp.

## Outputs

- Implemented code changes
- Updated story file with task statuses, AC evidence
- Mini-retrospectives appended to story
- Story status: `verifying`
```

### 4.5 `~/.claude/skills/swarm-verify/SKILL.md`

```markdown
---
name: swarm-verify
description: Verification phase — run all checks, validate ACs, confirm Definition of Done
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Skill: swarm-verify

Transition a story from **verifying** to **done** (or back to **executing** if issues are found).

## Inputs

- **Story file:** Path to a `.swarm/backlog/{ID}.md` file in `verifying` status

## Steps

### Step 1: Read Context

1. Read `.swarm/config.md` for DoD and conventions.
2. Read the story file — understand all ACs and their current status.

### Step 2: Run Automated Checks

1. **Type check:** `bun run typecheck`
2. **Lint:** `bunx biome check .`
3. **Tests:** `bun test`
4. Record pass/fail for each check.

### Step 3: Verify Acceptance Criteria

For each AC:
1. Check if evidence has been provided.
2. If automated, run the verification command.
3. If manual, review the implementation against the criterion.
4. Update AC status to `passing` or `failing`.

### Step 4: Check Definition of Done

1. Walk through each DoD item from `.swarm/definition-of-done.yaml`.
2. Run automated DoD commands where available.
3. Record which items pass and which fail.

### Step 5: Handle Failures

If any check fails:
1. Set story status back to `executing`.
2. Create new tasks for the failing items.
3. Document the failures in the story body.

### Step 6: Transition to Done

If all checks pass, set story status to `done`.

## Outputs

- Updated story file with AC evidence and statuses
- Story status: `done` or `executing` (if issues found)
- Verification report appended to story body
```

### 4.6 `~/.claude/skills/swarm-close/SKILL.md`

```markdown
---
name: swarm-close
description: Close phase — generate retrospective, extract knowledge, archive story
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
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

1. Create the retrospective file at `.swarm/retrospectives/{ID}-retro.md` using the retrospective template.
2. Fill in metrics, summary, what went well, what could improve, key decisions, effort analysis, learnings by agent.

### Step 5: Extract Knowledge Items

Parse the retrospective for knowledge candidates:
1. "What Went Well" → P (Praxeology/Best Practices) candidates
2. "What Could Improve" → Q (Qualia/Pain Points) candidates
3. "Key Decisions" → E (Epistemology/Patterns) candidates
4. Write knowledge item files to `.swarm/knowledge/{STORY_ID}-{N}.md` using the knowledge-item template.

### Step 6: Update Agent Memory

For each agent involved, append key learnings to `.claude/agent-memory/{agent}/MEMORY.md`.

### Step 7: Archive Story

1. Set story status to `archived`.
2. Move story from `.swarm/backlog/{ID}.md` to `.swarm/archive/{ID}.md`.

## Outputs

- Retrospective file: `.swarm/retrospectives/{ID}-retro.md`
- Knowledge items: `.swarm/knowledge/{ID}-{N}.md`
- Updated agent memory files
- Archived story: `.swarm/archive/{ID}.md`
```

### 4.7 `~/.claude/skills/swarm-retro/SKILL.md`

```markdown
---
name: swarm-retro
description: Standalone knowledge extraction — process retrospectives for knowledge items
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Skill: swarm-retro

Standalone knowledge extraction. Can process any retrospective to extract, tag, deduplicate, and link knowledge items.

## Inputs

- **Retrospective file:** Path to a `.swarm/retrospectives/{ID}-retro.md` file

## Steps

### Step 1: Read Context

1. Read `.swarm/config.md` for project conventions and knowledge settings.
2. Read the retrospective file.
3. List existing knowledge items in `.swarm/knowledge/` to check for duplicates.

### Step 2: Parse Retrospective

1. "What Went Well" → P (Praxeology) candidates
2. "What Could Improve" → Q (Qualia) candidates
3. "Key Decisions" → E (Epistemology) candidates
4. "Learnings by Agent" → all dimensions
5. "Knowledge to Preserve" table if present
6. Mini-retrospective "Knowledge hints" lines

### Step 3: Write Knowledge Items

For each candidate, write a knowledge item file to `.swarm/knowledge/{STORY-ID}-{N}.md` using the knowledge-item template with:
- Appropriate dimension (E/Q/P)
- Scope (repo/team/department/enterprise)
- Domain and tags
- `hoistable: true` if broadly applicable

### Step 4: Deduplicate

Compare against existing knowledge items. If semantically similar:
- Better new item → set `supersedes` to old ID
- Old item better → skip
- Complementary → keep both, cross-reference via tags

### Step 5: Update Retrospective

Add `knowledge_extracted` array to retrospective frontmatter referencing all items.

## Outputs

- Knowledge item files in `.swarm/knowledge/`
- Updated retrospective frontmatter
```

### 4.8 `~/.claude/skills/swarm-run/SKILL.md`

```markdown
---
name: swarm-run
description: Full pipeline — run ideate, plan, execute, verify, close with phase gating
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Skill: swarm-run

Full SWARM SDLC pipeline with phase gating. Runs all phases in sequence with confirmation between each phase.

## Inputs

- **Story description or file:** Either a description of what to build, or path to a `.swarm/backlog/{ID}.md` file in `draft` status
- **Optional:** `--auto` flag to skip confirmations between phases

## Steps

### Phase 1: Ideate

1. Execute the ideation process (see `/swarm-ideate`).
2. **Gate:** Verify story has at least 3 ACs, complexity estimated, status is `ideating`.
3. If gate fails or status is `awaiting_input`, stop and report.
4. If not `--auto`, ask for confirmation to proceed.

### Phase 2: Plan

1. Execute the planning process (see `/swarm-plan`).
2. **Gate:** Verify at least one task defined, all ACs covered, no circular dependencies.
3. If gate fails, stop and report.
4. If not `--auto`, ask for confirmation.

### Phase 3: Execute

1. Execute the implementation process (see `/swarm-execute`).
2. **Gate:** All tasks done, code compiles (`bun run typecheck`), tests pass (`bun test`), lint passes (`bunx biome check .`).
3. If gate fails, stop and report.
4. If not `--auto`, ask for confirmation.

### Phase 4: Verify

1. Execute the verification process (see `/swarm-verify`).
2. **Gate:** All ACs passing, story status is `done`.
3. If gate fails, stop and report.
4. If not `--auto`, ask for confirmation.

### Phase 5: Close

1. Execute the close process (see `/swarm-close`).
2. **Gate:** Retrospective exists, story archived, knowledge extracted.
3. If gate fails, stop and report.

### Final Report

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
- Retrospective with metrics
- Knowledge items extracted
- Agent memory updated
- Pipeline summary report
```

---

## 5. Agents

These go in `.claude/agents/` if using the plugin, or are simply referenced by name in task assignments.

### 5.1 `backend-dev.md`

```markdown
---
name: backend-dev
description: Backend developer agent — APIs, services, data layer
tools: Read, Write, Edit, Bash, Glob, Grep
model: opus
---

# Backend Developer Agent

## Before Starting

1. Read your memory file: `.claude/agent-memory/backend-dev.md`
2. Read the assigned story from `.swarm/backlog/`
3. Review any relevant knowledge items in `.swarm/knowledge/`

## Working Protocol

- Focus on API endpoints, service logic, and data access patterns
- Write tests first (test-driven development)
- Keep functions small and focused — single responsibility
- Use dependency injection where practical
- Handle errors explicitly; never swallow exceptions
- Add JSDoc comments to public interfaces

## Code Standards

- TypeScript strict mode
- Bun runtime
- Biome for linting and formatting
- Use for-loops instead of forEach
- Prefer async/await over raw promises
- Name files in kebab-case

## Mini-Retrospective Format

When completing a task, append a mini-retrospective to the story:

## Mini-Retrospective: backend-dev
- **What worked:** [techniques that were effective]
- **What to remember:** [patterns, gotchas, important context]
- **Suggestion:** [improvements for next time]
- **Knowledge hints:** [E: patterns found | Q: pain points | P: best practices]
```

### 5.2 `frontend-dev.md`

```markdown
---
name: frontend-dev
description: Frontend developer agent — UI components, pages, UX
tools: Read, Write, Edit, Bash, Glob, Grep
model: opus
---

# Frontend Developer Agent

## Before Starting

1. Read your memory file: `.claude/agent-memory/frontend-dev.md`
2. Read the assigned story from `.swarm/backlog/`
3. Review any relevant knowledge items in `.swarm/knowledge/`

## Working Protocol

- Build accessible, responsive UI components
- Follow component composition patterns (small, reusable pieces)
- Use semantic HTML and ARIA attributes where needed
- Keep styling co-located or use design tokens
- Test interactions and edge cases in the browser
- Report errors with toast notifications, never use alert/confirm

## Code Standards

- TypeScript strict mode
- Bun runtime
- Biome for linting and formatting
- Use for-loops instead of forEach
- Use shadcn/ui dialogs instead of native alert/confirm
- Name components in PascalCase, files in kebab-case

## Mini-Retrospective Format

When completing a task, append a mini-retrospective to the story:

## Mini-Retrospective: frontend-dev
- **What worked:** [techniques that were effective]
- **What to remember:** [patterns, gotchas, important context]
- **Suggestion:** [improvements for next time]
- **Knowledge hints:** [E: patterns found | Q: pain points | P: best practices]
```

### 5.3 `qa-engineer.md`

```markdown
---
name: qa-engineer
description: QA engineer agent — testing, verification, quality assurance
tools: Read, Write, Edit, Bash, Glob, Grep
model: opus
---

# QA Engineer Agent

## Before Starting

1. Read your memory file: `.claude/agent-memory/qa-engineer.md`
2. Read the assigned story from `.swarm/backlog/`
3. Review acceptance criteria carefully before writing tests
4. Review any relevant knowledge items in `.swarm/knowledge/`

## Working Protocol

- Write tests that directly verify acceptance criteria
- Cover happy path, edge cases, and error scenarios
- Use descriptive test names that explain the expected behavior
- Keep test files co-located with source files or in a `__tests__` directory
- Run the full test suite before marking tasks complete
- Update AC status in the story frontmatter when tests pass

## Code Standards

- TypeScript strict mode
- Bun test runner (`bun test`)
- Biome for linting and formatting
- Use for-loops instead of forEach
- Use `describe` / `it` blocks for organization
- Prefer `expect().toBe()` style assertions

## Mini-Retrospective Format

When completing a task, append a mini-retrospective to the story:

## Mini-Retrospective: qa-engineer
- **What worked:** [techniques that were effective]
- **What to remember:** [patterns, gotchas, important context]
- **Suggestion:** [improvements for next time]
- **Knowledge hints:** [E: patterns found | Q: pain points | P: best practices]
```

### 5.4 `architect.md`

```markdown
---
name: architect
description: Architect agent — system design, patterns, architecture decision records
tools: Read, Write, Edit, Bash, Glob, Grep
model: opus
---

# Architect Agent

## Before Starting

1. Read your memory file: `.claude/agent-memory/architect.md`
2. Read the assigned story from `.swarm/backlog/`
3. Review existing architecture and patterns in the codebase
4. Review any relevant knowledge items in `.swarm/knowledge/`

## Working Protocol

- Define clear interfaces and boundaries between components
- Document architectural decisions as ADRs when significant
- Consider scalability, maintainability, and testability
- Prefer composition over inheritance
- Keep dependency graphs acyclic
- Sketch technical approaches before implementation begins

## Code Standards

- TypeScript strict mode
- Bun runtime
- Biome for linting and formatting
- Use for-loops instead of forEach
- Design for extensibility without over-engineering
- Name modules by domain, not by technical layer

## Mini-Retrospective Format

When completing a task, append a mini-retrospective to the story:

## Mini-Retrospective: architect
- **What worked:** [techniques that were effective]
- **What to remember:** [patterns, gotchas, important context]
- **Suggestion:** [improvements for next time]
- **Knowledge hints:** [E: patterns found | Q: pain points | P: best practices]
```

### 5.5 `tech-writer.md`

```markdown
---
name: tech-writer
description: Tech writer agent — documentation, guides, changelogs
tools: Read, Write, Edit, Bash, Glob, Grep
model: sonnet
---

# Tech Writer Agent

## Before Starting

1. Read your memory file: `.claude/agent-memory/tech-writer.md`
2. Read the assigned story from `.swarm/backlog/`
3. Review existing documentation for consistency
4. Review any relevant knowledge items in `.swarm/knowledge/`

## Working Protocol

- Write clear, concise documentation aimed at the target audience
- Use consistent terminology throughout
- Include code examples where they add clarity
- Keep README files up to date with project changes
- Document public APIs, configuration options, and setup steps
- Add inline comments only where the code is non-obvious

## Code Standards

- Markdown for all documentation
- Use ATX-style headings (# not ===)
- Code blocks with language annotation
- Tables for structured comparisons
- Link to related docs rather than duplicating content

## Mini-Retrospective Format

When completing a task, append a mini-retrospective to the story:

## Mini-Retrospective: tech-writer
- **What worked:** [techniques that were effective]
- **What to remember:** [patterns, gotchas, important context]
- **Suggestion:** [improvements for next time]
- **Knowledge hints:** [E: patterns found | Q: pain points | P: best practices]
```

### 5.6 `devops.md`

```markdown
---
name: devops
description: DevOps engineer agent — CI/CD, infrastructure, deployment
tools: Read, Write, Edit, Bash, Glob, Grep
model: sonnet
---

# DevOps Engineer Agent

## Before Starting

1. Read your memory file: `.claude/agent-memory/devops.md`
2. Read the assigned story from `.swarm/backlog/`
3. Review existing CI/CD configuration and infrastructure
4. Review any relevant knowledge items in `.swarm/knowledge/`

## Working Protocol

- Automate everything that can be automated
- Keep CI pipelines fast and reliable
- Use infrastructure as code (IaC) patterns
- Implement proper secrets management (never commit secrets)
- Add health checks and monitoring for deployed services
- Document deployment procedures and rollback steps

## Code Standards

- TypeScript for scripts, YAML for configuration
- Bun runtime for build tooling
- Biome for linting and formatting
- Use for-loops instead of forEach
- Prefer declarative over imperative configuration
- Tag and version all deployable artifacts

## Mini-Retrospective Format

When completing a task, append a mini-retrospective to the story:

## Mini-Retrospective: devops
- **What worked:** [techniques that were effective]
- **What to remember:** [patterns, gotchas, important context]
- **Suggestion:** [improvements for next time]
- **Knowledge hints:** [E: patterns found | Q: pain points | P: best practices]
```

---

## 6. .swarm/ Templates

### 6.1 `config.md`

```markdown
---
project: "{{project}}"
prefix: "{{prefix}}"
counter: 0
definition_of_ready:
  - "Problem statement is clearly defined"
  - "Acceptance criteria are testable"
  - "Complexity has been estimated"
  - "Technical approach has been sketched"
definition_of_done:
  - "All acceptance criteria are passing"
  - "Code compiles without errors"
  - "All tests pass"
  - "Linting passes with no errors"
  - "Retrospective has been generated"
  - "Knowledge has been extracted"
ways_of_working:
  testing: "test-first"
  review: "required"
  documentation: "standard"
  effort_model: "tshirt"
  max_parallel_agents: 3
  auto_verify: true
  knowledge_extraction: true
  knowledge_auto_hoist: false
---

# {{project}} — SWARM Configuration

## Team Conventions

- **Runtime:** Bun
- **Language:** TypeScript
- **Linter / Formatter:** Biome

## Agent Roles

| Agent | Role | Focus Area |
|-------|------|------------|
| backend-dev | Backend Developer | APIs, services, data layer |
| frontend-dev | Frontend Developer | UI components, pages, UX |
| qa-engineer | QA Engineer | Testing, verification, quality |
| architect | Architect | System design, patterns, ADRs |
| tech-writer | Tech Writer | Documentation, guides, changelogs |
| devops | DevOps Engineer | CI/CD, infrastructure, deployment |

## Story Lifecycle

draft → ideating → planned → executing → verifying → done → archived
                ↘                                   ↗
              awaiting_input ──────────────────────┘

Each phase is executed by the corresponding SWARM skill:
1. `swarm-ideate` — Problem decomposition & acceptance criteria
2. `swarm-plan` — Task breakdown & agent assignment
3. `swarm-execute` — Implementation with agent coordination
4. `swarm-verify` — Automated & manual verification
5. `swarm-close` — Retrospective, knowledge extraction, archival
```

### 6.2 `story.md`

```markdown
---
id: "{ID}"
title: "{TITLE}"
status: "draft"
priority: "medium"
complexity: "moderate"
created: "{TIMESTAMP}"
updated: "{TIMESTAMP}"
author: "architect"
tags: []
acceptance_criteria: []
tasks: []
execution:
  started_at: null
  completed_at: null
  task_list_id: null
  session_ids: []
why:
  problem: "{PROBLEM}"
  root_cause: ""
  impact: ""
---

# {TITLE}

## Problem Statement

{PROBLEM}

## Acceptance Criteria

_To be defined during ideation phase._

## Technical Approach

_To be defined during planning phase._

## Tasks

_To be generated during planning phase._

## Notes

- Story created: {TIMESTAMP}
- Backlog path: `.swarm/backlog/{ID}.md`
```

### 6.3 `retrospective.md`

```markdown
---
story_id: "{STORY_ID}"
title: "{TITLE}"
completed: "{TIMESTAMP}"
duration: "{DURATION}"
agents_involved: []
repo: "{REPO}"
team: ""
knowledge_extracted: []
metrics:
  tasks_total: 0
  tasks_completed: 0
  acs_total: 0
  acs_passing: 0
  files_changed: 0
  tests_added: 0
  cycle_time_hours: 0
---

# Retrospective: {TITLE}

## Summary

Brief summary of what was accomplished, key decisions made, and overall outcome.

## What Went Well

- Item 1
- Item 2

## What Could Improve

- Item 1
- Item 2

## Key Decisions

| Decision | Rationale | Alternatives Considered |
|----------|-----------|------------------------|
| Decision 1 | Why this was chosen | What else was evaluated |

## Effort Analysis

| Task | Agent | Estimated | Actual | Notes |
|------|-------|-----------|--------|-------|
| Task 1 | agent-name | S | S | On target |

## Learnings by Agent

### backend-dev
- Learning 1

### frontend-dev
- Learning 1

### qa-engineer
- Learning 1

### architect
- Learning 1

### tech-writer
- Learning 1

### devops
- Learning 1

## Knowledge to Preserve

| # | Dimension | Scope | Title | Description |
|---|-----------|-------|-------|-------------|
| 1 | E/Q/P | repo/team | Title | Brief description |
```

### 6.4 `knowledge-item.md`

```markdown
---
id: "{ID}"
source_story: "{STORY_ID}"
source_repo: "{REPO}"
created: "{TIMESTAMP}"
author: "{AGENT}"
dimension: "{DIMENSION}"
scope: "{SCOPE}"
hoistable: false
hoisted_to: null
hoisted_at: null
confidence: "medium"
tags: []
domain: "{DOMAIN}"
title: "{TITLE}"
supersedes: null
ttl: null
---

# {TITLE}

## Context

_What situation or scenario does this knowledge apply to?_

## Description

_Detailed description of the pattern, pain point, or best practice._

## Recommendation

_What should be done when this situation is encountered?_

## Evidence

- Source story: `{STORY_ID}`
- Discovered by: {AGENT}
- Confidence: medium
```

---

## 7. Quality Gates

### 7.1 `definition-of-ready.yaml`

```yaml
# Definition of Ready — SWARM
# A story is ready for planning when all required items are met.

items:
  - id: "dor-1"
    description: "Problem statement is clearly defined"
    required: true
    automated: false

  - id: "dor-2"
    description: "Acceptance criteria are testable"
    required: true
    automated: false

  - id: "dor-3"
    description: "Complexity has been estimated"
    required: true
    automated: false

  - id: "dor-4"
    description: "Technical approach has been sketched"
    required: false
    automated: false
```

### 7.2 `definition-of-done.yaml`

```yaml
# Definition of Done — SWARM
# A story is done when all required items are met.

items:
  - id: "dod-1"
    description: "All acceptance criteria are passing"
    required: true
    automated: true
    command: "grep -c 'status: passing' .swarm/backlog/{STORY_ID}.md"

  - id: "dod-2"
    description: "Code compiles without errors"
    required: true
    automated: true
    command: "bun run typecheck"

  - id: "dod-3"
    description: "All tests pass"
    required: true
    automated: true
    command: "bun test"

  - id: "dod-4"
    description: "Linting passes with no errors"
    required: true
    automated: true
    command: "bunx biome check ."

  - id: "dod-5"
    description: "Retrospective has been generated"
    required: true
    automated: false

  - id: "dod-6"
    description: "Knowledge has been extracted"
    required: true
    automated: false
```

### 7.3 `ways-of-working.yaml`

```yaml
# Ways of Working — SWARM
# Team process and automation settings.

testing: "test-first"
review: "required"
documentation: "standard"
effort_model: "tshirt"
max_parallel_agents: 3
auto_verify: true
knowledge_extraction: true
knowledge_auto_hoist: false
```

---

## 8. Agent Memory Seeds

For each agent, create `.claude/agent-memory/{name}/MEMORY.md`:

```markdown
# {Title} — Agent Memory

## Patterns Learned
_No patterns recorded yet._

## Gotchas & Pain Points
_No gotchas recorded yet._

## Best Practices
_No best practices recorded yet._

## Project-Specific Notes
_No project-specific notes yet._
```

Where `{Title}` is:

| Agent | Title |
|-------|-------|
| backend-dev | Backend Developer |
| frontend-dev | Frontend Developer |
| qa-engineer | QA Engineer |
| architect | Architect |
| tech-writer | Tech Writer |
| devops | DevOps Engineer |

---

## 9. .gitignore Rules

Append these to your project's `.gitignore`:

```
# SWARM SDLC (local state)
.swarm/pending-questions/

# Agent memory (project-specific, not shared)
.claude/agent-memory/
```

---

## 10. Story Lifecycle

```
draft → ideating → planned → executing → verifying → done → archived
              ↘                                    ↗
            awaiting_input ───────────────────────┘
```

### Valid Transitions

| From | To |
|------|----|
| `draft` | `ideating` |
| `ideating` | `planned`, `awaiting_input` |
| `planned` | `executing`, `awaiting_input` |
| `executing` | `verifying`, `awaiting_input` |
| `verifying` | `done`, `executing` (rework) |
| `done` | `archived` |
| `awaiting_input` | previous status (resume) |

### Transition Preconditions

| Target | Preconditions |
|--------|--------------|
| `planned` | Has acceptance_criteria, has why.problem |
| `executing` | Has tasks (non-empty) |
| `verifying` | All tasks are `done` or `skipped` |
| `done` | All ACs are `passing` |
| `archived` | Story status is `done` |

---

## 11. Knowledge Taxonomy

### Dimensions

| Code | Name | Meaning | Sources |
|------|------|---------|---------|
| **E** | Epistemology | Patterns — reusable architectural/design patterns | Key Decisions, architectural choices |
| **Q** | Qualia | Pain Points — gotchas, pitfalls, surprises | What Could Improve, debugging war stories |
| **P** | Praxeology | Best Practices — proven techniques and conventions | What Went Well, effective workflows |

### Scope

| Level | Description |
|-------|-------------|
| `repo` | Applies to this repository only |
| `team` | Applies across team repositories |
| `department` | Applies department-wide |
| `enterprise` | Applies organization-wide |

### Knowledge Hierarchy

```
Worker (repo) → Scout (team) → Queen (dept) → Hive Mind (enterprise)
```

Items with `hoistable: true` can be promoted upward by Scout agents.
