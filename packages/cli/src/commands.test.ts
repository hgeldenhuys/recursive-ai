import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { serializeFrontmatter } from '@recursive-ai/core';

const TEST_DIR = join(import.meta.dir, '../../../.test-commands');
const CLI_PATH = join(import.meta.dir, 'index.ts');

beforeEach(() => {
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true });
  }
  mkdirSync(join(TEST_DIR, '.swarm/backlog'), { recursive: true });
  mkdirSync(join(TEST_DIR, '.swarm/knowledge'), { recursive: true });
  mkdirSync(join(TEST_DIR, '.swarm/retrospectives'), { recursive: true });
});

afterEach(() => {
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true });
  }
});

function writeStory(id: string, overrides: Record<string, unknown> = {}): string {
  const meta: Record<string, unknown> = {
    id,
    title: `Test Story ${id}`,
    status: 'draft',
    priority: 'medium',
    complexity: 'moderate',
    created: '2026-01-01T00:00:00Z',
    updated: '2026-01-01T00:00:00Z',
    author: 'architect',
    tags: [],
    acceptance_criteria: [],
    tasks: [],
    execution: {
      started_at: null,
      completed_at: null,
      task_list_id: null,
      session_ids: [],
    },
    why: {
      problem: 'Test problem',
      root_cause: '',
      impact: '',
    },
    ...overrides,
  };

  const body = `\n# ${meta.title}\n\nTest body content.\n`;
  const filePath = join(TEST_DIR, `.swarm/backlog/${id}.md`);
  writeFileSync(filePath, serializeFrontmatter(meta, body));
  return filePath;
}

function runCommand(cmd: string): { stdout: string; exitCode: number } {
  const result = Bun.spawnSync(['bun', CLI_PATH, ...cmd.split(' ')], {
    cwd: TEST_DIR,
    env: { ...process.env },
  });
  return {
    stdout: result.stdout.toString().trim(),
    exitCode: result.exitCode,
  };
}

function parseOutput(stdout: string): Record<string, unknown> {
  // Take the last line that looks like JSON (skip any other output)
  const lines = stdout.split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i]!.trim();
    if (line.startsWith('{')) {
      return JSON.parse(line);
    }
  }
  throw new Error(`No JSON found in output: ${stdout}`);
}

// ---------------------------------------------------------------------------
// validate
// ---------------------------------------------------------------------------

