"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whoamiCommand = whoamiCommand;
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
const auth_1 = require("../../core/auth");
const ui_1 = require("../utils/ui");
/**
 * Display current authentication status.
 */
async function whoamiCommand() {
    ui_1.ui.showCompactBanner();
    ui_1.ui.sectionHeader('Authentication Status');
    const authService = new auth_1.AuthService();
    // Check for environment variable token first
    if (process.env.GIDEVO_API_TOKEN) {
        ui_1.ui.success('Authenticated via environment variable');
        ui_1.ui.keyValue('Source', 'GIDEVO_API_TOKEN');
        ui_1.ui.info('Note', 'Environment variable takes precedence over stored credentials');
        return;
    }
    const config = authService.getConfig();
    if (!config) {
        ui_1.ui.warning('Not authenticated', 'No stored credentials found.');
        ui_1.ui.nextSteps([
            'Run "gidevo-api-tool login" to authenticate',
            'Or set GIDEVO_API_TOKEN environment variable',
        ]);
        return;
    }
    // Check if token is expired
    if (authService.isTokenExpired()) {
        ui_1.ui.error('Token expired', 'Your authentication token has expired.');
        ui_1.ui.keyValue('Expired at', ui_1.ui.timestamp(config.expiresAt));
        ui_1.ui.nextSteps([
            'Run "gidevo-api-tool login" to re-authenticate',
        ]);
        return;
    }
    // Show authenticated status
    ui_1.ui.success('Authenticated');
    ui_1.ui.divider();
    ui_1.ui.keyValue('User ID', config.userId);
    ui_1.ui.keyValue('Expires at', ui_1.ui.timestamp(config.expiresAt));
    const daysRemaining = authService.getTokenValidityDays();
    if (daysRemaining !== null) {
        const status = daysRemaining <= 7
            ? ui_1.ui.highlight(`${daysRemaining} days (expiring soon!)`)
            : `${daysRemaining} days`;
        ui_1.ui.keyValue('Valid for', status);
    }
    ui_1.ui.keyValue('Config dir', ui_1.ui.filePath(authService.getConfigDir()));
}
//# sourceMappingURL=whoami.js.map