"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
const chalk_1 = __importDefault(require("chalk"));
const generator_1 = require("../core/generator");
class GoGeneratorPlugin {
    constructor() {
        this.name = 'GoGenerator';
    }
    initialize(_program) {
        // No special initialization required
    }
    async run(specPath, outputDir) {
        console.log(chalk_1.default.blue(`GoGenerator: generating from ${specPath}`));
        const gen = new generator_1.CodeGenerator();
        try {
            await gen.generate({ spec: specPath, language: 'go', outputDir });
            console.log(chalk_1.default.green(`✅ Go SDK generated at ${outputDir}`));
            return true;
        }
        catch (error) {
            console.log(chalk_1.default.red('Generation error:'), error);
            return false;
        }
    }
}
exports.default = GoGeneratorPlugin;
//# sourceMappingURL=goGenerator.js.map