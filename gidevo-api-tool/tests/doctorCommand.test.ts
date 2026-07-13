import { jest } from '@jest/globals';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { doctorCommand } from '../src/cli/commands/doctor.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('doctorCommand', () => {
  const fixtureSpec = path.resolve(__dirname, 'fixtures', 'api.yaml');
  let logSpy: jest.SpiedFunction<typeof console.log>;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('prints JSON project health report', async () => {
    await doctorCommand({ spec: fixtureSpec, json: true });
    const report = JSON.parse(String(logSpy.mock.calls.at(-1)?.[0]));
    expect(report.ok).toBe(true);
    expect(report.checks.some((check: any) => check.name === 'node')).toBe(true);
    expect(report.checks.some((check: any) => check.name === 'spec')).toBe(true);
  });
});
