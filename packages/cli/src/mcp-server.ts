#!/usr/bin/env bun
/**
 * Minimal MCP server for SWARM SDLC.
 *
 * Implements JSON-RPC 2.0 over stdio (newline-delimited JSON).
 * Exposes SWARM enforcement commands as MCP tools so plugin skills
 * can call them without needing to know the CLI path.
 *
 * No external MCP SDK dependency — just ~200 lines of protocol handling.
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import {
  commandExtractKnowledge,
  commandList,
  commandNextId,
  commandTransition,
  commandValidate,
} from './commands';
import { SwarmInstaller } from './installer';

// ---------------------------------------------------------------------------
// JSON-RPC types
// ---------------------------------------------------------------------------

interface JsonRpcRequest {
  jsonrpc: '2.0';
  id?: string | number;
  method: string;
  params?: Record<string, unknown>;
}

interface JsonRpcResponse {
  jsonrpc: '2.0';
  id: string | number | null;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

// ---------------------------------------------------------------------------
// MCP tool definitions
// ---------------------------------------------------------------------------

const TOOLS = [
  {
    name: 'swarm_init',
    description:
      'Initialize SWARM SDLC in a project directory. Creates .swarm/ structure, quality gates, templates, and agent memory files.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        project_dir: {
          type: 'string',
          description: 'Absolute path to the project directory to initialize SWARM in (required)',
        },
        prefix: {
          type: 'string',
          description: 'Story ID prefix (optional, defaults to project name uppercase)',
        },
        dry_run: {
          type: 'boolean',
          description: 'Preview what would be created without doing it (default: false)',
        },
      },
      required: ['project_dir'],
    },
  },
  {
    name: 'swarm_validate',
    description:
      'Validate a SWARM story file. Checks frontmatter structure, required fields, and returns story metadata.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        path: {
          type: 'string',
          description: 'Absolute path to the story .md file to validate',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'swarm_transition',
    description:
      'Check if a story status transition is allowed. Validates both structural transitions and semantic preconditions.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        path: {
          type: 'string',
          description: 'Absolute path to the story .md file',
        },
        target_status: {
          type: 'string',
          description:
            'Target status to transition to (e.g., ideating, planned, executing, verifying, done, archived)',
        },
      },
      required: ['path', 'target_status'],
    },
  },
  {
    name: 'swarm_next_id',
    description:
      'Get the next story ID by reading and incrementing the counter in the SWARM config file.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        config_path: {
          type: 'string',
          description: 'Absolute path to .swarm/config.md',
        },
      },
      required: ['config_path'],
    },
  },
  {
    name: 'swarm_list',
    description:
      'List stories or knowledge items in a directory. Reads frontmatter from all .md files and optionally filters by status.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        directory: {
          type: 'string',
          description:
            'Absolute path to the directory to list (e.g., .swarm/backlog or .swarm/knowledge)',
        },
        status: {
          type: 'string',
          description: 'Optional status filter',
        },
      },
      required: ['directory'],
    },
  },
  {
    name: 'swarm_extract_knowledge',
    description:
      'Extract knowledge items from a retrospective file. Parses the retro body, classifies items by E/Q/P dimension, and writes knowledge files.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        retro_path: {
          type: 'string',
          description: 'Absolute path to the retrospective .md file',
        },
        story_id: {
          type: 'string',
          description: 'Story ID for the knowledge items (optional if present in frontmatter)',
        },
        repo: {
          type: 'string',
          description: 'Repository name (optional if present in frontmatter)',
        },
      },
      required: ['retro_path'],
    },
  },
  {
    name: 'swarm_status',
    description:
      'Check SWARM initialization status in a project directory. Returns which .swarm/ files and directories exist.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        project_dir: {
          type: 'string',
          description: 'Absolute path to the project directory to check',
        },
      },
      required: ['project_dir'],
    },
  },
];

// ---------------------------------------------------------------------------
// Tool handlers
// ---------------------------------------------------------------------------

async function handleToolCall(
  name: string,
  args: Record<string, unknown>
): Promise<{ content: Array<{ type: string; text: string }>; isError?: boolean }> {
  switch (name) {
    case 'swarm_init': {
      const projectDir = args.project_dir as string;
      const prefix = args.prefix as string | undefined;
      const dryRun = (args.dry_run as boolean) ?? false;

      const installer = new SwarmInstaller({ projectDir, prefix, dryRun });
      const results = await installer.install();
      const report = installer.report(results);

      return { content: [{ type: 'text', text: report }] };
    }

    case 'swarm_validate': {
      const result = commandValidate(args.path as string);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        isError: !result.ok,
      };
    }

    case 'swarm_transition': {
      const result = commandTransition(args.path as string, args.target_status as string);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        isError: !result.ok,
      };
    }

    case 'swarm_next_id': {
      const result = commandNextId(args.config_path as string);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        isError: !result.ok,
      };
    }

    case 'swarm_list': {
      const statusArgs: string[] = [];
      if (args.status) {
        statusArgs.push('--status', args.status as string);
      }
      const result = commandList(args.directory as string, statusArgs);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        isError: !result.ok,
      };
    }

    case 'swarm_extract_knowledge': {
      const extraArgs: string[] = [];
      if (args.story_id) {
        extraArgs.push('--story-id', args.story_id as string);
      }
      if (args.repo) {
        extraArgs.push('--repo', args.repo as string);
      }
      const result = commandExtractKnowledge(args.retro_path as string, extraArgs);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        isError: !result.ok,
      };
    }

    case 'swarm_status': {
      const projectDir = args.project_dir as string;
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

      const status: Record<string, boolean> = {};
      let allPresent = true;
      for (const check of checks) {
        const present = existsSync(join(projectDir, check));
        status[check] = present;
        if (!present) allPresent = false;
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ initialized: allPresent, checks: status }, null, 2),
          },
        ],
      };
    }

    default:
      return {
        content: [{ type: 'text', text: `Unknown tool: ${name}` }],
        isError: true,
      };
  }
}

// ---------------------------------------------------------------------------
// JSON-RPC message handling
// ---------------------------------------------------------------------------

function makeResponse(id: string | number | null, result: unknown): JsonRpcResponse {
  return { jsonrpc: '2.0', id, result };
}

function makeError(id: string | number | null, code: number, message: string): JsonRpcResponse {
  return { jsonrpc: '2.0', id, error: { code, message } };
}

async function handleMessage(msg: JsonRpcRequest): Promise<JsonRpcResponse | null> {
  const id = msg.id ?? null;

  switch (msg.method) {
    case 'initialize':
      return makeResponse(id, {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: {
          name: 'swarm-sdlc',
          version: '0.2.0',
        },
      });

    case 'notifications/initialized':
      // No response needed for notifications
      return null;

    case 'tools/list':
      return makeResponse(id, { tools: TOOLS });

    case 'tools/call': {
      const params = msg.params as
        | { name: string; arguments?: Record<string, unknown> }
        | undefined;
      if (!params?.name) {
        return makeError(id, -32602, 'Missing tool name');
      }
      const toolResult = await handleToolCall(params.name, params.arguments ?? {});
      return makeResponse(id, toolResult);
    }

    case 'ping':
      return makeResponse(id, {});

    default:
      return makeError(id, -32601, `Method not found: ${msg.method}`);
  }
}

// ---------------------------------------------------------------------------
// stdio transport
// ---------------------------------------------------------------------------

function send(msg: JsonRpcResponse): void {
  process.stdout.write(`${JSON.stringify(msg)}\n`);
}

const rl = createInterface({ input: process.stdin, terminal: false });

rl.on('line', async (line: string) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  let request: JsonRpcRequest;
  try {
    request = JSON.parse(trimmed) as JsonRpcRequest;
  } catch {
    send(makeError(null, -32700, 'Parse error'));
    return;
  }

  const response = await handleMessage(request);
  if (response) {
    send(response);
  }
});

rl.on('close', () => {
  process.exit(0);
});
