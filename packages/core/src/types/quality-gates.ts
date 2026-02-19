/**
 * Quality gate types for SWARM SDLC.
 *
 * Definition of Ready (DoR), Definition of Done (DoD),
 * and Ways of Working (WoW) configurations.
 */

export interface QualityGateItem {
  id: string;
  description: string;
  required: boolean;
  automated: boolean;
  command?: string; // Shell command for automated checks
}

export interface DefinitionOfReady {
  items: QualityGateItem[];
}

export interface DefinitionOfDone {
  items: QualityGateItem[];
}

export type TestingStrategy = 'test-first' | 'test-after' | 'test-during';
export type ReviewPolicy = 'required' | 'optional' | 'none';
export type DocumentationLevel = 'minimal' | 'standard' | 'comprehensive';
export type EffortModel = 'tshirt' | 'story-points' | 'hours';

export interface WaysOfWorking {
  testing: TestingStrategy;
  review: ReviewPolicy;
  documentation: DocumentationLevel;
  effort_model: EffortModel;
  max_parallel_agents: number;
  auto_verify: boolean;
  knowledge_extraction: boolean; // SWARM addition: extract knowledge on close
  knowledge_auto_hoist: boolean; // SWARM addition: auto-hoist team-scoped items
}
