import { jest } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

jest.unstable_mockModule('../src/cli/utils/interactive.js', () => ({
  prompt: async () => 'interactive-token',
  password: async () => 'interactive-token',
  confirm: async () => true,
}));

jest.unstable_mockModule('../src/cli/utils/spinner.js', () => ({
  createSpinner: async () => ({
    start: jest.fn(),
    stop: jest.fn(),
    succeed: jest.fn(),
    fail: jest.fn(),
  }),
}));

const { AuthService } = await import('../src/core/auth.js');
const { loginCommand } = await import('../src/cli/commands/login.js');
const { logoutCommand } = await import('../src/cli/commands/logout.js');

describe('Auth flow', () => {
  const homeDir = path.join(process.cwd(), 'tests', 'tmp-auth-home');
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

  test('loginCommand with --token writes config', async () => {
    await loginCommand({ token: 'abc123' });
    const svc = new AuthService();
    const token = await svc.getToken();
    expect(token).toBe('abc123');
  });

  test('loginCommand prompts when no token provided', async () => {
    await loginCommand({});
    const svc = new AuthService();
    const token = await svc.getToken();
    expect(token).toBe('interactive-token');
  });

  test('AuthService.getToken respects expiration', async () => {
    const svc = new AuthService();
    await svc.login('exp-token');
    const first = await svc.getToken();
    expect(first).toBe('exp-token');

    const cfg = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    cfg.expiresAt = new Date(Date.now() - 1000).toISOString();
    fs.writeFileSync(configFile, JSON.stringify(cfg, null, 2));

    const second = await svc.getToken();
    expect(second).toBeNull();
  });

  test('logout removes config file', async () => {
    const svc = new AuthService();
    await svc.login('to-remove');
    expect(fs.existsSync(configFile)).toBe(true);
    await logoutCommand();
    expect(fs.existsSync(configFile)).toBe(false);
    const token = await svc.getToken();
    expect(token).toBeNull();
  });
});
