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
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginCommand = pluginCommand;
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const plugin_1 = require("../../plugins/plugin");
const ui_1 = require("../utils/ui");
const spinner_1 = require("../utils/spinner");
/**
 * Run a registered plugin by name.
 * Args are passed directly to plugin.run(...args).
 */
async function pluginCommand(name, args) {
    ui_1.ui.showCompactBanner();
    ui_1.ui.sectionHeader('EXTENSION RUNTIME');
    // Determine plugin directory: prefer compiled dist/plugins, fallback to src/plugins
    const candidatePluginDirs = [
        path.resolve(__dirname, '..', '..', 'plugins'), // dist/plugins after build
        path.resolve(__dirname, '..', '..', '..', 'src', 'plugins'), // src/plugins during development
    ];
    const pluginDir = candidatePluginDirs.find(d => fs.existsSync(d)) || candidatePluginDirs[0];
    let plugins;
    try {
        plugins = (0, plugin_1.loadPlugins)(pluginDir);
    }
    catch (error) {
        ui_1.ui.error('Extension Load Failed', error.message);
        process.exit(1);
    }
    // List available plugins if requested
    if (name === 'list' || name === '--list') {
        if (plugins.length === 0) {
            ui_1.ui.warning('No Extensions Detected', `Scanned: ${ui_1.ui.filePath(pluginDir)}`);
        }
        else {
            ui_1.ui.sectionHeader('REGISTERED EXTENSIONS');
            plugins.forEach(plugin => {
                console.log(`    ${ui_1.ui.highlight(plugin.name)}`);
            });
        }
        return;
    }
    const plugin = plugins.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (!plugin) {
        ui_1.ui.error('Extension Unknown', `"${name}" not in registry`);
        if (plugins.length > 0) {
            ui_1.ui.sectionHeader('REGISTERED EXTENSIONS');
            plugins.forEach(p => {
                console.log(`    ${ui_1.ui.highlight(p.name)}`);
            });
        }
        else {
            ui_1.ui.warning('Registry Empty', `Scanned: ${ui_1.ui.filePath(pluginDir)}`);
        }
        process.exit(1);
    }
    ui_1.ui.info('Invocation', ui_1.ui.highlight(plugin.name));
    if (args.length > 0) {
        ui_1.ui.keyValue('Parameters', args.join(' '));
    }
    const spinner = await (0, spinner_1.createSpinner)(`Executing extension...`);
    if (spinner.start)
        spinner.start();
    try {
        const startTime = Date.now();
        const success = await plugin.run(...args);
        const duration = Date.now() - startTime;
        spinner.stop();
        if (!success) {
            ui_1.ui.error(`Extension Execution Failed`, plugin.name);
            process.exit(1);
        }
        ui_1.ui.success(`Extension Complete`, `${plugin.name} | ${formatDuration(duration)}`);
    }
    catch (error) {
        spinner.stop();
        ui_1.ui.error(`Extension Runtime Error`, `${plugin.name}: ${error.message}`);
        process.exit(1);
    }
}
function formatDuration(ms) {
    if (ms < 1000)
        return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}
//# sourceMappingURL=plugin.js.map