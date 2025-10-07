// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import chalk from 'chalk';
import { AuthService } from '../../core/auth';

export async function logoutCommand() {
  const authService = new AuthService();
  authService.logout();
  console.log(chalk.green('🗝️ Logged out and credentials removed.'));
}
