"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
const chalk_1 = __importDefault(require("chalk"));
const generator_1 = require("../core/generator");
class TypeScriptGeneratorPlugin {
    constructor() {
        this.name = 'TypeScriptGenerator';
    }
    initialize(_program) {
        // no initialization needed
    }
    async run(specPath, outputDir) {
        console.log(chalk_1.default.blue(`TypeScriptGenerator: generating from ${specPath}`));
        const gen = new generator_1.CodeGenerator();
        try {
            await gen.generate({ spec: specPath, language: 'typescript', outputDir });
            console.log(chalk_1.default.green(`✅ TS SDK generated at ${outputDir}`));
            return true;
        }
        catch (error) {
            console.log(chalk_1.default.red('Generation error:'), error);
            return false;
        }
    }
}
exports.default = TypeScriptGeneratorPlugin;
//# sourceMappingURL=typescriptGenerator.js.map