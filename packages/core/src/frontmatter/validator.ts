/**
 * Schema validation for SWARM frontmatter types.
 *
 * Lightweight runtime validation without external schema libraries.
 */

import type { KnowledgeItem } from '../types/knowledge';
import type { RetroMeta, StoryMeta } from '../types/story';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

function error(field: string, message: string): ValidationError {
  return { field, message };
}

function isString(v: unknown): v is string {
  return typeof v === 'string';
}

function isNumber(v: unknown): v is number {
  return typeof v === 'number';
}

function isArray(v: unknown): v is unknown[] {
  return Array.isArray(v);
}

const STORY_STATUSES = [
  'draft',
  'ideating',
  'planned',
  'executing',
  'verifying',
  'done',
  'archived',
  'awaiting_input',
];
const PRIORITIES = ['critical', 'high', 'medium', 'low'];
const COMPLEXITIES = ['trivial', 'simple', 'moderate', 'complex', 'epic'];
const AC_STATUSES = ['pending', 'passing', 'failing'];
const TASK_STATUSES = ['pending', 'in_progress', 'done', 'skipped'];
const DIMENSIONS = ['epistemology', 'qualia', 'praxeology'];
const SCOPES = ['repo', 'team', 'department', 'enterprise'];
const CONFIDENCES = ['low', 'medium', 'high'];
const DOMAINS = [
  'frontend',
  'backend',
  'devops',
  'architecture',
  'testing',
  'process',
  'documentation',
  'security',
];

/**
 * Validate a StoryMeta object.
 */
export function validateStoryMeta(meta: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];

  if (!isString(meta.id)) errors.push(error('id', 'must be a string'));
  if (!isString(meta.title)) errors.push(error('title', 'must be a string'));
  if (!isString(meta.status) || !STORY_STATUSES.includes(meta.status)) {
    errors.push(error('status', `must be one of: ${STORY_STATUSES.join(', ')}`));
  }
  if (!isString(meta.priority) || !PRIORITIES.includes(meta.priority)) {
    errors.push(error('priority', `must be one of: ${PRIORITIES.join(', ')}`));
  }
  if (!isString(meta.complexity) || !COMPLEXITIES.includes(meta.complexity)) {
    errors.push(error('complexity', `must be one of: ${COMPLEXITIES.join(', ')}`));
  }
  if (!isString(meta.created)) errors.push(error('created', 'must be a string'));
  if (!isString(meta.updated)) errors.push(error('updated', 'must be a string'));
  if (!isString(meta.author)) errors.push(error('author', 'must be a string'));
  if (!isArray(meta.tags)) errors.push(error('tags', 'must be an array'));

  if (isArray(meta.acceptance_criteria)) {
    for (let i = 0; i < meta.acceptance_criteria.length; i++) {
      const ac = meta.acceptance_criteria[i] as Record<string, unknown>;
      if (!isString(ac.id)) errors.push(error(`acceptance_criteria[${i}].id`, 'must be a string'));
      if (!isString(ac.status) || !AC_STATUSES.includes(ac.status)) {
        errors.push(
          error(`acceptance_criteria[${i}].status`, `must be one of: ${AC_STATUSES.join(', ')}`)
        );
      }
    }
  }

  if (isArray(meta.tasks)) {
    for (let i = 0; i < meta.tasks.length; i++) {
      const task = meta.tasks[i] as Record<string, unknown>;
      if (!isString(task.id)) errors.push(error(`tasks[${i}].id`, 'must be a string'));
      if (!isString(task.status) || !TASK_STATUSES.includes(task.status)) {
        errors.push(error(`tasks[${i}].status`, `must be one of: ${TASK_STATUSES.join(', ')}`));
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a KnowledgeItem object.
 */
export function validateKnowledgeItem(meta: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];

  if (!isString(meta.id)) errors.push(error('id', 'must be a string'));
  if (!isString(meta.source_story)) errors.push(error('source_story', 'must be a string'));
  if (!isString(meta.source_repo)) errors.push(error('source_repo', 'must be a string'));
  if (!isString(meta.created)) errors.push(error('created', 'must be a string'));
  if (!isString(meta.author)) errors.push(error('author', 'must be a string'));
  if (!isString(meta.dimension) || !DIMENSIONS.includes(meta.dimension)) {
    errors.push(error('dimension', `must be one of: ${DIMENSIONS.join(', ')}`));
  }
  if (!isString(meta.scope) || !SCOPES.includes(meta.scope)) {
    errors.push(error('scope', `must be one of: ${SCOPES.join(', ')}`));
  }
  if (typeof meta.hoistable !== 'boolean') errors.push(error('hoistable', 'must be a boolean'));
  if (!isString(meta.confidence) || !CONFIDENCES.includes(meta.confidence)) {
    errors.push(error('confidence', `must be one of: ${CONFIDENCES.join(', ')}`));
  }
  if (!isArray(meta.tags)) errors.push(error('tags', 'must be an array'));
  if (!isString(meta.domain) || !DOMAINS.includes(meta.domain)) {
    errors.push(error('domain', `must be one of: ${DOMAINS.join(', ')}`));
  }
  if (!isString(meta.title)) errors.push(error('title', 'must be a string'));

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a RetroMeta object.
 */
export function validateRetroMeta(meta: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];

  if (!isString(meta.story_id)) errors.push(error('story_id', 'must be a string'));
  if (!isString(meta.title)) errors.push(error('title', 'must be a string'));
  if (!isString(meta.completed)) errors.push(error('completed', 'must be a string'));
  if (!isString(meta.duration)) errors.push(error('duration', 'must be a string'));
  if (!isArray(meta.agents_involved)) {
    errors.push(error('agents_involved', 'must be an array'));
  }

  return { valid: errors.length === 0, errors };
}
