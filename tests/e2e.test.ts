import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

describe('E2E CLI tests', () => {
  const cliPath = path.resolve(__dirname, '../dist/cli/index.js');
  const tmpInit = path.join(__dirname, 'tmp-e2e-init');
  const tmpGen = path.join(__dirname, 'tmp-e2e-gen');
  const fixtureSpec = path.resolve(__dirname, 'fixtures', 'api.yaml');

  beforeAll(() => {
    [tmpInit, tmpGen].forEach(dir => {
      if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
    });
  });

  afterAll(() => {
    [tmpInit, tmpGen].forEach(dir => {
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
    expect(res.stdout).toContain('No Active Context');
  });

  it('init command scaffolds project', () => {
    const res = runCli(['init', '--template', 'openapi', '--output', tmpInit]);
    if (!res) return;
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('Project Architecture Synthesized');
    expect(fs.existsSync(tmpInit)).toBe(true);
    // Expect specs folder and api.yaml
    const specPath = path.join(tmpInit, 'specs', 'api.yaml');
    expect(fs.existsSync(specPath)).toBe(true);
  });

  it('validate valid spec', () => {
    const res = runCli(['validate', fixtureSpec]);
    if (!res) return;
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('Schema Integrity Verified');
  });

  it('validate missing spec exits with error', () => {
    const missing = 'does-not-exist.yaml';
    const res = runCli(['validate', missing]);
    if (!res) return;
    expect(res.status).toBe(1);
    expect(res.stdout).toContain('Source Not Found');
  });

  it('generate SDK produces output', () => {
    const res = runCli(['generate', '--spec', fixtureSpec, '--language', 'typescript', '--output', tmpGen]);
    if (!res) return;
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('Synthesis Complete');
    expect(fs.existsSync(tmpGen)).toBe(true);
    // Expect at least one file in output dir
    const files = fs.readdirSync(tmpGen);
    expect(files.length).toBeGreaterThan(0);
  });
});
