// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions

import chalk from 'chalk';

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
export function showBanner(): void {
  const banner = `
${chalk.hex(BRAND_PRIMARY).bold('╔════════════════════════════════════════════════════════════╗')}
${chalk.hex(BRAND_PRIMARY).bold('║')}                                                            ${chalk.hex(BRAND_PRIMARY).bold('║')}
${chalk.hex(BRAND_PRIMARY).bold('║')}   ${chalk.hex(BRAND_SECONDARY).bold('██████╗ ██╗██████╗ ███████╗██╗   ██╗ ██████╗')}              ${chalk.hex(BRAND_PRIMARY).bold('║')}
${chalk.hex(BRAND_PRIMARY).bold('║')}   ${chalk.hex(BRAND_SECONDARY).bold('██╔════╝ ██║██╔══██╗██╔════╝██║   ██║██╔═══██╗')}             ${chalk.hex(BRAND_PRIMARY).bold('║')}
${chalk.hex(BRAND_PRIMARY).bold('║')}   ${chalk.hex(BRAND_SECONDARY).bold('██║  ███╗██║██║  ██║█████╗  ██║   ██║██║   ██║')}             ${chalk.hex(BRAND_PRIMARY).bold('║')}
${chalk.hex(BRAND_PRIMARY).bold('║')}   ${chalk.hex(BRAND_SECONDARY).bold('██║   ██║██║██║  ██║██╔══╝  ╚██╗ ██╔╝██║   ██║')}             ${chalk.hex(BRAND_PRIMARY).bold('║')}
${chalk.hex(BRAND_PRIMARY).bold('║')}   ${chalk.hex(BRAND_SECONDARY).bold('╚██████╔╝██║██████╔╝███████╗ ╚████╔╝ ╚██████╔╝')}             ${chalk.hex(BRAND_PRIMARY).bold('║')}
${chalk.hex(BRAND_PRIMARY).bold('║')}   ${chalk.hex(BRAND_SECONDARY).bold(' ╚═════╝ ╚═╝╚═════╝ ╚══════╝  ╚═══╝   ╚═════╝')}              ${chalk.hex(BRAND_PRIMARY).bold('║')}
${chalk.hex(BRAND_PRIMARY).bold('║')}                                                            ${chalk.hex(BRAND_PRIMARY).bold('║')}
${chalk.hex(BRAND_PRIMARY).bold('║')}   ${chalk.gray('Enterprise-grade API Integration & Code Generation')}       ${chalk.hex(BRAND_PRIMARY).bold('║')}
${chalk.hex(BRAND_PRIMARY).bold('║')}                                                            ${chalk.hex(BRAND_PRIMARY).bold('║')}
${chalk.hex(BRAND_PRIMARY).bold('╚════════════════════════════════════════════════════════════╝')}
`;
  console.log(banner);
}

/**
 * Display a compact banner for subcommands
 */
export function showCompactBanner(): void {
  console.log(
    chalk.hex(BRAND_PRIMARY).bold('\n  GIDEVO') + 
    chalk.gray(' API Tool') + 
    chalk.hex(BRAND_ACCENT)(' ⚡\n')
  );
}

/**
 * Box styles for different message types
 */
export interface BoxOptions {
  title?: string;
  padding?: number;
  borderColor?: string;
}

/**
 * Create a styled box around content
 */
