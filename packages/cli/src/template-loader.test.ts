import { describe, expect, it } from 'bun:test';
import {
  AGENT_NAMES,
  AGENT_TEMPLATES,
  SKILL_NAMES,
  SKILL_TEMPLATES,
  configMd,
  definitionOfDoneYaml,
  definitionOfReadyYaml,
  knowledgeItemTemplate,
  retrospectiveTemplate,
  storyTemplate,
  waysOfWorkingYaml,
} from './templates';

describe('Template Loader', () => {
  describe('swarm templates', () => {
    it('loads config.md with parameter substitution', () => {
      const content = configMd({
        projectName: 'test-project',
        prefix: 'TEST',
        timestamp: '2026-01-01T00:00:00Z',
      });
      expect(content).toContain('test-project');
      expect(content).toContain('TEST');
      expect(content).not.toContain('{{project}}');
      expect(content).not.toContain('{{prefix}}');
    });

    it('loads story template', () => {
      const content = storyTemplate();
      expect(content).toContain('{ID}');
      expect(content).toContain('{TITLE}');
      expect(content).toContain('status: "draft"');
    });

    it('loads retrospective template', () => {
      const content = retrospectiveTemplate();
      expect(content).toContain('{STORY_ID}');
      expect(content).toContain('What Went Well');
      expect(content).toContain('Knowledge to Preserve');
    });

    it('loads knowledge item template', () => {
      const content = knowledgeItemTemplate();
      expect(content).toContain('{DIMENSION}');
      expect(content).toContain('{SCOPE}');
      expect(content).toContain('Recommendation');
    });
  });

  describe('quality gate templates', () => {
    it('loads definition of ready', () => {
      const content = definitionOfReadyYaml();
      expect(content).toContain('dor-1');
      expect(content).toContain('Problem statement');
    });

    it('loads definition of done', () => {
      const content = definitionOfDoneYaml();
      expect(content).toContain('dod-1');
      expect(content).toContain('bun test');
    });

    it('loads ways of working', () => {
      const content = waysOfWorkingYaml();
      expect(content).toContain('test-first');
      expect(content).toContain('knowledge_extraction');
    });
  });

  describe('skill templates', () => {
    it('loads all 7 skill templates', () => {
      for (const name of SKILL_NAMES) {
        const templateFn = SKILL_TEMPLATES[name];
        expect(templateFn).toBeDefined();
        const content = templateFn!();
        expect(content).toContain(`name: ${name}`);
        expect(content).toContain('description');
        expect(content.startsWith('---\n')).toBe(true);
      }
    });

    it('skill templates contain CLI command references', () => {
      const ideate = SKILL_TEMPLATES['swarm-ideate']!();
      expect(ideate).toContain('next-id');
      expect(ideate).toContain('validate');

      const plan = SKILL_TEMPLATES['swarm-plan']!();
      expect(plan).toContain('validate');
      expect(plan).toContain('transition');

      const execute = SKILL_TEMPLATES['swarm-execute']!();
      expect(execute).toContain('transition');
      expect(execute).toContain('list');

      const verify = SKILL_TEMPLATES['swarm-verify']!();
      expect(verify).toContain('validate');
      expect(verify).toContain('transition');

      const close = SKILL_TEMPLATES['swarm-close']!();
      expect(close).toContain('extract-knowledge');
      expect(close).toContain('transition');

      const retro = SKILL_TEMPLATES['swarm-retro']!();
      expect(retro).toContain('extract-knowledge');
      expect(retro).toContain('list');

      const run = SKILL_TEMPLATES['swarm-run']!();
      expect(run).toContain('transition');
      expect(run).toContain('validate');
    });
  });

  describe('agent templates', () => {
    it('loads all 6 agent templates', () => {
      for (const name of AGENT_NAMES) {
        const templateFn = AGENT_TEMPLATES[name];
        expect(templateFn).toBeDefined();
        const content = templateFn!();
        expect(content).toContain(`name: ${name}`);
        expect(content).toContain('Mini-Retrospective');
        expect(content.startsWith('---\n')).toBe(true);
      }
    });
  });
});
