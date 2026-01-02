"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginCommand = loginCommand;
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
const auth_1 = require("../../core/auth");
const ui_1 = require("../utils/ui");
const spinner_1 = require("../utils/spinner");
const interactive_1 = require("../utils/interactive");
async function loginCommand(options) {
    ui_1.ui.showCompactBanner();
    ui_1.ui.sectionHeader('SECURE CONTEXT ESTABLISHMENT');
    const authService = new auth_1.AuthService();
    // Check if already authenticated
    const existingToken = await authService.getToken();
    if (existingToken) {
        ui_1.ui.warning('Context Active', 'Secure session already established.');
        const proceed = await (0, interactive_1.confirm)('Do you want to replace the existing credentials?', false);
        if (!proceed) {
            ui_1.ui.info('Operation Aborted', 'Existing context preserved.');
            return;
        }
    }
    let token = options.token;
    if (!token) {
        console.log();
        token = await (0, interactive_1.password)('Input Access Token');
        if (!token || token.trim().length === 0) {
            ui_1.ui.error('Input Anomaly', 'Token cannot be empty.');
            process.exit(1);
        }
        if (token.length < 10) {
            ui_1.ui.error('Integrity Check Failed', 'Token appears to be too short.');
            process.exit(1);
        }
    }
    const spinner = await (0, spinner_1.createSpinner)('Establishing secure handshake...');
    if (spinner.start)
        spinner.start();
    try {
        await authService.login(token);
        spinner.stop();
        ui_1.ui.success('Secure Context Established');
        ui_1.ui.info('Credentials Archived', 'Token encrypted and stored locally.');
        ui_1.ui.divider();
        ui_1.ui.nextSteps([
            'Verify identity: gidevo-api-tool whoami',
            'Begin synthesis: gidevo-api-tool generate',
        ]);
    }
    catch (error) {
        spinner.stop();
        ui_1.ui.error('Handshake Failed', error.message);
        ui_1.ui.info('Resolution', 'Verify token authenticity and retry.');
        process.exit(1);
    }
}
//# sourceMappingURL=login.js.map