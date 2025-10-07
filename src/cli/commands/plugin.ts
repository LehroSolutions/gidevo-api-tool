// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';
import { loadPlugins } from '../../plugins/plugin';

/**
 * Run a registered plugin by name.
 * Args are passed directly to plugin.run(...args).
 */
export async function pluginCommand(name: string, args: string[]): Promise<void> {
  // Determine plugin directory: prefer compiled dist/plugins, fallback to src/plugins
  const candidatePluginDirs = [
    path.resolve(__dirname, '..', '..', 'plugins'),      // dist/plugins after build
    path.resolve(__dirname, '..', '..', '..', 'src', 'plugins'), // src/plugins during development
  ];
  const pluginDir = candidatePluginDirs.find(d => fs.existsSync(d)) || candidatePluginDirs[0];
  const plugins = loadPlugins(pluginDir);
  const plugin = plugins.find(p => p.name.toLowerCase() === name.toLowerCase());
  if (!plugin) {
    console.log(chalk.red(`Plugin not found: ${name}`));
    process.exit(1);
  }
  console.log(chalk.blue(`Running plugin: ${plugin.name}`));
  const success = await plugin.run(...args);
  if (!success) {
    console.log(chalk.red(`Plugin ${plugin.name} failed.`));
    process.exit(1);
  }
  console.log(chalk.green(`Plugin ${plugin.name} completed successfully.`));
  // no return; Commander actions expect void
return;
}
