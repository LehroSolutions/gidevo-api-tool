import { whoamiCommand } from '../src/cli/commands/whoami.js';
import * as fs from 'fs';
import * as path from 'path';

describe('whoamiCommand', () => {
  const homeDir = path.join(process.cwd(), 'tests', 'tmp-whoami-home');
  const configDir = path.join(homeDir, '.gidevo-api-tool');
  const configFile = path.join(configDir, 'config.json');

  beforeEach(() => {
    process.env.GIDEVO_CONFIG_HOME = homeDir;
    delete process.env.GIDEVO_API_TOKEN;
    if (fs.existsSync(homeDir)) {
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    delete process.env.GIDEVO_CONFIG_HOME;
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
    const config = {
      token: 'token123',
      userId: 'user42',
      expiresAt: new Date(Date.now() + 60000).toISOString(),
    };
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));

    const logs: string[] = [];
    const spy = jest.spyOn(console, 'log').mockImplementation((...args) => {
      logs.push(args.join(' '));
    });

    await whoamiCommand();

    // Check that userId appears in output
    const hasUserId = logs.some((log) => log.includes('user42'));
    expect(hasUserId).toBe(true);

    // Check that Authenticated success appears
    const hasAuth = logs.some((log) => log.includes('Authenticated'));
    expect(hasAuth).toBe(true);

    spy.mockRestore();
  });
});
