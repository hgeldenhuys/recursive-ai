---
name: swarm-retro
description: Standalone knowledge extraction — process retrospectives for knowledge items
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

- **Retrospective file:** Path to a `.swarm/retrospectives/{ID}-retro.md` file
- **Optional:** `--reprocess` flag to re-extract from an already-processed retrospective

## Steps

### Step 1: Read Context

1. Read `.swarm/config.md` for project conventions and knowledge settings.
2. Read the retrospective file.
3. List existing knowledge items to check for duplicates:
   ```bash
   bun $RECURSIVE_AI_PATH/packages/cli/src/index.ts list .swarm/knowledge
   ```

### Step 2: Parse Retrospective

1. Extract the "What Went Well" section for P (Praxeology) candidates.
2. Extract the "What Could Improve" section for Q (Qualia) candidates.
3. Extract the "Key Decisions" table for E (Epistemology) candidates.
4. Extract "Learnings by Agent" for all dimensions.
5. Extract "Knowledge to Preserve" table if present.
6. Parse mini-retrospective "Knowledge hints" lines for tagged items.

### Step 3: Extract Knowledge Programmatically

Run the extract-knowledge command:
```bash
bun $RECURSIVE_AI_PATH/packages/cli/src/index.ts extract-knowledge .swarm/retrospectives/${STORY_ID}-retro.md --story-id ${STORY_ID} --repo ${REPO_NAME}
```

Review the JSON output for extracted items. The command handles:
- Parsing the retrospective body
- Classifying items by E/Q/P dimension
- Assigning scope and domain
- Writing knowledge files to `.swarm/knowledge/`

### Step 4: Deduplicate

1. Compare each candidate against existing knowledge items in `.swarm/knowledge/`.
2. Check for semantic similarity in title and description.
3. If a duplicate is found:
   - If the new item has higher confidence, set `supersedes` to the old item's ID.
   - If the old item is better, skip the new candidate.
4. If items are complementary, keep both and cross-reference via tags.

### Step 5: Update Retrospective

1. Add references to all extracted knowledge items in the retrospective's `knowledge_extracted` frontmatter array:
   ```yaml
   knowledge_extracted:
     - id: "K-PROJ-003-1"
       dimension: "epistemology"
       title: "API versioning pattern"
   ```

### Step 6: Prepare for Scout Hoisting

1. For items marked `hoistable: true`, log them as candidates for Scout-level consolidation.
2. Output a summary of hoistable items to stdout for visibility.

## Outputs

- Knowledge item files: `.swarm/knowledge/{STORY-ID}-{N}.md`
- Updated retrospective frontmatter with `knowledge_extracted` references
- Summary of extracted and hoistable items printed to stdout
