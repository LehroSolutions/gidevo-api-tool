/**
 * Configuration File Support
 *
 * Loads project-level configuration from JSON config files.
 * This allows users to set default options for commands.
 */

import * as fs from 'fs';
import * as path from 'path';
import Ajv from 'ajv';
import { logger } from '../../core/logger';

/**
 * Configuration file structure
 */
export interface GidevoConfig {
  /** Default settings for the generate command */
  generate?: {
    language?: 'typescript' | 'python' | 'go';
    output?: string;
    template?: string;
    spec?: string;
    allowOutsideProject?: boolean;
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

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
const validateConfig = ajv.compile({
  type: 'object',
  additionalProperties: false,
  properties: {
    generate: {
      type: 'object',
      additionalProperties: false,
      properties: {
        language: { type: 'string', enum: ['typescript', 'python', 'go'] },
        output: { type: 'string', minLength: 1, maxLength: 1024 },
        template: { type: 'string', minLength: 1, maxLength: 255 },
        spec: { type: 'string', minLength: 1, maxLength: 1024 },
        allowOutsideProject: { type: 'boolean' },
      },
    },
    init: {
      type: 'object',
      additionalProperties: false,
      properties: {
        template: { type: 'string', enum: ['openapi', 'graphql'] },
        output: { type: 'string', minLength: 1, maxLength: 1024 },
      },
    },
    validate: {
      type: 'object',
      additionalProperties: false,
      properties: {
        strict: { type: 'boolean' },
      },
    },
    plugins: {
      type: 'object',
      additionalProperties: false,
      properties: {
        enabled: { type: 'boolean' },
        directory: { type: 'string', minLength: 1, maxLength: 1024 },
        config: { type: 'object', additionalProperties: true },
      },
    },
    telemetry: {
      type: 'object',
      additionalProperties: false,
      properties: {
        enabled: { type: 'boolean' },
      },
    },
  },
});

/**
 * Configuration file names to search for (in order of priority)
 * NOTE: gidevo.config.js is intentionally excluded — executing arbitrary JS as config
 * is a Remote Code Execution (RCE) vulnerability. JSON-only configs are supported.
 */
const CONFIG_FILE_NAMES = ['.gidevorc.json', '.gidevorc', 'gidevo.config.json'];

/**
 * Cached configuration
 */
let cachedConfig: GidevoConfig | null = null;
let cachedConfigPath: string | null = null;

/**
 * Find configuration file in the project directory
 */
export function findConfigFile(startDir: string = process.cwd()): string | null {
  let currentDir = startDir;

  // Walk up the directory tree looking for config files
  while (currentDir !== path.dirname(currentDir)) {
    for (const fileName of CONFIG_FILE_NAMES) {
      const configPath = path.join(currentDir, fileName);
      if (fs.existsSync(configPath)) {
        return configPath;
      }
    }
    currentDir = path.dirname(currentDir);
  }

  return null;
}

/**
 * Load configuration from a file
 */
export function loadConfigFile(configPath: string): GidevoConfig {
  const ext = path.extname(configPath).toLowerCase();

  // Reject .js config files to prevent Remote Code Execution (RCE).
  // require(configPath) evaluates the file as executable Node.js code.
  if (ext === '.js') {
    throw new Error(
      `JavaScript config files (${configPath}) are not supported for security reasons. ` +
        'Please use a JSON config file (.gidevorc.json or gidevo.config.json) instead.'
    );
  }

  const content = fs.readFileSync(configPath, 'utf-8');

  // JSON or no extension (treat as JSON)
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to parse config file ${configPath}: ${(error as Error).message}`);
  }

  if (!validateConfig(parsed)) {
    const details = ajv.errorsText(validateConfig.errors, { separator: ', ' });
    throw new Error(`Config schema validation failed: ${details}`);
  }

  return parsed as GidevoConfig;
}

/**
 * Load and cache configuration
 */
export function loadConfig(startDir: string = process.cwd()): GidevoConfig {
  // Return cached config if available and from same directory
  if (cachedConfig && cachedConfigPath) {
    const currentConfigPath = findConfigFile(startDir);
    if (currentConfigPath === cachedConfigPath) {
      return cachedConfig;
    }
  }

  const configPath = findConfigFile(startDir);

  if (!configPath) {
    // No config file found, return empty config
    cachedConfig = {};
    cachedConfigPath = null;
    return cachedConfig;
  }

  try {
    cachedConfig = loadConfigFile(configPath);
    cachedConfigPath = configPath;
    logger.debug('Loaded configuration', { path: configPath });
    return cachedConfig;
  } catch (error) {
    logger.warn(`Failed to load config from ${configPath}`, { error });
    cachedConfig = {};
    cachedConfigPath = null;
    return cachedConfig;
  }
}

/**
 * Get configuration value with optional default
 */
export function getConfigValue<T>(key: string, defaultValue?: T): T | undefined {
  const config = loadConfig();
  const keys = key.split('.');
  let value: any = config;

  for (const k of keys) {
    if (value === undefined || value === null) {
      return defaultValue;
    }
    value = value[k];
  }

  return value !== undefined ? value : defaultValue;
}

/**
 * Clear cached configuration (useful for testing)
 */
export function clearConfigCache(): void {
  cachedConfig = null;
  cachedConfigPath = null;
}

/**
 * Get the path to the loaded config file (or null if none)
 */
export function getConfigPath(): string | null {
  loadConfig(); // Ensure config is loaded
  return cachedConfigPath;
}

/**
 * Merge command options with config file defaults
 * Command-line options take precedence over config file
 */
export function mergeWithConfig<T extends Record<string, any>>(
  commandOptions: T,
  configSection: string
): T {
  const config = loadConfig();
  const sectionConfig = config[configSection] || {};

  // Start with config defaults, then overlay command options
  const merged: Record<string, any> = { ...sectionConfig };

  for (const [key, value] of Object.entries(commandOptions)) {
    // Only use command option if it's explicitly set (not undefined)
    if (value !== undefined) {
      merged[key] = value;
    }
  }

  return merged as T;
}

/**
 * Create a sample configuration file
 */
export function createSampleConfig(outputPath: string = '.gidevorc.json'): void {
  const sampleConfig: GidevoConfig = {
    generate: {
      language: 'typescript',
      output: './generated',
      allowOutsideProject: false,
    },
    init: {
      template: 'openapi',
    },
    validate: {
      strict: false,
    },
    plugins: {
      enabled: true,
    },
    telemetry: {
      enabled: true,
    },
  };

  const resolvedPath = path.resolve(process.cwd(), outputPath);
  fs.writeFileSync(resolvedPath, JSON.stringify(sampleConfig, null, 2) + '\n');
  logger.info('Created sample configuration', { path: resolvedPath });
}
