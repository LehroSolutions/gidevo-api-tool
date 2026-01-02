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
exports.generateCommand = generateCommand;
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const spinner_1 = require("../utils/spinner");
const generator_1 = require("../../core/generator");
const logger_1 = require("../../core/logger");
const telemetry_1 = require("../../core/telemetry");
const ui_1 = require("../utils/ui");
const config_1 = require("../utils/config");
const SUPPORTED_LANGUAGES = ['typescript', 'python'];
async function generateCommand(options) {
    // Merge with config file defaults
    const mergedOptions = (0, config_1.mergeWithConfig)(options, 'generate');
    const { spec, language = 'typescript', output = './generated' } = mergedOptions;
    ui_1.ui.showCompactBanner();
    ui_1.ui.sectionHeader('SDK SYNTHESIS PROTOCOL');
    // Show config file if used
    const configPath = (0, config_1.getConfigPath)();
    if (configPath) {
        ui_1.ui.info('Context Loaded', ui_1.ui.filePath(configPath));
    }
    // Validate required spec option
    if (!spec) {
        ui_1.ui.error('Missing Directive', 'Specification file required via -s or --spec');
        ui_1.ui.info('Usage', 'gidevo-api-tool generate -s <spec-file>');
        process.exit(1);
    }
    // Validate language
    if (!SUPPORTED_LANGUAGES.includes(language.toLowerCase())) {
        ui_1.ui.error('Target Unsupported', `Runtime environment must be: ${SUPPORTED_LANGUAGES.join(', ')}`);
        process.exit(1);
    }
    // Check if spec file exists
    if (!fs.existsSync(spec)) {
        ui_1.ui.error('Source Not Found', ui_1.ui.filePath(spec));
        process.exit(1);
    }
    // Display configuration
    ui_1.ui.table(['Parameter', 'Value'], [
        ['Source Spec', ui_1.ui.filePath(path.basename(spec))],
        ['Target Runtime', ui_1.ui.highlight(language)],
        ['Output Artifact', ui_1.ui.filePath(path.resolve(output))],
    ]);
    telemetry_1.telemetry.track('generate_start', { language });
    const spinner = await (0, spinner_1.createSpinner)(`Synthesizing ${language} SDK...`);
    if (spinner.start)
        spinner.start();
    const generator = new generator_1.CodeGenerator();
    try {
        const startTime = Date.now();
        // Steps are handled by the generator internally or we can denote phases here
        // But since generator is a black box call, we just show the spinner.
        // Ideally we would hook into generator events.
        if (spinner.text)
            spinner.text = 'Parsing Neural Schema...';
        await new Promise(r => setTimeout(r, 400)); // Visual pacing
        if (spinner.text)
            spinner.text = `Compiling ${language} Definitions...`;
        await generator.generate({ spec, language, outputDir: output });
        if (spinner.text)
            spinner.text = 'Optimizing Artifacts...';
        const duration = Date.now() - startTime;
        if (spinner.stop)
            spinner.stop();
        ui_1.ui.divider();
        ui_1.ui.success('Synthesis Complete', `Execution Time: ${formatDuration(duration)}`);
        // List generated files
        const generatedFiles = listGeneratedFiles(output);
        if (generatedFiles.length > 0) {
            ui_1.ui.list(generatedFiles.map(f => ui_1.ui.filePath(f)), 'ARTIFACT MANIFEST');
        }
        ui_1.ui.nextSteps([
            `Integrate artifacts from ${ui_1.ui.filePath(output)}`,
            'Install required runtime dependencies',
            'Initialize client with generated tokens',
        ]);
        telemetry_1.telemetry.track('generate_success', { language, duration });
        logger_1.logger.info('Generation completed successfully!');
        logger_1.logger.info(`Output: ${path.resolve(output)}`);
    }
    catch (error) {
        if (spinner.stop)
            spinner.stop();
        ui_1.ui.error('Synthesis Failed', error.message);
        logger_1.logger.error('Generation failed', { error });
        telemetry_1.telemetry.captureException(error, { language });
        telemetry_1.telemetry.track('generate_fail', { language, error: error.message });
        process.exit(1);
    }
}
function formatDuration(ms) {
    if (ms < 1000)
        return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}
function listGeneratedFiles(dir, prefix = '') {
    const files = [];
    try {
        if (!fs.existsSync(dir))
            return files;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(prefix, entry.name);
            if (entry.isDirectory()) {
                files.push(...listGeneratedFiles(path.join(dir, entry.name), fullPath));
            }
            else {
                files.push(fullPath);
            }
        }
    }
    catch {
        // Ignore errors when listing files
    }
    return files;
}
//# sourceMappingURL=generate.js.map