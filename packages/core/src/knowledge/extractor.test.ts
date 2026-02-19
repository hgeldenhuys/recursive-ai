import { describe, expect, it } from 'bun:test';
import { extractKnowledge, extractRawLearnings, transformLearnings } from './extractor';
import type { ExtractionContext } from './extractor';

describe('extractRawLearnings', () => {
  it('extracts bullet point learnings from sections', () => {
    const body = `## What Went Well

- Used for-loops instead of forEach for better performance
- Biome formatting caught issues early

## What Could Improve

- Database migrations were harder than expected
- Missing test fixtures caused flaky tests

## Learnings by Agent

### backend-dev
- SQLite type casting requires explicit handling
- Bun.serve has different default timeouts than Node
`;

    const learnings = extractRawLearnings(body);
    expect(learnings.length).toBe(6);

    expect(learnings[0].text).toContain('for-loops');
    expect(learnings[0].section).toBe('What Went Well');
    expect(learnings[0].agent).toBeUndefined();

    expect(learnings[4].section).toBe('Learnings by Agent');
    expect(learnings[4].agent).toBe('backend-dev');
  });

  it('skips placeholder text in brackets', () => {
    const body = `## What Went Well

- [Effective patterns, smooth workflows]
- Actual learning here
`;
    const learnings = extractRawLearnings(body);
    expect(learnings.length).toBe(1);
    expect(learnings[0].text).toBe('Actual learning here');
  });

  it('returns empty array for body with no learnings', () => {
    const body = '## Summary\n\nJust a summary paragraph.\n';
    const learnings = extractRawLearnings(body);
    expect(learnings.length).toBe(0);
  });
});

describe('transformLearnings', () => {
  const ctx: ExtractionContext = {
    storyId: 'PROJ-001',
    repoName: 'test-repo',
    author: 'orchestrator',
    existingIds: [],
  };

  it('generates sequential knowledge item IDs', () => {
    const rawLearnings = [
      { text: 'First pattern found', section: 'What Went Well' },
      { text: 'Second gotcha discovered', section: 'What Could Improve' },
    ];

    const items = transformLearnings(rawLearnings, ctx);
    expect(items.length).toBe(2);
    expect(items[0].id).toBe('K-001');
    expect(items[1].id).toBe('K-002');
  });

  it('continues IDs from existing ones', () => {
    const ctxWithExisting = { ...ctx, existingIds: ['K-005', 'K-003'] };
    const rawLearnings = [{ text: 'New learning about API patterns', section: 'What Went Well' }];

    const items = transformLearnings(rawLearnings, ctxWithExisting);
    expect(items[0].id).toBe('K-006');
  });

  it('tags items with source information', () => {
    const rawLearnings = [
      {
        text: 'Use TypeScript strict mode for better safety',
        section: 'What Went Well',
        agent: 'backend-dev',
      },
    ];

    const items = transformLearnings(rawLearnings, ctx);
    expect(items[0].source_story).toBe('PROJ-001');
    expect(items[0].source_repo).toBe('test-repo');
    expect(items[0].author).toBe('backend-dev');
    expect(items[0].tags).toContain('typescript');
  });

  it('sets hoistable for team-scoped items', () => {
    const rawLearnings = [
      { text: 'Team convention: always use strict TypeScript', section: 'What Went Well' },
    ];

    const items = transformLearnings(rawLearnings, ctx);
    expect(items[0].scope).toBe('team');
    expect(items[0].hoistable).toBe(true);
  });

  it('sets hoistable false for repo-scoped items', () => {
    const rawLearnings = [
      { text: 'This specific API endpoint needs custom caching', section: 'What Went Well' },
    ];

    const items = transformLearnings(rawLearnings, ctx);
    expect(items[0].scope).toBe('repo');
    expect(items[0].hoistable).toBe(false);
  });
});

describe('extractKnowledge', () => {
  it('runs the full pipeline', () => {
    const retroBody = `## Summary

Completed authentication feature.

## What Went Well

- JWT pattern worked well for stateless auth
- TypeScript strict mode caught type errors early

## What Could Improve

- OAuth integration was surprisingly complex
- Missing test fixtures for edge cases

## Learnings by Agent

### backend-dev
- SQLite stores JWT tokens as TEXT, not BLOB
`;

    const ctx: ExtractionContext = {
      storyId: 'AUTH-001',
      repoName: 'auth-service',
      author: 'orchestrator',
      existingIds: [],
    };

    const items = extractKnowledge(retroBody, ctx);
    expect(items.length).toBe(5);

    // Check IDs are sequential
    for (let i = 0; i < items.length; i++) {
      expect(items[i].id).toBe(`K-${String(i + 1).padStart(3, '0')}`);
    }

    // Check source info
    for (const item of items) {
      expect(item.source_story).toBe('AUTH-001');
      expect(item.source_repo).toBe('auth-service');
    }
  });
});
