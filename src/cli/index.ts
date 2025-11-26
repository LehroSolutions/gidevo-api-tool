#!/usr/bin/env node

// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { generateCommand } from './commands/generate';
import { validateCommand } from './commands/validate';
import { loginCommand } from './commands/login';
import { pluginCommand } from './commands/plugin';
import { logoutCommand } from './commands/logout';
import { whoamiCommand } from './commands/whoami';
import { configCommand } from './commands/config';
import * as path from 'path';
import { loadPlugins } from '../plugins/plugin';
import * as fs from 'fs';
import { logger } from '../core/logger';
import { ui } from './utils/ui';
import { interactiveMode } from './utils/interactive';

// Resolve version from package.json (works for both ts-node dev and compiled dist)
function resolveVersion(): string {
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
  } catch {
    // ignore
  }
  return '0.0.0-dev';
}

const program = new Command();

import { v4 as uuidv4 } from 'uuid';

import { telemetry } from '../core/telemetry';

// Generate trace ID for this execution
const traceId = uuidv4();
logger.setTraceId(traceId);
telemetry.setTraceId(traceId);

// Global error handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { promise, reason });
  ui.error('An unexpected error occurred', String(reason));
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error });
  ui.error('An unexpected error occurred', error.message);
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
  subcommandTerm: (cmd) => chalk.cyan(cmd.name()) + (cmd.alias() ? chalk.gray(`, ${cmd.alias()}`) : ''),
});

const version = resolveVersion();

program
  .name('gidevo-api-tool')
  .description(chalk.hex('#3B82F6')('Enterprise-grade API integration & code generation CLI'))
  .version(version, '-v, --version', 'Display version number')
  .addHelpText('beforeAll', () => {
    // Show banner only when explicitly asking for help
    if (!process.argv.includes('-q') && !process.argv.includes('--quiet')) {
      ui.showBanner();
    }
    return '';
  })
  .addHelpText('after', `
${chalk.hex('#F59E0B').bold('Examples:')}
  ${chalk.gray('$')} gidevo-api-tool init -t openapi
  ${chalk.gray('$')} gidevo-api-tool generate -s api.yaml -l typescript
  ${chalk.gray('$')} gidevo-api-tool validate api.yaml --strict
  ${chalk.gray('$')} gidevo-api-tool login

${chalk.gray('Documentation:')} ${chalk.cyan('https://github.com/lehrosolutions/gidevo-api-tool')}
${chalk.gray('Report issues:')} ${chalk.cyan('https://github.com/lehrosolutions/gidevo-api-tool/issues')}
`);

program
  .command('init')
  .alias('i')
  .description('Initialize a new API project')
  .option('-t, --template <type>', 'Project template (openapi, graphql)', 'openapi')
  .option('-o, --output <dir>', 'Output directory', '.')
  .addHelpText('after', `
${chalk.gray('Templates:')}
  ${chalk.cyan('openapi')}   OpenAPI 3.0 specification (default)
  ${chalk.cyan('graphql')}   GraphQL schema

${chalk.gray('Example:')}
  ${chalk.gray('$')} gidevo-api-tool init -t openapi -o my-api
`)
  .action(initCommand);

program
  .command('generate')
  .alias('gen')
  .description('Generate SDKs and documentation from API specs')
  .option('-s, --spec <file>', 'OpenAPI/GraphQL spec file (required)')
  .option('-l, --language <lang>', 'Target language (typescript, python)', 'typescript')
  .option('-o, --output <dir>', 'Output directory', './generated')
  .addHelpText('after', `
${chalk.gray('Supported languages:')}
  ${chalk.cyan('typescript')}   TypeScript SDK with type definitions (default)
  ${chalk.cyan('python')}       Python SDK with type hints

${chalk.gray('Example:')}
  ${chalk.gray('$')} gidevo-api-tool generate -s api.yaml -l typescript -o ./sdk
`)
  .action(generateCommand);

program
  .command('validate')
  .alias('val')
  .description('Validate API specifications')
  .argument('<spec>', 'API spec file to validate')
  .option('--strict', 'Enable strict validation against full OpenAPI schema')
  .addHelpText('after', `
${chalk.gray('Validation modes:')}
  ${chalk.cyan('basic')}    Basic structure validation (default)
  ${chalk.cyan('strict')}   Full OpenAPI 3.0 schema compliance

${chalk.gray('Example:')}
  ${chalk.gray('$')} gidevo-api-tool validate api.yaml --strict
`)
  .action(validateCommand);

program
  .command('login')
  .description('Authenticate with the API tool service')
  .option('--token <token>', 'API token (or enter interactively)')
  .addHelpText('after', `
${chalk.gray('Authentication:')}
  You can provide a token via --token flag or enter it interactively.
  Tokens are stored securely in ~/.gidevo-api-tool/config.json
  
${chalk.gray('Environment:')}
  Set GIDEVO_API_TOKEN environment variable for CI/CD pipelines.

${chalk.gray('Example:')}
  ${chalk.gray('$')} gidevo-api-tool login
  ${chalk.gray('$')} gidevo-api-tool login --token your-token
`)
  .action(loginCommand);

program
  .command('logout')
  .description('Remove stored credentials')
  .action(logoutCommand);

program
  .command('whoami')
  .description('Display current authentication status')
  .action(whoamiCommand);

program
  .command('config')
  .description('View or create project configuration')
  .option('--init', 'Create a new .gidevorc.json file')
  .option('--show', 'Display current configuration (default)')
  .option('--path', 'Show config file path')
  .addHelpText('after', `
${chalk.gray('Configuration files:')}
  The tool looks for: .gidevorc.json, .gidevorc, gidevo.config.json

${chalk.gray('Examples:')}
  ${chalk.gray('$')} gidevo-api-tool config --init     Create config file
  ${chalk.gray('$')} gidevo-api-tool config --show     View current config
  ${chalk.gray('$')} gidevo-api-tool config --path     Show config file location
`)
  .action(configCommand);

program
  .command('plugin <name> [args...]')
  .alias('p')
  .description('Run a plugin by name')
  .addHelpText('after', `
${chalk.gray('Available plugins are loaded from:')}
  - dist/plugins/ (compiled)
  - src/plugins/ (development)

${chalk.gray('Example:')}
  ${chalk.gray('$')} gidevo-api-tool plugin spec-lint api.yaml
`)
  .action(pluginCommand);

// Check for interactive mode before parsing
const isInteractive = process.argv.includes('-i') || process.argv.includes('--interactive');

if (isInteractive) {
  // Run interactive mode wizard
  interactiveMode()
    .then(async ({ command, options }) => {
      switch (command) {
        case 'init':
          await initCommand(options);
          break;
        case 'generate':
          await generateCommand(options);
          break;
        case 'validate':
          await validateCommand(options.spec, { strict: options.strict });
          break;
        case 'login':
          await loginCommand({ token: options.token });
          break;
        case 'whoami':
          await whoamiCommand();
          break;
      }
    })
    .catch((error) => {
      if (error.message !== 'Wizard cancelled by user') {
        ui.error('Interactive mode failed', error.message);
      } else {
        console.log('\n  Operation cancelled.\n');
      }
      process.exit(1);
    });
} else {
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
      const plugins = loadPlugins(pluginDir);
      plugins.forEach(plugin => {
        try {
          plugin.initialize(program);
        } catch (e) {
          logger.error(`Failed to initialize plugin ${plugin.name}`, { error: e });
        }
      });
    } catch (e) {
      // Plugin directory might not exist or other error, just log debug
      // logger.debug('No plugins loaded');
    }
  }

  program.parse();
}
