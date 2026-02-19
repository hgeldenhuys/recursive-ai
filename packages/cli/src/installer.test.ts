import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { SwarmInstaller } from './installer';

const TEST_DIR = join(import.meta.dir, '../../../.test-install');

beforeEach(() => {
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true });
  }
  mkdirSync(TEST_DIR, { recursive: true });
  // Create a package.json so the installer can resolve project name
  writeFileSync(join(TEST_DIR, 'package.json'), JSON.stringify({ name: 'test-project' }, null, 2));
});

afterEach(() => {
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true });
  }
});

describe('SwarmInstaller', () => {
  it('creates all required directories', async () => {
    const installer = new SwarmInstaller({ projectDir: TEST_DIR });
    const results = await installer.install();

    // Check .swarm directories exist
    expect(existsSync(join(TEST_DIR, '.swarm/backlog'))).toBe(true);
    expect(existsSync(join(TEST_DIR, '.swarm/archive'))).toBe(true);
    expect(existsSync(join(TEST_DIR, '.swarm/retrospectives'))).toBe(true);
    expect(existsSync(join(TEST_DIR, '.swarm/knowledge'))).toBe(true);
    expect(existsSync(join(TEST_DIR, '.swarm/templates'))).toBe(true);

    // Check some results were created
    const createdPaths = results.filter((r) => r.action === 'created').map((r) => r.path);
    expect(createdPaths.length).toBeGreaterThan(0);
  });

  it('creates config.md', async () => {
    const installer = new SwarmInstaller({ projectDir: TEST_DIR });
    await installer.install();

    const configPath = join(TEST_DIR, '.swarm/config.md');
    expect(existsSync(configPath)).toBe(true);

    const content = await Bun.file(configPath).text();
    expect(content).toContain('test-project');
    expect(content).toContain('TESTPROJECT');
    expect(content).toContain('knowledge_extraction');
  });

  it('creates quality gate YAML files', async () => {
    const installer = new SwarmInstaller({ projectDir: TEST_DIR });
    await installer.install();

    expect(existsSync(join(TEST_DIR, '.swarm/definition-of-ready.yaml'))).toBe(true);
    expect(existsSync(join(TEST_DIR, '.swarm/definition-of-done.yaml'))).toBe(true);
    expect(existsSync(join(TEST_DIR, '.swarm/ways-of-working.yaml'))).toBe(true);
  });

  it('creates template files', async () => {
    const installer = new SwarmInstaller({ projectDir: TEST_DIR });
    await installer.install();

    expect(existsSync(join(TEST_DIR, '.swarm/templates/story.md'))).toBe(true);
    expect(existsSync(join(TEST_DIR, '.swarm/templates/retrospective.md'))).toBe(true);
    expect(existsSync(join(TEST_DIR, '.swarm/templates/knowledge-item.md'))).toBe(true);
  });

  it('creates all 6 agent memory files', async () => {
    const installer = new SwarmInstaller({ projectDir: TEST_DIR });
    await installer.install();

    const agents = [
      'backend-dev',
      'frontend-dev',
      'qa-engineer',
      'architect',
      'tech-writer',
      'devops',
    ];

    for (const agent of agents) {
      const memoryPath = join(TEST_DIR, `.claude/agent-memory/${agent}/MEMORY.md`);
      expect(existsSync(memoryPath)).toBe(true);

      const content = await Bun.file(memoryPath).text();
      expect(content).toContain('Memory');
      expect(content).toContain('Patterns & Preferences');
    }
  });

  it('does not create skill files (provided by plugin)', async () => {
    const installer = new SwarmInstaller({ projectDir: TEST_DIR });
    await installer.install();

    // Skills are provided by the plugin, not created by the installer
    expect(existsSync(join(TEST_DIR, '.claude/skills'))).toBe(false);
  });

  it('does not create agent definition files (provided by plugin)', async () => {
    const installer = new SwarmInstaller({ projectDir: TEST_DIR });
    await installer.install();

    // Agent definitions are provided by the plugin, not created by the installer
    expect(existsSync(join(TEST_DIR, '.claude/agents'))).toBe(false);
  });

  it('is idempotent - second run skips all', async () => {
    const installer = new SwarmInstaller({ projectDir: TEST_DIR });

    // First install
    await installer.install();

    // Second install
    const results2 = await installer.install();
    const createdInSecondRun = results2.filter((r) => r.action === 'created');
    expect(createdInSecondRun.length).toBe(0);

    // All should be skipped
    const skippedInSecondRun = results2.filter((r) => r.action === 'skipped');
    expect(skippedInSecondRun.length).toBeGreaterThan(0);
  });

  it('uses custom prefix when provided', async () => {
    const installer = new SwarmInstaller({
      projectDir: TEST_DIR,
      prefix: 'MYAPP',
    });
    await installer.install();

    const configPath = join(TEST_DIR, '.swarm/config.md');
    const content = await Bun.file(configPath).text();
    expect(content).toContain('MYAPP');
  });

  it('dry run creates nothing', async () => {
    const installer = new SwarmInstaller({
      projectDir: TEST_DIR,
      dryRun: true,
    });
    const results = await installer.install();

    expect(existsSync(join(TEST_DIR, '.swarm/config.md'))).toBe(false);
    expect(existsSync(join(TEST_DIR, '.swarm/backlog'))).toBe(false);

    // But results should show what would be created
    const wouldCreate = results.filter((r) => r.action === 'created');
    expect(wouldCreate.length).toBeGreaterThan(0);
  });

  it('generates a readable report', async () => {
    const installer = new SwarmInstaller({ projectDir: TEST_DIR });
    const results = await installer.install();
    const report = installer.report(results);

    expect(report).toContain('SWARM SDLC installed');
    expect(report).toContain('Created:');
    expect(report).toContain('/swarm:ideate');
  });
});
