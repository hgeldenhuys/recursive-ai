/**
 * SWARM frontmatter parser and serializer.
 *
 * Parses YAML frontmatter from SWARM markdown files (stories, config,
 * retrospectives, knowledge items) and serializes typed objects back
 * into markdown with YAML frontmatter.
 */

import { parse, stringify } from 'yaml';

/**
 * Parse YAML frontmatter from a markdown string.
 *
 * Expects the content to start with `---\n`, followed by YAML, then
 * another `---\n` delimiter. Everything after the closing delimiter
 * is returned as the body.
 *
 * @param content - Raw markdown string with YAML frontmatter
 * @returns Parsed metadata and body, or null if no valid frontmatter found
 */
export function parseFrontmatter<T = Record<string, unknown>>(
  content: string
): { meta: T; body: string } | null {
  if (!content.startsWith('---')) {
    return null;
  }

  const closingIndex = content.indexOf('\n---', 3);
  if (closingIndex === -1) {
    return null;
  }

  const yamlBlock = content.slice(4, closingIndex);

  const afterClosing = closingIndex + 4;
  let body: string;
  if (afterClosing < content.length && content[afterClosing] === '\n') {
    body = content.slice(afterClosing + 1);
  } else {
    body = content.slice(afterClosing);
  }

  try {
    const meta = parse(yamlBlock) as T;
    if (meta === null || meta === undefined || typeof meta !== 'object') {
      return null;
    }
    return { meta, body };
  } catch {
    return null;
  }
}

/**
 * Serialize metadata and body back into a markdown string with YAML frontmatter.
 *
 * @param meta - Metadata object to serialize as YAML
 * @param body - Markdown body content
 * @returns Complete markdown string with `---\n{yaml}\n---\n{body}`
 */
export function serializeFrontmatter(meta: Record<string, unknown>, body: string): string {
  const yaml = stringify(meta, {
    lineWidth: 0,
  });
  return `---\n${yaml}---\n${body}`;
}
