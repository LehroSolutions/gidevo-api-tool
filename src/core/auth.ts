// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { SecretsManager } from './secrets';

export interface AuthConfig {
  userId: string;
  expiresAt: string;
}

export class AuthService {
  private configDir = path.join(os.homedir(), '.gidevo-api-tool');
  private configFile = path.join(this.configDir, 'config.json');
  private secrets = new SecretsManager();

  async login(token: string): Promise<void> {
    // Validate token format (basic validation)
    if (!token || token.trim().length === 0) {
      throw new Error('Token cannot be empty');
    }

    // In real implementation, validate token with backend
    const config: AuthConfig = {
      userId: 'user123',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });
    }

    // Store non-sensitive config
    fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2), { mode: 0o600 });
    
    // Store token securely
    await this.secrets.setSecret('auth_token', token);
  }

  async getToken(): Promise<string | null> {
    // Environment variable override for CI/automation
    if (process.env.GIDEVO_API_TOKEN) {
      return process.env.GIDEVO_API_TOKEN;
    }
    
    const config = this.getConfigSync(); // We can still read config sync as it's just JSON
    if (!config) return null;
    
    if (new Date(config.expiresAt) < new Date()) {
      return null; // Token expired
    }
    
    return await this.secrets.getSecret('auth_token');
  }

  /**
   * Get the full authentication configuration (excluding token)
   */
  getConfigSync(): AuthConfig | null {
    if (!fs.existsSync(this.configFile)) {
      return null;
    }
    try {
      const data = fs.readFileSync(this.configFile, 'utf8');
      return JSON.parse(data) as AuthConfig;
    } catch {
      return null;
    }
  }

  /**
   * Check if currently authenticated with valid token
   */
  async isAuthenticated(): Promise<boolean> {
    return (await this.getToken()) !== null;
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const config = this.getConfigSync();
    if (!config) return true;
    return new Date(config.expiresAt) < new Date();
  }

  /**
   * Get remaining token validity in days
   */
  getTokenValidityDays(): number | null {
    const config = this.getConfigSync();
    if (!config) return null;
    
    const expiryDate = new Date(config.expiresAt);
    const now = new Date();
    const diffMs = expiryDate.getTime() - now.getTime();
    
    if (diffMs <= 0) return 0;
    return Math.ceil(diffMs / (24 * 60 * 60 * 1000));
  }

  async logout(): Promise<void> {
    if (fs.existsSync(this.configFile)) {
      fs.unlinkSync(this.configFile);
    }
    await this.secrets.deleteSecret('auth_token');
  }

  /**
   * Get the config directory path
   */
  getConfigDir(): string {
    return this.configDir;
  }
}
