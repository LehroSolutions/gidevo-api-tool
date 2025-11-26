// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface AuthConfig {
  token: string;
  userId: string;
  expiresAt: string;
}

export class AuthService {
  private configDir = path.join(os.homedir(), '.gidevo-api-tool');
  private configFile = path.join(this.configDir, 'config.json');

  async login(token: string): Promise<void> {
    // Validate token format (basic validation)
    if (!token || token.trim().length === 0) {
      throw new Error('Token cannot be empty');
    }

    // In real implementation, validate token with backend
    const config: AuthConfig = {
      token,
      userId: 'user123',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });
    }

    fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2), { mode: 0o600 });
  }

  getToken(): string | null {
    // Environment variable override for CI/automation
    if (process.env.GIDEVO_API_TOKEN) {
      return process.env.GIDEVO_API_TOKEN;
    }
    
    const config = this.getConfig();
    if (!config) return null;
    
    if (new Date(config.expiresAt) < new Date()) {
      return null; // Token expired
    }
    
    return config.token;
  }

  /**
   * Get the full authentication configuration
   */
  getConfig(): AuthConfig | null {
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
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const config = this.getConfig();
    if (!config) return true;
    return new Date(config.expiresAt) < new Date();
  }

  /**
   * Get remaining token validity in days
   */
  getTokenValidityDays(): number | null {
    const config = this.getConfig();
    if (!config) return null;
    
    const expiryDate = new Date(config.expiresAt);
    const now = new Date();
    const diffMs = expiryDate.getTime() - now.getTime();
    
    if (diffMs <= 0) return 0;
    return Math.ceil(diffMs / (24 * 60 * 60 * 1000));
  }

  logout(): void {
    if (fs.existsSync(this.configFile)) {
      fs.unlinkSync(this.configFile);
    }
  }

  /**
   * Get the config directory path
   */
  getConfigDir(): string {
    return this.configDir;
  }
}
