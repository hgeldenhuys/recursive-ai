# RECURSIVE-AI: SWARM SDLC Framework

An AI-native SDLC methodology for Claude Code. SWARM (Structured Workflow for Agent-Run Methodology) enables structured development cycles with knowledge capture and hierarchical consolidation.

## What is SWARM?

SWARM brings Scrum-like discipline to AI agent workflows:

- **Structured SDLC cycles** via `/swarm:*` skills (ideate, plan, execute, verify, close)
- **Knowledge capture** with E/Q/P taxonomy (Epistemology, Qualia, Praxeology)
- **Hierarchical consolidation** from repo to enterprise level
- **Plugin distribution** via the official Claude Code plugin system

## Installation

### Option 1: Claude Code Plugin (recommended)

```bash
# Add the marketplace
/plugin marketplace add hgeldenhuys/recursive-ai

# Install the SWARM plugin
/plugin install swarm@recursive-ai

# Initialize SWARM in your project
/swarm:init
```

After init, skills are available as `/swarm:ideate`, `/swarm:plan`, `/swarm:execute`, `/swarm:verify`, `/swarm:close`, `/swarm:retro`, `/swarm:run`. The MCP tools are used internally by the skills and available immediately.

### Option 2: Clone and Initialize

```bash
# Clone the repo
git clone https://github.com/hgeldenhuys/recursive-ai.git
cd recursive-ai
bun install

# Initialize SWARM in your target project
bun packages/cli/src/index.ts init /path/to/your-project
```

This creates the `.swarm/` directory structure, quality gates, templates, and agent memory files.

### What initialization creates

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

## Usage

Once initialized, use the SWARM skills in Claude Code:

```
/swarm:ideate Add user authentication with JWT tokens
/swarm:plan MYPROJ-001
/swarm:execute MYPROJ-001
/swarm:verify MYPROJ-001
/swarm:close MYPROJ-001
```

Or run the full pipeline in one command:
```
/swarm:run Add user authentication with JWT tokens
```

### Story Lifecycle

```
draft → ideating → planned → executing → verifying → done → archived
              ↘                                    ↗
            awaiting_input ───────────────────────┘
```

Each phase maps to a skill:
1. `/swarm:ideate` — Problem decomposition, acceptance criteria
2. `/swarm:plan` — Task breakdown, agent assignment
3. `/swarm:execute` — Implementation with agent coordination
4. `/swarm:verify` — Automated and manual verification
5. `/swarm:close` — Retrospective, knowledge extraction, archival

## Skills

| Skill | Purpose |
|-------|---------|
| `/swarm:ideate` | Transform idea into story with acceptance criteria |
| `/swarm:plan` | Break story into tasks, assign agents |
| `/swarm:execute` | Spawn agents, run tasks in dependency order |
| `/swarm:verify` | Verify all ACs with concrete evidence |
| `/swarm:close` | Retrospective, knowledge extraction, archive |
| `/swarm:retro` | Standalone knowledge extraction from any retrospective |
| `/swarm:run` | Full pipeline with phase gating |
| `/swarm:init` | Initialize SWARM in the current project |

## MCP Tools

The plugin exposes enforcement commands via MCP tools:

| Tool | Purpose |
|------|---------|
| `swarm_init` | Initialize SWARM in a project directory |
| `swarm_validate` | Validate story frontmatter |
| `swarm_transition` | Check if a status transition is allowed |
| `swarm_next_id` | Get next story ID from config |
| `swarm_list` | List stories/knowledge items |
| `swarm_extract_knowledge` | Extract knowledge from retrospectives |
| `swarm_status` | Check SWARM initialization status |

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

Knowledge items are automatically extracted during `/swarm:close` and stored in `.swarm/knowledge/` as markdown files with structured YAML frontmatter.

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
bun test             # Run all tests
bun run typecheck    # Type check all packages
bun run lint         # Lint with Biome
bun run lint:fix     # Auto-fix lint issues
bun run build:mcp    # Bundle MCP server
```

## License

MIT
