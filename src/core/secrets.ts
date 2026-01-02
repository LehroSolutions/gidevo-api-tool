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
      // @ts-ignore
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
    // In a real scenario, we'd want a user-provided password or machine-specific key.
    // For this fallback, we use a static key derived from the machine's hostname/user
    // to prevent simple copy-pasting of the file to another machine.
    const machineId = os.hostname() + os.userInfo().username;
    return crypto.scryptSync(machineId, 'salt', 32);
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
    const iv = crypto.randomBytes(16);
    const key = this.getEncryptionKey();
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  private decrypt(text: string): string {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const key = this.getEncryptionKey();
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}
