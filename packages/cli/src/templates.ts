/**
 * Template generators for the SWARM SDLC system.
 *
 * Templates are loaded from disk files under `packages/cli/templates/`.
 * This module provides the same public API as before, with a thin loader.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// ---------------------------------------------------------------------------
// Template loader
// ---------------------------------------------------------------------------

const TEMPLATES_DIR = join(import.meta.dir, '../templates');

function loadTemplate(relativePath: string): string {
  return readFileSync(join(TEMPLATES_DIR, relativePath), 'utf-8');
}

// ---------------------------------------------------------------------------
// Template context
// ---------------------------------------------------------------------------

export interface TemplateContext {
  projectName: string;
  prefix: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// .swarm/config.md
// ---------------------------------------------------------------------------

export function configMd(ctx: TemplateContext): string {
  let content = loadTemplate('swarm/config.md');
  content = content.replaceAll('{{project}}', ctx.projectName);
  content = content.replaceAll('{{prefix}}', ctx.prefix);
  return content;
}

// ---------------------------------------------------------------------------
// Story template
// ---------------------------------------------------------------------------

export function storyTemplate(): string {
  return loadTemplate('swarm/templates/story.md');
}

// ---------------------------------------------------------------------------
// Retrospective template
// ---------------------------------------------------------------------------

export function retrospectiveTemplate(): string {
  return loadTemplate('swarm/templates/retrospective.md');
}

// ---------------------------------------------------------------------------
// Knowledge item template
// ---------------------------------------------------------------------------

export function knowledgeItemTemplate(): string {
  return loadTemplate('swarm/templates/knowledge-item.md');
}

// ---------------------------------------------------------------------------
// Definition of Ready YAML
// ---------------------------------------------------------------------------

export function definitionOfReadyYaml(): string {
  return loadTemplate('swarm/definition-of-ready.yaml');
}

// ---------------------------------------------------------------------------
// Definition of Done YAML
// ---------------------------------------------------------------------------

export function definitionOfDoneYaml(): string {
  return loadTemplate('swarm/definition-of-done.yaml');
}

// ---------------------------------------------------------------------------
// Ways of Working YAML
// ---------------------------------------------------------------------------

export function waysOfWorkingYaml(): string {
  return loadTemplate('swarm/ways-of-working.yaml');
}

// ---------------------------------------------------------------------------
// Agent templates
// ---------------------------------------------------------------------------

export function agentBackendDev(): string {
  return loadTemplate('agents/backend-dev.md');
}

export function agentFrontendDev(): string {
  return loadTemplate('agents/frontend-dev.md');
}

export function agentQaEngineer(): string {
  return loadTemplate('agents/qa-engineer.md');
}

export function agentArchitect(): string {
  return loadTemplate('agents/architect.md');
}

export function agentTechWriter(): string {
  return loadTemplate('agents/tech-writer.md');
}

export function agentDevops(): string {
  return loadTemplate('agents/devops.md');
}

// ---------------------------------------------------------------------------
// Agent memory seed
// ---------------------------------------------------------------------------

export function agentMemorySeed(name: string, title: string): string {
  return `# ${title}

## Project Context

_This file is automatically maintained. The ${name} agent reads it at the start of each task and appends learnings at the end._

## Patterns & Preferences

_No entries yet._

## Gotchas & Pitfalls

_No entries yet._

## Key Decisions

_No entries yet._
`;
}

// ---------------------------------------------------------------------------
// Agent memory titles
// ---------------------------------------------------------------------------

export const AGENT_MEMORY_TITLES: Record<string, string> = {
  'backend-dev': 'Backend Developer Memory',
  'frontend-dev': 'Frontend Developer Memory',
  'qa-engineer': 'QA Engineer Memory',
  architect: 'Architect Memory',
  'tech-writer': 'Tech Writer Memory',
  devops: 'DevOps Engineer Memory',
};

// ---------------------------------------------------------------------------
// Skill templates
// ---------------------------------------------------------------------------

export function skillSwarmIdeate(): string {
  return loadTemplate('skills/swarm-ideate.md');
}

export function skillSwarmPlan(): string {
  return loadTemplate('skills/swarm-plan.md');
}

export function skillSwarmExecute(): string {
  return loadTemplate('skills/swarm-execute.md');
}

export function skillSwarmVerify(): string {
  return loadTemplate('skills/swarm-verify.md');
}

export function skillSwarmClose(): string {
  return loadTemplate('skills/swarm-close.md');
}

export function skillSwarmRetro(): string {
  return loadTemplate('skills/swarm-retro.md');
}

export function skillSwarmRun(): string {
  return loadTemplate('skills/swarm-run.md');
}

// ---------------------------------------------------------------------------
// Directory and file constants
// ---------------------------------------------------------------------------

export const SWARM_DIRECTORIES: string[] = [
  '.swarm',
  '.swarm/backlog',
  '.swarm/archive',
  '.swarm/retrospectives',
  '.swarm/templates',
  '.swarm/knowledge',
  '.swarm/pending-questions',
];

export const GITKEEP_DIRECTORIES: string[] = [
  '.swarm/backlog',
  '.swarm/archive',
  '.swarm/retrospectives',
  '.swarm/templates',
  '.swarm/knowledge',
  '.swarm/pending-questions',
];

export const AGENT_NAMES: string[] = [
  'backend-dev',
  'frontend-dev',
  'qa-engineer',
  'architect',
  'tech-writer',
  'devops',
];

export const AGENT_TEMPLATES: Record<string, () => string> = {
  'backend-dev': agentBackendDev,
  'frontend-dev': agentFrontendDev,
  'qa-engineer': agentQaEngineer,
  architect: agentArchitect,
  'tech-writer': agentTechWriter,
  devops: agentDevops,
};

export const SKILL_NAMES: string[] = [
  'swarm-ideate',
  'swarm-plan',
  'swarm-execute',
  'swarm-verify',
  'swarm-close',
  'swarm-retro',
  'swarm-run',
];

export const SKILL_TEMPLATES: Record<string, () => string> = {
  'swarm-ideate': skillSwarmIdeate,
  'swarm-plan': skillSwarmPlan,
  'swarm-execute': skillSwarmExecute,
  'swarm-verify': skillSwarmVerify,
  'swarm-close': skillSwarmClose,
  'swarm-retro': skillSwarmRetro,
  'swarm-run': skillSwarmRun,
};

export const GITIGNORE_RULES: string[] = [
  '# SWARM SDLC',
  '.swarm/pending-questions/',
  '',
  '# Agent memory (project-specific, not shared)',
  '.claude/agent-memory/',
  '',
  '# Skill working files',
  '.claude/commands/swarm-*.md',
];
