// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export class AuthService {
  private configDir = path.join(os.homedir(), '.gidevo-api-tool');
  private configFile = path.join(this.configDir, 'config.json');

  async login(token: string): Promise<void> {
    // In real implementation, validate token with backend
    const config = {
      token,
      userId: 'user123',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });
    }

    fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2));
  }

  getToken(): string | null {
    // Environment variable override for CI/automation
    if (process.env.GIDEVO_API_TOKEN) {
      return process.env.GIDEVO_API_TOKEN;
    }
    if (!fs.existsSync(this.configFile)) {
      return null;
    }
    try {
      const config = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
      if (new Date(config.expiresAt) < new Date()) {
        return null;
      }
      return config.token;
    } catch {
      return null;
    }
  }

  logout(): void {
    if (fs.existsSync(this.configFile)) {
      fs.unlinkSync(this.configFile);
    }
  }
}
