/**
 * SWARM configuration types.
 */

import type { HierarchyConfig } from './hierarchy';
import type { WaysOfWorking } from './quality-gates';

export interface SwarmConfig {
  project: string;
  prefix: string;
  counter: number;
  definition_of_ready: string[];
  definition_of_done: string[];
  ways_of_working: Partial<WaysOfWorking>;
  hierarchy?: HierarchyConfig;
}

// --- Plugin/Marketplace types ---

export type PluginType = 'skill' | 'agent' | 'template' | 'hook' | 'knowledge-pack';

export interface PluginDefinition {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  type: PluginType;
  entryPoint: string;
  dependencies?: string[];
  config?: Record<string, unknown>;
}

export interface PluginManifest {
  plugin: PluginDefinition;
  installedAt: string;
  enabled: boolean;
  source: PluginSource;
}

export type PluginSource =
  | { type: 'marketplace'; packageId: string }
  | { type: 'local'; path: string }
  | { type: 'git'; url: string; ref?: string };

export interface MarketplacePackage {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  downloads: number;
  rating: number;
  tags: string[];
  pluginType: PluginType;
  repository?: string;
  homepage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceSearchOptions {
  query?: string;
  type?: PluginType;
  tags?: string[];
  sortBy?: 'downloads' | 'rating' | 'recent';
  page?: number;
  limit?: number;
}
