/**
 * Marketplace manifest validation.
 *
 * Validates plugin.json and marketplace.json files for the
 * SWARM marketplace distribution system.
 */

import type { MarketplacePackage, PluginDefinition, PluginType } from '@recursive-ai/core';

export interface ManifestValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const VALID_PLUGIN_TYPES: PluginType[] = ['skill', 'agent', 'template', 'hook', 'knowledge-pack'];

/**
 * Validate a plugin.json manifest.
 */
export function validatePluginManifest(
  manifest: Record<string, unknown>
): ManifestValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!manifest.id || typeof manifest.id !== 'string') {
    errors.push('plugin.json: "id" is required and must be a string');
  }
  if (!manifest.name || typeof manifest.name !== 'string') {
    errors.push('plugin.json: "name" is required and must be a string');
  }
  if (!manifest.version || typeof manifest.version !== 'string') {
    errors.push('plugin.json: "version" is required and must be a string');
  }
  if (!manifest.description || typeof manifest.description !== 'string') {
    errors.push('plugin.json: "description" is required and must be a string');
  }
  if (!manifest.author || typeof manifest.author !== 'string') {
    errors.push('plugin.json: "author" is required and must be a string');
  }
  if (!manifest.type || !VALID_PLUGIN_TYPES.includes(manifest.type as PluginType)) {
    errors.push(`plugin.json: "type" must be one of: ${VALID_PLUGIN_TYPES.join(', ')}`);
  }

  // Version format check
  if (typeof manifest.version === 'string') {
    const semverPattern = /^\d+\.\d+\.\d+(-[\w.]+)?$/;
    if (!semverPattern.test(manifest.version)) {
      warnings.push('plugin.json: "version" should follow semver format (e.g., 1.0.0)');
    }
  }

  // Optional fields validation
  if (manifest.dependencies && !Array.isArray(manifest.dependencies)) {
    errors.push('plugin.json: "dependencies" must be an array');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate a marketplace.json manifest.
 */
export function validateMarketplaceManifest(
  manifest: Record<string, unknown>
): ManifestValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!manifest.name || typeof manifest.name !== 'string') {
    errors.push('marketplace.json: "name" is required');
  }
  if (!manifest.version || typeof manifest.version !== 'string') {
    errors.push('marketplace.json: "version" is required');
  }
  if (!manifest.description || typeof manifest.description !== 'string') {
    errors.push('marketplace.json: "description" is required');
  }

  // Validate tags
  if (manifest.tags) {
    if (!Array.isArray(manifest.tags)) {
      errors.push('marketplace.json: "tags" must be an array');
    }
  } else {
    warnings.push('marketplace.json: consider adding "tags" for discoverability');
  }

  // Validate contents
  if (manifest.contents) {
    if (!Array.isArray(manifest.contents)) {
      errors.push('marketplace.json: "contents" must be an array');
    } else {
      for (let i = 0; i < manifest.contents.length; i++) {
        const item = manifest.contents[i] as Record<string, unknown>;
        if (!item.type || !VALID_PLUGIN_TYPES.includes(item.type as PluginType)) {
          errors.push(
            `marketplace.json: contents[${i}].type must be one of: ${VALID_PLUGIN_TYPES.join(', ')}`
          );
        }
        if (!item.name || typeof item.name !== 'string') {
          errors.push(`marketplace.json: contents[${i}].name is required`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
