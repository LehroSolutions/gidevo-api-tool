// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import { AuthService } from '../../core/auth';
import { ui } from '../utils/ui';

/**
 * Display current authentication status.
 */
export async function whoamiCommand(): Promise<void> {
  ui.showCompactBanner();
  ui.sectionHeader('IDENTITY CONTEXT');

  const authService = new AuthService();

  // Check for environment variable token first
  if (process.env.GIDEVO_API_TOKEN) {
    ui.success('Environment Context Active');
    ui.keyValue('Context Source', 'GIDEVO_API_TOKEN (env)');
    ui.info('Priority', 'Environment context supersedes local storage');
    return;
  }

  const config = authService.getConfigSync();

  if (!config) {
    ui.warning('No Active Context', 'Secure session not established.');
    ui.nextSteps([
      'Establish context: gidevo-api-tool login',
      'Alternative: Set GIDEVO_API_TOKEN environment variable',
    ]);
    return;
  }

  // Check if token is expired
  if (authService.isTokenExpired()) {
    ui.error('Context Expired', 'Session token validity exhausted.');
    ui.keyValue('Terminated', ui.timestamp(config.expiresAt));
    ui.nextSteps([
      'Refresh context: gidevo-api-tool login',
    ]);
    return;
  }

  // Show authenticated status
  ui.success('Session Active');

  ui.divider();

  ui.keyValue('Identity', config.userId);
  ui.keyValue('Context Expiry', ui.timestamp(config.expiresAt));

  const daysRemaining = authService.getTokenValidityDays();
  if (daysRemaining !== null) {
    const status = daysRemaining <= 7
      ? ui.highlight(`${daysRemaining}d remaining [CRITICAL]`)
      : `${daysRemaining}d remaining`;
    ui.keyValue('TTL', status);
  }

  ui.keyValue('Vault Path', ui.filePath(authService.getConfigDir()));
}