# RECURSIVE-AI: SWARM SDLC Framework

An AI-native SDLC methodology for Claude Code. SWARM (Structured Workflow for Agent-Run Methodology) enables structured development cycles with knowledge capture and hierarchical consolidation.

## What is SWARM?

SWARM brings Scrum-like discipline to AI agent workflows:

- **Structured SDLC cycles** via `/swarm-*` skills (ideate, plan, execute, verify, close)
- **Knowledge capture** with E/Q/P taxonomy (Epistemology, Qualia, Praxeology)
- **Hierarchical consolidation** from repo to enterprise level
- **Marketplace distribution** as a Claude Code plugin

## Installation

### Option 1: Clone and Initialize (recommended)

```bash
# Clone the repo alongside your project (or anywhere accessible)
git clone https://github.com/hgeldenhuys/recursive-ai.git
cd recursive-ai
bun install

# Initialize SWARM in your target project
cd /path/to/your-project
bun /path/to/recursive-ai/packages/cli/src/index.ts init
```

### Option 2: Git Submodule

```bash
# Add as a submodule in your project
cd your-project
git submodule add https://github.com/hgeldenhuys/recursive-ai.git .recursive-ai
cd .recursive-ai && bun install && cd ..

# Initialize SWARM
bun .recursive-ai/packages/cli/src/index.ts init
```

### Option 3: npx-style (one-liner)

```bash
# Clone, install, and initialize in one step
cd your-project
bunx --bun sh -c 'git clone https://github.com/hgeldenhuys/recursive-ai.git /tmp/recursive-ai && cd /tmp/recursive-ai && bun install && bun packages/cli/src/index.ts init --prefix $(basename $(pwd))'
```

### What `recursive init` Creates

```
your-project/
├── .swarm/
│   ├── config.md                    # Project config (prefix, DoR, DoD, WoW)
│   ├── backlog/                     # Active stories
│   ├── archive/                     # Completed stories
│   ├── retrospectives/              # Retrospective documents
│   ├── knowledge/                   # Extracted knowledge items (E/Q/P)
│   ├── templates/
│   │   ├── story.md                 # Story template
│   │   ├── retrospective.md         # Retrospective template
│   │   └── knowledge-item.md        # Knowledge item template
│   ├── definition-of-ready.yaml     # Quality gate: when is a story ready?
│   ├── definition-of-done.yaml      # Quality gate: when is a story done?
│   └── ways-of-working.yaml         # Team conventions
├── .claude/
│   ├── skills/
│   │   ├── swarm-ideate/SKILL.md
│   │   ├── swarm-plan/SKILL.md
│   │   ├── swarm-execute/SKILL.md
│   │   ├── swarm-verify/SKILL.md
│   │   ├── swarm-close/SKILL.md
│   │   ├── swarm-retro/SKILL.md
│   │   └── swarm-run/SKILL.md
│   ├── agents/
│   │   ├── backend-dev.md
│   │   ├── frontend-dev.md
│   │   ├── qa-engineer.md
│   │   ├── architect.md
│   │   ├── tech-writer.md
│   │   └── devops.md
│   └── agent-memory/
│       └── {agent}/MEMORY.md        # Per-agent tactical learnings
└── .gitignore                       # Updated with SWARM rules
```

### CLI Options

```bash
recursive init                  # Initialize with defaults
recursive init --prefix MYAPP   # Custom story ID prefix (e.g., MYAPP-001)
recursive init --dry-run        # Preview what would be created
recursive status                # Check initialization status
```

### Verifying Installation

```bash
cd your-project
bun /path/to/recursive-ai/packages/cli/src/index.ts status
```

You should see all checks passing:
```
SWARM status: checking .swarm/ directory...
  + .swarm/config.md
  + .swarm/backlog
  + .swarm/archive
  + .swarm/retrospectives
  + .swarm/knowledge
  + .swarm/templates/story.md
  + .swarm/definition-of-ready.yaml
  + .swarm/definition-of-done.yaml
  + .swarm/ways-of-working.yaml

SWARM is fully initialized. Run /swarm-ideate to start.
```

## Usage

Once initialized, use the SWARM skills in Claude Code:

```
/swarm-ideate Add user authentication with JWT tokens
/swarm-plan MYPROJ-001
/swarm-execute MYPROJ-001
/swarm-verify MYPROJ-001
/swarm-close MYPROJ-001
```

Or run the full pipeline in one command:
```
/swarm-run Add user authentication with JWT tokens
```

### Story Lifecycle

```
draft → ideating → planned → executing → verifying → done → archived
              ↘                                    ↗
            awaiting_input ───────────────────────┘
```

Each phase maps to a skill:
1. `/swarm-ideate` — Problem decomposition, acceptance criteria
2. `/swarm-plan` — Task breakdown, agent assignment
3. `/swarm-execute` — Implementation with agent coordination
4. `/swarm-verify` — Automated and manual verification
5. `/swarm-close` — Retrospective, knowledge extraction, archival

## Skills

| Skill | Purpose |
|-------|---------|
| `/swarm-ideate` | Transform idea into story with acceptance criteria |
| `/swarm-plan` | Break story into tasks, assign agents |
| `/swarm-execute` | Spawn agents, run tasks in dependency order |
| `/swarm-verify` | Verify all ACs with concrete evidence |
| `/swarm-close` | Retrospective, knowledge extraction, archive |
| `/swarm-retro` | Standalone knowledge extraction from any retrospective |
| `/swarm-run` | Full pipeline with phase gating |

## Agents

| Agent | Role | Model |
|-------|------|-------|
| `backend-dev` | APIs, services, data layer | opus |
| `frontend-dev` | UI components, pages, UX | opus |
| `qa-engineer` | Testing, verification, quality | opus |
| `architect` | System design, patterns, ADRs | opus |
| `tech-writer` | Documentation, guides, changelogs | sonnet |
| `devops` | CI/CD, infrastructure, deployment | sonnet |

## Knowledge Taxonomy

SWARM captures knowledge using three dimensions:

- **E (Epistemology)**: Patterns — reusable architectural/design patterns
- **Q (Qualia)**: Pain Points — gotchas, pitfalls, surprises
- **P (Praxeology)**: Best Practices — proven techniques and conventions

Knowledge items are automatically extracted during `/swarm-close` and stored in `.swarm/knowledge/` as markdown files with structured YAML frontmatter.

## Knowledge Hierarchy

```
Worker (repo) → Scout (team) → Queen (dept) → Hive Mind (enterprise)
```

- **Worker**: Discovers knowledge during SDLC cycles in a single repo
- **Scout**: Consolidates knowledge across repos within a team (Phase 2)
- **Queen**: Aggregates department-wide patterns (Phase 3)
- **Hive Mind**: Enterprise-level strategic knowledge (Phase 3)

Knowledge items with `hoistable: true` can be promoted upward through the hierarchy by Scout agents.

## Packages

| Package | Description |
|---------|-------------|
| `@recursive-ai/core` | Types, parsers, state machine, knowledge extractor |
| `@recursive-ai/cli` | Bootstrap CLI and template generators |
| `@recursive-ai/marketplace` | Plugin registry and manifest validation |

## Development

```bash
git clone https://github.com/hgeldenhuys/recursive-ai.git
cd recursive-ai
bun install

# Run checks
bun test             # 68 tests, 210 assertions
bun run typecheck    # Type check all packages
bun run lint         # Lint with Biome
bun run lint:fix     # Auto-fix lint issues
```

## License

MIT
