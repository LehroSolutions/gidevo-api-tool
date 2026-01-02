// Tests for AuthService, login/logout commands
import { AuthService } from '../src/core/auth';
import { loginCommand } from '../src/cli/commands/login';
import { logoutCommand } from '../src/cli/commands/logout';
import * as fs from 'fs';
import * as path from 'path';

// Use temp home dir override by monkeypatching os.homedir
jest.mock('os', () => {
  const real = jest.requireActual('os');
  return {
    ...real,
    homedir: () => path.join(process.cwd(), 'tests', 'tmp-auth-home')
  };
});

// Mock interactive utils
jest.mock('../src/cli/utils/interactive', () => ({
  prompt: async () => 'interactive-token',
  password: async () => 'interactive-token',
  confirm: async () => true
}));

// Mock spinner
jest.mock('../src/cli/utils/spinner', () => ({
  createSpinner: async () => ({
    start: jest.fn(),
    stop: jest.fn(),
    succeed: jest.fn(),
    fail: jest.fn()
  })
}));

describe('Auth flow', () => {
  const homeDir = path.join(process.cwd(), 'tests', 'tmp-auth-home');
  const configDir = path.join(homeDir, '.gidevo-api-tool');
  const configFile = path.join(configDir, 'config.json');

  beforeEach(() => {
    if (fs.existsSync(homeDir)) {
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
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
    
    // Corrupt expiresAt to past
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
