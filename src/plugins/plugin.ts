// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import * as fs from 'fs';
import { createRequire } from 'module';
import * as path from 'path';

import { Command } from 'commander';

/**
 * Base interface for plugins. Plugins export a default class or object matching this.
 */
export interface Plugin {
  /** Unique plugin name */
  name: string;

  /** Initialize plugin with tool context/config */
  initialize(program: Command): void;

  /** Execute plugin action; return true if handled */
  run(...args: any[]): Promise<boolean>;
}

/**
 * Dynamically load all plugins from a directory.
 * @param pluginDir Absolute or relative path to plugins folder
 */
export function loadPlugins(pluginDir: string): Plugin[] {
  const dir = path.resolve(pluginDir);
  if (!fs.existsSync(dir)) return [];
  const requireFromLoader = createRequire(__filename);

  // Resolve canonical (symlink-free) path and verify it matches the intended dir.
  // This prevents symlink-based path traversal attacks.
  let realDir: string;
  try {
    realDir = fs.realpathSync(dir);
  } catch {
    return [];
  }

  const plugins: Plugin[] = [];
  for (const file of fs.readdirSync(realDir)) {
    // Only load compiled JavaScript files, skip TypeScript declaration and source files
    if (!file.endsWith('.js')) continue;

    // Ensure the filename contains no path separators (prevents traversal via filenames)
    if (path.basename(file) !== file) continue;

    const pluginPath = path.join(realDir, file);
    let pluginStat: fs.Stats;
    try {
      pluginStat = fs.lstatSync(pluginPath);
    } catch {
      continue;
    }
    if (!pluginStat.isFile() || pluginStat.isSymbolicLink()) continue;

    // Verify each plugin file resolves within the allowed directory (symlink-safe)
    let realPluginPath: string;
    try {
      realPluginPath = fs.realpathSync(pluginPath);
    } catch {
      continue;
    }
    if (!realPluginPath.startsWith(realDir + path.sep) && realPluginPath !== realDir) continue;

    // Use Node's module loader after strict realpath validation of each plugin file.
    const mod = requireFromLoader(realPluginPath);
    const exportObj = mod.default || mod;
    const plugin: Plugin = typeof exportObj === 'function' ? new exportObj() : exportObj;
    if (plugin && plugin.name && typeof plugin.run === 'function') {
      plugins.push(plugin);
    }
  }
  return plugins;
}
