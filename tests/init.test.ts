import * as fs from 'fs';
import * as path from 'path';
import { initCommand } from '../src/cli/commands/init.js';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('CLI Init Command', () => {
  const tmpDir = path.resolve(__dirname, 'tmp-init');

  beforeAll(() => {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('should initialize a new OpenAPI project', async () => {
    await initCommand({ template: 'openapi', output: tmpDir });
    expect(fs.existsSync(tmpDir)).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, 'package.json'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, 'specs', 'api.yaml'))).toBe(true);
  });
});
