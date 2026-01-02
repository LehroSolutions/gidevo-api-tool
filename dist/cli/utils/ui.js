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
 * "Intentional Minimalism" Design System
 */
// AVANT-GARDE PALETTE
const THEME = {
    primary: '#8B5CF6', // Violet: Core Identity
    secondary: '#06B6D4', // Cyan: Success / Action
    accent: '#EC4899', // Pink: Alerts / Highlights
    dim: '#64748B', // Slate: Subtle text
    bg: '#1E293B', // Dark Slate: Box backgrounds
    success: '#10B981', // Emerald: Success state
    error: '#EF4444', // Red: Error state
    warning: '#F59E0B', // Amber: Warning state
};
// Layout constants
const BORDER_STYLE = {
    topLeft: '╭',
    topRight: '╮',
    bottomLeft: '╰',
    bottomRight: '╯',
    horizontal: '─',
    vertical: '│',
};
/**
 * Display the application banner with premium styling
 */
function showBanner() {
    // Ultra-minimalist modern banner
    console.log('\n');
    console.log(chalk_1.default.hex(THEME.primary).bold('  G I D E V O'));
    console.log(chalk_1.default.hex(THEME.dim)('  ──────────────────────'));
    console.log(chalk_1.default.white('  API Integration Engine'));
    console.log(chalk_1.default.hex(THEME.dim)('  v' + require('../../../package.json').version));
    console.log('\n');
}
/**
 * Display a compact banner for subcommands
 */
function showCompactBanner() {
    console.log(chalk_1.default.hex(THEME.primary).bold('\n  ● G') +
        chalk_1.default.white('IDEVO') +
        chalk_1.default.hex(THEME.dim)(' API Tool'));
}
/**
 * Create a styled box around content
 */
function box(content, options = {}) {
    const { title, padding = 1, borderColor = THEME.primary, dimBorder = false } = options;
    const lines = content.split('\n');
    const maxLen = Math.max(...lines.map(l => stripAnsi(l).length), title ? stripAnsi(title).length + 4 : 0);
    const width = maxLen + padding * 2;
    const colorFn = chalk_1.default.hex(borderColor);
    const borderFn = dimBorder ? (s) => chalk_1.default.hex(THEME.dim)(s) : colorFn;
    const { topLeft, topRight, bottomLeft, bottomRight, horizontal, vertical } = BORDER_STYLE;
    const hLine = horizontal.repeat(width);
    const paddingStr = ' '.repeat(padding);
    let result = '';
    // Top border
    if (title) {
        const titleLen = stripAnsi(title).length;
        // Asymmetric title placement for modern feel
        result += borderFn(topLeft + horizontal + ' ') + chalk_1.default.bold(title) + borderFn(' ' + horizontal.repeat(width - titleLen - 2) + topRight + '\n');
    }
    else {
        result += borderFn(topLeft + hLine + topRight + '\n');
    }
    // Content lines
    for (const line of lines) {
        const lineLen = stripAnsi(line).length;
        const rightPadding = ' '.repeat(width - padding - lineLen);
        result += borderFn(vertical) + paddingStr + line + rightPadding + borderFn(vertical + '\n');
    }
    // Bottom border
    result += borderFn(bottomLeft + hLine + bottomRight);
    return result;
}
/**
 * Display a success message
 */
function success(message, details) {
    console.log(chalk_1.default.hex(THEME.success).bold('\n  ✔ SUCCESS'));
    console.log(chalk_1.default.white(`  ${message}`));
    if (details) {
        console.log(chalk_1.default.hex(THEME.dim)(`  ${details}`));
    }
}
/**
 * Display an error message with high visibility
 */
function error(message, details) {
    console.log(chalk_1.default.hex(THEME.error).bold('\n  ✖ ERROR'));
    console.log(chalk_1.default.white(`  ${message}`));
    if (details) {
        console.log(chalk_1.default.hex(THEME.dim)(`  ${details}`));
    }
}
/**
 * Display a warning message
 */
function warning(message, details) {
    console.log(chalk_1.default.hex(THEME.warning).bold('\n  ! WARNING'));
    console.log(chalk_1.default.white(`  ${message}`));
    if (details) {
        console.log(chalk_1.default.hex(THEME.dim)(`  ${details}`));
    }
}
/**
 * Display an info message
 */
