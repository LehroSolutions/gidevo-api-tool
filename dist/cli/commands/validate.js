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
exports.validateCommand = validateCommand;
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const validator_1 = require("../../core/validator");
const telemetry_1 = require("../../core/telemetry");
const ui_1 = require("../utils/ui");
const spinner_1 = require("../utils/spinner");
const config_1 = require("../utils/config");
async function validateCommand(spec, options) {
    // Merge with config file defaults
    const mergedOptions = (0, config_1.mergeWithConfig)(options, 'validate');
    ui_1.ui.showCompactBanner();
    ui_1.ui.sectionHeader('SCHEMA INTEGRITY VERIFICATION');
    // Check if spec file exists
    if (!fs.existsSync(spec)) {
        ui_1.ui.error('Source Not Found', ui_1.ui.filePath(spec));
        ui_1.ui.info('Resolution', 'Verify file path and ensure source exists');
        process.exit(1);
    }
    const mode = mergedOptions.strict ? 'strict' : 'basic';
    const specPath = path.resolve(spec);
    ui_1.ui.table(['Parameter', 'Value'], [
        ['Source Document', ui_1.ui.filePath(specPath)],
        ['Verification Mode', ui_1.ui.highlight(mode.toUpperCase())],
    ]);
    telemetry_1.telemetry.track('validate_start', { mode });
    const spinner = await (0, spinner_1.createSpinner)(`Analyzing schema integrity...`);
    if (spinner.start)
        spinner.start();
    const validator = new validator_1.Validator();
    const startTime = Date.now();
    try {
        const result = await validator.validate(spec, { strict: mergedOptions.strict });
        const duration = Date.now() - startTime;
        spinner.stop();
        ui_1.ui.divider();
        if (result.valid) {
            ui_1.ui.success('Schema Integrity Verified', `Scan completed in ${formatDuration(duration)}`);
            // Show spec info
            const specContent = fs.readFileSync(spec, 'utf8');
            const ext = path.extname(spec).toLowerCase();
            if (ext === '.yaml' || ext === '.yml' || ext === '.json') {
                try {
                    const yaml = require('js-yaml');
                    const parsed = ext === '.json' ? JSON.parse(specContent) : yaml.load(specContent);
                    if (parsed.openapi) {
                        ui_1.ui.sectionHeader('DOCUMENT METADATA');
                        ui_1.ui.keyValue('OpenAPI Version', parsed.openapi);
                        ui_1.ui.keyValue('Title', parsed.info?.title || 'N/A');
                        ui_1.ui.keyValue('Version', parsed.info?.version || 'N/A');
                        const pathCount = Object.keys(parsed.paths || {}).length;
                        ui_1.ui.keyValue('Endpoints', String(pathCount));
                    }
                }
                catch {
                    // Silently ignore parsing errors for info display
                }
            }
            telemetry_1.telemetry.track('validate_success', { mode, duration });
        }
        else {
            ui_1.ui.error('Integrity Check Failed', `Detected ${result.errors.length} anomaly(ies)`);
            ui_1.ui.sectionHeader('ANOMALY REPORT');
            result.errors.forEach((error, index) => {
                console.log(`    ${ui_1.ui.highlight(`${index + 1}.`)} ${error}`);
            });
            ui_1.ui.nextSteps([
                'Remediate anomalies listed above',
                'Cross-reference with OpenAPI 3.x specification',
                'Engage --strict mode for deep validation',
            ]);
            telemetry_1.telemetry.track('validate_fail', { mode, errorCount: result.errors.length });
            process.exit(1);
        }
    }
    catch (error) {
        spinner.stop();
        ui_1.ui.error('Verification Aborted', error.message);
        telemetry_1.telemetry.captureException(error);
        process.exit(1);
    }
}
function formatDuration(ms) {
    if (ms < 1000)
        return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}
//# sourceMappingURL=validate.js.map