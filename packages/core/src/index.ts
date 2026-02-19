/**
 * @recursive-ai/core
 *
 * Core types, parsers, state machine, and knowledge extractor
 * for the SWARM SDLC methodology.
 */

// Types
export * from './types/index';

// Frontmatter
export { parseFrontmatter, serializeFrontmatter } from './frontmatter/parser';
export {
  validateStoryMeta,
  validateKnowledgeItem,
  validateRetroMeta,
  type ValidationError,
  type ValidationResult,
} from './frontmatter/validator';

// Knowledge
export {
  suggestDimension,
  suggestDomain,
  DIMENSION_KEYWORDS,
  DOMAIN_KEYWORDS,
  extractRawLearnings,
  transformLearnings,
  extractKnowledge,
  type ExtractionContext,
  type RawLearning,
} from './knowledge/index';

// Lifecycle
export {
  VALID_TRANSITIONS,
  TERMINAL_STATES,
  ACTIVE_STATES,
  STATUS_LABELS,
  HAPPY_PATH,
} from './lifecycle/states';
export {
  canTransition,
  validateTransition,
  type TransitionResult,
} from './lifecycle/transitions';
