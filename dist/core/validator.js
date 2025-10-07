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
exports.Validator = void 0;
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const yaml = __importStar(require("js-yaml"));
class Validator {
    async validate(specPath) {
        const errors = [];
        try {
            const content = fs.readFileSync(specPath, 'utf8');
            const ext = path.extname(specPath).toLowerCase();
            let parsed;
            if (ext === '.json') {
                parsed = JSON.parse(content);
            }
            else if (ext === '.yaml' || ext === '.yml') {
                // Load YAML and enforce presence of openapi field
                try {
                    parsed = yaml.load(content);
                }
                catch (e) {
                    throw new Error(`Failed to parse spec: ${e}`);
                }
                if (parsed === null || typeof parsed !== 'object' || !('openapi' in parsed)) {
                    throw new Error('Failed to parse spec: Invalid or missing openapi field');
                }
            }
            else if (ext === '.graphql' || ext === '.gql') {
                return { valid: true, errors: [] }; // Basic validation for now
            }
            else {
                errors.push(`Unsupported file format: ${ext}`);
                return { valid: false, errors };
            }
            // Basic OpenAPI validation
            if (parsed.openapi) {
                if (!parsed.info || !parsed.info.title) {
                    errors.push('Missing required field: info.title');
                }
                if (!parsed.info || !parsed.info.version) {
                    errors.push('Missing required field: info.version');
                }
                if (!parsed.paths || Object.keys(parsed.paths).length === 0) {
                    errors.push('No paths defined');
                }
            }
            return { valid: errors.length === 0, errors };
        }
        catch (error) {
            errors.push(`Failed to parse spec: ${error}`);
            return { valid: false, errors };
        }
    }
}
exports.Validator = Validator;
//# sourceMappingURL=validator.js.map