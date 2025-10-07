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
exports.initCommand = initCommand;
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const spinner_1 = require("../utils/spinner");
async function initCommand(options) {
    const { template, output } = options;
    const targetDir = path.resolve(output);
    if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
        console.log(chalk_1.default.red('Directory is not empty. Aborting.'));
        return;
    }
    // Spinner for initialization
    const spinner = await (0, spinner_1.createSpinner)(`Initializing new ${template} project in ${targetDir}`);
    // Start if start method exists (for real spinner)
    if (spinner.start)
        spinner.start();
    // Create directory structure
    fs.mkdirSync(targetDir, { recursive: true });
    fs.mkdirSync(path.join(targetDir, 'specs'));
    fs.mkdirSync(path.join(targetDir, 'generated'));
    fs.mkdirSync(path.join(targetDir, 'tests'));
    // Create base files
    const packageJson = {
        name: path.basename(targetDir),
        version: '1.0.0',
        description: 'Generated API project',
        scripts: {
            generate: 'gidevo-api-tool generate',
            validate: 'gidevo-api-tool validate'
        }
    };
    fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(packageJson, null, 2));
    // Create sample spec based on template
    if (template === 'openapi') {
        const spec = {
            openapi: '3.0.0',
            info: { title: 'My API', version: '1.0.0' },
            paths: {
                '/health': {
                    get: {
                        summary: 'Health check',
                        responses: { '200': { description: 'OK' } }
                    }
                }
            }
        };
        fs.writeFileSync(path.join(targetDir, 'specs', 'api.yaml'), JSON.stringify(spec, null, 2));
    }
    else if (template === 'graphql') {
        const schema = `
type Query {
  hello: String
}

schema {
  query: Query
}
    `.trim();
        fs.writeFileSync(path.join(targetDir, 'specs', 'schema.graphql'), schema);
    }
    // Stop spinner and display success messages
    spinner.stop();
    console.log(chalk_1.default.green('✅ Project initialized successfully!'));
    console.log(chalk_1.default.yellow('Next steps:'));
    console.log('  cd', path.basename(targetDir));
    console.log('  gidevo-api-tool generate');
}
//# sourceMappingURL=init.js.map