import { describe, expect, it } from 'bun:test';
import { parseFrontmatter, serializeFrontmatter } from './parser';

describe('parseFrontmatter', () => {
  it('parses valid YAML frontmatter', () => {
    const content = `---
id: TEST-001
title: Test Story
status: ideating
---

## Body Content

Some text here.
`;
    const result = parseFrontmatter(content);
    expect(result).not.toBeNull();
    expect(result!.meta).toEqual({
      id: 'TEST-001',
      title: 'Test Story',
      status: 'ideating',
    });
    expect(result!.body).toContain('## Body Content');
    expect(result!.body).toContain('Some text here.');
  });

  it('returns null for content without frontmatter', () => {
    const content = '# Just a heading\n\nSome text.';
    const result = parseFrontmatter(content);
    expect(result).toBeNull();
  });

  it('returns null for content with unclosed frontmatter', () => {
    const content = '---\nid: test\ntitle: broken\n';
    const result = parseFrontmatter(content);
    expect(result).toBeNull();
  });

  it('returns null for empty YAML block', () => {
    const content = '---\n---\nBody.';
    const result = parseFrontmatter(content);
    expect(result).toBeNull();
  });

  it('handles complex nested YAML', () => {
    const content = `---
id: PROJ-001
acceptance_criteria:
  - id: AC-1
    description: "Test criterion"
    status: pending
tags:
  - backend
  - api
---

Body content.
`;
    const result = parseFrontmatter<{
      id: string;
      acceptance_criteria: { id: string; description: string; status: string }[];
      tags: string[];
    }>(content);
    expect(result).not.toBeNull();
    expect(result!.meta.id).toBe('PROJ-001');
    expect(result!.meta.acceptance_criteria).toHaveLength(1);
    expect(result!.meta.acceptance_criteria[0].id).toBe('AC-1');
    expect(result!.meta.tags).toEqual(['backend', 'api']);
  });
});

describe('serializeFrontmatter', () => {
  it('serializes metadata and body into markdown', () => {
    const meta = { id: 'TEST-001', title: 'Test Story', status: 'ideating' };
    const body = '## Body\n\nContent here.\n';
    const result = serializeFrontmatter(meta, body);

    expect(result).toStartWith('---\n');
    expect(result).toContain('id: TEST-001');
    expect(result).toContain('title: Test Story');
    expect(result).toContain('## Body');
  });

  it('roundtrips parse/serialize', () => {
    const original = {
      id: 'RT-001',
      title: 'Roundtrip Test',
      tags: ['a', 'b'],
    };
    const body = '## Test\n\nContent.\n';
    const serialized = serializeFrontmatter(original, body);
    const parsed = parseFrontmatter(serialized);

    expect(parsed).not.toBeNull();
    expect(parsed!.meta).toEqual(original);
    expect(parsed!.body).toBe(body);
  });
});
