export type DomainName = 'file-io' | 'web-ui' | 'security' | 'mcp-skill';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type RunStatus = 'queued' | 'running' | 'passed' | 'failed';

export type ScoringRubricItem = {
  name: string;
  weight: number;
};

export type TestCase = {
  id: string;
  domain: DomainName;
  title: string;
  objective: string;
  difficulty: Difficulty;
  inputSchema: Record<string, unknown>;
  expectedSignals: string[];
  scoringRubric: ScoringRubricItem[];
  fixtureIds: string[];
};

export type FixtureAsset = {
  id: string;
  domain: DomainName;
  name: string;
  kind: 'document' | 'web-page' | 'prompt' | 'resource';
  description: string;
  mimeType: string;
};

export type TestDomain = {
  name: DomainName;
  goals: string[];
  sampleCase: string;
};

export type TestCasesPayload = {
  version: string;
  domains: TestDomain[];
  cases: TestCase[];
};

export type RunRecord = {
  id: string;
  testCaseId: string;
  status: RunStatus;
  startedAt?: string;
  finishedAt?: string;
  score?: number;
  agentOutput?: string;
  evaluatorNotes?: string[];
  input: Record<string, unknown>;
};

export type CreateRunRequest = {
  testCaseId: string;
  input?: Record<string, unknown>;
};

export type AgentAccessManifest = {
  mcp: {
    enabled: boolean;
    resources: string[];
    auth: string;
  };
  skill: {
    enabled: boolean;
    examples: string[];
    fallback: string;
  };
};
