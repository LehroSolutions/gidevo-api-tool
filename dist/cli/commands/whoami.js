"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.whoamiCommand = whoamiCommand;
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
const chalk_1 = __importDefault(require("chalk"));
const fs = __importStar(require("fs"));
const auth_1 = require("../../core/auth");
/**
 * Display current authentication status.
 */
async function whoamiCommand() {
    const authService = new auth_1.AuthService();
    const token = authService.getToken();
    if (!token) {
        console.log(chalk_1.default.yellow('Not authenticated. Please login first.'));
        return;
    }
    // Read config to get userId and expiry
    try {
        const configFile = authService.configFile;
        const data = fs.readFileSync(configFile, 'utf8');
        const config = JSON.parse(data);
        console.log(chalk_1.default.green('Authenticated as:'), config.userId);
        console.log(chalk_1.default.green('Token expires at:'), config.expiresAt);
    }
    catch (e) {
        console.log(chalk_1.default.red('Failed to read auth config:'), e);
    }
}
//# sourceMappingURL=whoami.js.map