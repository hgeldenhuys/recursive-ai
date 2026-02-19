/**
 * Knowledge layer types for SWARM.
 *
 * Enables machine-discoverable insights with E/Q/P taxonomy
 * and hierarchical scope for knowledge hoisting.
 */

export type KnowledgeDimension = 'epistemology' | 'qualia' | 'praxeology';
// E = Patterns (reusable architectural/design patterns)
// Q = Pain Points (gotchas, pitfalls, surprises)
// P = Best Practices (proven techniques and conventions)

export type HierarchyScope = 'repo' | 'team' | 'department' | 'enterprise';

export type Confidence = 'low' | 'medium' | 'high';

export type KnowledgeDomain =
  | 'frontend'
  | 'backend'
  | 'devops'
  | 'architecture'
  | 'testing'
  | 'process'
  | 'documentation'
  | 'security';

export interface KnowledgeItem {
  id: string; // K-001, K-002, etc.
  source_story: string; // PROJ-003
  source_repo: string; // my-api-service
  created: string; // ISO timestamp
  author: string; // Agent that discovered it
  dimension: KnowledgeDimension;
  scope: HierarchyScope;
  hoistable: boolean; // Can be promoted upward?
  hoisted_to: string | null; // Set by Scout when hoisted
  hoisted_at: string | null;
  confidence: Confidence;
  tags: string[];
  domain: KnowledgeDomain;
  title: string;
  description: string;
  context: string; // What situation this applies to
  recommendation: string; // What to do about it
  supersedes: string | null; // ID of item this replaces
  ttl: string | null; // Optional expiry (ISO duration)
}

/**
 * Dimension descriptions for use in templates and documentation.
 */
export const DIMENSION_LABELS: Record<KnowledgeDimension, { label: string; description: string }> =
  {
    epistemology: {
      label: 'Patterns',
      description: 'Reusable architectural and design patterns',
    },
    qualia: {
      label: 'Pain Points',
      description: 'Gotchas, pitfalls, and surprises',
    },
    praxeology: {
      label: 'Best Practices',
      description: 'Proven techniques and conventions',
    },
  };

/**
 * Scope hierarchy order (lowest to highest).
 */
export const SCOPE_ORDER: HierarchyScope[] = ['repo', 'team', 'department', 'enterprise'];

/**
 * Check if a scope is higher than another in the hierarchy.
 */
export function isScopeHigherThan(a: HierarchyScope, b: HierarchyScope): boolean {
  return SCOPE_ORDER.indexOf(a) > SCOPE_ORDER.indexOf(b);
}
