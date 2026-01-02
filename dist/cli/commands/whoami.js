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
    ui_1.ui.sectionHeader('IDENTITY CONTEXT');
    const authService = new auth_1.AuthService();
    // Check for environment variable token first
    if (process.env.GIDEVO_API_TOKEN) {
        ui_1.ui.success('Environment Context Active');
        ui_1.ui.keyValue('Context Source', 'GIDEVO_API_TOKEN (env)');
        ui_1.ui.info('Priority', 'Environment context supersedes local storage');
        return;
    }
    const config = authService.getConfigSync();
    if (!config) {
        ui_1.ui.warning('No Active Context', 'Secure session not established.');
        ui_1.ui.nextSteps([
            'Establish context: gidevo-api-tool login',
            'Alternative: Set GIDEVO_API_TOKEN environment variable',
        ]);
        return;
    }
    // Check if token is expired
    if (authService.isTokenExpired()) {
        ui_1.ui.error('Context Expired', 'Session token validity exhausted.');
        ui_1.ui.keyValue('Terminated', ui_1.ui.timestamp(config.expiresAt));
        ui_1.ui.nextSteps([
            'Refresh context: gidevo-api-tool login',
        ]);
        return;
    }
    // Show authenticated status
    ui_1.ui.success('Session Active');
    ui_1.ui.divider();
    ui_1.ui.keyValue('Identity', config.userId);
    ui_1.ui.keyValue('Context Expiry', ui_1.ui.timestamp(config.expiresAt));
    const daysRemaining = authService.getTokenValidityDays();
    if (daysRemaining !== null) {
        const status = daysRemaining <= 7
            ? ui_1.ui.highlight(`${daysRemaining}d remaining [CRITICAL]`)
            : `${daysRemaining}d remaining`;
        ui_1.ui.keyValue('TTL', status);
    }
    ui_1.ui.keyValue('Vault Path', ui_1.ui.filePath(authService.getConfigDir()));
}
//# sourceMappingURL=whoami.js.map