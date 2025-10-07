#!/usr/bin/env node
"use strict";
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
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
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const init_1 = require("./commands/init");
const generate_1 = require("./commands/generate");
const validate_1 = require("./commands/validate");
const login_1 = require("./commands/login");
const plugin_1 = require("./commands/plugin");
const logout_1 = require("./commands/logout");
const whoami_1 = require("./commands/whoami");
const path = __importStar(require("path"));
const plugin_2 = require("../plugins/plugin");
const fs = __importStar(require("fs"));
// Resolve version from package.json (works for both ts-node dev and compiled dist)
function resolveVersion() {
    const pkgCandidates = [
        path.resolve(__dirname, '..', '..', 'package.json'), // dist structure after build
        path.resolve(__dirname, '..', '..', '..', 'package.json'), // src execution via ts-node
    ];
    for (const p of pkgCandidates) {
        if (fs.existsSync(p)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
                if (pkg.version)
                    return pkg.version;
            }
            catch { /* ignore */ }
        }
    }
    return '0.0.0-dev';
}
const program = new commander_1.Command();
// Global options for accessibility / CI friendliness
program
    .option('--no-spinner', 'Disable spinners for non-TTY or CI environments')
    .option('--no-color', 'Disable ANSI colors');
program
    .name('gidevo-api-tool')
    .description('Enterprise-grade API integration tool')
    .version(resolveVersion());
program
    .command('init')
    .description('Initialize a new API project')
    .option('-t, --template <type>', 'Project template (openapi, graphql)', 'openapi')
    .option('-o, --output <dir>', 'Output directory', '.')
    .action(init_1.initCommand);
program
    .command('generate')
    .description('Generate SDKs and documentation from API specs')
    .option('-s, --spec <file>', 'OpenAPI/GraphQL spec file')
    .option('-l, --language <lang>', 'Target language (typescript, python)', 'typescript')
    .option('-o, --output <dir>', 'Output directory', './generated')
    .action(generate_1.generateCommand);
program
    .command('validate')
    .description('Validate API specifications')
    .argument('<spec>', 'API spec file to validate')
    .action(validate_1.validateCommand);
program
    .command('login')
    .description('Authenticate with the API tool service')
    .option('--token <token>', 'API token')
    .action(login_1.loginCommand);
program
    .command('logout')
    .description('Remove stored credentials')
    .action(logout_1.logoutCommand);
// WhoAmI command to show current authentication status
// Single whoami command registration
program
    .command('whoami')
    .description('Display current authentication status')
    .action(whoami_1.whoamiCommand);
program
    .command('plugin <name> [args...]')
    .description('Run a plugin by name')
    .action(plugin_1.pluginCommand);
program.parse();
// Plugin system integration (prefer dist/plugins when packaged, fall back to src/plugins for dev)
const candidatePluginDirs = [
    path.resolve(__dirname, '..', 'plugins'), // dist/plugins after build
    path.resolve(__dirname, '..', '..', 'src', 'plugins'), // running from ts-node in src
];
const pluginDir = candidatePluginDirs.find(d => fs.existsSync(d)) || candidatePluginDirs[0];
const plugins = (0, plugin_2.loadPlugins)(pluginDir);
plugins.forEach(plugin => {
    console.log(chalk_1.default.green(`Loaded plugin: ${plugin.name}`));
    try {
        plugin.initialize();
    }
    catch (e) {
        console.log(chalk_1.default.red(`Failed to initialize plugin ${plugin.name}:`), e);
    }
});
//# sourceMappingURL=index.js.map