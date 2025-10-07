import os from 'os';
import { whoamiCommand } from '../src/cli/commands/whoami';
import * as fs from 'fs';
import * as path from 'path';

describe('whoamiCommand', () => {
  const homeDir = path.join(process.cwd(), 'tests', 'tmp-whoami-home');
  const configDir = path.join(homeDir, '.gidevo-api-tool');
  const configFile = path.join(configDir, 'config.json');

  beforeEach(() => {
    // Clean temp home directory and module cache
    if (fs.existsSync(homeDir)) {
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
    jest.resetModules();
    jest.resetAllMocks();
    // Mock os.homedir to use our temp directory
    jest.spyOn(os, 'homedir').mockReturnValue(homeDir);
  });


  it('prints not authenticated when no token is present', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await whoamiCommand();
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Not authenticated'));
    spy.mockRestore();
  });

  it('prints authenticated userId and expiry when token is valid', async () => {
    // Create valid config
    fs.mkdirSync(configDir, { recursive: true });
    const config = { token: 'token123', userId: 'user42', expiresAt: new Date(Date.now() + 60000).toISOString() };
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));

    const logs: any[] = [];
    const spy = jest.spyOn(console, 'log').mockImplementation((...args) => { logs.push(args); });

    await whoamiCommand();

    // First log for userId
    expect(logs[0]).toEqual([expect.any(String), 'user42']);
    // Second log for expiry
    expect(logs[1]).toEqual([expect.any(String), config.expiresAt]);

    spy.mockRestore();
  });
});
