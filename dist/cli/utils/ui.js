"use strict";
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ui = void 0;
exports.showBanner = showBanner;
exports.showCompactBanner = showCompactBanner;
exports.box = box;
exports.success = success;
exports.error = error;
exports.warning = warning;
exports.info = info;
exports.step = step;
exports.list = list;
exports.keyValue = keyValue;
exports.table = table;
exports.progressBar = progressBar;
exports.divider = divider;
exports.nextSteps = nextSteps;
exports.sectionHeader = sectionHeader;
exports.code = code;
exports.highlight = highlight;
exports.filePath = filePath;
exports.timestamp = timestamp;
const chalk_1 = __importDefault(require("chalk"));
/**
 * UI utility functions for consistent CLI output formatting
 */
// Brand colors
const BRAND_PRIMARY = '#3B82F6'; // Blue
const BRAND_SECONDARY = '#10B981'; // Green
const BRAND_ACCENT = '#F59E0B'; // Amber
/**
 * Display the application banner
 */
function showBanner() {
    const banner = `
${chalk_1.default.hex(BRAND_PRIMARY).bold('╔════════════════════════════════════════════════════════════╗')}
${chalk_1.default.hex(BRAND_PRIMARY).bold('║')}                                                            ${chalk_1.default.hex(BRAND_PRIMARY).bold('║')}
${chalk_1.default.hex(BRAND_PRIMARY).bold('║')}   ${chalk_1.default.hex(BRAND_SECONDARY).bold('██████╗ ██╗██████╗ ███████╗██╗   ██╗ ██████╗')}              ${chalk_1.default.hex(BRAND_PRIMARY).bold('║')}
${chalk_1.default.hex(BRAND_PRIMARY).bold('║')}   ${chalk_1.default.hex(BRAND_SECONDARY).bold('██╔════╝ ██║██╔══██╗██╔════╝██║   ██║██╔═══██╗')}             ${chalk_1.default.hex(BRAND_PRIMARY).bold('║')}
${chalk_1.default.hex(BRAND_PRIMARY).bold('║')}   ${chalk_1.default.hex(BRAND_SECONDARY).bold('██║  ███╗██║██║  ██║█████╗  ██║   ██║██║   ██║')}             ${chalk_1.default.hex(BRAND_PRIMARY).bold('║')}
${chalk_1.default.hex(BRAND_PRIMARY).bold('║')}   ${chalk_1.default.hex(BRAND_SECONDARY).bold('██║   ██║██║██║  ██║██╔══╝  ╚██╗ ██╔╝██║   ██║')}             ${chalk_1.default.hex(BRAND_PRIMARY).bold('║')}
${chalk_1.default.hex(BRAND_PRIMARY).bold('║')}   ${chalk_1.default.hex(BRAND_SECONDARY).bold('╚██████╔╝██║██████╔╝███████╗ ╚████╔╝ ╚██████╔╝')}             ${chalk_1.default.hex(BRAND_PRIMARY).bold('║')}
${chalk_1.default.hex(BRAND_PRIMARY).bold('║')}   ${chalk_1.default.hex(BRAND_SECONDARY).bold(' ╚═════╝ ╚═╝╚═════╝ ╚══════╝  ╚═══╝   ╚═════╝')}              ${chalk_1.default.hex(BRAND_PRIMARY).bold('║')}
${chalk_1.default.hex(BRAND_PRIMARY).bold('║')}                                                            ${chalk_1.default.hex(BRAND_PRIMARY).bold('║')}
${chalk_1.default.hex(BRAND_PRIMARY).bold('║')}   ${chalk_1.default.gray('Enterprise-grade API Integration & Code Generation')}       ${chalk_1.default.hex(BRAND_PRIMARY).bold('║')}
${chalk_1.default.hex(BRAND_PRIMARY).bold('║')}                                                            ${chalk_1.default.hex(BRAND_PRIMARY).bold('║')}
${chalk_1.default.hex(BRAND_PRIMARY).bold('╚════════════════════════════════════════════════════════════╝')}
`;
    console.log(banner);
}
/**
 * Display a compact banner for subcommands
 */
function showCompactBanner() {
    console.log(chalk_1.default.hex(BRAND_PRIMARY).bold('\n  GIDEVO') +
        chalk_1.default.gray(' API Tool') +
        chalk_1.default.hex(BRAND_ACCENT)(' ⚡\n'));
}
/**
 * Create a styled box around content
 */
function box(content, options = {}) {
    const { title, padding = 1, borderColor = BRAND_PRIMARY } = options;
    const lines = content.split('\n');
    const maxLen = Math.max(...lines.map(l => stripAnsi(l).length), title ? stripAnsi(title).length + 4 : 0);
    const width = maxLen + padding * 2;
    const color = chalk_1.default.hex(borderColor);
    const horizontal = '─'.repeat(width);
    const paddingStr = ' '.repeat(padding);
    let result = '';
    // Top border with optional title
    if (title) {
        const titleLen = stripAnsi(title).length;
        const leftPad = Math.floor((width - titleLen - 2) / 2);
        const rightPad = width - titleLen - 2 - leftPad;
        result += color('╭' + '─'.repeat(leftPad) + ' ') + chalk_1.default.bold(title) + color(' ' + '─'.repeat(rightPad) + '╮\n');
    }
    else {
        result += color('╭' + horizontal + '╮\n');
    }
    // Content lines
    for (const line of lines) {
        const lineLen = stripAnsi(line).length;
        const rightPadding = ' '.repeat(width - padding - lineLen);
        result += color('│') + paddingStr + line + rightPadding + color('│\n');
    }
    // Bottom border
    result += color('╰' + horizontal + '╯');
    return result;
}
/**
 * Display a success message
 */
