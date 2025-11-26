"use strict";
/**
 * Configuration File Support
 *
 * Loads project-level configuration from .gidevorc.json or gidevo.config.js
 * This allows users to set default options for commands.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.findConfigFile = findConfigFile;
exports.loadConfigFile = loadConfigFile;
exports.loadConfig = loadConfig;
exports.getConfigValue = getConfigValue;
exports.clearConfigCache = clearConfigCache;
exports.getConfigPath = getConfigPath;
exports.mergeWithConfig = mergeWithConfig;
exports.createSampleConfig = createSampleConfig;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const logger_1 = require("../../core/logger");
/**
 * Configuration file names to search for (in order of priority)
 */
const CONFIG_FILE_NAMES = [
    '.gidevorc.json',
    '.gidevorc',
    'gidevo.config.json',
    'gidevo.config.js',
];
/**
 * Cached configuration
 */
let cachedConfig = null;
let cachedConfigPath = null;
/**
 * Find configuration file in the project directory
 */
function findConfigFile(startDir = process.cwd()) {
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
function loadConfigFile(configPath) {
    const ext = path.extname(configPath).toLowerCase();
    const content = fs.readFileSync(configPath, 'utf-8');
    if (ext === '.js') {
        // For JS config files, we need to require them
        // Clear require cache to get fresh config
        delete require.cache[require.resolve(configPath)];
        const config = require(configPath);
        return config.default || config;
    }
    // JSON or no extension (treat as JSON)
    try {
        return JSON.parse(content);
    }
    catch (error) {
        throw new Error(`Failed to parse config file ${configPath}: ${error.message}`);
    }
}
/**
 * Load and cache configuration
 */
function loadConfig(startDir = process.cwd()) {
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
        logger_1.logger.debug('Loaded configuration', { path: configPath });
        return cachedConfig;
    }
    catch (error) {
        logger_1.logger.warn(`Failed to load config from ${configPath}`, { error });
        cachedConfig = {};
        cachedConfigPath = null;
        return cachedConfig;
    }
}
/**
 * Get configuration value with optional default
 */
function getConfigValue(key, defaultValue) {
    const config = loadConfig();
    const keys = key.split('.');
    let value = config;
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
function clearConfigCache() {
    cachedConfig = null;
    cachedConfigPath = null;
}
/**
 * Get the path to the loaded config file (or null if none)
 */
function getConfigPath() {
    loadConfig(); // Ensure config is loaded
    return cachedConfigPath;
}
/**
 * Merge command options with config file defaults
 * Command-line options take precedence over config file
 */
function mergeWithConfig(commandOptions, configSection) {
    const config = loadConfig();
    const sectionConfig = config[configSection] || {};
    // Start with config defaults, then overlay command options
    const merged = { ...sectionConfig };
    for (const [key, value] of Object.entries(commandOptions)) {
        // Only use command option if it's explicitly set (not undefined)
        if (value !== undefined) {
            merged[key] = value;
        }
    }
    return merged;
}
/**
 * Create a sample configuration file
 */
function createSampleConfig(outputPath = '.gidevorc.json') {
    const sampleConfig = {
        generate: {
            language: 'typescript',
            output: './generated',
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
    logger_1.logger.info('Created sample configuration', { path: resolvedPath });
}
//# sourceMappingURL=config.js.map