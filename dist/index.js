"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginCommand = exports.logoutCommand = exports.loginCommand = exports.validateCommand = exports.generateCommand = exports.initCommand = exports.loadPlugins = exports.AuthService = exports.Validator = exports.CodeGenerator = void 0;
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
//# sourceMappingURL=index.js.map