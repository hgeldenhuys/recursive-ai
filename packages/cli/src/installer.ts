/**
 * SWARM SDLC Installer.
 *
 * Idempotent installer that bootstraps the complete SWARM SDLC system
 * in any project. Every operation checks before acting:
 * - Directory exists? Skip.
 * - File exists? Skip (or merge for .gitignore).
 */

import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import {
  AGENT_MEMORY_TITLES,
  AGENT_NAMES,
  AGENT_TEMPLATES,
  GITIGNORE_RULES,
  GITKEEP_DIRECTORIES,
  SKILL_NAMES,
  SKILL_TEMPLATES,
  SWARM_DIRECTORIES,
  type TemplateContext,
  agentMemorySeed,
  configMd,
  definitionOfDoneYaml,
  definitionOfReadyYaml,
  knowledgeItemTemplate,
  retrospectiveTemplate,
  storyTemplate,
  waysOfWorkingYaml,
} from './templates';

export interface InstallResult {
  action: 'created' | 'skipped' | 'merged';
  path: string;
}

export interface InstallOptions {
  /** Target project directory */
  projectDir: string;
  /** Story ID prefix (default: project name uppercase) */
  prefix?: string;
  /** Print what would happen without doing it */
  dryRun?: boolean;
}

export class SwarmInstaller {
  private projectDir: string;
  private prefix: string;
  private dryRun: boolean;
  private ctx: TemplateContext;

