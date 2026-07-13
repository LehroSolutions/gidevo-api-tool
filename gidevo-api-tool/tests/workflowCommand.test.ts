import { jest } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { workflowCommand } from '../src/cli/commands/workflow.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('workflowCommand', () => {
  const fixtureSpec = path.resolve(__dirname, 'fixtures', 'api.yaml');
  const tmpOutput = path.resolve(__dirname, 'tmp-workflow-dry-run');
  let logSpy: jest.SpiedFunction<typeof console.log>;

  beforeEach(() => {
    if (fs.existsSync(tmpOutput)) fs.rmSync(tmpOutput, { recursive: true, force: true });
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    if (fs.existsSync(tmpOutput)) fs.rmSync(tmpOutput, { recursive: true, force: true });
  });

  it('runs validate step in dry-run JSON mode without writing files', async () => {
    await workflowCommand({
      spec: fixtureSpec,
      language: 'typescript',
      output: tmpOutput,
      dryRun: true,
      json: true,
    });

    const report = JSON.parse(String(logSpy.mock.calls.at(-1)?.[0]));
    expect(report.ok).toBe(true);
    expect(report.dryRun).toBe(true);
    expect(
      report.steps.some((step: any) => step.name === 'validate' && step.status === 'pass')
    ).toBe(true);
    expect(fs.existsSync(tmpOutput)).toBe(false);
  });
});
