// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import { AuthService } from '../../core/auth';
import { ui } from '../utils/ui';

export async function logoutCommand() {
  ui.showCompactBanner();
  ui.sectionHeader('Logout');

  const authService = new AuthService();
  
  // Check if currently authenticated
  const token = authService.getToken();
  if (!token) {
    ui.warning('Not authenticated', 'You are not currently logged in.');
    return;
  }
  
  authService.logout();
  ui.success('Logged out successfully', 'Your credentials have been removed.');
  
  ui.divider();
  
  ui.info('Next', 'Run "gidevo-api-tool login" to authenticate again.');
}
