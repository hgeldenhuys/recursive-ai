/**
 * Story lifecycle state machine.
 *
 * Defines valid states and transitions for SWARM stories.
 */

import type { StoryStatus } from '../types/story';

/**
 * Valid state transitions for stories.
 * Maps each status to the set of statuses it can transition to.
 */
export const VALID_TRANSITIONS: Record<StoryStatus, StoryStatus[]> = {
  draft: ['ideating'],
  ideating: ['planned', 'awaiting_input'],
  planned: ['executing', 'awaiting_input'],
  executing: ['verifying', 'done'],
  verifying: ['done', 'executing'],
  done: ['archived'],
  archived: [],
  awaiting_input: ['ideating', 'planned'],
};

/**
 * Terminal states — no further transitions possible.
 */
export const TERMINAL_STATES: StoryStatus[] = ['archived'];

/**
 * Active states — story is being worked on.
 */
export const ACTIVE_STATES: StoryStatus[] = ['ideating', 'planned', 'executing', 'verifying'];

/**
 * Get the display label for a story status.
 */
export const STATUS_LABELS: Record<StoryStatus, string> = {
  draft: 'Draft',
  ideating: 'Ideating',
  planned: 'Planned',
  executing: 'Executing',
  verifying: 'Verifying',
  done: 'Done',
  archived: 'Archived',
  awaiting_input: 'Awaiting Input',
};

/**
 * Get the next expected status in the happy path.
 */
export const HAPPY_PATH: StoryStatus[] = [
  'draft',
  'ideating',
  'planned',
  'executing',
  'verifying',
  'done',
  'archived',
];
