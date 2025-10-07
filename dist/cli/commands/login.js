"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginCommand = loginCommand;
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const auth_1 = require("../../core/auth");
async function loginCommand(options) {
    const authService = new auth_1.AuthService();
    let token = options.token;
    if (!token) {
        const answers = await inquirer_1.default.prompt([
            {
                type: 'password',
                name: 'token',
                message: 'Enter your API token:',
                mask: '*'
            }
        ]);
        token = answers.token;
    }
    try {
        await authService.login(token);
        console.log(chalk_1.default.green('✅ Successfully authenticated!'));
    }
    catch (error) {
        console.log(chalk_1.default.red('Authentication failed:'), error);
    }
}
//# sourceMappingURL=login.js.map