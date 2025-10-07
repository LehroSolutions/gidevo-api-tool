import { pluginCommand } from '../src/cli/commands/plugin';
import * as path from 'path';
import { loadPlugins } from '../src/plugins/plugin';

jest.mock('../src/plugins/plugin');
const mockLoad = loadPlugins as jest.MockedFunction<typeof loadPlugins>;

describe('pluginCommand', () => {
  const fixtureSpec = path.resolve('tests', 'fixtures', 'api.yaml');
  let exitSpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => { throw new Error('process.exit'); }) as any);
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    mockLoad.mockReset();
  });

  afterEach(() => {
    exitSpy.mockRestore();
    logSpy.mockRestore();
  });

  it('runs existing plugin successfully', async () => {
    const fakePlugin: any = { name: 'SpecLint', run: jest.fn().mockResolvedValue(true), initialize: jest.fn() };
    mockLoad.mockReturnValue([fakePlugin]);
    await pluginCommand('SpecLint', ['arg1']);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Running plugin')); 
    expect(fakePlugin.run).toHaveBeenCalledWith('arg1');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('completed successfully'));
  });

  it('exits on unknown plugin', async () => {
    mockLoad.mockReturnValue([]);
    await expect(pluginCommand('Unknown', [])).rejects.toThrow('process.exit');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Plugin not found')); 
  });
});