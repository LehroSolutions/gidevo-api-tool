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

  it('whoami prints not authenticated', () => {
    const res = spawnSync('node', [cliPath, 'whoami'], { encoding: 'utf8' });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('No Active Context');
  });

  it('init command scaffolds project', () => {
    const res = spawnSync('node', [cliPath, 'init', '--template', 'openapi', '--output', tmpInit], { encoding: 'utf8' });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('Project Architecture Synthesized');
    expect(fs.existsSync(tmpInit)).toBe(true);
    // Expect specs folder and api.yaml
    const specPath = path.join(tmpInit, 'specs', 'api.yaml');
    expect(fs.existsSync(specPath)).toBe(true);
  });

  it('validate valid spec', () => {
    const res = spawnSync('node', [cliPath, 'validate', fixtureSpec], { encoding: 'utf8' });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('Schema Integrity Verified');
  });

  it('validate missing spec exits with error', () => {
    const missing = 'does-not-exist.yaml';
    const res = spawnSync('node', [cliPath, 'validate', missing], { encoding: 'utf8' });
    expect(res.status).toBe(1);
    expect(res.stdout).toContain('Source Not Found');
  });

  it('generate SDK produces output', () => {
    const res = spawnSync(
      'node',
      [cliPath, 'generate', '--spec', fixtureSpec, '--language', 'typescript', '--output', tmpGen],
      { encoding: 'utf8' }
    );
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('Synthesis Complete');
    expect(fs.existsSync(tmpGen)).toBe(true);
    // Expect at least one file in output dir
    const files = fs.readdirSync(tmpGen);
    expect(files.length).toBeGreaterThan(0);
  });
});