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
const config_1 = require("./commands/config");
const path = __importStar(require("path"));
const plugin_2 = require("../plugins/plugin");
const fs = __importStar(require("fs"));
const logger_1 = require("../core/logger");
const ui_1 = require("./utils/ui");
const interactive_1 = require("./utils/interactive");
// Resolve version from package.json (works for both ts-node dev and compiled dist)
function resolveVersion() {
    try {
        // Try to find package.json relative to this file
        const pkgPath = path.resolve(__dirname, '..', '..', 'package.json');
        if (fs.existsSync(pkgPath)) {
            const pkgContent = fs.readFileSync(pkgPath, 'utf-8');
            return JSON.parse(pkgContent).version;
        }
        // Fallback for dev environment
        const devPkgPath = path.resolve(__dirname, '..', '..', '..', 'package.json');
        if (fs.existsSync(devPkgPath)) {
            const devPkgContent = fs.readFileSync(devPkgPath, 'utf-8');
            return JSON.parse(devPkgContent).version;
        }
    }
    catch {
        // ignore
    }
    return '0.0.0-dev';
}
const program = new commander_1.Command();
const uuid_1 = require("uuid");
const telemetry_1 = require("../core/telemetry");
// Generate trace ID for this execution
const traceId = (0, uuid_1.v4)();
logger_1.logger.setTraceId(traceId);
telemetry_1.telemetry.setTraceId(traceId);
// Global error handler
process.on('unhandledRejection', (reason, promise) => {
    logger_1.logger.error('Unhandled Rejection', { promise, reason });
    ui_1.ui.error('An unexpected error occurred', String(reason));
    process.exit(1);
});
process.on('uncaughtException', (error) => {
    logger_1.logger.error('Uncaught Exception', { error });
    ui_1.ui.error('An unexpected error occurred', error.message);
    process.exit(1);
});
// Global options for accessibility / CI friendliness
program
    .option('--no-spinner', 'Disable spinners for non-TTY or CI environments')
    .option('--no-color', 'Disable ANSI colors')
    .option('--no-plugins', 'Disable plugin loading')
    .option('-q, --quiet', 'Suppress banner and non-essential output')
    .option('-i, --interactive', 'Run in interactive wizard mode');
// Custom help formatting
program.configureHelp({
    sortSubcommands: true,
    subcommandTerm: (cmd) => chalk_1.default.cyan(cmd.name()) + (cmd.alias() ? chalk_1.default.gray(`, ${cmd.alias()}`) : ''),
});
const version = resolveVersion();
program
    .name('gidevo-api-tool')
    .description(chalk_1.default.hex('#3B82F6')('Enterprise-grade API integration & code generation CLI'))
    .version(version, '-v, --version', 'Display version number')
    .addHelpText('beforeAll', () => {
    // Show banner only when explicitly asking for help
    if (!process.argv.includes('-q') && !process.argv.includes('--quiet')) {
        ui_1.ui.showBanner();
    }
    return '';
})
    .addHelpText('after', `
${chalk_1.default.hex('#F59E0B').bold('Examples:')}
  ${chalk_1.default.gray('$')} gidevo-api-tool init -t openapi
  ${chalk_1.default.gray('$')} gidevo-api-tool generate -s api.yaml -l typescript
  ${chalk_1.default.gray('$')} gidevo-api-tool validate api.yaml --strict
  ${chalk_1.default.gray('$')} gidevo-api-tool login

${chalk_1.default.gray('Documentation:')} ${chalk_1.default.cyan('https://github.com/lehrosolutions/gidevo-api-tool')}
${chalk_1.default.gray('Report issues:')} ${chalk_1.default.cyan('https://github.com/lehrosolutions/gidevo-api-tool/issues')}
`);
program
    .command('init')
    .alias('i')
    .description('Initialize a new API project')
    .option('-t, --template <type>', 'Project template (openapi, graphql)', 'openapi')
    .option('-o, --output <dir>', 'Output directory', '.')
    .addHelpText('after', `
${chalk_1.default.gray('Templates:')}
  ${chalk_1.default.cyan('openapi')}   OpenAPI 3.0 specification (default)
  ${chalk_1.default.cyan('graphql')}   GraphQL schema

${chalk_1.default.gray('Example:')}
  ${chalk_1.default.gray('$')} gidevo-api-tool init -t openapi -o my-api
`)
    .action(init_1.initCommand);
program
    .command('generate')
    .alias('gen')
    .description('Generate SDKs and documentation from API specs')
    .option('-s, --spec <file>', 'OpenAPI/GraphQL spec file (required)')
    .option('-l, --language <lang>', 'Target language (typescript, python)', 'typescript')
    .option('-o, --output <dir>', 'Output directory', './generated')
    .addHelpText('after', `
${chalk_1.default.gray('Supported languages:')}
  ${chalk_1.default.cyan('typescript')}   TypeScript SDK with type definitions (default)
  ${chalk_1.default.cyan('python')}       Python SDK with type hints

${chalk_1.default.gray('Example:')}
  ${chalk_1.default.gray('$')} gidevo-api-tool generate -s api.yaml -l typescript -o ./sdk
`)
    .action(generate_1.generateCommand);
