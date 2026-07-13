import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('E2E CLI tests', () => {
  const cliPath = path.resolve(__dirname, '../dist/cli/index.js');
  const tmpInit = path.join(__dirname, 'tmp-e2e-init');
  const tmpGen = path.join(__dirname, 'tmp-e2e-gen');
  const tmpWorkflow = path.join(__dirname, 'tmp-e2e-workflow-go');
  const fixtureSpec = path.resolve(__dirname, 'fixtures', 'api.yaml');

  beforeAll(() => {
    [tmpInit, tmpGen, tmpWorkflow].forEach((dir) => {
      if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
    });
  });

  afterAll(() => {
    [tmpInit, tmpGen, tmpWorkflow].forEach((dir) => {
      if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
    });
  });

  const runCli = (args: string[]) => {
    const res = spawnSync('node', [cliPath, ...args], { encoding: 'utf8' });
    if (res.error && (res.error as NodeJS.ErrnoException).code === 'EPERM') {
      // Some sandboxed Windows environments block child process spawning in tests.
      return null;
    }
    if (res.error) {
      throw res.error;
    }
    return res;
  };

  it('whoami prints not authenticated', () => {
    const res = runCli(['whoami']);
    if (!res) return;
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('Not authenticated');
  });

  it('init command scaffolds project', () => {
    const res = runCli(['init', '--template', 'openapi', '--output', tmpInit]);
    if (!res) return;
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('Project created');
    expect(fs.existsSync(tmpInit)).toBe(true);
    // Expect specs folder and api.yaml
    const specPath = path.join(tmpInit, 'specs', 'api.yaml');
    expect(fs.existsSync(specPath)).toBe(true);
  });

  it('validate valid spec', () => {
    const res = runCli(['validate', fixtureSpec]);
    if (!res) return;
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('Specification is valid');
  });

  it('validate missing spec exits with error', () => {
    const missing = 'does-not-exist.yaml';
    const res = runCli(['validate', missing]);
    if (!res) return;
    expect(res.status).toBe(1);
    expect(res.stdout).toContain('Specification not found');
  });

  it('generate SDK produces output', () => {
    const res = runCli([
      'generate',
      '--spec',
      fixtureSpec,
      '--language',
      'typescript',
      '--output',
      tmpGen,
    ]);
    if (!res) return;
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('SDK generated');
    expect(fs.existsSync(tmpGen)).toBe(true);
    // Expect at least one file in output dir
    const files = fs.readdirSync(tmpGen);
    expect(files.length).toBeGreaterThan(0);
  });

  it('doctor returns JSON health report', () => {
    const res = runCli(['doctor', '--spec', fixtureSpec, '--json']);
    if (!res) return;
    expect(res.status).toBe(0);
    const report = JSON.parse(res.stdout);
    expect(report.ok).toBe(true);
    expect(report.checks.some((check: any) => check.name === 'spec')).toBe(true);
  });

  it('workflow dry-run validates without writing output', () => {
    const res = runCli([
      'workflow',
      '--spec',
      fixtureSpec,
      '--language',
      'go',
      '--output',
      tmpWorkflow,
      '--dry-run',
      '--json',
    ]);
    if (!res) return;
    expect(res.status).toBe(0);
    const report = JSON.parse(res.stdout);
    expect(report.ok).toBe(true);
    expect(report.dryRun).toBe(true);
    expect(fs.existsSync(tmpWorkflow)).toBe(false);
  });

  it('workflow generates Go output', () => {
    const res = runCli([
      'workflow',
      '--spec',
      fixtureSpec,
      '--language',
      'go',
      '--output',
      tmpWorkflow,
    ]);
    if (!res) return;
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('Workflow complete');
    expect(fs.existsSync(path.join(tmpWorkflow, 'client.go'))).toBe(true);
    expect(fs.existsSync(path.join(tmpWorkflow, 'types.go'))).toBe(true);
  });
});
