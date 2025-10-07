// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import * as fs from 'fs';
import * as path from 'path';

/**
 * Base interface for plugins. Plugins export a default class or object matching this.
 */
export interface Plugin {
  /** Unique plugin name */
  name: string;

  /** Initialize plugin with tool context/config */
  initialize(options?: any): void;

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

  const plugins: Plugin[] = [];
  for (const file of fs.readdirSync(dir)) {
    // Only load compiled JavaScript files, skip TypeScript declaration and source files
    if (!file.endsWith('.js')) continue;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require(path.join(dir, file));
    const exportObj = mod.default || mod;
    const plugin: Plugin = typeof exportObj === 'function' ? new exportObj() : exportObj;
    if (plugin && plugin.name && typeof plugin.run === 'function') {
      plugins.push(plugin);
    }
  }
  return plugins;
}
