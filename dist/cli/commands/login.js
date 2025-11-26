"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginCommand = loginCommand;
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
const inquirer_1 = __importDefault(require("inquirer"));
const auth_1 = require("../../core/auth");
const ui_1 = require("../utils/ui");
const spinner_1 = require("../utils/spinner");
async function loginCommand(options) {
    ui_1.ui.showCompactBanner();
    ui_1.ui.sectionHeader('Authentication');
    const authService = new auth_1.AuthService();
    // Check if already authenticated
    const existingToken = authService.getToken();
    if (existingToken) {
        ui_1.ui.warning('Already authenticated', 'You are already logged in.');
        const { proceed } = await inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'proceed',
                message: 'Do you want to replace the existing credentials?',
                default: false
            }
        ]);
        if (!proceed) {
            ui_1.ui.info('Login cancelled', 'Your existing credentials remain unchanged.');
            return;
        }
    }
    let token = options.token;
    if (!token) {
        console.log();
        const answers = await inquirer_1.default.prompt([
            {
                type: 'password',
                name: 'token',
                message: 'Enter your API token:',
                mask: '*',
                validate: (input) => {
                    if (!input || input.trim().length === 0) {
                        return 'Token cannot be empty';
                    }
                    if (input.length < 10) {
                        return 'Token appears to be too short. Please enter a valid token.';
                    }
                    return true;
                }
            }
        ]);
        token = answers.token;
    }
    const spinner = await (0, spinner_1.createSpinner)('Authenticating...');
    if (spinner.start)
        spinner.start();
    try {
        await authService.login(token);
        spinner.stop();
        ui_1.ui.success('Successfully authenticated!');
        ui_1.ui.info('Credentials stored', 'Your token has been saved securely.');
        ui_1.ui.divider();
        ui_1.ui.nextSteps([
            'Run "gidevo-api-tool whoami" to verify your identity',
            'Start generating SDKs with "gidevo-api-tool generate"',
        ]);
    }
    catch (error) {
        spinner.stop();
        ui_1.ui.error('Authentication failed', error.message);
        ui_1.ui.info('Tip', 'Make sure you are using a valid API token.');
        process.exit(1);
    }
}
//# sourceMappingURL=login.js.map