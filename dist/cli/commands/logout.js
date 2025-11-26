"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutCommand = logoutCommand;
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
const auth_1 = require("../../core/auth");
const ui_1 = require("../utils/ui");
async function logoutCommand() {
    ui_1.ui.showCompactBanner();
    ui_1.ui.sectionHeader('Logout');
    const authService = new auth_1.AuthService();
    // Check if currently authenticated
    const token = authService.getToken();
    if (!token) {
        ui_1.ui.warning('Not authenticated', 'You are not currently logged in.');
        return;
    }
    authService.logout();
    ui_1.ui.success('Logged out successfully', 'Your credentials have been removed.');
    ui_1.ui.divider();
    ui_1.ui.info('Next', 'Run "gidevo-api-tool login" to authenticate again.');
}
//# sourceMappingURL=logout.js.map