function success(message, details) {
    console.log(chalk_1.default.hex(BRAND_SECONDARY).bold('\n  ✓ ') + chalk_1.default.white(message));
    if (details) {
        console.log(chalk_1.default.gray('    ' + details));
    }
}
/**
 * Display an error message
 */
function error(message, details) {
    console.log(chalk_1.default.red.bold('\n  ✗ ') + chalk_1.default.white(message));
    if (details) {
        console.log(chalk_1.default.red('    ' + details));
    }
}
/**
 * Display a warning message
 */
function warning(message, details) {
    console.log(chalk_1.default.hex(BRAND_ACCENT).bold('\n  ⚠ ') + chalk_1.default.white(message));
    if (details) {
        console.log(chalk_1.default.hex(BRAND_ACCENT)('    ' + details));
    }
}
/**
 * Display an info message
 */
function info(message, details) {
    console.log(chalk_1.default.hex(BRAND_PRIMARY).bold('\n  ℹ ') + chalk_1.default.white(message));
    if (details) {
        console.log(chalk_1.default.gray('    ' + details));
    }
}
/**
 * Display a step in a process
 */
function step(stepNum, total, message) {
    const progress = chalk_1.default.hex(BRAND_PRIMARY)(`[${stepNum}/${total}]`);
    console.log(`  ${progress} ${message}`);
}
/**
 * Display a list of items
 */
function list(items, title) {
    if (title) {
        console.log(chalk_1.default.hex(BRAND_PRIMARY).bold(`\n  ${title}:`));
    }
    items.forEach(item => {
        console.log(chalk_1.default.gray('    •') + ` ${item}`);
    });
}
/**
 * Display a key-value pair
 */
function keyValue(key, value, indent = 2) {
    const padding = ' '.repeat(indent);
    console.log(`${padding}${chalk_1.default.gray(key + ':')} ${chalk_1.default.white(value)}`);
}
/**
 * Display a table
 */
function table(headers, rows) {
    const colWidths = headers.map((h, i) => {
        const maxRowWidth = Math.max(...rows.map(r => stripAnsi(r[i] || '').length));
        return Math.max(stripAnsi(h).length, maxRowWidth);
    });
    // Header
    console.log();
    const headerRow = headers.map((h, i) => chalk_1.default.hex(BRAND_PRIMARY).bold(h.padEnd(colWidths[i]))).join('  ');
    console.log('  ' + headerRow);
    console.log('  ' + colWidths.map(w => chalk_1.default.gray('─'.repeat(w))).join('  '));
    // Rows
    rows.forEach(row => {
        const rowStr = row.map((cell, i) => (cell || '').padEnd(colWidths[i])).join('  ');
        console.log('  ' + rowStr);
    });
    console.log();
}
/**
 * Display a progress bar
 */
function progressBar(current, total, width = 30) {
    const percentage = Math.round((current / total) * 100);
    const filled = Math.round((current / total) * width);
    const empty = width - filled;
    const bar = chalk_1.default.hex(BRAND_SECONDARY)('█'.repeat(filled)) + chalk_1.default.gray('░'.repeat(empty));
    return `[${bar}] ${percentage}%`;
}
/**
 * Display a divider
 */
function divider(char = '─', length = 50) {
    console.log(chalk_1.default.gray('\n  ' + char.repeat(length) + '\n'));
}
/**
 * Display "Next Steps" section
 */
function nextSteps(steps) {
    console.log(chalk_1.default.hex(BRAND_ACCENT).bold('\n  📋 Next Steps:\n'));
    steps.forEach((step, i) => {
        console.log(chalk_1.default.white(`    ${i + 1}. ${step}`));
    });
    console.log();
}
/**
 * Strip ANSI codes from a string (for length calculation)
 */
function stripAnsi(str) {
    // eslint-disable-next-line no-control-regex
    return str.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '');
}
/**
 * Display a section header
 */
function sectionHeader(title) {
    console.log(chalk_1.default.hex(BRAND_PRIMARY).bold(`\n  ▸ ${title}\n`));
}
/**
 * Display code/command
 */
function code(command, description) {
    console.log(chalk_1.default.bgGray.white(`  $ ${command}  `));
    if (description) {
        console.log(chalk_1.default.gray(`    ${description}`));
    }
}
/**
 * Display a highlighted value
 */
function highlight(text) {
    return chalk_1.default.hex(BRAND_SECONDARY).bold(text);
}
/**
 * Format a file path for display
 */
function filePath(path) {
    return chalk_1.default.cyan(path);
}
/**
 * Format a timestamp
 */
function timestamp(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return chalk_1.default.gray(d.toLocaleString());
}
exports.ui = {
    showBanner,
    showCompactBanner,
    box,
    success,
    error,
    warning,
    info,
    step,
    list,
    keyValue,
    table,
    progressBar,
    divider,
    nextSteps,
    sectionHeader,
    code,
    highlight,
    filePath,
    timestamp,
};
exports.default = exports.ui;
//# sourceMappingURL=ui.js.map