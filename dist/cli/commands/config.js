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
exports.configCommand = configCommand;
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ui_1 = require("../utils/ui");
const config_1 = require("../utils/config");
async function configCommand(options) {
    ui_1.ui.showCompactBanner();
    ui_1.ui.sectionHeader('Configuration');
    // If --init flag, create sample config
    if (options.init) {
        const configPath = path.resolve('.gidevorc.json');
        if (fs.existsSync(configPath)) {
            ui_1.ui.warning('Config file already exists', ui_1.ui.filePath(configPath));
            ui_1.ui.info('Tip', 'Remove existing file first or edit it manually');
            return;
        }
        (0, config_1.createSampleConfig)('.gidevorc.json');
        ui_1.ui.success('Created configuration file', ui_1.ui.filePath(configPath));
        ui_1.ui.nextSteps([
            'Edit .gidevorc.json to customize defaults',
            'Run gidevo-api-tool config --show to view current settings',
        ]);
        return;
    }
    // If --path flag, show config file path
    if (options.path) {
        const configPath = (0, config_1.getConfigPath)();
        if (configPath) {
            ui_1.ui.success('Config file found', ui_1.ui.filePath(configPath));
        }
        else {
            ui_1.ui.info('No config file', 'No .gidevorc.json found in project directory');
            ui_1.ui.info('Tip', 'Run gidevo-api-tool config --init to create one');
        }
        return;
    }
    // Default or --show: display current configuration
    const configPath = (0, config_1.getConfigPath)();
    const config = (0, config_1.loadConfig)();
    if (!configPath) {
        ui_1.ui.info('No configuration file found', 'Using default settings');
        ui_1.ui.nextSteps([
            'Run gidevo-api-tool config --init to create a config file',
        ]);
        return;
    }
    ui_1.ui.success('Config file', ui_1.ui.filePath(configPath));
    ui_1.ui.divider();
    // Display configuration sections
    if (config.generate) {
        ui_1.ui.sectionHeader('Generate Defaults');
        displayConfigSection(config.generate);
    }
    if (config.init) {
        ui_1.ui.sectionHeader('Init Defaults');
        displayConfigSection(config.init);
    }
    if (config.validate) {
        ui_1.ui.sectionHeader('Validate Defaults');
        displayConfigSection(config.validate);
    }
    if (config.plugins) {
        ui_1.ui.sectionHeader('Plugin Settings');
        displayConfigSection(config.plugins);
    }
    if (config.telemetry) {
        ui_1.ui.sectionHeader('Telemetry Settings');
        displayConfigSection(config.telemetry);
    }
}
function displayConfigSection(section) {
    for (const [key, value] of Object.entries(section)) {
        const displayValue = typeof value === 'object'
            ? JSON.stringify(value)
            : String(value);
        ui_1.ui.keyValue(key, displayValue);
    }
}
//# sourceMappingURL=config.js.map