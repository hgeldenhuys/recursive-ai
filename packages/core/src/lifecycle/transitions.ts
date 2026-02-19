/**
 * Transition validators for the story lifecycle.
 *
 * Each transition can have preconditions that must be met.
 */

import type { StoryMeta, StoryStatus } from '../types/story';
import { VALID_TRANSITIONS } from './states';

export interface TransitionResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Check if a status transition is structurally valid.
 */
export function canTransition(from: StoryStatus, to: StoryStatus): TransitionResult {
  const allowed = VALID_TRANSITIONS[from];
  if (!allowed.includes(to)) {
    return {
      allowed: false,
      reason: `Cannot transition from '${from}' to '${to}'. Valid targets: ${allowed.join(', ') || 'none'}`,
    };
  }
  return { allowed: true };
}

/**
 * Validate transition preconditions for a specific story.
 */
export function validateTransition(story: StoryMeta, targetStatus: StoryStatus): TransitionResult {
  // First check structural validity
  const structuralCheck = canTransition(story.status, targetStatus);
  if (!structuralCheck.allowed) return structuralCheck;

  // Check semantic preconditions
  switch (targetStatus) {
    case 'planned': {
      // DoR: must have acceptance criteria
      if (!story.acceptance_criteria || story.acceptance_criteria.length === 0) {
        return { allowed: false, reason: 'Cannot plan: no acceptance criteria defined' };
      }
      // DoR: must have WHY
      if (!story.why.problem) {
        return { allowed: false, reason: 'Cannot plan: problem statement is empty' };
      }
      return { allowed: true };
    }

    case 'executing': {
      // Must have tasks
      if (!story.tasks || story.tasks.length === 0) {
        return { allowed: false, reason: 'Cannot execute: no tasks defined' };
      }
      return { allowed: true };
    }

    case 'verifying': {
      // All tasks should be done
      const pendingTasks = story.tasks.filter((t) => t.status !== 'done' && t.status !== 'skipped');
      if (pendingTasks.length > 0) {
        return {
          allowed: false,
          reason: `Cannot verify: ${pendingTasks.length} task(s) still in progress`,
        };
      }
      return { allowed: true };
    }

    case 'done': {
      // All ACs should be passing
      const failingACs = story.acceptance_criteria.filter((ac) => ac.status !== 'passing');
      if (failingACs.length > 0) {
        return {
          allowed: false,
          reason: `Cannot mark done: ${failingACs.length} AC(s) not passing`,
        };
      }
      return { allowed: true };
    }

    case 'archived': {
      // Story should be done
      if (story.status !== 'done') {
        return { allowed: false, reason: 'Cannot archive: story is not done' };
      }
      return { allowed: true };
    }

    default:
      return { allowed: true };
  }
}
