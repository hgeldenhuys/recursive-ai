/**
 * @recursive-ai/marketplace
 *
 * Plugin registry and manifest validation for the SWARM marketplace.
 */

export { PackageRegistry, type RegistryEntry } from './registry';
export {
  validatePluginManifest,
  validateMarketplaceManifest,
  type ManifestValidationResult,
} from './manifest';
