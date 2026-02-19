/**
 * Hierarchy types for SWARM multi-repo knowledge consolidation.
 *
 * Worker (repo) → Scout (team) → Queen (dept) → Hive Mind (enterprise)
 */

export type HierarchyLevel = 'worker' | 'scout' | 'queen' | 'hive-mind';

export interface RepoReference {
  path: string;
  name: string;
  remote?: string;
}

export interface WorkerConfig {
  level: 'worker';
  repo: string;
  team?: string;
}

export interface ScoutConfig {
  level: 'scout';
  team: string;
  repos: RepoReference[];
  schedule: 'on-retro' | 'daily' | 'weekly' | 'manual';
  knowledge_dir: string; // Where consolidated knowledge lives
}

export interface QueenConfig {
  level: 'queen';
  department: string;
  teams: string[];
  schedule: 'weekly' | 'monthly' | 'manual';
}

export interface HiveMindConfig {
  level: 'hive-mind';
  departments: string[];
  schedule: 'monthly' | 'quarterly' | 'manual';
}

export type HierarchyConfig = WorkerConfig | ScoutConfig | QueenConfig | HiveMindConfig;

/**
 * Hierarchy level order (lowest to highest).
 */
export const HIERARCHY_ORDER: HierarchyLevel[] = ['worker', 'scout', 'queen', 'hive-mind'];

/**
 * Display labels for hierarchy levels.
 */
export const HIERARCHY_LABELS: Record<HierarchyLevel, { label: string; description: string }> = {
  worker: {
    label: 'Worker',
    description: 'Single repository SDLC execution',
  },
  scout: {
    label: 'Scout',
    description: 'Cross-repo knowledge consolidation for a team',
  },
  queen: {
    label: 'Queen',
    description: 'Department-level knowledge aggregation',
  },
  'hive-mind': {
    label: 'Hive Mind',
    description: 'Enterprise-wide strategic knowledge layer',
  },
};
