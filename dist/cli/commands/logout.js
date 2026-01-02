"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutCommand = logoutCommand;
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
const auth_1 = require("../../core/auth");
const ui_1 = require("../utils/ui");
async function logoutCommand() {
    ui_1.ui.showCompactBanner();
    ui_1.ui.sectionHeader('SESSION TERMINATION');
    const authService = new auth_1.AuthService();
    // Check if currently authenticated
    const token = await authService.getToken();
    if (!token) {
        ui_1.ui.warning('No Active Session', 'Context already cleared.');
        return;
    }
    await authService.logout();
    ui_1.ui.success('Session Terminated', 'Credentials purged from vault.');
    ui_1.ui.divider();
    ui_1.ui.info('Re-establish', 'gidevo-api-tool login to create new context');
}
//# sourceMappingURL=logout.js.map