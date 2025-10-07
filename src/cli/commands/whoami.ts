// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import chalk from 'chalk';
import * as fs from 'fs';
import { AuthService } from '../../core/auth';

/**
 * Display current authentication status.
 */
export async function whoamiCommand(): Promise<void> {
  const authService = new AuthService();
  const token = authService.getToken();
  if (!token) {
    console.log(chalk.yellow('Not authenticated. Please login first.'));
    return;
  }
  // Read config to get userId and expiry
  try {
    const configFile = (authService as any).configFile;
    const data = fs.readFileSync(configFile, 'utf8');
    const config = JSON.parse(data);
    console.log(chalk.green('Authenticated as:'), config.userId);
    console.log(chalk.green('Token expires at:'), config.expiresAt);
  } catch (e) {
    console.log(chalk.red('Failed to read auth config:'), e);
  }
}