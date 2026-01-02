// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import { AuthService } from '../../core/auth';
import { ui } from '../utils/ui';

export async function logoutCommand() {
  ui.showCompactBanner();
  ui.sectionHeader('SESSION TERMINATION');

  const authService = new AuthService();

  // Check if currently authenticated
  const token = await authService.getToken();
  if (!token) {
    ui.warning('No Active Session', 'Context already cleared.');
    return;
  }

  await authService.logout();
  ui.success('Session Terminated', 'Credentials purged from vault.');

  ui.divider();

  ui.info('Re-establish', 'gidevo-api-tool login to create new context');
}