  constructor(options: InstallOptions) {
    this.projectDir = options.projectDir;
    this.dryRun = options.dryRun ?? false;

    const projectName = this.resolveProjectName();
    this.prefix = options.prefix ?? projectName.toUpperCase().replace(/[^A-Z0-9]/g, '');

    this.ctx = {
      projectName,
      prefix: this.prefix,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Run the full installation. Returns combined results from all operations.
   */
  async install(): Promise<InstallResult[]> {
    const results: InstallResult[] = [];

    results.push(...this.ensureDirectories());
    results.push(...this.ensureConfig());
    results.push(...this.ensureQualityGates());
    results.push(...this.ensureTemplates());
    results.push(...this.ensureSkills());
    results.push(...this.ensureAgents());
    results.push(...this.ensureGitignore());

    return results;
  }

  // -------------------------------------------------------------------------
  // Individual operations (all idempotent)
  // -------------------------------------------------------------------------

  /**
   * Create .swarm/ directory structure with .gitkeep files in empty dirs.
   */
  ensureDirectories(): InstallResult[] {
    const results: InstallResult[] = [];

    for (const dir of SWARM_DIRECTORIES) {
      const fullPath = join(this.projectDir, dir);
      if (existsSync(fullPath)) {
        results.push({ action: 'skipped', path: dir });
      } else {
        if (!this.dryRun) {
          mkdirSync(fullPath, { recursive: true });
        }
        results.push({ action: 'created', path: dir });
      }
    }

    for (const dir of GITKEEP_DIRECTORIES) {
      const gitkeepPath = join(this.projectDir, dir, '.gitkeep');
      if (existsSync(gitkeepPath)) {
        // Already has .gitkeep
      } else {
        if (!this.dryRun) {
          Bun.write(gitkeepPath, '');
        }
        results.push({ action: 'created', path: `${dir}/.gitkeep` });
      }
    }

    return results;
  }

  /**
   * Create .swarm/config.md with project defaults.
   */
  ensureConfig(): InstallResult[] {
    const relPath = '.swarm/config.md';
    const fullPath = join(this.projectDir, relPath);

    if (existsSync(fullPath)) {
      return [{ action: 'skipped', path: relPath }];
    }

    if (!this.dryRun) {
      mkdirSync(join(this.projectDir, '.swarm'), { recursive: true });
      Bun.write(fullPath, configMd(this.ctx));
    }
    return [{ action: 'created', path: relPath }];
  }

  /**
   * Create quality gate YAML files.
   */
  ensureQualityGates(): InstallResult[] {
    const results: InstallResult[] = [];
    const files: [string, string][] = [
      ['.swarm/definition-of-ready.yaml', definitionOfReadyYaml()],
      ['.swarm/definition-of-done.yaml', definitionOfDoneYaml()],
      ['.swarm/ways-of-working.yaml', waysOfWorkingYaml()],
    ];

    for (const [relPath, content] of files) {
      const fullPath = join(this.projectDir, relPath);
      if (existsSync(fullPath)) {
        results.push({ action: 'skipped', path: relPath });
      } else {
        if (!this.dryRun) {
          Bun.write(fullPath, content);
        }
        results.push({ action: 'created', path: relPath });
      }
    }

    return results;
  }

  /**
   * Create .swarm/templates/ files.
   */
  ensureTemplates(): InstallResult[] {
    const results: InstallResult[] = [];
    const templates: [string, string][] = [
      ['.swarm/templates/story.md', storyTemplate()],
      ['.swarm/templates/retrospective.md', retrospectiveTemplate()],
      ['.swarm/templates/knowledge-item.md', knowledgeItemTemplate()],
    ];

    for (const [relPath, content] of templates) {
      const fullPath = join(this.projectDir, relPath);
      if (existsSync(fullPath)) {
        results.push({ action: 'skipped', path: relPath });
      } else {
        if (!this.dryRun) {
          mkdirSync(join(this.projectDir, '.swarm/templates'), { recursive: true });
          Bun.write(fullPath, content);
        }
        results.push({ action: 'created', path: relPath });
      }
    }

    return results;
  }

  /**
   * Create .claude/skills/swarm-{name}/SKILL.md for all 7 SWARM skills.
   */
  ensureSkills(): InstallResult[] {
    const results: InstallResult[] = [];

    for (const name of SKILL_NAMES) {
      const relPath = `.claude/skills/${name}/SKILL.md`;
      const fullPath = join(this.projectDir, relPath);

      if (existsSync(fullPath)) {
        results.push({ action: 'skipped', path: relPath });
      } else {
        if (!this.dryRun) {
          mkdirSync(join(this.projectDir, `.claude/skills/${name}`), { recursive: true });
          const templateFn = SKILL_TEMPLATES[name]!;
          Bun.write(fullPath, templateFn());
        }
        results.push({ action: 'created', path: relPath });
      }
    }

    return results;
  }

  /**
   * Create .claude/agents/{name}.md (6) and .claude/agent-memory/{name}/MEMORY.md (6).
   */
  ensureAgents(): InstallResult[] {
    const results: InstallResult[] = [];

    for (const name of AGENT_NAMES) {
      const relPath = `.claude/agents/${name}.md`;
      const fullPath = join(this.projectDir, relPath);

      if (existsSync(fullPath)) {
        results.push({ action: 'skipped', path: relPath });
      } else {
        if (!this.dryRun) {
          mkdirSync(join(this.projectDir, '.claude/agents'), { recursive: true });
          const templateFn = AGENT_TEMPLATES[name]!;
          Bun.write(fullPath, templateFn());
        }
        results.push({ action: 'created', path: relPath });
      }
    }

    for (const name of AGENT_NAMES) {
      const relPath = `.claude/agent-memory/${name}/MEMORY.md`;
      const fullPath = join(this.projectDir, relPath);

      if (existsSync(fullPath)) {
        results.push({ action: 'skipped', path: relPath });
      } else {
        if (!this.dryRun) {
          mkdirSync(join(this.projectDir, `.claude/agent-memory/${name}`), { recursive: true });
          const title = AGENT_MEMORY_TITLES[name] ?? name;
          Bun.write(fullPath, agentMemorySeed(name, title));
        }
        results.push({ action: 'created', path: relPath });
      }
    }

    return results;
  }

  /**
   * Add SWARM-specific rules to .gitignore.
   */
  ensureGitignore(): InstallResult[] {
    const relPath = '.gitignore';
    const fullPath = join(this.projectDir, relPath);
    const results: InstallResult[] = [];

    let existingLines: string[] = [];
    if (existsSync(fullPath)) {
      existingLines = readFileSync(fullPath, 'utf-8').split('\n');
    }

    const existingSet = new Set(existingLines.map((l) => l.trim()));
    const linesToAdd: string[] = [];

    for (const rule of GITIGNORE_RULES) {
      const trimmed = rule.trim();
      if (trimmed === '') {
        linesToAdd.push(rule);
        continue;
      }
      if (!existingSet.has(trimmed)) {
        linesToAdd.push(rule);
      }
    }

    const nonEmptyAdditions = linesToAdd.filter((l) => l.trim() !== '');

    if (nonEmptyAdditions.length === 0) {
      results.push({ action: 'skipped', path: relPath });
      return results;
    }

    if (!this.dryRun) {
      let content = '';
      if (existsSync(fullPath)) {
        content = readFileSync(fullPath, 'utf-8');
        if (content.length > 0 && !content.endsWith('\n')) {
          content += '\n';
        }
      }
      content += `${linesToAdd.join('\n')}\n`;
      Bun.write(fullPath, content);
    }

    results.push({ action: existsSync(fullPath) ? 'merged' : 'created', path: relPath });
    return results;
  }

  // -------------------------------------------------------------------------
  // Report
  // -------------------------------------------------------------------------

  report(results: InstallResult[]): string {
    const created: string[] = [];
    const skipped: string[] = [];
    const merged: string[] = [];

    for (const r of results) {
      if (r.action === 'created') {
        created.push(r.path);
      } else if (r.action === 'skipped') {
        skipped.push(r.path);
      } else if (r.action === 'merged') {
        merged.push(r.path);
      }
    }

    const lines: string[] = [];

    if (this.dryRun) {
      lines.push(`SWARM SDLC dry run for ${this.projectDir}`);
      lines.push('');
    } else {
      lines.push(`SWARM SDLC installed in ${this.projectDir}`);
      lines.push('');
    }

    if (created.length > 0) {
      lines.push('Created:');
      const grouped = this.groupPaths(created);
      for (const line of grouped) {
        lines.push(`  ${line}`);
      }
      lines.push('');
    }

    if (merged.length > 0) {
      lines.push('Merged:');
      for (const p of merged) {
        lines.push(`  ${p}`);
      }
      lines.push('');
    }

    if (skipped.length > 0) {
      lines.push('Skipped (already exists):');
      const grouped = this.groupPaths(skipped);
      for (const line of grouped) {
        lines.push(`  ${line}`);
      }
      lines.push('');
    }

    lines.push('Next: Run /swarm-ideate to create your first story');

    return lines.join('\n');
  }

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  private resolveProjectName(): string {
    const pkgPath = join(this.projectDir, 'package.json');
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
        if (pkg.name && typeof pkg.name === 'string') {
          return pkg.name;
        }
      } catch {
        // Fall through to directory name
      }
    }
    return basename(this.projectDir);
  }

  private groupPaths(paths: string[]): string[] {
    const groups = new Map<string, string[]>();
    for (const p of paths) {
      const parts = p.split('/');
      let key: string;
      if (parts.length >= 3 && (parts[0] === '.claude' || parts[0] === '.swarm')) {
        key = `${parts[0]}/${parts[1]}`;
      } else {
        key = p;
        groups.set(key, [p]);
        continue;
      }

      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(p);
    }

    const lines: string[] = [];
    for (const [_key, groupPaths] of groups) {
      if (groupPaths.length === 1) {
        lines.push(groupPaths[0]!);
      } else {
        const first = groupPaths[0]!;
        lines.push(`${first} (+ ${groupPaths.length - 1} more)`);
      }
    }

    return lines;
  }
}
