// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import inquirer from 'inquirer';
import { AuthService } from '../../core/auth';
import { ui } from '../utils/ui';
import { createSpinner } from '../utils/spinner';

interface LoginOptions {
  token?: string;
}

export async function loginCommand(options: LoginOptions) {
  ui.showCompactBanner();
  ui.sectionHeader('Authentication');

  const authService = new AuthService();
  
  // Check if already authenticated
  const existingToken = authService.getToken();
  if (existingToken) {
    ui.warning('Already authenticated', 'You are already logged in.');
    
    const { proceed } = await inquirer.prompt<{ proceed: boolean }>([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'Do you want to replace the existing credentials?',
        default: false
      }
    ]);
    
    if (!proceed) {
      ui.info('Login cancelled', 'Your existing credentials remain unchanged.');
      return;
    }
  }
  
  let token = options.token;
  
  if (!token) {
    console.log();
    const answers = await inquirer.prompt<{ token: string }>([
      {
        type: 'password',
        name: 'token',
        message: 'Enter your API token:',
        mask: '*',
        validate: (input: string) => {
          if (!input || input.trim().length === 0) {
            return 'Token cannot be empty';
          }
          if (input.length < 10) {
            return 'Token appears to be too short. Please enter a valid token.';
          }
          return true;
        }
      }
    ]);
    token = answers.token;
  }

  const spinner = await createSpinner('Authenticating...');
  if (spinner.start) spinner.start();

  try {
    await authService.login(token!);
    spinner.stop();
    
    ui.success('Successfully authenticated!');
    ui.info('Credentials stored', 'Your token has been saved securely.');
    
    ui.divider();
    
    ui.nextSteps([
      'Run "gidevo-api-tool whoami" to verify your identity',
      'Start generating SDKs with "gidevo-api-tool generate"',
    ]);
  } catch (error: any) {
    spinner.stop();
    ui.error('Authentication failed', error.message);
    ui.info('Tip', 'Make sure you are using a valid API token.');
    process.exit(1);
  }
}
