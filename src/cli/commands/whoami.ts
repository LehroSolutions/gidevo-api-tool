// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import { AuthService } from '../../core/auth';
import { ui } from '../utils/ui';

/**
 * Display current authentication status.
 */
export async function whoamiCommand(): Promise<void> {
  ui.showCompactBanner();
  ui.sectionHeader('Authentication Status');

  const authService = new AuthService();
  
  // Check for environment variable token first
  if (process.env.GIDEVO_API_TOKEN) {
    ui.success('Authenticated via environment variable');
    ui.keyValue('Source', 'GIDEVO_API_TOKEN');
    ui.info('Note', 'Environment variable takes precedence over stored credentials');
    return;
  }

  const config = authService.getConfig();
  
  if (!config) {
    ui.warning('Not authenticated', 'No stored credentials found.');
    ui.nextSteps([
      'Run "gidevo-api-tool login" to authenticate',
      'Or set GIDEVO_API_TOKEN environment variable',
    ]);
    return;
  }

  // Check if token is expired
  if (authService.isTokenExpired()) {
    ui.error('Token expired', 'Your authentication token has expired.');
    ui.keyValue('Expired at', ui.timestamp(config.expiresAt));
    ui.nextSteps([
      'Run "gidevo-api-tool login" to re-authenticate',
    ]);
    return;
  }

  // Show authenticated status
  ui.success('Authenticated');
  
  ui.divider();
  
  ui.keyValue('User ID', config.userId);
  ui.keyValue('Expires at', ui.timestamp(config.expiresAt));
  
  const daysRemaining = authService.getTokenValidityDays();
  if (daysRemaining !== null) {
    const status = daysRemaining <= 7 
      ? ui.highlight(`${daysRemaining} days (expiring soon!)`)
      : `${daysRemaining} days`;
    ui.keyValue('Valid for', status);
  }
  
  ui.keyValue('Config dir', ui.filePath(authService.getConfigDir()));
}