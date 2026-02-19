import { describe, expect, it } from 'bun:test';
import type { StoryMeta } from '../types/story';
import { canTransition, validateTransition } from './transitions';

describe('canTransition', () => {
  it('allows valid transitions', () => {
    expect(canTransition('draft', 'ideating').allowed).toBe(true);
    expect(canTransition('ideating', 'planned').allowed).toBe(true);
    expect(canTransition('planned', 'executing').allowed).toBe(true);
    expect(canTransition('executing', 'verifying').allowed).toBe(true);
    expect(canTransition('verifying', 'done').allowed).toBe(true);
    expect(canTransition('done', 'archived').allowed).toBe(true);
  });

  it('blocks invalid transitions', () => {
    expect(canTransition('draft', 'executing').allowed).toBe(false);
    expect(canTransition('archived', 'draft').allowed).toBe(false);
    expect(canTransition('done', 'ideating').allowed).toBe(false);
  });

  it('allows awaiting_input transitions', () => {
    expect(canTransition('ideating', 'awaiting_input').allowed).toBe(true);
    expect(canTransition('planned', 'awaiting_input').allowed).toBe(true);
    expect(canTransition('awaiting_input', 'ideating').allowed).toBe(true);
    expect(canTransition('awaiting_input', 'planned').allowed).toBe(true);
  });

  it('provides reason for blocked transitions', () => {
    const result = canTransition('draft', 'done');
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('Cannot transition');
  });
});

describe('validateTransition', () => {
  const baseStory: StoryMeta = {
    id: 'TEST-001',
    title: 'Test Story',
    status: 'ideating',
    priority: 'medium',
    complexity: 'moderate',
    created: '2026-01-01',
    updated: '2026-01-01',
    author: 'claude',
    tags: [],
    acceptance_criteria: [{ id: 'AC-1', description: 'Test AC', status: 'pending', evidence: '' }],
    tasks: [
      {
        id: 'T-1',
        title: 'Task 1',
        agent: 'backend-dev',
        status: 'done',
        depends_on: [],
        effort_estimate: 'simple',
        ac_coverage: ['AC-1'],
      },
    ],
    execution: {
      started_at: null,
      completed_at: null,
      task_list_id: null,
      session_ids: [],
    },
    why: {
      problem: 'Test problem',
      root_cause: 'Root cause',
      impact: 'Impact',
    },
  };

  it('blocks planned transition without ACs', () => {
    const story = { ...baseStory, acceptance_criteria: [] };
    const result = validateTransition(story, 'planned');
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('acceptance criteria');
  });

  it('blocks planned transition without problem statement', () => {
    const story = {
      ...baseStory,
      why: { problem: '', root_cause: '', impact: '' },
    };
    const result = validateTransition(story, 'planned');
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('problem statement');
  });

  it('allows planned transition with valid story', () => {
    const result = validateTransition(baseStory, 'planned');
    expect(result.allowed).toBe(true);
  });

  it('blocks executing transition without tasks', () => {
    const story = { ...baseStory, status: 'planned' as const, tasks: [] };
    const result = validateTransition(story, 'executing');
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('no tasks');
  });

  it('blocks done transition with failing ACs', () => {
    const story = {
      ...baseStory,
      status: 'verifying' as const,
      acceptance_criteria: [
        { id: 'AC-1', description: 'Test', status: 'failing' as const, evidence: '' },
      ],
    };
    const result = validateTransition(story, 'done');
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('not passing');
  });
});
