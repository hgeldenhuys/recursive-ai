#!/usr/bin/env bun
/**
 * @recursive-ai/cli
 *
 * CLI entry point for SWARM SDLC management.
 *
 * Usage:
 *   recursive init [--prefix PREFIX] [--dry-run]
 *   recursive status
 */

import { SwarmInstaller } from './installer';

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case 'init': {
      const projectDir = process.cwd();
      const prefixIdx = args.indexOf('--prefix');
      const prefix = prefixIdx !== -1 ? args[prefixIdx + 1] : undefined;
      const dryRun = args.includes('--dry-run');

      const installer = new SwarmInstaller({ projectDir, prefix, dryRun });
      const results = await installer.install();
      console.log(installer.report(results));
      break;
    }

    case 'status': {
      console.log('SWARM status: checking .swarm/ directory...');
      const { existsSync } = await import('node:fs');
      const { join } = await import('node:path');
      const cwd = process.cwd();

      const checks = [
        '.swarm/config.md',
        '.swarm/backlog',
        '.swarm/archive',
        '.swarm/retrospectives',
        '.swarm/knowledge',
        '.swarm/templates/story.md',
        '.swarm/definition-of-ready.yaml',
        '.swarm/definition-of-done.yaml',
        '.swarm/ways-of-working.yaml',
      ];

      let allPresent = true;
      for (const check of checks) {
        const exists = existsSync(join(cwd, check));
        const icon = exists ? '+' : '-';
        console.log(`  ${icon} ${check}`);
        if (!exists) allPresent = false;
      }

      if (allPresent) {
        console.log('\nSWARM is fully initialized. Run /swarm-ideate to start.');
      } else {
        console.log('\nSWARM is not fully initialized. Run `recursive init` to set up.');
      }
      break;
    }

    default: {
      console.log(`SWARM SDLC Manager (recursive-ai)

Usage:
  recursive init [--prefix PREFIX] [--dry-run]   Initialize SWARM in current directory
  recursive status                                Check SWARM initialization status

Options:
  --prefix PREFIX   Story ID prefix (default: project name)
  --dry-run         Show what would be created without doing it
`);
      break;
    }
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
