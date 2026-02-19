/**
 * Knowledge extractor.
 *
 * Parses retrospective markdown for learnings and generates
 * structured KnowledgeItem objects with E/Q/P classification.
 */

import type {
  Confidence,
  HierarchyScope,
  KnowledgeDimension,
  KnowledgeDomain,
  KnowledgeItem,
} from '../types/knowledge';
import { suggestDimension, suggestDomain } from './dimensions';

export interface ExtractionContext {
  storyId: string;
  repoName: string;
  author: string;
  existingIds: string[]; // For generating sequential IDs
}

export interface RawLearning {
  text: string;
  section: string; // Which retrospective section it came from
  agent?: string; // Which agent reported it
}

/**
 * Extract raw learnings from retrospective markdown body.
 */
export function extractRawLearnings(body: string): RawLearning[] {
  const learnings: RawLearning[] = [];
  const lines = body.split('\n');

  let currentSection = '';
  let currentAgent = '';

  for (const line of lines) {
    const trimmed = line.trim();

    // Track section headers
    if (trimmed.startsWith('## ')) {
      currentSection = trimmed.slice(3).trim();
      currentAgent = '';
      continue;
    }

    // Track agent sub-headers
    if (trimmed.startsWith('### ')) {
      currentAgent = trimmed.slice(4).trim();
      continue;
    }

    // Extract bullet point learnings
    if (trimmed.startsWith('- ') && trimmed.length > 4) {
      const text = trimmed.slice(2).trim();
      // Skip placeholder text
      if (text.startsWith('[') && text.endsWith(']')) continue;
      if (text === '') continue;

      learnings.push({
        text,
        section: currentSection,
        agent: currentAgent || undefined,
      });
    }
  }

  return learnings;
}

/**
 * Determine the scope of a learning based on content analysis.
 */
function assessScope(text: string, section: string): HierarchyScope {
  const lower = text.toLowerCase();

  // Enterprise-level patterns
  if (
    lower.includes('enterprise') ||
    lower.includes('organization') ||
    lower.includes('company-wide')
  ) {
    return 'enterprise';
  }

  // Department-level
  if (lower.includes('department') || lower.includes('cross-team')) {
    return 'department';
  }

  // Team-level — patterns that apply beyond a single repo
  if (
    lower.includes('team') ||
    lower.includes('convention') ||
    lower.includes('standard') ||
    lower.includes('always') ||
    lower.includes('never')
  ) {
    return 'team';
  }

  // Default to repo-level
  return 'repo';
}

/**
 * Assess confidence based on the content and context.
 */
function assessConfidence(text: string, section: string): Confidence {
  const lower = text.toLowerCase();

  if (lower.includes('proven') || lower.includes('confirmed') || lower.includes('consistently')) {
    return 'high';
  }

  if (lower.includes('might') || lower.includes('possibly') || lower.includes('unclear')) {
    return 'low';
  }

  return 'medium';
}

/**
 * Generate the next knowledge item ID.
 */
function nextId(existingIds: string[]): string {
  let maxNum = 0;
  for (const id of existingIds) {
    const match = id.match(/K-(\d+)/);
    if (match) {
      const num = Number.parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  return `K-${String(maxNum + 1).padStart(3, '0')}`;
}

/**
 * Extract tags from text.
 */
function extractTags(text: string): string[] {
  const tags: string[] = [];
  const lower = text.toLowerCase();

  // Look for technology mentions
  const techPatterns = [
    'typescript',
    'javascript',
    'react',
    'bun',
    'node',
    'sql',
    'sqlite',
    'postgres',
    'docker',
    'kubernetes',
    'css',
    'html',
    'graphql',
    'rest',
    'api',
    'jwt',
    'oauth',
  ];

  for (const tech of techPatterns) {
    if (lower.includes(tech)) {
      tags.push(tech);
    }
  }

  return tags;
}

/**
 * Transform raw learnings into structured KnowledgeItem objects.
 */
export function transformLearnings(
  rawLearnings: RawLearning[],
  ctx: ExtractionContext
): KnowledgeItem[] {
  const items: KnowledgeItem[] = [];
  const usedIds = [...ctx.existingIds];

  for (const learning of rawLearnings) {
    const id = nextId(usedIds);
    usedIds.push(id);

    const dimension = suggestDimension(learning.text);
    const domain = suggestDomain(learning.text);
    const scope = assessScope(learning.text, learning.section);
    const confidence = assessConfidence(learning.text, learning.section);
    const tags = extractTags(learning.text);

    const item: KnowledgeItem = {
      id,
      source_story: ctx.storyId,
      source_repo: ctx.repoName,
      created: new Date().toISOString(),
      author: learning.agent || ctx.author,
      dimension,
      scope,
      hoistable: scope !== 'repo',
      hoisted_to: null,
      hoisted_at: null,
      confidence,
      tags,
      domain,
      title: learning.text.slice(0, 80),
      description: learning.text,
      context: `From ${learning.section} section of ${ctx.storyId} retrospective`,
      recommendation: learning.text,
      supersedes: null,
      ttl: null,
    };

    items.push(item);
  }

  return items;
}

/**
 * Full extraction pipeline: parse retrospective → extract learnings → generate items.
 */
export function extractKnowledge(retroBody: string, ctx: ExtractionContext): KnowledgeItem[] {
  const rawLearnings = extractRawLearnings(retroBody);
  return transformLearnings(rawLearnings, ctx);
}
