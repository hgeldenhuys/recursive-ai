# SWARM SDLC Demo Walkthrough

This guide walks through a complete SDLC cycle using SWARM in a fresh project.

## Prerequisites

- [Bun](https://bun.sh) installed
- [Claude Code](https://claude.ai/code) installed
- A project directory to initialize

## Step 1: Initialize SWARM

```bash
# Navigate to your project
cd my-project

# Install recursive-ai (from marketplace or manually)
# Then run the initializer:
bun /path/to/recursive-ai/packages/cli/src/index.ts init
```

This creates the complete SWARM structure:

```
.swarm/
  config.md                    # Project config with DoR/DoD/WoW
  backlog/                     # Active stories
  archive/                     # Completed stories
  retrospectives/              # Retrospective documents
  knowledge/                   # Extracted knowledge items
  templates/                   # Story, retro, and knowledge templates
  definition-of-ready.yaml     # Quality gate: when is a story ready?
  definition-of-done.yaml      # Quality gate: when is a story done?
  ways-of-working.yaml         # Team conventions

.claude/
  skills/swarm-*/SKILL.md      # 7 SWARM skills
  agents/*.md                  # 6 agent definitions
  agent-memory/*/MEMORY.md     # Agent memory files
```

## Step 2: Create a Story (`/swarm-ideate`)

In Claude Code:

```
/swarm-ideate Add user authentication with JWT tokens
```

This will:
1. Read your project config and DoR
2. Ask clarifying questions about the feature
3. Generate 3-7 testable acceptance criteria
4. Estimate complexity
5. Create `.swarm/backlog/MYPROJ-001.md`

**Example output:**
```
Created story MYPROJ-001: "Add JWT Authentication"

Acceptance Criteria:
  AC-1: Users can register with email and password
  AC-2: Login returns a valid JWT token
  AC-3: Protected endpoints reject requests without valid JWT
  AC-4: Tokens expire after configured TTL
  AC-5: Refresh token flow works correctly

Complexity: moderate
Next: /swarm-plan MYPROJ-001
```

## Step 3: Plan the Work (`/swarm-plan`)

```
/swarm-plan MYPROJ-001
```

This will:
1. Read the story and explore your codebase
2. Design the technical approach
3. Decompose into tasks with agent assignments
4. Validate AC coverage

**Example output:**
```
Planned MYPROJ-001 with 5 tasks:

T-1: Design auth schema and API contracts (architect)
T-2: Implement auth service and endpoints (backend-dev)  [depends: T-1]
T-3: Add auth middleware and route protection (backend-dev)  [depends: T-2]
T-4: Write auth tests and verify ACs (qa-engineer)  [depends: T-2, T-3]
T-5: Document auth API (tech-writer)  [depends: T-2]

Next: /swarm-execute MYPROJ-001
```

## Step 4: Execute (`/swarm-execute`)

```
/swarm-execute MYPROJ-001
```

This will:
1. Group tasks by dependency phase
2. Spawn agents in parallel where possible
3. Wait for each phase to complete
4. Track progress in the story file

**Execution phases:**
- Phase 1: T-1 (architect designs schema)
- Phase 2: T-2, T-5 (backend-dev implements, tech-writer docs — in parallel)
- Phase 3: T-3 (backend-dev adds middleware)
- Phase 4: T-4 (qa-engineer verifies)

## Step 5: Verify (`/swarm-verify`)

```
/swarm-verify MYPROJ-001
```

This will:
1. Run DoD checks (typecheck, tests, lint)
2. Verify each AC with concrete evidence
3. Report pass/fail with details

**Example output:**
```
Verification Report: MYPROJ-001

Definition of Done:
  [x] Code compiles (bun run typecheck) — PASS
  [x] Tests pass (bun test) — PASS (23/23)
  [x] Linting passes (bun run lint) — PASS

Acceptance Criteria:
  [x] AC-1: Users can register — PASS (test: auth.test.ts:12)
  [x] AC-2: Login returns JWT — PASS (test: auth.test.ts:28)
  [x] AC-3: Protected endpoints — PASS (test: auth.test.ts:45)
  [x] AC-4: Token expiry — PASS (test: auth.test.ts:62)
  [x] AC-5: Refresh flow — PASS (test: auth.test.ts:78)

Verdict: ALL PASSING. Run /swarm-close MYPROJ-001
```

## Step 6: Close (`/swarm-close`)

```
/swarm-close MYPROJ-001
```

This will:
1. Generate a retrospective at `.swarm/retrospectives/MYPROJ-001.md`
2. Extract agent learnings and update agent memory files
3. **Extract knowledge items** with E/Q/P classification
4. Archive the story to `.swarm/archive/MYPROJ-001.md`

**Knowledge extraction example:**

```
Knowledge extracted:
  K-001 [Epistemology] JWT middleware pattern with Bun.serve (repo scope)
  K-002 [Qualia] SQLite stores JWT as TEXT, explicit type cast needed (team scope, hoistable)
  K-003 [Praxeology] Always validate token claims server-side (team scope, hoistable)

Files created:
  .swarm/knowledge/MYPROJ-001-1.md
  .swarm/knowledge/MYPROJ-001-2.md
  .swarm/knowledge/MYPROJ-001-3.md
```

## Step 7: Standalone Knowledge Review (`/swarm-retro`)

```
/swarm-retro MYPROJ-001
```

Use this to re-process any retrospective for knowledge extraction, or to review and classify existing knowledge items.

## Full Pipeline (`/swarm-run`)

For experienced teams, run the entire cycle in one command:

```
/swarm-run Add user authentication with JWT tokens
```

This executes ideate → plan → execute → verify → close with confirmation gates between each phase.

---

## Knowledge Hierarchy (Future)

Knowledge items with `hoistable: true` can be promoted up the hierarchy:

```
Worker (repo)  →  Scout (team)  →  Queen (dept)  →  Hive Mind (enterprise)
```

- **Worker**: Discovers knowledge during SDLC cycles
- **Scout**: Consolidates knowledge across team repos
- **Queen**: Aggregates department-wide patterns
- **Hive Mind**: Enterprise-level strategic knowledge

The E/Q/P taxonomy enables automatic classification:
- **E (Epistemology)**: Patterns — reusable designs and architectures
- **Q (Qualia)**: Pain Points — gotchas, pitfalls, surprises
- **P (Praxeology)**: Best Practices — proven techniques and conventions
