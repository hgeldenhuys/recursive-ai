import { describe, expect, it } from 'bun:test';
import { validateKnowledgeItem, validateRetroMeta, validateStoryMeta } from './validator';

describe('validateStoryMeta', () => {
  it('validates a correct story meta', () => {
    const meta = {
      id: 'PROJ-001',
      title: 'Test Story',
      status: 'ideating',
      priority: 'medium',
      complexity: 'moderate',
      created: '2026-01-01T00:00:00Z',
      updated: '2026-01-01T00:00:00Z',
      author: 'claude',
      tags: ['backend'],
      acceptance_criteria: [{ id: 'AC-1', description: 'Test', status: 'pending', evidence: '' }],
      tasks: [],
    };
    const result = validateStoryMeta(meta);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('reports missing required fields', () => {
    const result = validateStoryMeta({});
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    const fields = result.errors.map((e) => e.field);
    expect(fields).toContain('id');
    expect(fields).toContain('title');
    expect(fields).toContain('status');
  });

  it('validates enum values', () => {
    const meta = {
      id: 'PROJ-001',
      title: 'Test',
      status: 'invalid_status',
      priority: 'not_a_priority',
      complexity: 'moderate',
      created: '2026-01-01',
      updated: '2026-01-01',
      author: 'claude',
      tags: [],
    };
    const result = validateStoryMeta(meta);
    expect(result.valid).toBe(false);
    const fields = result.errors.map((e) => e.field);
    expect(fields).toContain('status');
    expect(fields).toContain('priority');
  });
});

describe('validateKnowledgeItem', () => {
  it('validates a correct knowledge item', () => {
    const meta = {
      id: 'K-001',
      source_story: 'PROJ-001',
      source_repo: 'my-app',
      created: '2026-01-01T00:00:00Z',
      author: 'backend-dev',
      dimension: 'epistemology',
      scope: 'repo',
      hoistable: false,
      confidence: 'medium',
      tags: ['typescript'],
      domain: 'backend',
      title: 'Use for-loops for better perf',
    };
    const result = validateKnowledgeItem(meta);
    expect(result.valid).toBe(true);
  });

  it('rejects invalid dimension', () => {
    const meta = {
      id: 'K-001',
      source_story: 'PROJ-001',
      source_repo: 'my-app',
      created: '2026-01-01',
      author: 'claude',
      dimension: 'invalid',
      scope: 'repo',
      hoistable: false,
      confidence: 'medium',
      tags: [],
      domain: 'backend',
      title: 'Test',
    };
    const result = validateKnowledgeItem(meta);
    expect(result.valid).toBe(false);
    expect(result.errors[0].field).toBe('dimension');
  });
});

describe('validateRetroMeta', () => {
  it('validates a correct retro meta', () => {
    const meta = {
      story_id: 'PROJ-001',
      title: 'Retrospective',
      completed: '2026-01-01',
      duration: '2 hours',
      agents_involved: ['backend-dev', 'qa-engineer'],
    };
    const result = validateRetroMeta(meta);
    expect(result.valid).toBe(true);
  });

  it('reports missing fields', () => {
    const result = validateRetroMeta({});
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(4);
  });
});
