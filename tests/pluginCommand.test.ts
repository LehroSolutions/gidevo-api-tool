import { jest } from '@jest/globals';

const mockLoad = jest.fn();

jest.unstable_mockModule('../src/plugins/plugin.js', () => ({
  loadPlugins: mockLoad,
}));

const { pluginCommand } = await import('../src/cli/commands/plugin.js');

describe('pluginCommand', () => {
  let exitSpy: jest.SpiedFunction<typeof process.exit>;
  let logSpy: jest.SpiedFunction<typeof console.log>;

  beforeEach(() => {
    exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => {
      throw new Error('process.exit');
    }) as never);
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    mockLoad.mockReset();
  });

  afterEach(() => {
    exitSpy.mockRestore();
    logSpy.mockRestore();
  });

  it('runs existing plugin successfully', async () => {
    const fakePlugin = {
      name: 'SpecLint',
      run: jest.fn().mockResolvedValue(true),
      initialize: jest.fn(),
    };
    mockLoad.mockResolvedValue([fakePlugin]);
    await pluginCommand('SpecLint', ['arg1']);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('PLUGIN'));
    expect(fakePlugin.run).toHaveBeenCalledWith('arg1');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Plugin complete'));
  });

  it('exits on unknown plugin', async () => {
    mockLoad.mockResolvedValue([]);
    await expect(pluginCommand('Unknown', [])).rejects.toThrow('process.exit');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Unknown plugin'));
  });
});
