// Public API exports for gidevo-api-tool
// Allows programmatic usage when imported as a library
export { CodeGenerator } from './core/generator';
export { Validator } from './core/validator';
export { AuthService } from './core/auth';
export { loadPlugins, Plugin } from './plugins/plugin';

// Optionally expose CLI commands for embedding
export { initCommand } from './cli/commands/init';
export { generateCommand } from './cli/commands/generate';
export { validateCommand } from './cli/commands/validate';
export { loginCommand } from './cli/commands/login';
export { logoutCommand } from './cli/commands/logout';
export { pluginCommand } from './cli/commands/plugin';
