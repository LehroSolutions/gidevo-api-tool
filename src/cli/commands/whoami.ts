// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2025 LEHRO Solutions
import { AuthService } from '../../core/auth.js';
import { ui } from '../utils/ui.js';

/**
 * Display current authentication status.
 */
export async function whoamiCommand(): Promise<void> {
  ui.showCompactBanner();
  ui.sectionHeader('Authentication Status');

  const authService = new AuthService();

  // Check for environment variable token first
  if (process.env.GIDEVO_API_TOKEN) {
    ui.success('Authenticated via environment');
    ui.keyValue('Source', 'GIDEVO_API_TOKEN');
    ui.info('Priority', 'Environment token takes precedence over local storage');
    return;
  }

  const config = authService.getConfigSync();

  if (!config) {
    ui.warning('Not authenticated', 'No local credentials were found.');
    ui.nextSteps(['Run: gidevo-api-tool login', 'Or set GIDEVO_API_TOKEN for CI']);
    return;
  }

  // Check if token is expired
  if (authService.isTokenExpired()) {
    ui.error('Credentials expired', 'Stored token is no longer valid.');
    ui.keyValue('Expired', ui.timestamp(config.expiresAt));
    ui.nextSteps(['Refresh credentials: gidevo-api-tool login']);
    return;
  }

  // Show authenticated status
  ui.success('Authenticated');

  ui.divider();

  ui.keyValue('User', config.userId);
  ui.keyValue('Expires', ui.timestamp(config.expiresAt));

  const daysRemaining = authService.getTokenValidityDays();
  if (daysRemaining !== null) {
    const status =
      daysRemaining <= 7
        ? ui.highlight(`${daysRemaining}d remaining [CRITICAL]`)
        : `${daysRemaining}d remaining`;
    ui.keyValue('Time remaining', status);
  }

  ui.keyValue('Config path', ui.filePath(authService.getConfigDir()));
}
