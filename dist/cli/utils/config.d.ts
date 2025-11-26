/**
 * Configuration File Support
 *
 * Loads project-level configuration from .gidevorc.json or gidevo.config.js
 * This allows users to set default options for commands.
 */
/**
 * Configuration file structure
 */
export interface GidevoConfig {
    /** Default settings for the generate command */
    generate?: {
        language?: 'typescript' | 'python';
        output?: string;
        template?: string;
        spec?: string;
    };
    /** Default settings for the init command */
    init?: {
        template?: 'openapi' | 'graphql';
        output?: string;
    };
    /** Default settings for the validate command */
    validate?: {
        strict?: boolean;
    };
    /** Plugin configuration */
    plugins?: {
        enabled?: boolean;
        directory?: string;
        config?: Record<string, any>;
    };
    /** Telemetry settings */
    telemetry?: {
        enabled?: boolean;
    };
    /** Custom settings */
    [key: string]: any;
}
/**
 * Find configuration file in the project directory
 */
export declare function findConfigFile(startDir?: string): string | null;
/**
 * Load configuration from a file
 */
export declare function loadConfigFile(configPath: string): GidevoConfig;
/**
 * Load and cache configuration
 */
export declare function loadConfig(startDir?: string): GidevoConfig;
/**
 * Get configuration value with optional default
 */
export declare function getConfigValue<T>(key: string, defaultValue?: T): T | undefined;
/**
 * Clear cached configuration (useful for testing)
 */
export declare function clearConfigCache(): void;
/**
 * Get the path to the loaded config file (or null if none)
 */
export declare function getConfigPath(): string | null;
/**
 * Merge command options with config file defaults
 * Command-line options take precedence over config file
 */
export declare function mergeWithConfig<T extends Record<string, any>>(commandOptions: T, configSection: string): T;
/**
 * Create a sample configuration file
 */
export declare function createSampleConfig(outputPath?: string): void;
//# sourceMappingURL=config.d.ts.map