describe('validate command', () => {
  it('validates a well-formed story', () => {
    const storyPath = writeStory('PROJ-001');
    const { stdout } = runCommand(`validate ${storyPath}`);
    const result = parseOutput(stdout);
    expect(result.ok).toBe(true);
    expect(result.id).toBe('PROJ-001');
    expect(result.status).toBe('draft');
    expect(result.ac_count).toBe(0);
    expect(result.task_count).toBe(0);
  });

  it('rejects a story with invalid status', () => {
    const storyPath = writeStory('PROJ-002', { status: 'invalid_status' });
    const { stdout, exitCode } = runCommand(`validate ${storyPath}`);
    const result = parseOutput(stdout);
    expect(result.ok).toBe(false);
    expect(result.error).toBe('Invalid story');
    expect(exitCode).toBe(1);
  });

  it('rejects a story with missing fields', () => {
    // Write a file with minimal/broken frontmatter
    const filePath = join(TEST_DIR, '.swarm/backlog/BAD-001.md');
    writeFileSync(filePath, '---\ntitle: "Bad Story"\n---\n\n# Bad Story\n');
    const { stdout, exitCode } = runCommand(`validate ${filePath}`);
    const result = parseOutput(stdout);
    expect(result.ok).toBe(false);
    expect(exitCode).toBe(1);
    expect(Array.isArray(result.details)).toBe(true);
    expect((result.details as string[]).length).toBeGreaterThan(0);
  });

  it('reports missing file', () => {
    const { stdout, exitCode } = runCommand('validate /nonexistent/path/story.md');
    const result = parseOutput(stdout);
    expect(result.ok).toBe(false);
    expect(exitCode).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// transition
// ---------------------------------------------------------------------------

describe('transition command', () => {
  it('allows valid transition draft → ideating', () => {
    const storyPath = writeStory('PROJ-001', { status: 'draft' });
    const { stdout } = runCommand(`transition ${storyPath} ideating`);
    const result = parseOutput(stdout);
    expect(result.ok).toBe(true);
    expect(result.from).toBe('draft');
    expect(result.to).toBe('ideating');
  });

  it('blocks invalid transition draft → executing', () => {
    const storyPath = writeStory('PROJ-001', { status: 'draft' });
    const { stdout, exitCode } = runCommand(`transition ${storyPath} executing`);
    const result = parseOutput(stdout);
    expect(result.ok).toBe(false);
    expect(exitCode).toBe(1);
  });

  it('blocks transition to planned without acceptance criteria', () => {
    const storyPath = writeStory('PROJ-001', {
      status: 'ideating',
      acceptance_criteria: [],
    });
    const { stdout, exitCode } = runCommand(`transition ${storyPath} planned`);
    const result = parseOutput(stdout);
    expect(result.ok).toBe(false);
    expect(exitCode).toBe(1);
    expect((result.details as string[])[0]).toContain('acceptance criteria');
  });

  it('allows transition to planned with ACs and problem', () => {
    const storyPath = writeStory('PROJ-001', {
      status: 'ideating',
      acceptance_criteria: [{ id: 'AC-1', description: 'Test', status: 'pending', evidence: '' }],
      why: { problem: 'Real problem', root_cause: '', impact: '' },
    });
    const { stdout } = runCommand(`transition ${storyPath} planned`);
    const result = parseOutput(stdout);
    expect(result.ok).toBe(true);
    expect(result.from).toBe('ideating');
    expect(result.to).toBe('planned');
  });

  it('blocks transition to executing without tasks', () => {
    const storyPath = writeStory('PROJ-001', {
      status: 'planned',
      tasks: [],
      acceptance_criteria: [{ id: 'AC-1', description: 'Test', status: 'pending', evidence: '' }],
      why: { problem: 'Problem', root_cause: '', impact: '' },
    });
    const { stdout, exitCode } = runCommand(`transition ${storyPath} executing`);
    const result = parseOutput(stdout);
    expect(result.ok).toBe(false);
    expect(exitCode).toBe(1);
    expect((result.details as string[])[0]).toContain('tasks');
  });
});

// ---------------------------------------------------------------------------
// next-id
// ---------------------------------------------------------------------------

describe('next-id command', () => {
  it('increments counter and returns next ID', () => {
    const configPath = join(TEST_DIR, '.swarm/config.md');
    const meta: Record<string, unknown> = {
      project: 'test-project',
      prefix: 'PROJ',
      counter: 3,
      definition_of_ready: [],
      definition_of_done: [],
      ways_of_working: {},
    };
    writeFileSync(configPath, serializeFrontmatter(meta, '\n# Config\n'));

    const { stdout } = runCommand(`next-id ${configPath}`);
    const result = parseOutput(stdout);
    expect(result.ok).toBe(true);
    expect(result.id).toBe('PROJ-004');
    expect(result.counter).toBe(4);

    // Verify file was updated
    const updatedContent = readFileSync(configPath, 'utf-8');
    expect(updatedContent).toContain('counter: 4');
  });

  it('starts from 0 if counter is missing', () => {
    const configPath = join(TEST_DIR, '.swarm/config.md');
    const meta: Record<string, unknown> = {
      project: 'test-project',
      prefix: 'NEW',
    };
    writeFileSync(configPath, serializeFrontmatter(meta, '\n# Config\n'));

    const { stdout } = runCommand(`next-id ${configPath}`);
    const result = parseOutput(stdout);
    expect(result.ok).toBe(true);
    expect(result.id).toBe('NEW-001');
    expect(result.counter).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// list
// ---------------------------------------------------------------------------

describe('list command', () => {
  it('lists stories in a directory', () => {
    writeStory('PROJ-001', { status: 'ideating' });
    writeStory('PROJ-002', { status: 'executing' });
    writeStory('PROJ-003', { status: 'executing' });

    const backlogDir = join(TEST_DIR, '.swarm/backlog');
    const { stdout } = runCommand(`list ${backlogDir}`);
    const result = parseOutput(stdout);
    expect(result.ok).toBe(true);
    expect(result.count).toBe(3);
    expect((result.items as unknown[]).length).toBe(3);
  });

  it('filters by status', () => {
    writeStory('PROJ-001', { status: 'ideating' });
    writeStory('PROJ-002', { status: 'executing' });
    writeStory('PROJ-003', { status: 'executing' });

    const backlogDir = join(TEST_DIR, '.swarm/backlog');
    const { stdout } = runCommand(`list ${backlogDir} --status executing`);
    const result = parseOutput(stdout);
    expect(result.ok).toBe(true);
    expect(result.count).toBe(2);
  });

  it('returns empty for no matches', () => {
    writeStory('PROJ-001', { status: 'ideating' });

    const backlogDir = join(TEST_DIR, '.swarm/backlog');
    const { stdout } = runCommand(`list ${backlogDir} --status archived`);
    const result = parseOutput(stdout);
    expect(result.ok).toBe(true);
    expect(result.count).toBe(0);
  });

  it('handles empty directory', () => {
    const emptyDir = join(TEST_DIR, '.swarm/knowledge');
    const { stdout } = runCommand(`list ${emptyDir}`);
    const result = parseOutput(stdout);
    expect(result.ok).toBe(true);
    expect(result.count).toBe(0);
  });

  it('reports missing directory', () => {
    const { stdout, exitCode } = runCommand('list /nonexistent/dir');
    const result = parseOutput(stdout);
    expect(result.ok).toBe(false);
    expect(exitCode).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// extract-knowledge
// ---------------------------------------------------------------------------

describe('extract-knowledge command', () => {
  it('extracts knowledge from a retrospective', () => {
    const retroPath = join(TEST_DIR, '.swarm/retrospectives/PROJ-001-retro.md');
    const meta: Record<string, unknown> = {
      story_id: 'PROJ-001',
      title: 'Test Retro',
      completed: '2026-01-01T00:00:00Z',
      duration: '2h',
      agents_involved: ['backend-dev'],
      repo: 'test-repo',
      team: '',
      knowledge_extracted: [],
      metrics: {
        tasks_total: 1,
        tasks_completed: 1,
        acs_total: 1,
        acs_passing: 1,
        files_changed: 2,
        tests_added: 1,
        cycle_time_hours: 2,
      },
    };
    const body = `
# Retrospective: Test

## What Went Well

- Using TypeScript strict mode caught bugs early
- The Bun test runner is consistently fast

## What Could Improve

- SQLite type casting was confusing and undocumented

## Key Decisions

| Decision | Rationale | Alternatives |
|----------|-----------|-------------|
| Use JWT | Standard auth | Session cookies |

## Learnings by Agent

### backend-dev
- Always validate JWT token claims server-side
- Bun.serve middleware pattern works well for auth
`;
    writeFileSync(retroPath, serializeFrontmatter(meta, body));

    const { stdout } = runCommand(
      `extract-knowledge ${retroPath} --story-id PROJ-001 --repo test-repo`
    );
    const result = parseOutput(stdout);
    expect(result.ok).toBe(true);
    expect(result.count as number).toBeGreaterThan(0);
    expect(Array.isArray(result.files_written)).toBe(true);
    expect((result.files_written as string[]).length).toBeGreaterThan(0);

    // Verify files were actually written
    for (const file of result.files_written as string[]) {
      const fullPath = join(TEST_DIR, file);
      expect(existsSync(fullPath)).toBe(true);
    }
  });

  it('returns empty for a retro with no learnings', () => {
    const retroPath = join(TEST_DIR, '.swarm/retrospectives/PROJ-002-retro.md');
    const meta: Record<string, unknown> = {
      story_id: 'PROJ-002',
      title: 'Empty Retro',
      completed: '2026-01-01T00:00:00Z',
      duration: '1h',
      agents_involved: [],
      repo: 'test-repo',
      team: '',
      knowledge_extracted: [],
      metrics: {
        tasks_total: 0,
        tasks_completed: 0,
        acs_total: 0,
        acs_passing: 0,
        files_changed: 0,
        tests_added: 0,
        cycle_time_hours: 0,
      },
    };
    const body = `
# Retrospective: Empty

## Summary

Nothing much happened.
`;
    writeFileSync(retroPath, serializeFrontmatter(meta, body));

    const { stdout } = runCommand(
      `extract-knowledge ${retroPath} --story-id PROJ-002 --repo test-repo`
    );
    const result = parseOutput(stdout);
    expect(result.ok).toBe(true);
    expect(result.count).toBe(0);
    expect((result.files_written as string[]).length).toBe(0);
  });

  it('falls back to frontmatter for story-id and repo', () => {
    const retroPath = join(TEST_DIR, '.swarm/retrospectives/PROJ-003-retro.md');
    const meta: Record<string, unknown> = {
      story_id: 'PROJ-003',
      title: 'Retro with metadata',
      completed: '2026-01-01T00:00:00Z',
      duration: '1h',
      agents_involved: ['architect'],
      repo: 'my-repo',
      team: '',
      knowledge_extracted: [],
      metrics: {
        tasks_total: 1,
        tasks_completed: 1,
        acs_total: 1,
        acs_passing: 1,
        files_changed: 1,
        tests_added: 1,
        cycle_time_hours: 1,
      },
    };
    const body = `
# Retrospective

## What Went Well

- Component composition pattern proved highly reusable
`;
    writeFileSync(retroPath, serializeFrontmatter(meta, body));

    // No --story-id or --repo args — should use frontmatter
    const { stdout } = runCommand(`extract-knowledge ${retroPath}`);
    const result = parseOutput(stdout);
    expect(result.ok).toBe(true);
    expect(result.count).toBe(1);
  });
});
