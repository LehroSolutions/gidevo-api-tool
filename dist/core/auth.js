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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
class AuthService {
    constructor() {
        this.configDir = path.join(os.homedir(), '.gidevo-api-tool');
        this.configFile = path.join(this.configDir, 'config.json');
    }
    async login(token) {
        // In real implementation, validate token with backend
        const config = {
            token,
            userId: 'user123',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
        if (!fs.existsSync(this.configDir)) {
            fs.mkdirSync(this.configDir, { recursive: true });
        }
        fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2));
    }
    getToken() {
        // Environment variable override for CI/automation
        if (process.env.GIDEVO_API_TOKEN) {
            return process.env.GIDEVO_API_TOKEN;
        }
        if (!fs.existsSync(this.configFile)) {
            return null;
        }
        try {
            const config = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
            if (new Date(config.expiresAt) < new Date()) {
                return null;
            }
            return config.token;
        }
        catch {
            return null;
        }
    }
    logout() {
        if (fs.existsSync(this.configFile)) {
            fs.unlinkSync(this.configFile);
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.js.map