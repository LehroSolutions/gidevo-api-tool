import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';
import { SecretsManager } from '../src/core/secrets';

jest.mock('os', () => {
  const real = jest.requireActual('os');
  return {
    ...real,
    homedir: () => path.join(process.cwd(), 'tests', 'tmp-secrets-home'),
  };
});

describe('SecretsManager hardening', () => {
  const homeDir = path.join(process.cwd(), 'tests', 'tmp-secrets-home');
  const configDir = path.join(homeDir, '.gidevo-api-tool');
  const secretsFile = path.join(configDir, 'secrets.enc');

  beforeEach(() => {
    if (fs.existsSync(homeDir)) {
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(homeDir)) {
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  });

  it('stores and retrieves encrypted secrets', async () => {
    const manager = new SecretsManager();
    await manager.setSecret('token', 'secret-token');

    const value = await manager.getSecret('token');
    expect(value).toBe('secret-token');
  });

  it('fails safely when GCM payload is tampered', async () => {
    const manager = new SecretsManager();
    await manager.setSecret('token', 'safe-token');

    const payload = fs.readFileSync(secretsFile, 'utf8');
    const tampered =
      payload.slice(0, payload.length - 1) + (payload.endsWith('0') ? '1' : '0');
    fs.writeFileSync(secretsFile, tampered);

    const value = await manager.getSecret('token');
    expect(value).toBeNull();
  });

  it('decrypts legacy AES-CBC payloads for migration', async () => {
    fs.mkdirSync(configDir, { recursive: true });

    const legacyData = JSON.stringify({ legacy: 'legacy-token' });
    const legacyMachineId = os.hostname() + os.userInfo().username;
    const legacyKey = crypto.scryptSync(legacyMachineId, 'salt', 32) as Buffer;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', legacyKey, iv);
    const encrypted = Buffer.concat([cipher.update(legacyData, 'utf8'), cipher.final()]);
    const legacyPayload = `${iv.toString('hex')}:${encrypted.toString('hex')}`;
    fs.writeFileSync(secretsFile, legacyPayload);

    const manager = new SecretsManager();
    const value = await manager.getSecret('legacy');
    expect(value).toBe('legacy-token');
  });
});
