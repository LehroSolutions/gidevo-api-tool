"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretsManager = exports.interactiveMode = exports.password = exports.select = exports.mergeWithConfig = exports.getConfigValue = exports.getConfigPath = exports.loadConfig = exports.ui = exports.configCommand = exports.whoamiCommand = exports.pluginCommand = exports.logoutCommand = exports.loginCommand = exports.validateCommand = exports.generateCommand = exports.initCommand = exports.TelemetryService = exports.LogLevel = exports.Logger = exports.loadPlugins = exports.AuthService = exports.Validator = exports.CodeGenerator = void 0;
// Public API exports for gidevo-api-tool
// Allows programmatic usage when imported as a library
var generator_1 = require("./core/generator");
Object.defineProperty(exports, "CodeGenerator", { enumerable: true, get: function () { return generator_1.CodeGenerator; } });
var validator_1 = require("./core/validator");
Object.defineProperty(exports, "Validator", { enumerable: true, get: function () { return validator_1.Validator; } });
var auth_1 = require("./core/auth");
Object.defineProperty(exports, "AuthService", { enumerable: true, get: function () { return auth_1.AuthService; } });
var plugin_1 = require("./plugins/plugin");
Object.defineProperty(exports, "loadPlugins", { enumerable: true, get: function () { return plugin_1.loadPlugins; } });
var logger_1 = require("./core/logger");
Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return logger_1.Logger; } });
Object.defineProperty(exports, "LogLevel", { enumerable: true, get: function () { return logger_1.LogLevel; } });
var telemetry_1 = require("./core/telemetry");
Object.defineProperty(exports, "TelemetryService", { enumerable: true, get: function () { return telemetry_1.TelemetryService; } });
// Optionally expose CLI commands for embedding
var init_1 = require("./cli/commands/init");
Object.defineProperty(exports, "initCommand", { enumerable: true, get: function () { return init_1.initCommand; } });
var generate_1 = require("./cli/commands/generate");
Object.defineProperty(exports, "generateCommand", { enumerable: true, get: function () { return generate_1.generateCommand; } });
var validate_1 = require("./cli/commands/validate");
Object.defineProperty(exports, "validateCommand", { enumerable: true, get: function () { return validate_1.validateCommand; } });
var login_1 = require("./cli/commands/login");
Object.defineProperty(exports, "loginCommand", { enumerable: true, get: function () { return login_1.loginCommand; } });
var logout_1 = require("./cli/commands/logout");
Object.defineProperty(exports, "logoutCommand", { enumerable: true, get: function () { return logout_1.logoutCommand; } });
var plugin_2 = require("./cli/commands/plugin");
Object.defineProperty(exports, "pluginCommand", { enumerable: true, get: function () { return plugin_2.pluginCommand; } });
var whoami_1 = require("./cli/commands/whoami");
Object.defineProperty(exports, "whoamiCommand", { enumerable: true, get: function () { return whoami_1.whoamiCommand; } });
var config_1 = require("./cli/commands/config");
Object.defineProperty(exports, "configCommand", { enumerable: true, get: function () { return config_1.configCommand; } });
// UI utilities for plugin developers
var ui_1 = require("./cli/utils/ui");
Object.defineProperty(exports, "ui", { enumerable: true, get: function () { return ui_1.ui; } });
// Configuration utilities
var config_2 = require("./cli/utils/config");
Object.defineProperty(exports, "loadConfig", { enumerable: true, get: function () { return config_2.loadConfig; } });
Object.defineProperty(exports, "getConfigPath", { enumerable: true, get: function () { return config_2.getConfigPath; } });
Object.defineProperty(exports, "getConfigValue", { enumerable: true, get: function () { return config_2.getConfigValue; } });
Object.defineProperty(exports, "mergeWithConfig", { enumerable: true, get: function () { return config_2.mergeWithConfig; } });
// Interactive mode utilities
var interactive_1 = require("./cli/utils/interactive");
Object.defineProperty(exports, "prompt", { enumerable: true, get: function () { return interactive_1.prompt; } });
Object.defineProperty(exports, "select", { enumerable: true, get: function () { return interactive_1.select; } });
Object.defineProperty(exports, "confirm", { enumerable: true, get: function () { return interactive_1.confirm; } });
Object.defineProperty(exports, "password", { enumerable: true, get: function () { return interactive_1.password; } });
Object.defineProperty(exports, "interactiveMode", { enumerable: true, get: function () { return interactive_1.interactiveMode; } });
// Secrets management (for advanced integrations)
var secrets_1 = require("./core/secrets");
Object.defineProperty(exports, "SecretsManager", { enumerable: true, get: function () { return secrets_1.SecretsManager; } });
//# sourceMappingURL=index.js.map