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
export declare function loadPlugins(pluginDir: string): Plugin[];
//# sourceMappingURL=plugin.d.ts.map