import * as fs from 'fs';
import * as path from 'path';
import { loadPlugins } from '../src/plugins/plugin';

describe('plugin loader hardening', () => {
  const tmpDir = path.resolve(__dirname, 'tmp-plugin-loader');
  const outsideDir = path.resolve(__dirname, 'tmp-plugin-loader-outside');

  beforeEach(() => {
    [tmpDir, outsideDir].forEach((dir) => {
      if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
      fs.mkdirSync(dir, { recursive: true });
    });
  });

  afterEach(() => {
    [tmpDir, outsideDir].forEach((dir) => {
      if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
    });
  });

  it('loads valid JS plugins and ignores non-js files', () => {
    fs.writeFileSync(
      path.join(tmpDir, 'safe.js'),
      `module.exports = { name: 'SafePlugin', initialize: () => {}, run: async () => true };`
    );
    fs.writeFileSync(path.join(tmpDir, 'ignored.txt'), 'nope');

    const plugins = loadPlugins(tmpDir);
    expect(plugins.some((p) => p.name === 'SafePlugin')).toBe(true);
    expect(plugins.some((p) => p.name === 'ignored')).toBe(false);
  });

  it('ignores symlinked plugin files', () => {
    fs.writeFileSync(
      path.join(outsideDir, 'evil.js'),
      `module.exports = { name: 'EvilPlugin', initialize: () => {}, run: async () => true };`
    );

    const symlinkPath = path.join(tmpDir, 'evil.js');
    let symlinkCreated = false;
    try {
      fs.symlinkSync(path.join(outsideDir, 'evil.js'), symlinkPath);
      symlinkCreated = true;
    } catch {
      // Windows environments without symlink permissions may not allow this.
      symlinkCreated = false;
    }

    const plugins = loadPlugins(tmpDir);
    if (symlinkCreated) {
      expect(plugins.some((p) => p.name === 'EvilPlugin')).toBe(false);
    } else {
      expect(Array.isArray(plugins)).toBe(true);
    }
  });
});