export function box(content: string, options: BoxOptions = {}): string {
  const { title, padding = 1, borderColor = BRAND_PRIMARY } = options;
  const lines = content.split('\n');
  const maxLen = Math.max(...lines.map(l => stripAnsi(l).length), title ? stripAnsi(title).length + 4 : 0);
  const width = maxLen + padding * 2;
  
  const color = chalk.hex(borderColor);
  const horizontal = '─'.repeat(width);
  const paddingStr = ' '.repeat(padding);
  
  let result = '';
  
  // Top border with optional title
  if (title) {
    const titleLen = stripAnsi(title).length;
    const leftPad = Math.floor((width - titleLen - 2) / 2);
    const rightPad = width - titleLen - 2 - leftPad;
    result += color('╭' + '─'.repeat(leftPad) + ' ') + chalk.bold(title) + color(' ' + '─'.repeat(rightPad) + '╮\n');
  } else {
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
export function success(message: string, details?: string): void {
  console.log(chalk.hex(BRAND_SECONDARY).bold('\n  ✓ ') + chalk.white(message));
  if (details) {
    console.log(chalk.gray('    ' + details));
  }
}

/**
 * Display an error message
 */
export function error(message: string, details?: string): void {
  console.log(chalk.red.bold('\n  ✗ ') + chalk.white(message));
  if (details) {
    console.log(chalk.red('    ' + details));
  }
}

/**
 * Display a warning message
 */
export function warning(message: string, details?: string): void {
  console.log(chalk.hex(BRAND_ACCENT).bold('\n  ⚠ ') + chalk.white(message));
  if (details) {
    console.log(chalk.hex(BRAND_ACCENT)('    ' + details));
  }
}

/**
 * Display an info message
 */
export function info(message: string, details?: string): void {
  console.log(chalk.hex(BRAND_PRIMARY).bold('\n  ℹ ') + chalk.white(message));
  if (details) {
    console.log(chalk.gray('    ' + details));
  }
}

/**
 * Display a step in a process
 */
export function step(stepNum: number, total: number, message: string): void {
  const progress = chalk.hex(BRAND_PRIMARY)(`[${stepNum}/${total}]`);
  console.log(`  ${progress} ${message}`);
}

/**
 * Display a list of items
 */
export function list(items: string[], title?: string): void {
  if (title) {
    console.log(chalk.hex(BRAND_PRIMARY).bold(`\n  ${title}:`));
  }
  items.forEach(item => {
    console.log(chalk.gray('    •') + ` ${item}`);
  });
}

/**
 * Display a key-value pair
 */
export function keyValue(key: string, value: string, indent = 2): void {
  const padding = ' '.repeat(indent);
  console.log(`${padding}${chalk.gray(key + ':')} ${chalk.white(value)}`);
}

/**
 * Display a table
 */
export function table(headers: string[], rows: string[][]): void {
  const colWidths = headers.map((h, i) => {
    const maxRowWidth = Math.max(...rows.map(r => stripAnsi(r[i] || '').length));
    return Math.max(stripAnsi(h).length, maxRowWidth);
  });

  // Header
  console.log();
  const headerRow = headers.map((h, i) => chalk.hex(BRAND_PRIMARY).bold(h.padEnd(colWidths[i]))).join('  ');
  console.log('  ' + headerRow);
  console.log('  ' + colWidths.map(w => chalk.gray('─'.repeat(w))).join('  '));

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
export function progressBar(current: number, total: number, width = 30): string {
  const percentage = Math.round((current / total) * 100);
  const filled = Math.round((current / total) * width);
  const empty = width - filled;
  
  const bar = chalk.hex(BRAND_SECONDARY)('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
  return `[${bar}] ${percentage}%`;
}

/**
 * Display a divider
 */
export function divider(char = '─', length = 50): void {
  console.log(chalk.gray('\n  ' + char.repeat(length) + '\n'));
}

/**
 * Display "Next Steps" section
 */
export function nextSteps(steps: string[]): void {
  console.log(chalk.hex(BRAND_ACCENT).bold('\n  📋 Next Steps:\n'));
  steps.forEach((step, i) => {
    console.log(chalk.white(`    ${i + 1}. ${step}`));
  });
  console.log();
}

/**
 * Strip ANSI codes from a string (for length calculation)
 */
function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '');
}

/**
 * Display a section header
 */
export function sectionHeader(title: string): void {
  console.log(chalk.hex(BRAND_PRIMARY).bold(`\n  ▸ ${title}\n`));
}

/**
 * Display code/command
 */
export function code(command: string, description?: string): void {
  console.log(chalk.bgGray.white(`  $ ${command}  `));
  if (description) {
    console.log(chalk.gray(`    ${description}`));
  }
}

/**
 * Display a highlighted value
 */
export function highlight(text: string): string {
  return chalk.hex(BRAND_SECONDARY).bold(text);
}

/**
 * Format a file path for display
 */
export function filePath(path: string): string {
  return chalk.cyan(path);
}

/**
 * Format a timestamp
 */
export function timestamp(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return chalk.gray(d.toLocaleString());
}

export const ui = {
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

export default ui;
