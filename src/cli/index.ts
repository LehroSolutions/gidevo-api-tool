#!/usr/bin/env node

// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2025 LEHRO Solutions

import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { Command } from 'commander';
import chalk from 'chalk';
import { configCommand } from './commands/config.js';
import { doctorCommand } from './commands/doctor.js';
import { generateCommand } from './commands/generate.js';
import { initCommand } from './commands/init.js';
import { loginCommand } from './commands/login.js';
import { logoutCommand } from './commands/logout.js';
import { pluginCommand } from './commands/plugin.js';
import { validateCommand } from './commands/validate.js';
import { whoamiCommand } from './commands/whoami.js';
import { workflowCommand } from './commands/workflow.js';
import { configureUi, ui } from './utils/ui.js';
import { logger } from '../core/logger.js';
import { dirnameFromMetaUrl, filenameFromMetaUrl } from '../core/runtime.js';
import { telemetry } from '../core/telemetry.js';
import { loadPlugins } from '../plugins/plugin.js';

const currentDir = dirnameFromMetaUrl(import.meta.url);
const currentFile = filenameFromMetaUrl(import.meta.url);
let handlersInstalled = false;

interface CreateProgramOptions {
  argv?: string[];
}

export function createProgram(options: CreateProgramOptions = {}): Command {
  const argv = options.argv ?? process.argv;
  configureUiFromArgv(argv);

  const program = new Command();
  const version = resolveVersion();

  program
    .name('gidevo-api-tool')
    .description('Agentic API integration and SDK generation CLI')
    .version(version, '-v, --version', 'Display version number')
    .option('--no-spinner', 'Disable spinners for non-TTY, CI, or screen reader workflows')
    .option('--no-color', 'Disable ANSI color output')
    .option('--no-plugins', 'Disable plugin loading')
    .option('-q, --quiet', 'Suppress banner and non-essential output')
    .option('-i, --interactive', 'Run in interactive wizard mode')
    .hook('preAction', (root) => {
      const opts = root.opts();
      configureUi({
        quiet: Boolean(opts.quiet),
        noColor: opts.color === false,
        noSpinner: opts.spinner === false,
      });
    });

  program.configureHelp({
    sortSubcommands: true,
    subcommandTerm: (cmd) =>
      chalk.cyan(cmd.name()) + (cmd.alias() ? chalk.gray(`, ${cmd.alias()}`) : ''),
  });

  program.addHelpText('beforeAll', () => {
    ui.showBanner();
    return '';
  });

  program.addHelpText(
    'after',
    `
${chalk.bold('Examples:')}
  ${chalk.gray('$')} gidevo-api-tool doctor --spec api.yaml
  ${chalk.gray('$')} gidevo-api-tool workflow --spec api.yaml --language typescript --dry-run
  ${chalk.gray('$')} gidevo-api-tool generate -s api.yaml -l typescript
  ${chalk.gray('$')} gidevo-api-tool validate api.yaml --strict

${chalk.gray('Documentation:')} ${chalk.cyan('https://github.com/lehrosolutions/gidevo-api-tool')}
${chalk.gray('Report issues:')} ${chalk.cyan('https://github.com/lehrosolutions/gidevo-api-tool/issues')}
`
  );

  registerCommands(program);

  return program;
}

export async function run(argv: string[] = process.argv): Promise<void> {
  installProcessHandlers();
  configureTrace();
  configureUiFromArgv(argv);

  if (argv.includes('-i') || argv.includes('--interactive')) {
    await runInteractiveMode();
    return;
  }

  const program = createProgram({ argv });
  if (!argv.includes('--no-plugins')) {
    await registerPluginCommands(program);
  }
  await program.parseAsync(argv);
}

