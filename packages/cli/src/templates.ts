/**
 * Template generators for the SWARM SDLC system.
 *
 * All templates produce markdown with YAML frontmatter.
 * Paths reference `.swarm/` directories; skill names use `swarm-` prefix.
 */

// ---------------------------------------------------------------------------
// Template context
// ---------------------------------------------------------------------------

export interface TemplateContext {
  projectName: string;
  prefix: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// .swarm/config.md
// ---------------------------------------------------------------------------

export function configMd(ctx: TemplateContext): string {
  return `---
project: "${ctx.projectName}"
prefix: "${ctx.prefix}"
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

# ${ctx.projectName} — SWARM Configuration

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

\`\`\`
draft → ideating → planned → executing → verifying → done → archived
                ↘                                   ↗
              awaiting_input ──────────────────────┘
\`\`\`

Each phase is executed by the corresponding SWARM skill:
1. \`swarm-ideate\` — Problem decomposition & acceptance criteria
2. \`swarm-plan\` — Task breakdown & agent assignment
3. \`swarm-execute\` — Implementation with agent coordination
4. \`swarm-verify\` — Automated & manual verification
5. \`swarm-close\` — Retrospective, knowledge extraction, archival
`;
}

// ---------------------------------------------------------------------------
// Story template
// ---------------------------------------------------------------------------

export function storyTemplate(): string {
  return `---
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
- Backlog path: \`.swarm/backlog/{ID}.md\`
`;
}

// ---------------------------------------------------------------------------
// Retrospective template
// ---------------------------------------------------------------------------

export function retrospectiveTemplate(): string {
  return `---
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

Items identified for knowledge extraction. Each should include:
- **Dimension:** E (Epistemology/Patterns), Q (Qualia/Pain Points), or P (Praxeology/Best Practices)
- **Scope:** repo, team, department, or enterprise
- **Description:** Concise description of the insight

| # | Dimension | Scope | Title | Description |
|---|-----------|-------|-------|-------------|
| 1 | E/Q/P | repo/team | Title | Brief description |
`;
}

// ---------------------------------------------------------------------------
// Knowledge item template
// ---------------------------------------------------------------------------

export function knowledgeItemTemplate(): string {
  return `---
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

- Source story: \`{STORY_ID}\`
- Discovered by: {AGENT}
- Confidence: medium
`;
}

// ---------------------------------------------------------------------------
// Definition of Ready YAML
// ---------------------------------------------------------------------------

export function definitionOfReadyYaml(): string {
  return `# Definition of Ready — SWARM
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
`;
}

// ---------------------------------------------------------------------------
// Definition of Done YAML
// ---------------------------------------------------------------------------

export function definitionOfDoneYaml(): string {
  return `# Definition of Done — SWARM
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
`;
}

// ---------------------------------------------------------------------------
// Ways of Working YAML
// ---------------------------------------------------------------------------

export function waysOfWorkingYaml(): string {
  return `# Ways of Working — SWARM
# Team process and automation settings.

testing: "test-first"
review: "required"
documentation: "standard"
effort_model: "tshirt"
max_parallel_agents: 3
auto_verify: true
knowledge_extraction: true
knowledge_auto_hoist: false
`;
}

// ---------------------------------------------------------------------------
// Agent templates
// ---------------------------------------------------------------------------

export function agentBackendDev(): string {
  return `---
name: "backend-dev"
description: "Backend developer agent — APIs, services, data layer"
memory: "project"
model: ""
allowed-tools:
  - "Read"
  - "Write"
  - "Edit"
  - "Bash"
  - "Glob"
  - "Grep"
---

# Backend Developer Agent

## Before Starting

1. Read your memory file: \`.claude/agent-memory/backend-dev.md\`
2. Read the assigned story from \`.swarm/backlog/\`
3. Review any relevant knowledge items in \`.swarm/knowledge/\`

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

\`\`\`
## Mini-Retrospective: backend-dev
- **What worked:** [techniques that were effective]
- **What to remember:** [patterns, gotchas, important context]
- **Suggestion:** [improvements for next time]
- **Knowledge hints:** [E: patterns found | Q: pain points | P: best practices]
\`\`\`
`;
}

export function agentFrontendDev(): string {
  return `---
name: "frontend-dev"
description: "Frontend developer agent — UI components, pages, UX"
memory: "project"
model: ""
allowed-tools:
  - "Read"
  - "Write"
  - "Edit"
  - "Bash"
  - "Glob"
  - "Grep"
---

# Frontend Developer Agent

## Before Starting

1. Read your memory file: \`.claude/agent-memory/frontend-dev.md\`
2. Read the assigned story from \`.swarm/backlog/\`
3. Review any relevant knowledge items in \`.swarm/knowledge/\`

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

\`\`\`
## Mini-Retrospective: frontend-dev
- **What worked:** [techniques that were effective]
- **What to remember:** [patterns, gotchas, important context]
- **Suggestion:** [improvements for next time]
- **Knowledge hints:** [E: patterns found | Q: pain points | P: best practices]
\`\`\`
`;
}

export function agentQaEngineer(): string {
  return `---
name: "qa-engineer"
description: "QA engineer agent — testing, verification, quality assurance"
memory: "project"
model: ""
allowed-tools:
  - "Read"
  - "Write"
  - "Edit"
  - "Bash"
  - "Glob"
  - "Grep"
---

# QA Engineer Agent

## Before Starting

1. Read your memory file: \`.claude/agent-memory/qa-engineer.md\`
2. Read the assigned story from \`.swarm/backlog/\`
3. Review acceptance criteria carefully before writing tests
4. Review any relevant knowledge items in \`.swarm/knowledge/\`

## Working Protocol

- Write tests that directly verify acceptance criteria
- Cover happy path, edge cases, and error scenarios
- Use descriptive test names that explain the expected behavior
- Keep test files co-located with source files or in a \`__tests__\` directory
- Run the full test suite before marking tasks complete
- Update AC status in the story frontmatter when tests pass

## Code Standards

- TypeScript strict mode
- Bun test runner (\`bun test\`)
- Biome for linting and formatting
- Use for-loops instead of forEach
- Use \`describe\` / \`it\` blocks for organization
- Prefer \`expect().toBe()\` style assertions

## Mini-Retrospective Format

When completing a task, append a mini-retrospective to the story:

\`\`\`
## Mini-Retrospective: qa-engineer
- **What worked:** [techniques that were effective]
- **What to remember:** [patterns, gotchas, important context]
- **Suggestion:** [improvements for next time]
- **Knowledge hints:** [E: patterns found | Q: pain points | P: best practices]
\`\`\`
`;
}

export function agentArchitect(): string {
  return `---
name: "architect"
description: "Architect agent — system design, patterns, architecture decision records"
memory: "project"
model: ""
allowed-tools:
  - "Read"
  - "Write"
  - "Edit"
  - "Bash"
  - "Glob"
  - "Grep"
---

# Architect Agent

## Before Starting

1. Read your memory file: \`.claude/agent-memory/architect.md\`
2. Read the assigned story from \`.swarm/backlog/\`
3. Review existing architecture and patterns in the codebase
4. Review any relevant knowledge items in \`.swarm/knowledge/\`

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

\`\`\`
## Mini-Retrospective: architect
- **What worked:** [techniques that were effective]
- **What to remember:** [patterns, gotchas, important context]
- **Suggestion:** [improvements for next time]
- **Knowledge hints:** [E: patterns found | Q: pain points | P: best practices]
\`\`\`
`;
}

export function agentTechWriter(): string {
  return `---
name: "tech-writer"
description: "Tech writer agent — documentation, guides, changelogs"
memory: "project"
model: ""
allowed-tools:
  - "Read"
  - "Write"
  - "Edit"
  - "Bash"
  - "Glob"
  - "Grep"
---

# Tech Writer Agent

## Before Starting

1. Read your memory file: \`.claude/agent-memory/tech-writer.md\`
2. Read the assigned story from \`.swarm/backlog/\`
3. Review existing documentation for consistency
4. Review any relevant knowledge items in \`.swarm/knowledge/\`

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

\`\`\`
## Mini-Retrospective: tech-writer
- **What worked:** [techniques that were effective]
- **What to remember:** [patterns, gotchas, important context]
- **Suggestion:** [improvements for next time]
- **Knowledge hints:** [E: patterns found | Q: pain points | P: best practices]
\`\`\`
`;
}

export function agentDevops(): string {
  return `---
name: "devops"
description: "DevOps engineer agent — CI/CD, infrastructure, deployment"
memory: "project"
model: ""
allowed-tools:
  - "Read"
  - "Write"
  - "Edit"
  - "Bash"
  - "Glob"
  - "Grep"
---

# DevOps Engineer Agent

## Before Starting

1. Read your memory file: \`.claude/agent-memory/devops.md\`
2. Read the assigned story from \`.swarm/backlog/\`
3. Review existing CI/CD configuration and infrastructure
4. Review any relevant knowledge items in \`.swarm/knowledge/\`

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

\`\`\`
## Mini-Retrospective: devops
- **What worked:** [techniques that were effective]
- **What to remember:** [patterns, gotchas, important context]
- **Suggestion:** [improvements for next time]
- **Knowledge hints:** [E: patterns found | Q: pain points | P: best practices]
\`\`\`
`;
}

// ---------------------------------------------------------------------------
// Agent memory seed
// ---------------------------------------------------------------------------

export function agentMemorySeed(name: string, title: string): string {
  return `# ${title}

## Project Context

_This file is automatically maintained. The ${name} agent reads it at the start of each task and appends learnings at the end._

## Patterns & Preferences

_No entries yet._

## Gotchas & Pitfalls

_No entries yet._

## Key Decisions

_No entries yet._
`;
}

// ---------------------------------------------------------------------------
// Agent memory titles
// ---------------------------------------------------------------------------

export const AGENT_MEMORY_TITLES: Record<string, string> = {
  'backend-dev': 'Backend Developer Memory',
  'frontend-dev': 'Frontend Developer Memory',
  'qa-engineer': 'QA Engineer Memory',
  architect: 'Architect Memory',
  'tech-writer': 'Tech Writer Memory',
  devops: 'DevOps Engineer Memory',
};

// ---------------------------------------------------------------------------
// Skill templates
// ---------------------------------------------------------------------------

export function skillSwarmIdeate(): string {
  return `---
name: "swarm-ideate"
description: "Ideation phase — decompose problem, define acceptance criteria, estimate complexity"
model: ""
allowed-tools:
  - "Read"
  - "Write"
  - "Edit"
  - "Bash"
  - "Glob"
  - "Grep"
---

# Skill: swarm-ideate

Transition a story from **draft** to **ideating** and then to **planned** (or **awaiting_input** if clarification is needed).

## Inputs

- **Story file:** Path to a \`.swarm/backlog/{ID}.md\` file in \`draft\` status

## Steps

### Step 1: Read Context

1. Read \`.swarm/config.md\` for project conventions and DoR.
2. Read the story file and understand the problem statement.
3. Read relevant knowledge items from \`.swarm/knowledge/\` that may inform the approach.

### Step 2: Decompose the Problem

1. Break the problem into sub-problems if needed.
2. Identify affected components, services, or modules.
3. Note any external dependencies or unknowns.

### Step 3: Define Acceptance Criteria

1. Write 3–7 testable acceptance criteria.
2. Each AC must be independently verifiable.
3. Use the format:
   \`\`\`yaml
   - id: "AC-1"
     description: "Given X, when Y, then Z"
     status: "pending"
     evidence: ""
   \`\`\`

### Step 4: Estimate Complexity

1. Assess complexity: trivial, simple, moderate, complex, or epic.
2. Consider unknowns, integration surface, and test effort.

### Step 5: Check Definition of Ready

1. Verify all DoR items from \`.swarm/config.md\` are satisfied.
2. If any item is not met, set status to \`awaiting_input\` and create a question file.

### Step 6: Update Story

1. Update the story frontmatter with ACs, complexity, and tags.
2. Set status to \`ideating\`.
3. Update the \`updated\` timestamp.

### Step 7: Handle Questions (if any)

If clarification is needed:
1. Create a question file at \`.swarm/pending-questions/{ID}-ideate.md\`:
   \`\`\`yaml
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
   \`\`\`
2. Set story status to \`awaiting_input\`.

## Outputs

- Updated story file with ACs, complexity, tags
- Story status: \`ideating\` (or \`awaiting_input\`)
- Optional: question file in \`.swarm/pending-questions/\`
`;
}

export function skillSwarmPlan(): string {
  return `---
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

- **Story file:** Path to a \`.swarm/backlog/{ID}.md\` file in \`ideating\` status

## Steps

### Step 1: Read Context

1. Read \`.swarm/config.md\` for agent roles, WoW, and effort model.
2. Read the story file — understand ACs and the problem.
3. Review the codebase structure to understand where changes are needed.
4. Read relevant knowledge items from \`.swarm/knowledge/\`.

### Step 2: Design Technical Approach

1. Sketch the technical approach in the story body.
2. Identify files to create, modify, or delete.
3. Note architectural patterns to follow.

### Step 3: Create Task Breakdown

1. Create tasks that collectively satisfy all ACs.
2. Each task should map to one or more ACs via \`ac_coverage\`.
3. Assign each task to the appropriate agent.
4. Estimate effort using the project's effort model (T-shirt sizes by default).
5. Define task dependencies via \`depends_on\`.
6. Use the format:
   \`\`\`yaml
   - id: "T-1"
     title: "Implement API endpoint for..."
     agent: "backend-dev"
     status: "pending"
     depends_on: []
     effort_estimate: "M"
     ac_coverage: ["AC-1", "AC-2"]
   \`\`\`

### Step 4: Validate Coverage

1. Ensure every AC is covered by at least one task.
2. Ensure no circular dependencies exist in the task graph.
3. Check that total effort is reasonable for the complexity estimate.

### Step 5: Handle Questions (if any)

If clarification is needed during planning:
1. Create a question file at \`.swarm/pending-questions/{ID}-plan.md\`.
2. Set story status to \`awaiting_input\`.

### Step 6: Update Story

1. Update the story frontmatter with the task list.
2. Add the technical approach to the story body.
3. Set status to \`planned\`.
4. Update the \`updated\` timestamp.

## Outputs

- Updated story file with tasks, technical approach
- Story status: \`planned\` (or \`awaiting_input\`)
- Optional: question file in \`.swarm/pending-questions/\`
`;
}

export function skillSwarmExecute(): string {
  return `---
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

- **Story file:** Path to a \`.swarm/backlog/{ID}.md\` file in \`planned\` status

## Steps

### Step 1: Read Context

1. Read \`.swarm/config.md\` for conventions and WoW.
2. Read the story file — understand tasks, ACs, and technical approach.
3. Read agent memory files from \`.claude/agent-memory/\` for assigned agents.
4. Read relevant knowledge items from \`.swarm/knowledge/\`.

### Step 2: Set Up Execution

1. Set story status to \`executing\`.
2. Set \`execution.started_at\` to current timestamp.
3. Update the \`updated\` timestamp.

### Step 3: Execute Tasks In Order

For each task (respecting dependency order):

1. Read the task details and its AC coverage.
2. Identify the assigned agent and read their memory.
3. Implement the task:
   - Write code following project standards.
   - Write tests if the WoW requires test-first.
   - Run linting after changes: \`bunx biome check .\`
   - Run tests after changes: \`bun test\`
4. Update task status to \`in_progress\`, then \`done\`.
5. Update related AC statuses as evidence is gathered.
6. Update the \`updated\` timestamp.

### Step 4: Verify As You Go

If \`auto_verify\` is enabled in WoW:
1. Run tests after each task completes.
2. Run the type checker: \`bun run typecheck\`
3. If verification fails, fix issues before proceeding.

### Step 5: Write Mini-Retrospectives

After each task, the assigned agent appends a mini-retrospective:

\`\`\`
## Mini-Retrospective: {agent}
- **What worked:** [techniques that were effective]
- **What to remember:** [patterns, gotchas, important context]
- **Suggestion:** [improvements for next time]
- **Knowledge hints:** [E: patterns found | Q: pain points | P: best practices]
\`\`\`

### Step 6: Update Execution State

1. Once all tasks are done, set story status to \`verifying\` (or \`done\` if auto_verify handled it).
2. Set \`execution.completed_at\` to current timestamp.
3. Update the \`updated\` timestamp.

## Outputs

- Implemented code changes
- Updated story file with task statuses, AC evidence
- Mini-retrospectives appended to story
- Story status: \`verifying\` or \`done\`
`;
}

export function skillSwarmVerify(): string {
  return `---
name: "swarm-verify"
description: "Verification phase — run all checks, validate ACs, confirm Definition of Done"
model: ""
allowed-tools:
  - "Read"
  - "Write"
  - "Edit"
  - "Bash"
  - "Glob"
  - "Grep"
---

# Skill: swarm-verify

Transition a story from **verifying** to **done** (or back to **executing** if issues are found).

## Inputs

- **Story file:** Path to a \`.swarm/backlog/{ID}.md\` file in \`verifying\` status

## Steps

### Step 1: Read Context

1. Read \`.swarm/config.md\` for DoD and conventions.
2. Read the story file — understand all ACs and their current status.

### Step 2: Run Automated Checks

1. **Type check:** \`bun run typecheck\`
2. **Lint:** \`bunx biome check .\`
3. **Tests:** \`bun test\`
4. Record pass/fail for each check.

### Step 3: Verify Acceptance Criteria

For each AC:
1. Check if evidence has been provided.
2. If automated, run the verification command.
3. If manual, review the implementation against the criterion.
4. Update AC status to \`passing\` or \`failing\`.

### Step 4: Check Definition of Done

1. Walk through each DoD item from \`.swarm/config.md\`.
2. Run automated DoD commands where available.
3. Record which items pass and which fail.

### Step 5: Handle Failures

If any check fails:
1. Set story status back to \`executing\`.
2. Create new tasks for the failing items.
3. Document the failures in the story body.
4. Update the \`updated\` timestamp.

### Step 6: Mark Done

If all checks pass:
1. Set all AC statuses to \`passing\`.
2. Set story status to \`done\`.
3. Update the \`updated\` timestamp.

## Outputs

- Updated story file with AC evidence and statuses
- Story status: \`done\` or \`executing\` (if issues found)
- Verification report appended to story body
`;
}

export function skillSwarmClose(): string {
  return `---
name: "swarm-close"
description: "Close phase — generate retrospective, extract knowledge, archive story"
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

- **Story file:** Path to a \`.swarm/backlog/{ID}.md\` file in \`done\` status

## Steps

### Step 1: Read Context

1. Read \`.swarm/config.md\` for project conventions.
2. Read the story file — gather all tasks, ACs, mini-retrospectives.
3. Read the WoW to check if knowledge_extraction is enabled.

### Step 2: Compute Metrics

1. Count tasks: total, completed, skipped.
2. Count ACs: total, passing, failing.
3. Count files changed (via \`git diff --stat\` or similar).
4. Count tests added.
5. Calculate cycle time from \`execution.started_at\` to \`execution.completed_at\`.

### Step 3: Extract Learnings per Agent

1. Parse each mini-retrospective from the story body.
2. Consolidate "What worked", "What to remember", and "Suggestion" items.
3. Group learnings by agent.

### Step 3.5: Extract Knowledge Items

Parse the retrospective and mini-retrospectives for discrete knowledge items:

1. **Identify knowledge candidates:** Look for patterns, pain points, and best practices mentioned in mini-retrospectives and learnings.
2. **Tag each item with dimension:**
   - **E (Epistemology):** Reusable architectural/design patterns discovered
   - **Q (Qualia):** Gotchas, pitfalls, surprises encountered
   - **P (Praxeology):** Proven techniques and conventions that worked well
3. **Assign scope:** \`repo\` for project-specific, \`team\` for broadly applicable.
4. **Create knowledge files:** For each identified item, create a file at \`.swarm/knowledge/{STORY-ID}-{N}.md\` using the knowledge item template with structured frontmatter:
   \`\`\`yaml
   ---
   id: "K-{N}"
   source_story: "{STORY-ID}"
   source_repo: "{REPO}"
   created: "{TIMESTAMP}"
   author: "{AGENT}"
   dimension: "epistemology|qualia|praxeology"
   scope: "repo|team|department|enterprise"
   hoistable: true  # Set to true for items with scope >= team
   hoisted_to: null
   hoisted_at: null
   confidence: "low|medium|high"
   tags: []
   domain: "frontend|backend|devops|architecture|testing|process|documentation|security"
   title: "{TITLE}"
   supersedes: null
   ttl: null
   ---
   \`\`\`
5. **Set hoistable:** Mark items with scope \`team\` or higher as \`hoistable: true\`.
6. **Update retrospective frontmatter:** Add references to extracted knowledge items in the \`knowledge_extracted\` array.

### Step 4: Generate Retrospective

1. Create the retrospective file at \`.swarm/retrospectives/{ID}-retro.md\`.
2. Fill in the template with:
   - Summary of what was accomplished
   - What went well / what could improve
   - Key decisions table
   - Effort analysis table
   - Learnings by agent
   - Knowledge items extracted (with dimension, scope, and title)
3. Update the retrospective frontmatter with metrics and \`knowledge_extracted\` references.

### Step 5: Update Agent Memory

1. For each agent involved, append key learnings to \`.claude/agent-memory/{agent}.md\`.
2. Include patterns, gotchas, and decisions relevant to that agent's role.

### Step 6: Archive Story

1. Move the story file from \`.swarm/backlog/{ID}.md\` to \`.swarm/archive/{ID}.md\`.
2. Set story status to \`archived\`.
3. Update the \`updated\` timestamp.

## Outputs

- Retrospective file: \`.swarm/retrospectives/{ID}-retro.md\`
- Knowledge item files: \`.swarm/knowledge/{ID}-{N}.md\` (one per extracted item)
- Updated agent memory files
- Archived story: \`.swarm/archive/{ID}.md\`
- Story status: \`archived\`
`;
}

export function skillSwarmRetro(): string {
  return `---
name: "swarm-retro"
description: "Standalone knowledge extraction — process retrospectives for knowledge items"
model: ""
allowed-tools:
  - "Read"
  - "Write"
  - "Edit"
  - "Bash"
  - "Glob"
  - "Grep"
---

# Skill: swarm-retro

Standalone knowledge extraction skill. Can process any retrospective (new or old) to extract, tag, deduplicate, and link knowledge items.

## Inputs

- **Retrospective file:** Path to a \`.swarm/retrospectives/{ID}-retro.md\` file
- **Optional:** \`--reprocess\` flag to re-extract from an already-processed retrospective

## Steps

### Step 1: Read Context

1. Read \`.swarm/config.md\` for project conventions and knowledge settings.
2. Read the retrospective file.
3. List existing knowledge items in \`.swarm/knowledge/\` to check for duplicates.

### Step 2: Parse Retrospective

1. Extract the "What Went Well" section for P (Praxeology) candidates.
2. Extract the "What Could Improve" section for Q (Qualia) candidates.
3. Extract the "Key Decisions" table for E (Epistemology) candidates.
4. Extract "Learnings by Agent" for all dimensions.
5. Extract "Knowledge to Preserve" table if present.
6. Parse mini-retrospective "Knowledge hints" lines for tagged items.

### Step 3: Classify and Tag

For each knowledge candidate:

1. **Assign dimension:**
   - **E (Epistemology):** Patterns — reusable architectural or design patterns
   - **Q (Qualia):** Pain Points — gotchas, pitfalls, surprises
   - **P (Praxeology):** Best Practices — proven techniques and conventions
2. **Assign scope:** \`repo\`, \`team\`, \`department\`, or \`enterprise\`
3. **Assign domain:** frontend, backend, devops, architecture, testing, process, documentation, security
4. **Assign confidence:** low, medium, or high based on evidence strength
5. **Generate tags:** Extract relevant keywords

### Step 4: Deduplicate

1. Compare each candidate against existing knowledge items in \`.swarm/knowledge/\`.
2. Check for semantic similarity in title and description.
3. If a duplicate is found:
   - If the new item has higher confidence, set \`supersedes\` to the old item's ID.
   - If the old item is better, skip the new candidate.
4. If items are complementary, keep both and cross-reference via tags.

### Step 5: Create Knowledge Files

For each unique knowledge item:

1. Generate a unique ID: \`K-{STORY-ID}-{N}\`
2. Create the file at \`.swarm/knowledge/{STORY-ID}-{N}.md\` with full frontmatter.
3. Fill in Context, Description, Recommendation, and Evidence sections.
4. Set \`hoistable: true\` for items with scope \`team\` or higher.

### Step 6: Update Retrospective

1. Add references to all extracted knowledge items in the retrospective's \`knowledge_extracted\` frontmatter array:
   \`\`\`yaml
   knowledge_extracted:
     - id: "K-PROJ-003-1"
       dimension: "epistemology"
       title: "API versioning pattern"
   \`\`\`

### Step 7: Prepare for Scout Hoisting

1. For items marked \`hoistable: true\`, log them as candidates for Scout-level consolidation.
2. Output a summary of hoistable items to stdout for visibility.

## Outputs

- Knowledge item files: \`.swarm/knowledge/{STORY-ID}-{N}.md\`
- Updated retrospective frontmatter with \`knowledge_extracted\` references
- Summary of extracted and hoistable items printed to stdout
`;
}

export function skillSwarmRun(): string {
  return `---
name: "swarm-run"
description: "Full pipeline — run ideate → plan → execute → verify → close with phase gating"
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

- **Story file:** Path to a \`.swarm/backlog/{ID}.md\` file in \`draft\` status
- **Optional:** \`--auto\` flag to skip confirmations between phases

## Steps

### Phase 1: Ideate

1. Execute the \`swarm-ideate\` skill on the story.
2. **Gate check:** Verify the story has:
   - At least 3 acceptance criteria defined
   - Complexity estimated
   - Status is \`ideating\` (not \`awaiting_input\`)
3. If the gate fails:
   - Report what is missing.
   - If status is \`awaiting_input\`, stop and tell the user to answer questions in \`.swarm/pending-questions/\`.
   - Exit with failure.
4. If the gate passes and \`--auto\` is not set, ask for confirmation to proceed.

### Phase 2: Plan

1. Execute the \`swarm-plan\` skill on the story.
2. **Gate check:** Verify the story has:
   - At least one task defined
   - All ACs covered by at least one task
   - No circular task dependencies
   - Status is \`planned\` (not \`awaiting_input\`)
3. If the gate fails:
   - Report what is missing.
   - Exit with failure.
4. If the gate passes and \`--auto\` is not set, ask for confirmation to proceed.

### Phase 3: Execute

1. Execute the \`swarm-execute\` skill on the story.
2. **Gate check:** Verify:
   - All tasks are \`done\` or \`skipped\`
   - Code compiles: \`bun run typecheck\`
   - Tests pass: \`bun test\`
   - Linting passes: \`bunx biome check .\`
3. If the gate fails:
   - Report which checks failed.
   - Exit with failure.
4. If the gate passes and \`--auto\` is not set, ask for confirmation to proceed.

### Phase 4: Verify

1. Execute the \`swarm-verify\` skill on the story.
2. **Gate check:** Verify:
   - All ACs have status \`passing\`
   - Story status is \`done\`
3. If the gate fails:
   - Report which ACs are not passing.
   - Exit with failure.
4. If the gate passes and \`--auto\` is not set, ask for confirmation to proceed.

### Phase 5: Close

1. Execute the \`swarm-close\` skill on the story.
2. **Gate check:** Verify:
   - Retrospective file exists at \`.swarm/retrospectives/{ID}-retro.md\`
   - Story has been moved to \`.swarm/archive/{ID}.md\`
   - Knowledge items extracted (if knowledge_extraction enabled in WoW)
3. If the gate fails:
   - Report what is missing.
   - Exit with failure.

### Final Report

Output a summary:

\`\`\`
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
\`\`\`

## Outputs

- Fully processed story from draft to archived
- Retrospective file with metrics
- Knowledge items extracted and filed
- Agent memory updated
- Pipeline summary report
`;
}

// ---------------------------------------------------------------------------
// Directory and file constants
// ---------------------------------------------------------------------------

export const SWARM_DIRECTORIES: string[] = [
  '.swarm',
  '.swarm/backlog',
  '.swarm/archive',
  '.swarm/retrospectives',
  '.swarm/templates',
  '.swarm/knowledge',
  '.swarm/pending-questions',
];

export const GITKEEP_DIRECTORIES: string[] = [
  '.swarm/backlog',
  '.swarm/archive',
  '.swarm/retrospectives',
  '.swarm/templates',
  '.swarm/knowledge',
  '.swarm/pending-questions',
];

export const AGENT_NAMES: string[] = [
  'backend-dev',
  'frontend-dev',
  'qa-engineer',
  'architect',
  'tech-writer',
  'devops',
];

export const AGENT_TEMPLATES: Record<string, () => string> = {
  'backend-dev': agentBackendDev,
  'frontend-dev': agentFrontendDev,
  'qa-engineer': agentQaEngineer,
  architect: agentArchitect,
  'tech-writer': agentTechWriter,
  devops: agentDevops,
};

export const SKILL_NAMES: string[] = [
  'swarm-ideate',
  'swarm-plan',
  'swarm-execute',
  'swarm-verify',
  'swarm-close',
  'swarm-retro',
  'swarm-run',
];

export const SKILL_TEMPLATES: Record<string, () => string> = {
  'swarm-ideate': skillSwarmIdeate,
  'swarm-plan': skillSwarmPlan,
  'swarm-execute': skillSwarmExecute,
  'swarm-verify': skillSwarmVerify,
  'swarm-close': skillSwarmClose,
  'swarm-retro': skillSwarmRetro,
  'swarm-run': skillSwarmRun,
};

export const GITIGNORE_RULES: string[] = [
  '# SWARM SDLC',
  '.swarm/pending-questions/',
  '',
  '# Agent memory (project-specific, not shared)',
  '.claude/agent-memory/',
  '',
  '# Skill working files',
  '.claude/commands/swarm-*.md',
];
