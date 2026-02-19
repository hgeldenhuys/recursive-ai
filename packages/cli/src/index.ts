#!/usr/bin/env bun
/**
 * @recursive-ai/cli
 *
 * CLI entry point for SWARM SDLC management.
 *
 * Usage:
 *   recursive init [--prefix PREFIX] [--dry-run]
 *   recursive status
 *   recursive validate <story-file>
 *   recursive transition <story-file> <target-status>
 *   recursive extract-knowledge <retro-file> [--story-id ID] [--repo NAME]
 *   recursive next-id <config-file>
 *   recursive list <directory> [--status STATUS]
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

    case 'validate': {
      const { commandValidate } = await import('./commands');
      const storyFile = args[1];
      if (!storyFile) {
        console.log(JSON.stringify({ ok: false, error: 'Usage: recursive validate <story-file>' }));
        process.exit(1);
      }
      commandValidate(storyFile);
      break;
    }

    case 'transition': {
      const { commandTransition } = await import('./commands');
      const storyFile = args[1];
      const targetStatus = args[2];
      if (!storyFile || !targetStatus) {
        console.log(
          JSON.stringify({
            ok: false,
            error: 'Usage: recursive transition <story-file> <target-status>',
          })
        );
        process.exit(1);
      }
      commandTransition(storyFile, targetStatus);
      break;
    }

    case 'extract-knowledge': {
      const { commandExtractKnowledge } = await import('./commands');
      const retroFile = args[1];
      if (!retroFile) {
        console.log(
          JSON.stringify({
            ok: false,
            error: 'Usage: recursive extract-knowledge <retro-file> [--story-id ID] [--repo NAME]',
          })
        );
        process.exit(1);
      }
      commandExtractKnowledge(retroFile, args.slice(2));
      break;
    }

    case 'next-id': {
      const { commandNextId } = await import('./commands');
      const configFile = args[1];
      if (!configFile) {
        console.log(JSON.stringify({ ok: false, error: 'Usage: recursive next-id <config-file>' }));
        process.exit(1);
      }
      commandNextId(configFile);
      break;
    }

    case 'list': {
      const { commandList } = await import('./commands');
      const directory = args[1];
      if (!directory) {
        console.log(
          JSON.stringify({
            ok: false,
            error: 'Usage: recursive list <directory> [--status STATUS]',
          })
        );
        process.exit(1);
      }
      commandList(directory, args.slice(2));
      break;
    }

    default: {
      console.log(`SWARM SDLC Manager (recursive-ai)

Usage:
  recursive init [--prefix PREFIX] [--dry-run]                            Initialize SWARM in current directory
  recursive status                                                         Check SWARM initialization status
  recursive validate <story-file>                                          Validate story frontmatter
  recursive transition <story-file> <target-status>                        Check if transition is allowed
  recursive extract-knowledge <retro-file> [--story-id ID] [--repo NAME]   Extract knowledge items
  recursive next-id <config-file>                                          Get next story ID
  recursive list <directory> [--status STATUS]                             List stories/knowledge items

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