function info(message, details) {
    console.log(chalk_1.default.hex(THEME.secondary).bold('\n  ℹ INFO'));
    console.log(chalk_1.default.white(`  ${message}`));
    if (details) {
        console.log(chalk_1.default.hex(THEME.dim)(`  ${details}`));
    }
}
/**
 * Display a step in a process (Modern Minimalist)
 */
function step(stepNum, total, message) {
    const stepStr = `0${stepNum}`.slice(-2);
    const totalStr = `0${total}`.slice(-2);
    console.log(chalk_1.default.hex(THEME.dim)('  [') +
        chalk_1.default.hex(THEME.secondary)(`${stepStr}`) +
        chalk_1.default.hex(THEME.dim)('/') +
        chalk_1.default.hex(THEME.dim)(`${totalStr}`) +
        chalk_1.default.hex(THEME.dim)('] ') +
        chalk_1.default.white(message));
}
/**
 * Display a list of items
 */
function list(items, title) {
    if (title) {
        console.log(chalk_1.default.hex(THEME.primary).bold(`\n  ${title}`));
    }
    items.forEach(item => {
        console.log(chalk_1.default.hex(THEME.secondary)('  → ') + chalk_1.default.white(item));
    });
}
/**
 * Display a key-value pair
 */
function keyValue(key, value, indent = 2) {
    const padding = ' '.repeat(indent);
    console.log(`${padding}${chalk_1.default.hex(THEME.dim)(key + ':')} ${chalk_1.default.white(value)}`);
}
/**
 * Display a modern table
 */
function table(headers, rows) {
    const colWidths = headers.map((h, i) => {
        const maxRowWidth = Math.max(...rows.map(r => stripAnsi(r[i] || '').length));
        return Math.max(stripAnsi(h).length, maxRowWidth);
    });
    // Header
    console.log();
    const headerRow = headers.map((h, i) => chalk_1.default.hex(THEME.dim)(h.toUpperCase().padEnd(colWidths[i]))).join('  ');
    console.log('  ' + headerRow);
    // Rows
    rows.forEach(row => {
        const rowStr = row.map((cell, i) => {
            // Highlight first column
            const content = (cell || '').padEnd(colWidths[i]);
            return i === 0 ? chalk_1.default.hex(THEME.primary)(content) : chalk_1.default.white(content);
        }).join('  ');
        console.log('  ' + rowStr);
    });
    console.log();
}
/**
 * Display a minimalist progress bar
 */
function progressBar(current, total, width = 30) {
    const percentage = Math.round((current / total) * 100);
    const filled = Math.round((current / total) * width);
    const empty = width - filled;
    const bar = chalk_1.default.hex(THEME.secondary)('━'.repeat(filled)) + chalk_1.default.hex(THEME.dim)('━'.repeat(empty));
    return `${bar} ${percentage}%`;
}
/**
 * Display a subtle divider
 */
function divider(char = '─', length = 50) {
    console.log(chalk_1.default.hex(THEME.dim)('\n  ' + char.repeat(length) + '\n'));
}
/**
 * Display "Next Steps" section
 */
function nextSteps(steps) {
    console.log(chalk_1.default.hex(THEME.success).bold('\n  READY TO BUILD\n'));
    steps.forEach((step, i) => {
        console.log(chalk_1.default.hex(THEME.dim)(`  ${i + 1}. `) + chalk_1.default.white(step));
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
    console.log(chalk_1.default.hex(THEME.primary).bold(`\n  :: ${title.toUpperCase()}\n`));
}
/**
 * Display code/command
 */
function code(command, description) {
    console.log(chalk_1.default.bgHex(THEME.bg).hex(THEME.secondary)(`  $ ${command}  `));
    if (description) {
        console.log(chalk_1.default.hex(THEME.dim)(`    ${description}`));
    }
}
/**
 * Display a highlighted value
 */
function highlight(text) {
    return chalk_1.default.hex(THEME.accent)(text);
}
/**
 * Format a file path for display
 */
function filePath(path) {
    return chalk_1.default.underline.hex(THEME.dim)(path);
}
/**
 * Format a timestamp
 */
function timestamp(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return chalk_1.default.hex(THEME.dim)(d.toISOString().split('T')[0]);
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
    theme: THEME, // Export theme for direct access
};
exports.default = exports.ui;
//# sourceMappingURL=ui.js.map