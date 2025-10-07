// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import chalk from 'chalk';
import inquirer from 'inquirer';
import { AuthService } from '../../core/auth';

interface LoginOptions {
  token?: string;
}

export async function loginCommand(options: LoginOptions) {
  const authService = new AuthService();
  
  let token = options.token;
  
  if (!token) {
    const answers = await inquirer.prompt<{ token: string }>([
      {
        type: 'password',
        name: 'token',
        message: 'Enter your API token:',
        mask: '*'
      }
    ]);
    token = answers.token;
  }

  try {
    await authService.login(token!);
    console.log(chalk.green('✅ Successfully authenticated!'));
  } catch (error) {
    console.log(chalk.red('Authentication failed:'), error);
  }
}
