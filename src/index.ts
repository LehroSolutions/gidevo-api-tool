// Public API exports for gidevo-api-tool
// Allows programmatic usage when imported as a library
export { CodeGenerator } from './core/generator';
export { Validator } from './core/validator';
export { AuthService, AuthConfig } from './core/auth';
export { loadPlugins, Plugin } from './plugins/plugin';
export { Logger, LogLevel } from './core/logger';
export { TelemetryService, TelemetryProvider } from './core/telemetry';

// Optionally expose CLI commands for embedding
export { initCommand } from './cli/commands/init';
export { generateCommand } from './cli/commands/generate';
export { validateCommand } from './cli/commands/validate';
export { loginCommand } from './cli/commands/login';
export { logoutCommand } from './cli/commands/logout';
export { pluginCommand } from './cli/commands/plugin';
export { whoamiCommand } from './cli/commands/whoami';
export { configCommand } from './cli/commands/config';

// UI utilities for plugin developers
export { ui } from './cli/utils/ui';

// Configuration utilities
export { 
  loadConfig, 
  getConfigPath, 
  getConfigValue, 
  mergeWithConfig,
  GidevoConfig 
} from './cli/utils/config';

// Interactive mode utilities
export { 
  prompt, 
  select, 
  confirm, 
  password,
  interactiveMode 
} from './cli/utils/interactive';

// Secrets management (for advanced integrations)
export { SecretsManager } from './core/secrets';
