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
import * as path from 'path';
import { loadPlugins } from '../plugins/plugin';
import * as fs from 'fs';

// Resolve version from package.json (works for both ts-node dev and compiled dist)
function resolveVersion(): string {
  const pkgCandidates = [
    path.resolve(__dirname, '..', '..', 'package.json'), // dist structure after build
    path.resolve(__dirname, '..', '..', '..', 'package.json'), // src execution via ts-node
  ];
  for (const p of pkgCandidates) {
    if (fs.existsSync(p)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
        if (pkg.version) return pkg.version;
      } catch {/* ignore */}
    }
  }
  return '0.0.0-dev';
}

const program = new Command();

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
  .action(initCommand);

program
  .command('generate')
  .description('Generate SDKs and documentation from API specs')
  .option('-s, --spec <file>', 'OpenAPI/GraphQL spec file')
  .option('-l, --language <lang>', 'Target language (typescript, python)', 'typescript')
  .option('-o, --output <dir>', 'Output directory', './generated')
  .action(generateCommand);

program
  .command('validate')
  .description('Validate API specifications')
  .argument('<spec>', 'API spec file to validate')
  .action(validateCommand);

program
  .command('login')
  .description('Authenticate with the API tool service')
  .option('--token <token>', 'API token')
  .action(loginCommand);

program
  .command('logout')
  .description('Remove stored credentials')
  .action(logoutCommand);
// WhoAmI command to show current authentication status
// Single whoami command registration

program
  .command('whoami')
  .description('Display current authentication status')
  .action(whoamiCommand);

program
  .command('plugin <name> [args...]')
  .description('Run a plugin by name')
  .action(pluginCommand);

program.parse();

// Plugin system integration (prefer dist/plugins when packaged, fall back to src/plugins for dev)
const candidatePluginDirs = [
  path.resolve(__dirname, '..', 'plugins'), // dist/plugins after build
  path.resolve(__dirname, '..', '..', 'src', 'plugins'), // running from ts-node in src
];
const pluginDir = candidatePluginDirs.find(d => fs.existsSync(d)) || candidatePluginDirs[0];
const plugins = loadPlugins(pluginDir);
plugins.forEach(plugin => {
  console.log(chalk.green(`Loaded plugin: ${plugin.name}`));
  try {
    plugin.initialize();
  } catch (e) {
    console.log(chalk.red(`Failed to initialize plugin ${plugin.name}:`), e);
  }
});
