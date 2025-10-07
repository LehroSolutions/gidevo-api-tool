import * as fs from 'fs';
import * as path from 'path';
import { generateCommand } from '../src/cli/commands/generate';

describe('CLI Generate Command', () => {
  const fixtureSpec = path.resolve(__dirname, 'fixtures', 'api.yaml');
  const tmpTs = path.resolve(__dirname, 'tmp-generate-ts');
  const tmpPy = path.resolve(__dirname, 'tmp-generate-py');

  beforeAll(() => {
    [tmpTs, tmpPy].forEach(dir => {
      if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
    });
  });

  it('generates TypeScript client', async () => {
    await generateCommand({ spec: fixtureSpec, language: 'typescript', output: tmpTs });
    expect(fs.existsSync(path.join(tmpTs, 'client.ts'))).toBe(true);
    expect(fs.existsSync(path.join(tmpTs, 'types.ts'))).toBe(true);
  });

  it('generates Python client', async () => {
    await generateCommand({ spec: fixtureSpec, language: 'python', output: tmpPy });
    expect(fs.existsSync(path.join(tmpPy, 'client.py'))).toBe(true);
  });
});
