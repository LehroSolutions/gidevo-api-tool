import * as fs from 'fs';
import * as path from 'path';
import { clearConfigCache, loadConfig, loadConfigFile } from '../src/cli/utils/config';

describe('config utils security + validation', () => {
  const tmpDir = path.resolve(__dirname, 'tmp-config-utils');

  beforeEach(() => {
    clearConfigCache();
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tmpDir, { recursive: true });
  });

  afterEach(() => {
    clearConfigCache();
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('rejects JavaScript config files', () => {
    const configPath = path.join(tmpDir, 'gidevo.config.js');
    fs.writeFileSync(configPath, 'module.exports = {};');

    expect(() => loadConfigFile(configPath)).toThrow('JavaScript config files');
  });

  it('validates config schema and rejects invalid language', () => {
    const configPath = path.join(tmpDir, '.gidevorc.json');
    fs.writeFileSync(configPath, JSON.stringify({ generate: { language: 'ruby' } }, null, 2));

    expect(() => loadConfigFile(configPath)).toThrow('Config schema validation failed');
  });

  it('falls back to empty config when schema validation fails', () => {
    const configPath = path.join(tmpDir, '.gidevorc.json');
    fs.writeFileSync(configPath, JSON.stringify({ generate: { language: 'ruby' } }, null, 2));

    const config = loadConfig(tmpDir);
    expect(config).toEqual({});
  });

  it('loads valid config with allowOutsideProject', () => {
    const configPath = path.join(tmpDir, '.gidevorc.json');
    fs.writeFileSync(
      configPath,
      JSON.stringify(
        {
          generate: {
            language: 'go',
            output: './generated',
            allowOutsideProject: true,
          },
        },
        null,
        2
      )
    );

    const config = loadConfig(tmpDir);
    expect(config.generate?.language).toBe('go');
    expect(config.generate?.allowOutsideProject).toBe(true);
  });
});
