import { describe, expect, it } from 'bun:test';
import { validateMarketplaceManifest, validatePluginManifest } from './manifest';

describe('validatePluginManifest', () => {
  it('validates a correct plugin manifest', () => {
    const manifest = {
      id: 'recursive-ai-swarm',
      name: 'SWARM SDLC Framework',
      version: '0.1.0',
      description: 'AI-native SDLC methodology',
      author: 'recursive-ai',
      type: 'skill',
    };
    const result = validatePluginManifest(manifest);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('reports missing required fields', () => {
    const result = validatePluginManifest({});
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(5);
  });

  it('rejects invalid plugin type', () => {
    const manifest = {
      id: 'test',
      name: 'Test',
      version: '1.0.0',
      description: 'Test',
      author: 'test',
      type: 'invalid',
    };
    const result = validatePluginManifest(manifest);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('type');
  });

  it('warns about non-semver versions', () => {
    const manifest = {
      id: 'test',
      name: 'Test',
      version: 'latest',
      description: 'Test',
      author: 'test',
      type: 'skill',
    };
    const result = validatePluginManifest(manifest);
    expect(result.valid).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});

describe('validateMarketplaceManifest', () => {
  it('validates a correct marketplace manifest', () => {
    const manifest = {
      name: 'SWARM SDLC Framework',
      version: '0.1.0',
      description: 'AI-native SDLC methodology',
      tags: ['sdlc', 'swarm'],
      contents: [
        { type: 'skill', name: 'swarm-ideate' },
        { type: 'agent', name: 'backend-dev' },
      ],
    };
    const result = validateMarketplaceManifest(manifest);
    expect(result.valid).toBe(true);
  });

  it('reports missing required fields', () => {
    const result = validateMarketplaceManifest({});
    expect(result.valid).toBe(false);
  });

  it('validates content items', () => {
    const manifest = {
      name: 'Test',
      version: '1.0.0',
      description: 'Test',
      contents: [{ type: 'invalid', name: 'bad' }],
    };
    const result = validateMarketplaceManifest(manifest);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('contents[0].type');
  });
});
