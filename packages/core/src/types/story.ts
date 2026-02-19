/**
 * SWARM story metadata types.
 *
 * TypeScript interfaces for all YAML frontmatter structures used in
 * SWARM story files, config, and retrospectives.
 */

// --- Enum-like string literal unions ---

export type StoryStatus =
  | 'draft'
  | 'ideating'
  | 'planned'
  | 'executing'
  | 'verifying'
  | 'done'
  | 'archived'
  | 'awaiting_input';

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export type Complexity = 'trivial' | 'simple' | 'moderate' | 'complex' | 'epic';

export type ACStatus = 'pending' | 'passing' | 'failing';

export type TaskStatus = 'pending' | 'in_progress' | 'done' | 'skipped';

// --- Nested structures ---

export interface AcceptanceCriterion {
  id: string;
  description: string;
  status: ACStatus;
  evidence: string;
}

export interface Task {
  id: string;
  title: string;
  agent: string;
  status: TaskStatus;
  depends_on: string[];
  effort_estimate: string;
  ac_coverage: string[];
}

export interface Execution {
  started_at: string | null;
  completed_at: string | null;
  task_list_id: string | null;
  session_ids: string[];
}

export interface Why {
  problem: string;
  root_cause: string;
  impact: string;
}

// --- Top-level frontmatter types ---

export interface StoryMeta {
  id: string;
  title: string;
  status: StoryStatus;
  priority: Priority;
  complexity: Complexity;
  created: string;
  updated: string;
  author: string;
  tags: string[];
  acceptance_criteria: AcceptanceCriterion[];
  tasks: Task[];
  execution: Execution;
  why: Why;
}

export interface ConfigMeta {
  project: string;
  prefix: string;
  counter: number;
  definition_of_ready: string[];
  definition_of_done: string[];
  ways_of_working: Record<string, string | number | boolean>;
  // SWARM additions
  hierarchy?: {
    level: string;
    team?: string;
    department?: string;
  };
}

export interface KnowledgeReference {
  id: string;
  dimension: string;
  title: string;
}

export interface StoryMetrics {
  tasks_total: number;
  tasks_completed: number;
  acs_total: number;
  acs_passing: number;
  files_changed: number;
  tests_added: number;
  cycle_time_hours: number;
}

export interface RetroMeta {
  story_id: string;
  title: string;
  completed: string;
  duration: string;
  agents_involved: string[];
  repo: string;
  team?: string;
  // SWARM additions
  knowledge_extracted: KnowledgeReference[];
  metrics: StoryMetrics;
}

// --- Index types ---

export interface ACSummary {
  total: number;
  passing: number;
  failing: number;
  pending: number;
}

export interface TaskSummary {
  total: number;
  done: number;
  in_progress: number;
  pending: number;
}

export interface StoryIndexEntry {
  id: string;
  title: string;
  status: string;
  priority: string;
  complexity: string;
  created: string;
  updated: string;
  tags: string[];
  source: 'backlog' | 'archive';
  ac_summary: ACSummary;
  task_summary: TaskSummary;
}

// --- Headless question/answer types ---

export interface SwarmQuestionOption {
  label: string;
  description?: string;
}

export interface SwarmQuestion {
  id: string;
  question: string;
  type: 'freetext' | 'choice';
  header?: string;
  options?: SwarmQuestionOption[];
  multiSelect?: boolean;
  answer?: string | string[];
}

export interface SwarmQuestionFile {
  story_id: string;
  phase: 'ideate' | 'plan';
  status: 'pending' | 'answered';
  created: string;
  answered_at?: string;
  questions: SwarmQuestion[];
}
