/**
 * Git-based package registry for SWARM marketplace.
 *
 * Plugins are distributed as git repositories that can be
 * installed into any project via the Claude Code marketplace.
 */

import type { MarketplacePackage, MarketplaceSearchOptions, PluginType } from '@recursive-ai/core';

export interface RegistryEntry {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  tags: string[];
  pluginType: PluginType;
  repository: string;
  homepage?: string;
  downloads: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * In-memory registry backed by a JSON file or git repository.
 */
export class PackageRegistry {
  private entries: RegistryEntry[] = [];

  constructor(entries?: RegistryEntry[]) {
    this.entries = entries ?? [];
  }

  /**
   * Load registry entries from a JSON array.
   */
  loadFromJson(json: RegistryEntry[]): void {
    this.entries = json;
  }

  /**
   * Search the registry with filters.
   */
  search(options: MarketplaceSearchOptions): MarketplacePackage[] {
    let results = [...this.entries];

    // Filter by query
    if (options.query) {
      const q = options.query.toLowerCase();
      results = results.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Filter by type
    if (options.type) {
      results = results.filter((e) => e.pluginType === options.type);
    }

    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      results = results.filter((e) => options.tags!.some((tag: string) => e.tags.includes(tag)));
    }

    // Sort
    switch (options.sortBy) {
      case 'downloads':
        results.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'recent':
        results.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
        break;
      default:
        results.sort((a, b) => b.downloads - a.downloads);
    }

    // Paginate
    const page = options.page ?? 0;
    const limit = options.limit ?? 20;
    const start = page * limit;
    results = results.slice(start, start + limit);

    return results.map((e) => ({
      id: e.id,
      name: e.name,
      version: e.version,
      description: e.description,
      author: e.author,
      downloads: e.downloads,
      rating: e.rating,
      tags: e.tags,
      pluginType: e.pluginType,
      repository: e.repository,
      homepage: e.homepage,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    }));
  }

  /**
   * Get a specific package by ID.
   */
  getById(id: string): MarketplacePackage | null {
    const entry = this.entries.find((e) => e.id === id);
    if (!entry) return null;

    return {
      id: entry.id,
      name: entry.name,
      version: entry.version,
      description: entry.description,
      author: entry.author,
      downloads: entry.downloads,
      rating: entry.rating,
      tags: entry.tags,
      pluginType: entry.pluginType,
      repository: entry.repository,
      homepage: entry.homepage,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    };
  }

  /**
   * Add or update a registry entry.
   */
  upsert(entry: RegistryEntry): void {
    const existingIdx = this.entries.findIndex((e) => e.id === entry.id);
    if (existingIdx !== -1) {
      this.entries[existingIdx] = entry;
    } else {
      this.entries.push(entry);
    }
  }

  /**
   * Export the registry as JSON.
   */
  toJson(): RegistryEntry[] {
    return [...this.entries];
  }

  /**
   * Get the total number of entries.
   */
  get size(): number {
    return this.entries.length;
  }
}
