import { spawnSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

describe('--no-spinner flag', () => {
  const cliPath = path.resolve(__dirname, '../dist/cli/index.js');
  const tmpDir = path.join(__dirname, 'tmp-no-spinner');
  const spec = path.resolve(__dirname, 'fixtures', 'api.yaml');

  beforeAll(() => {
    if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
  });
  afterAll(() => {
    if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('respects --no-spinner for generate', () => {
    const res = spawnSync('node', [cliPath, 'generate', '--no-spinner', '--spec', spec, '--language', 'typescript', '--output', tmpDir], { encoding: 'utf8' });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('✅ Generation completed successfully!');
  });
});