program
    .command('validate')
    .alias('val')
    .description('Validate API specifications')
    .argument('<spec>', 'API spec file to validate')
    .option('--strict', 'Enable strict validation against full OpenAPI schema')
    .addHelpText('after', `
${chalk_1.default.gray('Validation modes:')}
  ${chalk_1.default.cyan('basic')}    Basic structure validation (default)
  ${chalk_1.default.cyan('strict')}   Full OpenAPI 3.0 schema compliance

${chalk_1.default.gray('Example:')}
  ${chalk_1.default.gray('$')} gidevo-api-tool validate api.yaml --strict
`)
    .action(validate_1.validateCommand);
program
    .command('login')
    .description('Authenticate with the API tool service')
    .option('--token <token>', 'API token (or enter interactively)')
    .addHelpText('after', `
${chalk_1.default.gray('Authentication:')}
  You can provide a token via --token flag or enter it interactively.
  Tokens are stored securely in ~/.gidevo-api-tool/config.json
  
${chalk_1.default.gray('Environment:')}
  Set GIDEVO_API_TOKEN environment variable for CI/CD pipelines.

${chalk_1.default.gray('Example:')}
  ${chalk_1.default.gray('$')} gidevo-api-tool login
  ${chalk_1.default.gray('$')} gidevo-api-tool login --token your-token
`)
    .action(login_1.loginCommand);
program
    .command('logout')
    .description('Remove stored credentials')
    .action(logout_1.logoutCommand);
program
    .command('whoami')
    .description('Display current authentication status')
    .action(whoami_1.whoamiCommand);
program
    .command('config')
    .description('View or create project configuration')
    .option('--init', 'Create a new .gidevorc.json file')
    .option('--show', 'Display current configuration (default)')
    .option('--path', 'Show config file path')
    .addHelpText('after', `
${chalk_1.default.gray('Configuration files:')}
  The tool looks for: .gidevorc.json, .gidevorc, gidevo.config.json

${chalk_1.default.gray('Examples:')}
  ${chalk_1.default.gray('$')} gidevo-api-tool config --init     Create config file
  ${chalk_1.default.gray('$')} gidevo-api-tool config --show     View current config
  ${chalk_1.default.gray('$')} gidevo-api-tool config --path     Show config file location
`)
    .action(config_1.configCommand);
program
    .command('plugin <name> [args...]')
    .alias('p')
    .description('Run a plugin by name')
    .addHelpText('after', `
${chalk_1.default.gray('Available plugins are loaded from:')}
  - dist/plugins/ (compiled)
  - src/plugins/ (development)

${chalk_1.default.gray('Example:')}
  ${chalk_1.default.gray('$')} gidevo-api-tool plugin spec-lint api.yaml
`)
    .action(plugin_1.pluginCommand);
// Check for interactive mode before parsing
const isInteractive = process.argv.includes('-i') || process.argv.includes('--interactive');
if (isInteractive) {
    // Run interactive mode wizard
    (0, interactive_1.interactiveMode)()
        .then(async ({ command, options }) => {
        switch (command) {
            case 'init':
                await (0, init_1.initCommand)(options);
                break;
            case 'generate':
                await (0, generate_1.generateCommand)(options);
                break;
            case 'validate':
                await (0, validate_1.validateCommand)(options.spec, { strict: options.strict });
                break;
            case 'login':
                await (0, login_1.loginCommand)({ token: options.token });
                break;
            case 'whoami':
                await (0, whoami_1.whoamiCommand)();
                break;
        }
    })
        .catch((error) => {
        if (error.message !== 'Wizard cancelled by user') {
            ui_1.ui.error('Interactive mode failed', error.message);
        }
        else {
            console.log('\n  Operation cancelled.\n');
        }
        process.exit(1);
    });
}
else {
    // Plugin system integration (prefer dist/plugins when packaged, fall back to src/plugins for dev)
    // Check for --no-plugins flag in argv before parsing to prevent loading
    const disablePlugins = process.argv.includes('--no-plugins');
    if (!disablePlugins) {
        const candidatePluginDirs = [
            path.resolve(__dirname, '..', 'plugins'), // dist/plugins after build
            path.resolve(__dirname, '..', '..', 'src', 'plugins'), // running from ts-node in src
        ];
        const pluginDir = candidatePluginDirs.find(d => fs.existsSync(d)) || candidatePluginDirs[0];
        try {
            const plugins = (0, plugin_2.loadPlugins)(pluginDir);
            plugins.forEach(plugin => {
                try {
                    plugin.initialize(program);
                }
                catch (e) {
                    logger_1.logger.error(`Failed to initialize plugin ${plugin.name}`, { error: e });
                }
            });
        }
        catch (e) {
            // Plugin directory might not exist or other error, just log debug
            // logger.debug('No plugins loaded');
        }
    }
    program.parse();
}
//# sourceMappingURL=index.js.map