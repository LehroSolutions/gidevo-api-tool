// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2025 LEHRO Solutions
import { AuthService } from '../../core/auth.js';
import { ui } from '../utils/ui.js';
import { createSpinner } from '../utils/spinner.js';
import { confirm, password } from '../utils/interactive.js';

interface LoginOptions {
  token?: string;
}

export async function loginCommand(options: LoginOptions) {
  ui.showCompactBanner();
  ui.sectionHeader('Login');

  const authService = new AuthService();

  // Check if already authenticated
  const existingToken = await authService.getToken();
  if (existingToken) {
    ui.warning('Already authenticated', 'Stored credentials already exist.');

    const proceed = await confirm('Do you want to replace the existing credentials?', false);

    if (!proceed) {
      ui.info('Operation cancelled', 'Existing credentials were preserved.');
      return;
    }
  }

  let token = options.token;

  if (!token) {
    console.log();
    token = await password('Input Access Token');

    if (!token || token.trim().length === 0) {
      ui.error('Missing token', 'Token cannot be empty.');
      process.exit(1);
    }
    if (token.length < 10) {
      ui.error('Invalid token', 'Token appears to be too short.');
      process.exit(1);
    }
  }

  const spinner = await createSpinner('Storing credentials...');
  if (spinner.start) spinner.start();

  try {
    await authService.login(token!);
    spinner.stop();

    ui.success('Logged in');
    ui.info('Credentials stored', 'Token encrypted and stored locally.');

    ui.divider();

    ui.nextSteps([
      'Verify identity: gidevo-api-tool whoami',
      'Generate an SDK: gidevo-api-tool generate',
    ]);
  } catch (error: any) {
    spinner.stop();
    ui.error('Login failed', error.message);
    ui.info('Resolution', 'Verify token authenticity and retry.');
    process.exit(1);
  }
}
