import * as fs from 'fs';
import * as path from 'path';
import {
  prepareOutputDirectory,
  resolveSpecPath,
  safeWriteGeneratedFile,
} from '../src/core/pathSafety';

describe('path safety guards', () => {
  const tmpDir = path.resolve(__dirname, 'tmp-path-safety');
  const outsideDir = path.resolve(process.cwd(), '..', 'tmp-path-safety-outside');

  beforeEach(() => {
    [tmpDir, outsideDir].forEach((dir) => {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    });
    fs.mkdirSync(tmpDir, { recursive: true });
  });

  afterEach(() => {
    [tmpDir, outsideDir].forEach((dir) => {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    });
  });

  it('blocks spec path outside project by default', () => {
    fs.mkdirSync(outsideDir, { recursive: true });
    const outsideSpec = path.join(outsideDir, 'api.yaml');
    fs.writeFileSync(outsideSpec, 'openapi: "3.0.0"');

    expect(() => resolveSpecPath(outsideSpec)).toThrow('outside project root');
  });

  it('allows spec path outside project with explicit override', () => {
    fs.mkdirSync(outsideDir, { recursive: true });
    const outsideSpec = path.join(outsideDir, 'api.yaml');
    fs.writeFileSync(outsideSpec, 'openapi: "3.0.0"');

    expect(resolveSpecPath(outsideSpec, { allowOutsideProject: true })).toBe(
      fs.realpathSync(outsideSpec)
    );
  });

  it('blocks output directory outside project by default', async () => {
    await expect(prepareOutputDirectory(outsideDir)).rejects.toThrow('outside project root');
  });

  it('allows outside output with explicit override', async () => {
    const prepared = await prepareOutputDirectory(outsideDir, { allowOutsideProject: true });
    await safeWriteGeneratedFile(prepared.outputDir, 'client.ts', 'export const ok = true;');

    expect(fs.existsSync(path.join(outsideDir, 'client.ts'))).toBe(true);
  });

  it('prevents generated file path traversal', async () => {
    const prepared = await prepareOutputDirectory(tmpDir);
    await expect(
      safeWriteGeneratedFile(prepared.outputDir, '../escape.txt', 'malicious')
    ).rejects.toThrow('traversal');
  });
});
