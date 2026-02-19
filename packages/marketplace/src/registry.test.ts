import { describe, expect, it } from 'bun:test';
import { PackageRegistry, type RegistryEntry } from './registry';

const sampleEntries: RegistryEntry[] = [
  {
    id: 'swarm-sdlc',
    name: 'SWARM SDLC Framework',
    version: '0.1.0',
    description: 'AI-native SDLC methodology',
    author: 'recursive-ai',
    tags: ['sdlc', 'swarm', 'ai'],
    pluginType: 'skill',
    repository: 'https://github.com/recursive-ai/recursive-ai',
    downloads: 100,
    rating: 4.5,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'code-review-bot',
    name: 'Code Review Bot',
    version: '1.0.0',
    description: 'Automated code review agent',
    author: 'devtools-inc',
    tags: ['review', 'qa', 'ai'],
    pluginType: 'agent',
    repository: 'https://github.com/devtools/review-bot',
    downloads: 250,
    rating: 4.0,
    createdAt: '2025-12-01T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'security-scanner',
    name: 'Security Scanner',
    version: '2.0.0',
    description: 'Scan code for security vulnerabilities',
    author: 'secteam',
    tags: ['security', 'scanner'],
    pluginType: 'hook',
    repository: 'https://github.com/secteam/scanner',
    downloads: 500,
    rating: 4.8,
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2026-02-10T00:00:00Z',
  },
];

describe('PackageRegistry', () => {
  it('loads entries and searches by query', () => {
    const registry = new PackageRegistry(sampleEntries);
    const results = registry.search({ query: 'SWARM' });
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('swarm-sdlc');
  });

  it('filters by plugin type', () => {
    const registry = new PackageRegistry(sampleEntries);
    const results = registry.search({ type: 'agent' });
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('code-review-bot');
  });

  it('filters by tags', () => {
    const registry = new PackageRegistry(sampleEntries);
    const results = registry.search({ tags: ['ai'] });
    expect(results.length).toBe(2);
  });

  it('sorts by downloads', () => {
    const registry = new PackageRegistry(sampleEntries);
    const results = registry.search({ sortBy: 'downloads' });
    expect(results[0].id).toBe('security-scanner');
    expect(results[1].id).toBe('code-review-bot');
  });

  it('sorts by rating', () => {
    const registry = new PackageRegistry(sampleEntries);
    const results = registry.search({ sortBy: 'rating' });
    expect(results[0].id).toBe('security-scanner');
    expect(results[0].rating).toBe(4.8);
  });

  it('sorts by recent', () => {
    const registry = new PackageRegistry(sampleEntries);
    const results = registry.search({ sortBy: 'recent' });
    expect(results[0].id).toBe('security-scanner');
  });

  it('paginates results', () => {
    const registry = new PackageRegistry(sampleEntries);
    const page0 = registry.search({ limit: 2, page: 0 });
    const page1 = registry.search({ limit: 2, page: 1 });
    expect(page0.length).toBe(2);
    expect(page1.length).toBe(1);
  });

  it('gets package by ID', () => {
    const registry = new PackageRegistry(sampleEntries);
    const pkg = registry.getById('swarm-sdlc');
    expect(pkg).not.toBeNull();
    expect(pkg!.name).toBe('SWARM SDLC Framework');
  });

  it('returns null for unknown ID', () => {
    const registry = new PackageRegistry(sampleEntries);
    expect(registry.getById('nonexistent')).toBeNull();
  });

  it('upserts entries', () => {
    const registry = new PackageRegistry([]);
    expect(registry.size).toBe(0);

    registry.upsert(sampleEntries[0]);
    expect(registry.size).toBe(1);

    // Update existing
    registry.upsert({ ...sampleEntries[0], version: '0.2.0' });
    expect(registry.size).toBe(1);
    expect(registry.getById('swarm-sdlc')!.version).toBe('0.2.0');
  });

  it('exports to JSON', () => {
    const registry = new PackageRegistry(sampleEntries);
    const json = registry.toJson();
    expect(json.length).toBe(3);
  });
});
