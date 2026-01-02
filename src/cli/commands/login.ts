// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import { AuthService } from '../../core/auth';
import { ui } from '../utils/ui';
import { createSpinner } from '../utils/spinner';
import { confirm, password } from '../utils/interactive';

interface LoginOptions {
  token?: string;
}

export async function loginCommand(options: LoginOptions) {
  ui.showCompactBanner();
  ui.sectionHeader('SECURE CONTEXT ESTABLISHMENT');

  const authService = new AuthService();

  // Check if already authenticated
  const existingToken = await authService.getToken();
  if (existingToken) {
    ui.warning('Context Active', 'Secure session already established.');

    const proceed = await confirm('Do you want to replace the existing credentials?', false);

    if (!proceed) {
      ui.info('Operation Aborted', 'Existing context preserved.');
      return;
    }
  }

  let token = options.token;

  if (!token) {
    console.log();
    token = await password('Input Access Token');
    
    if (!token || token.trim().length === 0) {
      ui.error('Input Anomaly', 'Token cannot be empty.');
      process.exit(1);
    }
    if (token.length < 10) {
      ui.error('Integrity Check Failed', 'Token appears to be too short.');
      process.exit(1);
    }
  }

  const spinner = await createSpinner('Establishing secure handshake...');
  if (spinner.start) spinner.start();

  try {
    await authService.login(token!);
    spinner.stop();

    ui.success('Secure Context Established');
    ui.info('Credentials Archived', 'Token encrypted and stored locally.');

    ui.divider();

    ui.nextSteps([
      'Verify identity: gidevo-api-tool whoami',
      'Begin synthesis: gidevo-api-tool generate',
    ]);
  } catch (error: any) {
    spinner.stop();
    ui.error('Handshake Failed', error.message);
    ui.info('Resolution', 'Verify token authenticity and retry.');
    process.exit(1);
  }
}
