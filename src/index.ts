// Public API exports for gidevo-api-tool
// Allows programmatic usage when imported as a library
export { CodeGenerator } from './core/generator.js';
export { Validator } from './core/validator.js';
export { AuthService } from './core/auth.js';
export type { AuthConfig } from './core/auth.js';
export { loadPlugins } from './plugins/plugin.js';
export type { Plugin } from './plugins/plugin.js';
export { Logger, LogLevel } from './core/logger.js';
export { TelemetryService } from './core/telemetry.js';
export type { TelemetryProvider } from './core/telemetry.js';

// Optionally expose CLI commands for embedding
export { initCommand } from './cli/commands/init.js';
export { generateCommand } from './cli/commands/generate.js';
export { validateCommand } from './cli/commands/validate.js';
export { doctorCommand } from './cli/commands/doctor.js';
export { workflowCommand } from './cli/commands/workflow.js';
export { loginCommand } from './cli/commands/login.js';
export { logoutCommand } from './cli/commands/logout.js';
export { pluginCommand } from './cli/commands/plugin.js';
export { whoamiCommand } from './cli/commands/whoami.js';
export { configCommand } from './cli/commands/config.js';
export { createProgram, run } from './cli/index.js';

// UI utilities for plugin developers
export { ui } from './cli/utils/ui.js';

// Configuration utilities
export { loadConfig, getConfigPath, getConfigValue, mergeWithConfig } from './cli/utils/config.js';
export type { GidevoConfig } from './cli/utils/config.js';

// Interactive mode utilities
export { prompt, select, confirm, password, interactiveMode } from './cli/utils/interactive.js';

// Secrets management (for advanced integrations)
export { SecretsManager } from './core/secrets.js';
