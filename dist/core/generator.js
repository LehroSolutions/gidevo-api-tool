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
exports.CodeGenerator = void 0;
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const yaml = __importStar(require("js-yaml"));
const validator_1 = require("./validator");
const TypeScriptStrategy_1 = require("./strategies/TypeScriptStrategy");
const PythonStrategy_1 = require("./strategies/PythonStrategy");
const logger_1 = require("./logger");
class CodeGenerator {
    constructor() {
        this.strategies = new Map();
        this.strategies.set('typescript', new TypeScriptStrategy_1.TypeScriptStrategy());
        this.strategies.set('python', new PythonStrategy_1.PythonStrategy());
    }
    async generate(options) {
        const { spec, language, outputDir } = options;
        logger_1.logger.info(`Starting generation for ${language} from ${spec}`);
        // Validate first
        const validator = new validator_1.Validator();
        const validation = await validator.validate(spec);
        if (!validation.valid) {
            const errorMsg = `Spec validation failed:\n${validation.errors.join('\n')}`;
            logger_1.logger.error(errorMsg);
            throw new Error(errorMsg);
        }
        const specContent = await fs.promises.readFile(spec, 'utf8');
        const parsedSpec = this.parseSpec(spec, specContent);
        await fs.promises.mkdir(outputDir, { recursive: true });
        const strategy = this.strategies.get(language);
        if (!strategy) {
            const errorMsg = `Unsupported language: ${language}`;
            logger_1.logger.error(errorMsg);
            throw new Error(errorMsg);
        }
        await strategy.generate(parsedSpec, outputDir);
        logger_1.logger.info(`Generation completed successfully in ${outputDir}`);
    }
    parseSpec(filePath, content) {
        const ext = path.extname(filePath).toLowerCase();
        if (ext === '.json') {
            return JSON.parse(content);
        }
        else if (ext === '.yaml' || ext === '.yml') {
            return yaml.load(content);
        }
        else if (ext === '.graphql' || ext === '.gql') {
            return { type: 'graphql', schema: content };
        }
        throw new Error(`Unsupported spec format: ${ext}`);
    }
}
exports.CodeGenerator = CodeGenerator;
//# sourceMappingURL=generator.js.map