// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import * as path from 'path';
import * as fs from 'fs';
import { loadPlugins } from '../../plugins/plugin';
import { ui } from '../utils/ui';
import { createSpinner } from '../utils/spinner';

/**
 * Run a registered plugin by name.
 * Args are passed directly to plugin.run(...args).
 */
export async function pluginCommand(name: string, args: string[]): Promise<void> {
  ui.showCompactBanner();
  ui.sectionHeader('EXTENSION RUNTIME');

  // Determine plugin directory: prefer compiled dist/plugins, fallback to src/plugins
  const candidatePluginDirs = [
    path.resolve(__dirname, '..', '..', 'plugins'),      // dist/plugins after build
    path.resolve(__dirname, '..', '..', '..', 'src', 'plugins'), // src/plugins during development
  ];
  const pluginDir = candidatePluginDirs.find(d => fs.existsSync(d)) || candidatePluginDirs[0];

  let plugins;
  try {
    plugins = loadPlugins(pluginDir);
  } catch (error: any) {
    ui.error('Extension Load Failed', error.message);
    process.exit(1);
  }

  // List available plugins if requested
  if (name === 'list' || name === '--list') {
    if (plugins.length === 0) {
      ui.warning('No Extensions Detected', `Scanned: ${ui.filePath(pluginDir)}`);
    } else {
      ui.sectionHeader('REGISTERED EXTENSIONS');
      plugins.forEach(plugin => {
        console.log(`    ${ui.highlight(plugin.name)}`);
      });
    }
    return;
  }

  const plugin = plugins.find(p => p.name.toLowerCase() === name.toLowerCase());

  if (!plugin) {
    ui.error('Extension Unknown', `"${name}" not in registry`);

    if (plugins.length > 0) {
      ui.sectionHeader('REGISTERED EXTENSIONS');
      plugins.forEach(p => {
        console.log(`    ${ui.highlight(p.name)}`);
      });
    } else {
      ui.warning('Registry Empty', `Scanned: ${ui.filePath(pluginDir)}`);
    }

    process.exit(1);
  }

  ui.info('Invocation', ui.highlight(plugin.name));
  if (args.length > 0) {
    ui.keyValue('Parameters', args.join(' '));
  }

  const spinner = await createSpinner(`Executing extension...`);
  if (spinner.start) spinner.start();

  try {
    const startTime = Date.now();
    const success = await plugin.run(...args);
    const duration = Date.now() - startTime;

    spinner.stop();

    if (!success) {
      ui.error(`Extension Execution Failed`, plugin.name);
      process.exit(1);
    }

    ui.success(`Extension Complete`, `${plugin.name} | ${formatDuration(duration)}`);
  } catch (error: any) {
    spinner.stop();
    ui.error(`Extension Runtime Error`, `${plugin.name}: ${error.message}`);
    process.exit(1);
  }
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}
