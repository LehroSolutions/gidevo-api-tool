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
    ui_1.ui.sectionHeader('ENVIRONMENT CONFIGURATION');
    // If --init flag, create sample config
    if (options.init) {
        const configPath = path.resolve('.gidevorc.json');
        if (fs.existsSync(configPath)) {
            ui_1.ui.warning('Manifest Already Exists', ui_1.ui.filePath(configPath));
            ui_1.ui.info('Resolution', 'Remove existing manifest or modify directly');
            return;
        }
        (0, config_1.createSampleConfig)('.gidevorc.json');
        ui_1.ui.success('Manifest Synthesized', ui_1.ui.filePath(configPath));
        ui_1.ui.nextSteps([
            'Modify .gidevorc.json to define project defaults',
            'Inspect: gidevo-api-tool config --show',
        ]);
        return;
    }
    // If --path flag, show config file path
    if (options.path) {
        const configPath = (0, config_1.getConfigPath)();
        if (configPath) {
            ui_1.ui.success('Manifest Located', ui_1.ui.filePath(configPath));
        }
        else {
            ui_1.ui.info('No Manifest Detected', 'Workspace lacks .gidevorc.json');
            ui_1.ui.info('Initialize', 'gidevo-api-tool config --init');
        }
        return;
    }
    // Default or --show: display current configuration
    const configPath = (0, config_1.getConfigPath)();
    const config = (0, config_1.loadConfig)();
    if (!configPath) {
        ui_1.ui.info('Operating in Default Mode', 'No project manifest detected');
        ui_1.ui.nextSteps([
            'Initialize manifest: gidevo-api-tool config --init',
        ]);
        return;
    }
    ui_1.ui.success('Active Manifest', ui_1.ui.filePath(configPath));
    ui_1.ui.divider();
    // Display configuration sections
    if (config.generate) {
        ui_1.ui.sectionHeader('SYNTHESIS DEFAULTS');
        displayConfigSection(config.generate);
    }
    if (config.init) {
        ui_1.ui.sectionHeader('INITIALIZATION DEFAULTS');
        displayConfigSection(config.init);
    }
    if (config.validate) {
        ui_1.ui.sectionHeader('VERIFICATION DEFAULTS');
        displayConfigSection(config.validate);
    }
    if (config.plugins) {
        ui_1.ui.sectionHeader('EXTENSION CONFIGURATION');
        displayConfigSection(config.plugins);
    }
    if (config.telemetry) {
        ui_1.ui.sectionHeader('TELEMETRY CONFIGURATION');
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