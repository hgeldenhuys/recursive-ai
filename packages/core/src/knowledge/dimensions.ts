/**
 * E/Q/P taxonomy constants and utilities.
 *
 * Epistemology (E) = Patterns — reusable architectural/design patterns
 * Qualia (Q) = Pain Points — gotchas, pitfalls, surprises
 * Praxeology (P) = Best Practices — proven techniques and conventions
 */

import type { KnowledgeDimension, KnowledgeDomain } from '../types/knowledge';

/**
 * Keywords that suggest a particular dimension.
 * Used for automated classification of knowledge items.
 */
export const DIMENSION_KEYWORDS: Record<KnowledgeDimension, string[]> = {
  epistemology: [
    'pattern',
    'architecture',
    'design',
    'structure',
    'abstraction',
    'module',
    'interface',
    'decomposition',
    'composition',
    'separation',
    'layering',
    'encapsulation',
    'polymorphism',
    'factory',
    'strategy',
    'observer',
    'adapter',
    'singleton',
  ],
  qualia: [
    'gotcha',
    'pitfall',
    'surprise',
    'unexpected',
    'bug',
    'issue',
    'problem',
    'workaround',
    'hack',
    'caveat',
    'warning',
    'careful',
    'trap',
    'edge case',
    'subtle',
    'confusing',
    'misleading',
    'broken',
  ],
  praxeology: [
    'best practice',
    'convention',
    'standard',
    'recommend',
    'should',
    'always',
    'never',
    'prefer',
    'avoid',
    'technique',
    'approach',
    'method',
    'workflow',
    'guideline',
    'rule',
    'practice',
    'proven',
    'effective',
  ],
};

/**
 * Keywords that suggest a knowledge domain.
 */
export const DOMAIN_KEYWORDS: Record<KnowledgeDomain, string[]> = {
  frontend: [
    'react',
    'component',
    'ui',
    'css',
    'style',
    'hook',
    'state',
    'render',
    'dom',
    'browser',
    'responsive',
  ],
  backend: [
    'api',
    'server',
    'database',
    'endpoint',
    'service',
    'middleware',
    'route',
    'query',
    'sql',
    'rest',
    'graphql',
  ],
  devops: [
    'deploy',
    'ci',
    'cd',
    'docker',
    'kubernetes',
    'pipeline',
    'infrastructure',
    'monitor',
    'log',
    'container',
  ],
  architecture: [
    'architecture',
    'design',
    'schema',
    'migration',
    'scale',
    'performance',
    'microservice',
    'monolith',
  ],
  testing: [
    'test',
    'spec',
    'assert',
    'mock',
    'stub',
    'fixture',
    'coverage',
    'integration',
    'unit',
    'e2e',
  ],
  process: [
    'workflow',
    'process',
    'agile',
    'sprint',
    'retrospective',
    'standup',
    'review',
    'planning',
  ],
  documentation: ['doc', 'readme', 'comment', 'jsdoc', 'typedoc', 'changelog', 'guide', 'api doc'],
  security: [
    'auth',
    'security',
    'permission',
    'token',
    'jwt',
    'oauth',
    'encrypt',
    'vulnerability',
    'cors',
    'csrf',
  ],
};

/**
 * Score text against dimension keywords to suggest a classification.
 */
export function suggestDimension(text: string): KnowledgeDimension {
  const lower = text.toLowerCase();
  let bestDimension: KnowledgeDimension = 'praxeology';
  let bestScore = 0;

  const dimensions: KnowledgeDimension[] = ['epistemology', 'qualia', 'praxeology'];
  for (const dim of dimensions) {
    let score = 0;
    for (const keyword of DIMENSION_KEYWORDS[dim]) {
      if (lower.includes(keyword)) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestDimension = dim;
    }
  }

  return bestDimension;
}

/**
 * Score text against domain keywords to suggest a domain.
 */
export function suggestDomain(text: string): KnowledgeDomain {
  const lower = text.toLowerCase();
  let bestDomain: KnowledgeDomain = 'backend';
  let bestScore = 0;

  const domains: KnowledgeDomain[] = [
    'frontend',
    'backend',
    'devops',
    'architecture',
    'testing',
    'process',
    'documentation',
    'security',
  ];
  for (const domain of domains) {
    let score = 0;
    for (const keyword of DOMAIN_KEYWORDS[domain]) {
      if (lower.includes(keyword)) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestDomain = domain;
    }
  }

  return bestDomain;
}
