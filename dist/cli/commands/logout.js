"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutCommand = logoutCommand;
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
const chalk_1 = __importDefault(require("chalk"));
const auth_1 = require("../../core/auth");
async function logoutCommand() {
    const authService = new auth_1.AuthService();
    authService.logout();
    console.log(chalk_1.default.green('🗝️ Logged out and credentials removed.'));
}
//# sourceMappingURL=logout.js.map