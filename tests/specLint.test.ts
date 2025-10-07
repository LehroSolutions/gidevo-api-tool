import { loadPlugins } from '../src/plugins/plugin';
import path from 'path';

describe('SpecLint Plugin', () => {
  // Use dist/plugins after build so only .js files are loaded
  const pluginDir = path.resolve(__dirname, '../dist/plugins');
  const fixtureSpec = path.resolve(__dirname, 'fixtures', 'api.yaml');
  let plugin: any;

  beforeAll(() => {
    const plugins = loadPlugins(pluginDir);
    plugin = plugins.find(p => p.name === 'SpecLint');
  });

  it('loads SpecLint plugin', () => {
    expect(plugin).toBeDefined();
  });

  it('validates fixture spec without errors', async () => {
    const result = await plugin.run(fixtureSpec);
    expect(result).toBe(true);
  });
});