function registerCommands(program: Command): void {
  program
    .command('init')
    .alias('i')
    .description('Initialize a new API project')
    .option('-t, --template <type>', 'Project template (openapi, graphql)', 'openapi')
    .option('-o, --output <dir>', 'Output directory', '.')
    .addHelpText(
      'after',
      `
${chalk.gray('Templates:')}
  ${chalk.cyan('openapi')}   OpenAPI 3.x project (default)
  ${chalk.cyan('graphql')}   GraphQL schema project

${chalk.gray('Example:')}
  ${chalk.gray('$')} gidevo-api-tool init -t openapi -o my-api
`
    )
    .action(initCommand);

  program
    .command('generate')
    .alias('gen')
    .description('Generate an SDK from an API specification')
    .option('-s, --spec <file>', 'OpenAPI/GraphQL spec file')
    .option('-l, --language <lang>', 'Target language (typescript, python, go)', 'typescript')
    .option('-o, --output <dir>', 'Output directory', './generated')
    .option(
      '--allow-outside-project',
      'Allow spec/output paths outside current project root (unsafe override)'
    )
    .addHelpText(
      'after',
      `
${chalk.gray('Supported languages:')}
  ${chalk.cyan('typescript')}   TypeScript SDK with type definitions (default)
  ${chalk.cyan('python')}       Python SDK with type hints
  ${chalk.cyan('go')}           Go SDK with generated client and types

${chalk.gray('Example:')}
  ${chalk.gray('$')} gidevo-api-tool generate -s api.yaml -l typescript -o ./sdk
`
    )
    .action(generateCommand);

  program
    .command('validate')
    .alias('val')
    .description('Validate an API specification')
    .argument('<spec>', 'API spec file to validate')
    .option('--strict', 'Enable strict validation against full OpenAPI schema')
    .addHelpText(
      'after',
      `
${chalk.gray('Validation modes:')}
  ${chalk.cyan('basic')}    Basic structure validation (default)
  ${chalk.cyan('strict')}   Full OpenAPI 3.x schema compliance

${chalk.gray('Example:')}
  ${chalk.gray('$')} gidevo-api-tool validate api.yaml --strict
`
    )
    .action(validateCommand);

  program
    .command('doctor')
    .description('Run read-only project health checks')
    .option('-s, --spec <file>', 'Spec file to include in health checks')
    .option('-o, --output <dir>', 'Output directory to check', './generated')
    .option('--strict', 'Use strict validation for the spec check')
    .option('--json', 'Print machine-readable JSON')
    .option('--allow-outside-project', 'Allow paths outside current project root')
    .action(doctorCommand);

  program
    .command('workflow')
    .description('Validate a spec, then generate an SDK')
    .option('-s, --spec <file>', 'OpenAPI/GraphQL spec file')
    .option('-l, --language <lang>', 'Target language (typescript, python, go)')
    .option('-o, --output <dir>', 'Output directory')
    .option('--strict', 'Use strict validation before generation')
    .option('--dry-run', 'Validate and report planned actions without writing files')
    .option('--json', 'Print machine-readable JSON')
    .option('--allow-outside-project', 'Allow paths outside current project root')
    .action(workflowCommand);

  program
    .command('login')
    .description('Store an API token')
    .option('--token <token>', 'API token (or enter interactively)')
    .action(loginCommand);

  program.command('logout').description('Remove stored credentials').action(logoutCommand);

  program.command('whoami').description('Display authentication status').action(whoamiCommand);

  program
    .command('config')
    .description('View or create project configuration')
    .option('--init', 'Create a new .gidevorc.json file')
    .option('--show', 'Display current configuration (default)')
    .option('--path', 'Show config file path')
    .action(configCommand);

  program
    .command('plugin <name> [args...]')
    .alias('p')
    .description('Run a plugin by name')
    .addHelpText(
      'after',
      `
${chalk.gray('Examples:')}
  ${chalk.gray('$')} gidevo-api-tool plugin list
  ${chalk.gray('$')} gidevo-api-tool plugin spec-lint api.yaml
`
    )
    .action((name: string, args: string[] = []) => pluginCommand(name, args));
}

async function registerPluginCommands(program: Command): Promise<void> {
  const candidatePluginDirs = [
    path.resolve(currentDir, '..', 'plugins'),
    path.resolve(currentDir, '..', '..', 'src', 'plugins'),
  ];
  const pluginDir = candidatePluginDirs.find((dir) => fs.existsSync(dir)) || candidatePluginDirs[0];

  try {
    const plugins = await loadPlugins(pluginDir);
    plugins.forEach((plugin) => {
      try {
        plugin.initialize(program);
      } catch (error) {
        logger.error(`Failed to initialize plugin ${plugin.name}`, { error });
      }
    });
  } catch {
    // Plugin loading is optional. The explicit `plugin` command reports detailed failures.
  }
}

async function runInteractiveMode(): Promise<void> {
  const { interactiveMode } = await import('./utils/interactive.js');
  const { command, options } = await interactiveMode();

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
    case 'doctor':
      await doctorCommand(options);
      break;
    case 'workflow':
      await workflowCommand(options);
      break;
    case 'login':
      await loginCommand({ token: options.token });
      break;
    case 'whoami':
      await whoamiCommand();
      break;
  }
}

function resolveVersion(): string {
  const candidatePaths = [
    path.resolve(currentDir, '..', '..', 'package.json'),
    path.resolve(currentDir, '..', '..', '..', 'package.json'),
  ];

  for (const pkgPath of candidatePaths) {
    try {
      if (fs.existsSync(pkgPath)) {
        return JSON.parse(fs.readFileSync(pkgPath, 'utf-8')).version;
      }
    } catch {
      // Continue to fallback.
    }
  }

  return '0.0.0-dev';
}

function configureTrace(): void {
  const traceId = randomUUID();
  logger.setTraceId(traceId);
  telemetry.setTraceId(traceId);
}

function configureUiFromArgv(argv: string[]): void {
  configureUi({
    quiet: argv.includes('-q') || argv.includes('--quiet'),
    noColor: argv.includes('--no-color'),
    noSpinner: argv.includes('--no-spinner'),
  });
}

function installProcessHandlers(): void {
  if (handlersInstalled) return;
  handlersInstalled = true;

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled rejection', { promise, reason });
    ui.error('An unexpected error occurred', String(reason));
    process.exit(1);
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', { error });
    ui.error('An unexpected error occurred', error.message);
    process.exit(1);
  });
}

if (currentFile === path.resolve(process.argv[1] ?? '')) {
  run().catch((error) => {
    ui.error('CLI failed', error.message);
    process.exit(1);
  });
}
