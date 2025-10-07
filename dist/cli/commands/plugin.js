"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginCommand = pluginCommand;
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
const plugin_1 = require("../../plugins/plugin");
/**
 * Run a registered plugin by name.
 * Args are passed directly to plugin.run(...args).
 */
async function pluginCommand(name, args) {
    // Determine plugin directory: prefer compiled dist/plugins, fallback to src/plugins
    const candidatePluginDirs = [
        path.resolve(__dirname, '..', '..', 'plugins'), // dist/plugins after build
        path.resolve(__dirname, '..', '..', '..', 'src', 'plugins'), // src/plugins during development
    ];
    const pluginDir = candidatePluginDirs.find(d => fs.existsSync(d)) || candidatePluginDirs[0];
    const plugins = (0, plugin_1.loadPlugins)(pluginDir);
    const plugin = plugins.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (!plugin) {
        console.log(chalk_1.default.red(`Plugin not found: ${name}`));
        process.exit(1);
    }
    console.log(chalk_1.default.blue(`Running plugin: ${plugin.name}`));
    const success = await plugin.run(...args);
    if (!success) {
        console.log(chalk_1.default.red(`Plugin ${plugin.name} failed.`));
        process.exit(1);
    }
    console.log(chalk_1.default.green(`Plugin ${plugin.name} completed successfully.`));
    // no return; Commander actions expect void
    return;
}
//# sourceMappingURL=plugin.js.map