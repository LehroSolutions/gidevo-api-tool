// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';

/**
 * Secrets Manager
 *
 * Handles secure storage of sensitive information like authentication tokens.
 * Tries to use system keychain (via keytar) if available, otherwise falls back
 * to an obfuscated file in the user's home directory with restricted permissions.
 */
export class SecretsManager {
  private serviceName = 'gidevo-api-tool';
  private accountName = 'current-user';
  private configDir = path.join(os.homedir(), '.gidevo-api-tool');
  private secretsFile = path.join(this.configDir, 'secrets.enc');
  private keytar: any = null;
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    // Initialization is lazy - will be triggered on first use
  }

  /**
   * Ensure the secrets manager is initialized (lazy initialization)
   */
  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;

    if (!this.initPromise) {
      this.initPromise = this.init();
    }

    await this.initPromise;
  }

  private async init(): Promise<void> {
    if (this.initialized) return;

    try {
      // Try to load keytar dynamically
      // This allows the tool to work even if keytar build failed or isn't installed
      // @ts-expect-error keytar is optional and may not be installed in all environments.
      this.keytar = await import('keytar');
    } catch (e) {
      // Keytar not available, will use file fallback
      this.keytar = null;
    }

    this.initialized = true;
  }

  /**
   * Store a secret securely
   */
  async setSecret(key: string, value: string): Promise<void> {
    await this.ensureInitialized();

    if (this.keytar) {
      try {
        await this.keytar.setPassword(this.serviceName, key, value);
        return;
      } catch (e) {
        // Fallback if keytar fails - log for debugging
        if (process.env.DEBUG) {
          console.warn('[SecretsManager] Keytar failed, using file fallback:', e);
        }
      }
    }

    this.saveToFile(key, value);
  }

  /**
   * Retrieve a secret
   */
  async getSecret(key: string): Promise<string | null> {
    await this.ensureInitialized();

    if (this.keytar) {
      try {
        const secret = await this.keytar.getPassword(this.serviceName, key);
        if (secret) return secret;
      } catch (e) {
        // Fallback - log for debugging
        if (process.env.DEBUG) {
          console.warn('[SecretsManager] Keytar retrieval failed, trying file:', e);
        }
      }
    }

    return this.loadFromFile(key);
  }

  /**
   * Delete a secret
   */
  async deleteSecret(key: string): Promise<void> {
    await this.ensureInitialized();

    if (this.keytar) {
      try {
        await this.keytar.deletePassword(this.serviceName, key);
      } catch (e) {
        // Log for debugging but continue to delete from file
        if (process.env.DEBUG) {
          console.warn('[SecretsManager] Keytar delete failed:', e);
        }
      }
    }

    this.deleteFromFile(key);
  }

  // ==========================================
  // File-based Fallback (Obfuscated)
  // ==========================================

  private getEncryptionKey(): Buffer {
    // Derive a key from a machine-specific value using PBKDF2 with a stored random salt.
    // This is significantly stronger than the previous scryptSync(hostname+username, 'salt', 32)
    // approach which used a predictable, static salt.
    const saltFile = path.join(this.configDir, '.enc-salt');
    let salt: Buffer;

    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true, mode: 0o700 });
    }

    if (fs.existsSync(saltFile)) {
      salt = fs.readFileSync(saltFile);
    } else {
      // Generate a new 32-byte random salt on first run and store it
      salt = crypto.randomBytes(32);
      fs.writeFileSync(saltFile, salt, { mode: 0o600 });
    }

    // Use a machine-specific value as the passphrase (not purely random so secrets
    // survive process restarts without a user-provided master password)
    const machineId = os.hostname() + os.userInfo().username;
    return crypto.pbkdf2Sync(machineId, salt, 100000, 32, 'sha256');
  }

  private saveToFile(key: string, value: string): void {
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true, mode: 0o700 });
    }

    let secrets: Record<string, string> = {};
    if (fs.existsSync(this.secretsFile)) {
      try {
        const content = fs.readFileSync(this.secretsFile, 'utf8');
        secrets = JSON.parse(this.decrypt(content));
      } catch {
        // Corrupt or invalid, start fresh
      }
    }

    secrets[key] = value;

    const encrypted = this.encrypt(JSON.stringify(secrets));
    fs.writeFileSync(this.secretsFile, encrypted, { mode: 0o600 });
  }

  private loadFromFile(key: string): string | null {
    if (!fs.existsSync(this.secretsFile)) return null;

    try {
      const content = fs.readFileSync(this.secretsFile, 'utf8');
      const secrets = JSON.parse(this.decrypt(content));
      return secrets[key] || null;
    } catch {
      return null;
    }
  }

  private deleteFromFile(key: string): void {
    if (!fs.existsSync(this.secretsFile)) return;

    try {
      const content = fs.readFileSync(this.secretsFile, 'utf8');
      const secrets = JSON.parse(this.decrypt(content));

      if (secrets[key]) {
        delete secrets[key];
        const encrypted = this.encrypt(JSON.stringify(secrets));
        fs.writeFileSync(this.secretsFile, encrypted, { mode: 0o600 });
      }
    } catch {
      // Ignore
    }
  }

  private encrypt(text: string): string {
    // AES-256-GCM: authenticated encryption — detects tampering via auth tag.
    // Replaces previous AES-256-CBC which provided no integrity guarantee.
    const iv = crypto.randomBytes(12); // 96-bit IV recommended for GCM
    const key = this.getEncryptionKey();
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag(); // 16-byte authentication tag
    // Format: <iv-hex>:<authTag-hex>:<ciphertext-hex>
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted.toString('hex');
  }

  private decrypt(text: string): string {
    const parts = text.split(':');
    // Legacy CBC format had 2 parts (iv:ciphertext); GCM has 3 (iv:authTag:ciphertext)
    if (parts.length === 2) {
      // Migrate legacy CBC-encrypted data - decrypt with old algorithm, will be re-encrypted as GCM on next write
      return this.decryptLegacyCbc(text);
    }
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted secrets format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encryptedText = Buffer.from(parts[2], 'hex');
    if (iv.length !== 12) {
      throw new Error('Invalid encrypted payload: IV must be 12 bytes for AES-GCM');
    }
    if (authTag.length !== 16) {
      throw new Error('Invalid encrypted payload: auth tag must be 16 bytes for AES-GCM');
    }
    if (encryptedText.length === 0) {
      throw new Error('Invalid encrypted payload: ciphertext is empty');
    }

    const key = this.getEncryptionKey();
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag); // throws if data was tampered
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString('utf8');
  }

  /** Decrypt data encrypted with the old AES-256-CBC scheme for migration purposes. */
  private decryptLegacyCbc(text: string): string {
    const textParts = text.split(':');
    if (textParts.length < 2) {
      throw new Error('Invalid legacy encrypted payload');
    }

    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    if (iv.length !== 16) {
      throw new Error('Invalid legacy encrypted payload: IV must be 16 bytes');
    }
    if (encryptedText.length === 0) {
      throw new Error('Invalid legacy encrypted payload: ciphertext is empty');
    }

    // Reconstruct the old key (scryptSync with static 'salt')
    const machineId = os.hostname() + os.userInfo().username;
    const legacyKey = crypto.scryptSync(machineId, 'salt', 32) as Buffer;
    const decipher = crypto.createDecipheriv('aes-256-cbc', legacyKey, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}
