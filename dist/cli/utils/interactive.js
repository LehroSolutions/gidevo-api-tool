"use strict";
/**
 * Interactive Mode Utilities
 *
 * Provides a guided wizard for new users to configure and run
 * gidevo-api-tool commands interactively.
 */
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
exports.prompt = prompt;
exports.select = select;
exports.confirm = confirm;
exports.password = password;
exports.initWizard = initWizard;
exports.generateWizard = generateWizard;
exports.loginWizard = loginWizard;
exports.interactiveMode = interactiveMode;
const readline = __importStar(require("readline"));
const inquirer_1 = __importDefault(require("inquirer"));
const ui_1 = require("./ui");
const chalk_1 = __importDefault(require("chalk"));
/**
 * Prompt user for input with a question and Avant-Garde styling
 */
function prompt(question, defaultValue) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const questionMark = chalk_1.default.hex(ui_1.ui.theme.secondary)('?');
    const questionText = chalk_1.default.bold(question);
    const defaultText = defaultValue ? chalk_1.default.hex(ui_1.ui.theme.dim)(` (${defaultValue})`) : '';
    const pointer = chalk_1.default.hex(ui_1.ui.theme.secondary)(' › ');
    const displayQuestion = `${questionMark} ${questionText}${defaultText}${pointer}`;
    return new Promise((resolve) => {
        rl.question(displayQuestion, (answer) => {
            rl.close();
            const final = answer.trim() || defaultValue || '';
            // Clear line and print result for cleaner log
            // readline leaves the input there, which is fine
            resolve(final);
        });
    });
}
/**
 * Prompt user to select from a list of options with detailed visualization
 */
async function select(question, options, defaultIndex = 0) {
    console.log();
    console.log(`${chalk_1.default.hex(ui_1.ui.theme.secondary)('?')} ${chalk_1.default.bold(question)}`);
    options.forEach((opt, idx) => {
        const isSelected = idx === defaultIndex; // Visual hint for default, though real selection logic is via number input
        // We are simulating a selection list but staying with simple numbering for robustness without 'inquirer'
        const marker = chalk_1.default.hex(ui_1.ui.theme.dim)(`${idx + 1}.`);
        const text = isSelected ? chalk_1.default.hex(ui_1.ui.theme.secondary)(opt) + chalk_1.default.hex(ui_1.ui.theme.dim)(' (default)') : chalk_1.default.white(opt);
        console.log(`  ${marker} ${text}`);
    });
    console.log();
    const answer = await prompt(`Enter selection`, String(defaultIndex + 1));
    const index = parseInt(answer, 10) - 1;
    if (index >= 0 && index < options.length) {
        return options[index];
    }
    return options[defaultIndex];
}
/**
 * Prompt for yes/no confirmation
 */
async function confirm(question, defaultYes = true) {
    const hint = defaultYes ? 'Y/n' : 'y/N';
    const answer = await prompt(question, hint);
    if (!answer || answer === hint)
        return defaultYes;
    return answer.toLowerCase().startsWith('y');
}
/**
 * Prompt for password with masking
 */
async function password(question) {
    const { answer } = await inquirer_1.default.prompt([
        {
            type: 'password',
            name: 'answer',
            message: chalk_1.default.bold(question),
            prefix: chalk_1.default.hex(ui_1.ui.theme.secondary)('?'),
            mask: '*'
        }
    ]);
    return answer;
}
/**
 * Interactive wizard for the init command
 */
async function initWizard() {
    ui_1.ui.sectionHeader('PROJECT INITIALIZATION PROTOCOL');
    const template = await select('Select Architecture Template', ['openapi', 'graphql'], 0);
    const defaultDir = `./${template}-api`;
    const output = await prompt('Target Workspace', defaultDir);
    const summary = `Template:  ${ui_1.ui.highlight(template)}\nOutput:    ${ui_1.ui.highlight(output)}`;
    console.log(ui_1.ui.box(summary, { title: 'CONFIGURATION LOCKED', borderColor: ui_1.ui.theme.success, dimBorder: true }));
    const proceed = await confirm('Execute Initialization?');
    if (!proceed) {
        throw new Error('Wizard cancelled by user');
    }
    return { template, output };
}
/**
 * Interactive wizard for the generate command
 */
async function generateWizard() {
    ui_1.ui.sectionHeader('SDK SYNTHESIS PROTOCOL');
    const spec = await prompt('Source Specification Path');
    if (!spec) {
        throw new Error('Specification file is required');
    }
    const language = await select('Target Runtime Environment', ['typescript', 'python'], 0);
    const output = await prompt('Artifact Output Directory', './generated');
    let template;
    if (language === 'typescript') {
        const useCustomTemplate = await confirm('Inject Custom Template?', false);
        if (useCustomTemplate) {
            template = await select('Select Blueprint', ['rest', 'axios'], 0);
        }
    }
    const summary = `
Spec:      ${ui_1.ui.highlight(spec)}
Language:  ${ui_1.ui.highlight(language)}
Output:    ${ui_1.ui.highlight(output)}
${template ? `Template:  ${ui_1.ui.highlight(template)}` : ''}
`.trim();
    console.log(ui_1.ui.box(summary, { title: 'SYNTHESIS PARAMETERS', borderColor: ui_1.ui.theme.success, dimBorder: true }));
    const proceed = await confirm('Initiate Synthesis?');
    if (!proceed) {
        throw new Error('Wizard cancelled by user');
    }
    return { spec, language, output, template };
}
/**
 * Interactive wizard for login
 */
async function loginWizard() {
    ui_1.ui.sectionHeader('SECURE CONTEXT HANDSHAKE');
    console.log(chalk_1.default.hex(ui_1.ui.theme.dim)('  Authenticate with GIDEVO Cloud Node to access premium features.'));
    console.log(chalk_1.default.hex(ui_1.ui.theme.dim)('  Token Authority: https://gidevo.io/settings/tokens\n'));
    const token = await password('Access Token');
    if (!token || token.length < 10) {
        throw new Error('Invalid token. Token integrity check failed.');
    }
    return { token };
}
/**
 * Main interactive mode entry point
 */
async function interactiveMode() {
    ui_1.ui.showBanner();
    const commandRaw = await select('Select Directice', [
        'init      :: Initialize new neural architecture',
        'generate  :: Synthesize SDK from specs',
        'validate  :: Verify specification integrity',
        'login     :: Establish secure cloud context',
        'whoami    :: Identity verification',
        'Exit      :: Terminate session'
    ], 0);
    const commandName = commandRaw.split(/\s+/)[0].trim().toLowerCase();
    switch (commandName) {
        case 'init':
            return { command: 'init', options: await initWizard() };
        case 'generate':
            return { command: 'generate', options: await generateWizard() };
        case 'validate': {
            ui_1.ui.sectionHeader('INTEGRITY VERIFICATION');
            const spec = await prompt('Specification Path');
            const strict = await confirm('Enforce Strict Schema Compliance?', false);
            return { command: 'validate', options: { spec, strict } };
        }
        case 'login':
            return { command: 'login', options: await loginWizard() };
        case 'whoami':
            return { command: 'whoami', options: {} };
        case 'exit':
            console.log(chalk_1.default.hex(ui_1.ui.theme.secondary)('\n  Session Terminated. Output flushed.\n'));
            process.exit(0);
        default:
            throw new Error(`Unknown command directive: ${commandName}`);
    }
}
//# sourceMappingURL=interactive.js.map