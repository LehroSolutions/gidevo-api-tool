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
exports.SecretsManager = void 0;
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const crypto = __importStar(require("crypto"));
/**
 * Secrets Manager
 *
 * Handles secure storage of sensitive information like authentication tokens.
 * Tries to use system keychain (via keytar) if available, otherwise falls back
 * to an obfuscated file in the user's home directory with restricted permissions.
 */
class SecretsManager {
    constructor() {
        this.serviceName = 'gidevo-api-tool';
        this.accountName = 'current-user';
        this.configDir = path.join(os.homedir(), '.gidevo-api-tool');
        this.secretsFile = path.join(this.configDir, 'secrets.enc');
        this.keytar = null;
        this.initialized = false;
        this.initPromise = null;
        // Initialization is lazy - will be triggered on first use
    }
    /**
     * Ensure the secrets manager is initialized (lazy initialization)
     */
    async ensureInitialized() {
        if (this.initialized)
            return;
        if (!this.initPromise) {
            this.initPromise = this.init();
        }
        await this.initPromise;
    }
    async init() {
        if (this.initialized)
            return;
        try {
            // Try to load keytar dynamically
            // This allows the tool to work even if keytar build failed or isn't installed
            // @ts-ignore
            this.keytar = await Promise.resolve().then(() => __importStar(require('keytar')));
        }
        catch (e) {
            // Keytar not available, will use file fallback
            this.keytar = null;
        }
        this.initialized = true;
    }
    /**
     * Store a secret securely
     */
    async setSecret(key, value) {
        await this.ensureInitialized();
        if (this.keytar) {
            try {
                await this.keytar.setPassword(this.serviceName, key, value);
                return;
            }
            catch (e) {
                // Fallback if keytar fails - log for debugging
                if (process.env.DEBUG) {
                    console.warn('[SecretsManager] Keytar failed, using file fallback:', e);
                }
            }
        }
        this.saveToFile(key, value);
    }
    /**
     * Retrieve a secret
     */
    async getSecret(key) {
        await this.ensureInitialized();
        if (this.keytar) {
            try {
                const secret = await this.keytar.getPassword(this.serviceName, key);
                if (secret)
                    return secret;
            }
            catch (e) {
                // Fallback - log for debugging
                if (process.env.DEBUG) {
                    console.warn('[SecretsManager] Keytar retrieval failed, trying file:', e);
                }
            }
        }
        return this.loadFromFile(key);
    }
    /**
     * Delete a secret
     */
    async deleteSecret(key) {
        await this.ensureInitialized();
        if (this.keytar) {
            try {
                await this.keytar.deletePassword(this.serviceName, key);
            }
            catch (e) {
                // Log for debugging but continue to delete from file
                if (process.env.DEBUG) {
                    console.warn('[SecretsManager] Keytar delete failed:', e);
                }
            }
        }
        this.deleteFromFile(key);
    }
    // ==========================================
    // File-based Fallback (Obfuscated)
    // ==========================================
    getEncryptionKey() {
        // In a real scenario, we'd want a user-provided password or machine-specific key.
        // For this fallback, we use a static key derived from the machine's hostname/user
        // to prevent simple copy-pasting of the file to another machine.
        const machineId = os.hostname() + os.userInfo().username;
        return crypto.scryptSync(machineId, 'salt', 32);
    }
    saveToFile(key, value) {
        if (!fs.existsSync(this.configDir)) {
            fs.mkdirSync(this.configDir, { recursive: true, mode: 0o700 });
        }
        let secrets = {};
        if (fs.existsSync(this.secretsFile)) {
            try {
                const content = fs.readFileSync(this.secretsFile, 'utf8');
                secrets = JSON.parse(this.decrypt(content));
            }
            catch {
                // Corrupt or invalid, start fresh
            }
        }
        secrets[key] = value;
        const encrypted = this.encrypt(JSON.stringify(secrets));
        fs.writeFileSync(this.secretsFile, encrypted, { mode: 0o600 });
    }
    loadFromFile(key) {
        if (!fs.existsSync(this.secretsFile))
            return null;
        try {
            const content = fs.readFileSync(this.secretsFile, 'utf8');
            const secrets = JSON.parse(this.decrypt(content));
            return secrets[key] || null;
        }
        catch {
            return null;
        }
    }
    deleteFromFile(key) {
        if (!fs.existsSync(this.secretsFile))
            return;
        try {
            const content = fs.readFileSync(this.secretsFile, 'utf8');
            const secrets = JSON.parse(this.decrypt(content));
            if (secrets[key]) {
                delete secrets[key];
                const encrypted = this.encrypt(JSON.stringify(secrets));
                fs.writeFileSync(this.secretsFile, encrypted, { mode: 0o600 });
            }
        }
        catch {
            // Ignore
        }
    }
    encrypt(text) {
        const iv = crypto.randomBytes(16);
        const key = this.getEncryptionKey();
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }
    decrypt(text) {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const key = this.getEncryptionKey();
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}
exports.SecretsManager = SecretsManager;
//# sourceMappingURL=secrets.js.map