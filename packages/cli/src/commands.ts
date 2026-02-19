/**
 * CLI enforcement commands for SWARM SDLC.
 *
 * Each command returns a structured CommandResult:
 *   Success: { ok: true, ...data }
 *   Failure: { ok: false, error: string, details?: string[] }
 *
 * The CLI entry point (index.ts) wraps these with I/O (console.log + process.exit).
 * The MCP server (mcp-server.ts) returns the result objects directly.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import {
  type ExtractionContext,
  type StoryMeta,
  type StoryStatus,
  type TransitionResult,
  type ValidationResult,
  canTransition,
  extractKnowledge,
  parseFrontmatter,
  serializeFrontmatter,
  validateStoryMeta,
  validateTransition,
} from '@recursive-ai/core';

// ---------------------------------------------------------------------------
// Result type
// ---------------------------------------------------------------------------

export type CommandResult =
  | ({ ok: true } & Record<string, unknown>)
  | { ok: false; error: string; details?: string[] };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function successResult(data: Record<string, unknown>): CommandResult {
  return { ok: true, ...data };
}

function errorResult(error: string, details?: string[]): CommandResult {
  return { ok: false, error, ...(details ? { details } : {}) };
}

function readAndParse<T = Record<string, unknown>>(filePath: string): { meta: T; body: string } {
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const content = readFileSync(filePath, 'utf-8');
  const parsed = parseFrontmatter<T>(content);
  if (!parsed) {
    throw new Error('Failed to parse frontmatter: File does not contain valid YAML frontmatter');
  }

  return parsed;
}

// ---------------------------------------------------------------------------
// validate <story-file>
// ---------------------------------------------------------------------------

export function commandValidate(storyPath: string): CommandResult {
  try {
    const { meta } = readAndParse(storyPath);
    const result: ValidationResult = validateStoryMeta(meta);

    if (!result.valid) {
      return errorResult(
        'Invalid story',
        result.errors.map((e) => `${e.field}: ${e.message}`)
      );
    }

    const storyMeta = meta as unknown as StoryMeta;
    return successResult({
      id: storyMeta.id,
      status: storyMeta.status,
      ac_count: Array.isArray(storyMeta.acceptance_criteria)
        ? storyMeta.acceptance_criteria.length
        : 0,
      task_count: Array.isArray(storyMeta.tasks) ? storyMeta.tasks.length : 0,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return errorResult(msg);
  }
}

// ---------------------------------------------------------------------------
// transition <story-file> <target-status>
// ---------------------------------------------------------------------------

export function commandTransition(storyPath: string, targetStatus: string): CommandResult {
  try {
    const { meta } = readAndParse(storyPath);

    // First validate the story structure
    const validationResult = validateStoryMeta(meta);
    if (!validationResult.valid) {
      return errorResult(
        'Invalid story structure',
        validationResult.errors.map((e) => `${e.field}: ${e.message}`)
      );
    }

    const storyMeta = meta as unknown as StoryMeta;
    const from = storyMeta.status;
    const to = targetStatus as StoryStatus;

    // Check structural transition
    const canResult: TransitionResult = canTransition(from, to);
    if (!canResult.allowed) {
      return errorResult(`Cannot transition from '${from}' to '${to}'`, [
        canResult.reason || 'Invalid transition',
      ]);
    }

    // Check semantic preconditions
    const transitionResult: TransitionResult = validateTransition(storyMeta, to);
    if (!transitionResult.allowed) {
      return errorResult(`Cannot transition from '${from}' to '${to}'`, [
        transitionResult.reason || 'Preconditions not met',
      ]);
    }

    return successResult({ from, to });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return errorResult(msg);
  }
}

// ---------------------------------------------------------------------------
// extract-knowledge <retro-file> [--story-id ID] [--repo NAME]
// ---------------------------------------------------------------------------

export function commandExtractKnowledge(retroPath: string, args: string[]): CommandResult {
  try {
    const { meta, body } = readAndParse(retroPath);

    // Parse optional args
    let storyId = '';
    let repoName = '';

    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--story-id' && i + 1 < args.length) {
        storyId = args[i + 1]!;
        i++;
      } else if (args[i] === '--repo' && i + 1 < args.length) {
        repoName = args[i + 1]!;
        i++;
      }
    }

    // Fall back to frontmatter if args not provided
    const retroMeta = meta as Record<string, unknown>;
    if (!storyId && typeof retroMeta.story_id === 'string') {
      storyId = retroMeta.story_id;
    }
    if (!repoName && typeof retroMeta.repo === 'string') {
      repoName = retroMeta.repo;
    }

    if (!storyId) {
      return errorResult('Missing story ID', [
        'Provide --story-id or include story_id in frontmatter',
      ]);
    }

    // Scan existing knowledge items for ID generation
    const knowledgeDir = join(process.cwd(), '.swarm/knowledge');
    const existingIds: string[] = [];
    if (existsSync(knowledgeDir)) {
      const files = readdirSync(knowledgeDir).filter((f) => f.endsWith('.md'));
      for (const file of files) {
        const filePath = join(knowledgeDir, file);
        const fileContent = readFileSync(filePath, 'utf-8');
        const parsed = parseFrontmatter(fileContent);
        if (parsed && typeof (parsed.meta as Record<string, unknown>).id === 'string') {
          existingIds.push((parsed.meta as Record<string, unknown>).id as string);
        }
      }
    }

    const ctx: ExtractionContext = {
      storyId,
      repoName: repoName || 'unknown',
      author: 'swarm-cli',
      existingIds,
    };

    const items = extractKnowledge(body, ctx);

    if (items.length === 0) {
      return successResult({ items: [], count: 0, files_written: [] });
    }

    // Write knowledge files
    if (!existsSync(knowledgeDir)) {
      mkdirSync(knowledgeDir, { recursive: true });
    }

    const filesWritten: string[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i]!;
      const fileName = `${storyId}-${i + 1}.md`;
      const filePath = join(knowledgeDir, fileName);
      const relativePath = `.swarm/knowledge/${fileName}`;

      const itemMeta: Record<string, unknown> = {
        id: item.id,
        source_story: item.source_story,
        source_repo: item.source_repo,
        created: item.created,
        author: item.author,
        dimension: item.dimension,
        scope: item.scope,
        hoistable: item.hoistable,
        hoisted_to: item.hoisted_to,
        hoisted_at: item.hoisted_at,
        confidence: item.confidence,
        tags: item.tags,
        domain: item.domain,
        title: item.title,
        supersedes: item.supersedes,
        ttl: item.ttl,
      };

      const itemBody = `
# ${item.title}

## Context

${item.context}

## Description

${item.description}

## Recommendation

${item.recommendation}

## Evidence

- Source story: \`${item.source_story}\`
- Discovered by: ${item.author}
- Confidence: ${item.confidence}
`;

      writeFileSync(filePath, serializeFrontmatter(itemMeta, itemBody));
      filesWritten.push(relativePath);
    }

    return successResult({
      items: items.map((item) => ({
        id: item.id,
        dimension: item.dimension,
        scope: item.scope,
        title: item.title,
      })),
      count: items.length,
      files_written: filesWritten,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return errorResult(msg);
  }
}

// ---------------------------------------------------------------------------
// next-id <config-file>
// ---------------------------------------------------------------------------

export function commandNextId(configPath: string): CommandResult {
  try {
    const { meta, body } = readAndParse(configPath);
    const configMeta = meta as Record<string, unknown>;

    if (typeof configMeta.prefix !== 'string') {
      return errorResult('Invalid config', ['Missing "prefix" field in config frontmatter']);
    }

    const currentCounter = typeof configMeta.counter === 'number' ? configMeta.counter : 0;
    const nextCounter = currentCounter + 1;
    const id = `${configMeta.prefix}-${String(nextCounter).padStart(3, '0')}`;

    // Update the config file with the incremented counter
    configMeta.counter = nextCounter;
    writeFileSync(configPath, serializeFrontmatter(configMeta, body));

    return successResult({ id, counter: nextCounter });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return errorResult(msg);
  }
}

// ---------------------------------------------------------------------------
// list <directory> [--status STATUS]
// ---------------------------------------------------------------------------

export function commandList(directory: string, args: string[]): CommandResult {
  try {
    if (!existsSync(directory)) {
      return errorResult(`Directory not found: ${directory}`);
    }

    // Parse --status filter
    let statusFilter = '';
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--status' && i + 1 < args.length) {
        statusFilter = args[i + 1]!;
        i++;
      }
    }

    const files = readdirSync(directory).filter((f) => f.endsWith('.md') && f !== '.gitkeep');

    const items: Array<{
      id: string;
      title: string;
      status: string;
      file: string;
    }> = [];

    for (const file of files) {
      const filePath = join(directory, file);
      const content = readFileSync(filePath, 'utf-8');
      const parsed = parseFrontmatter(content);

      if (!parsed) continue;

      const fileMeta = parsed.meta as Record<string, unknown>;
      const id = typeof fileMeta.id === 'string' ? fileMeta.id : basename(file, '.md');
      const title = typeof fileMeta.title === 'string' ? fileMeta.title : '';
      const status = typeof fileMeta.status === 'string' ? fileMeta.status : '';

      if (statusFilter && status !== statusFilter) continue;

      items.push({ id, title, status, file });
    }

    return successResult({ items, count: items.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return errorResult(msg);
  }
}
