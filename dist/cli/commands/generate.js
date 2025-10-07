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
exports.generateCommand = generateCommand;
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const spinner_1 = require("../utils/spinner");
const generator_1 = require("../../core/generator");
async function generateCommand(options) {
    const { spec, language, output } = options;
    if (!fs.existsSync(spec)) {
        console.log(chalk_1.default.red(`Spec file not found: ${spec}`));
        return;
    }
    const spinner = await (0, spinner_1.createSpinner)(`Generating ${language} SDK from ${spec}`);
    if (spinner.start)
        spinner.start();
    const generator = new generator_1.CodeGenerator();
    try {
        await generator.generate({ spec, language, outputDir: output });
        spinner.stop();
        console.log(chalk_1.default.green('✅ Generation completed successfully!'));
        console.log(chalk_1.default.yellow(`Output: ${path.resolve(output)}`));
    }
    catch (error) {
        spinner.stop();
        console.log(chalk_1.default.red('Generation failed:'), error);
    }
}
//# sourceMappingURL=generate.js.map