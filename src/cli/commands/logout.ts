// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2025 LEHRO Solutions
import { AuthService } from '../../core/auth.js';
import { ui } from '../utils/ui.js';

export async function logoutCommand() {
  ui.showCompactBanner();
  ui.sectionHeader('Logout');

  const authService = new AuthService();

  // Check if currently authenticated
  const token = await authService.getToken();
  if (!token) {
    ui.warning('No active session', 'Credentials are already cleared.');
    return;
  }

  await authService.logout();
  ui.success('Logged out', 'Stored credentials were removed.');

  ui.divider();

  ui.info('Sign in again', 'Run gidevo-api-tool login');
}
