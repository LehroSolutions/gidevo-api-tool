// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions

import chalk from 'chalk';

/**
 * UI utility functions for consistent CLI output formatting
 * "Intentional Minimalism" Design System
 */

// AVANT-GARDE PALETTE
const THEME = {
  primary: '#8B5CF6',    // Violet: Core Identity
  secondary: '#06B6D4',  // Cyan: Success / Action
  accent: '#EC4899',     // Pink: Alerts / Highlights
  dim: '#64748B',        // Slate: Subtle text
  bg: '#1E293B',         // Dark Slate: Box backgrounds
  success: '#10B981',    // Emerald: Success state
  error: '#EF4444',      // Red: Error state
  warning: '#F59E0B',    // Amber: Warning state
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
export function showBanner(): void {
  // Ultra-minimalist modern banner
  console.log('\n');
  console.log(chalk.hex(THEME.primary).bold('  G I D E V O'));
  console.log(chalk.hex(THEME.dim)('  ──────────────────────'));
  console.log(chalk.white('  API Integration Engine'));
  console.log(chalk.hex(THEME.dim)('  v' + require('../../../package.json').version));
  console.log('\n');
}

/**
 * Display a compact banner for subcommands
 */
export function showCompactBanner(): void {
  console.log(
    chalk.hex(THEME.primary).bold('\n  ● G') +
    chalk.white('IDEVO') +
    chalk.hex(THEME.dim)(' API Tool')
  );
}

/**
 * Box styles for different message types
 */
export interface BoxOptions {
  title?: string;
  padding?: number;
  borderColor?: string;
  borderStyle?: 'single' | 'double' | 'round';
  dimBorder?: boolean;
}

/**
 * Create a styled box around content
 */
export function box(content: string, options: BoxOptions = {}): string {
  const {
    title,
    padding = 1,
    borderColor = THEME.primary,
    dimBorder = false
  } = options;

  const lines = content.split('\n');
  const maxLen = Math.max(...lines.map(l => stripAnsi(l).length), title ? stripAnsi(title).length + 4 : 0);
  const width = maxLen + padding * 2;

  const colorFn = chalk.hex(borderColor);
  const borderFn = dimBorder ? (s: string) => chalk.hex(THEME.dim)(s) : colorFn;

  const { topLeft, topRight, bottomLeft, bottomRight, horizontal, vertical } = BORDER_STYLE;

  const hLine = horizontal.repeat(width);
  const paddingStr = ' '.repeat(padding);

  let result = '';

  // Top border
  if (title) {
    const titleLen = stripAnsi(title).length;
    // Asymmetric title placement for modern feel
    result += borderFn(topLeft + horizontal + ' ') + chalk.bold(title) + borderFn(' ' + horizontal.repeat(width - titleLen - 2) + topRight + '\n');
  } else {
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
export function success(message: string, details?: string): void {
  console.log(chalk.hex(THEME.success).bold('\n  ✔ SUCCESS'));
  console.log(chalk.white(`  ${message}`));
  if (details) {
    console.log(chalk.hex(THEME.dim)(`  ${details}`));
  }
}

/**
 * Display an error message with high visibility
 */
export function error(message: string, details?: string): void {
  console.log(chalk.hex(THEME.error).bold('\n  ✖ ERROR'));
  console.log(chalk.white(`  ${message}`));
  if (details) {
    console.log(chalk.hex(THEME.dim)(`  ${details}`));
  }
}

/**
 * Display a warning message
 */
export function warning(message: string, details?: string): void {
  console.log(chalk.hex(THEME.warning).bold('\n  ! WARNING'));
  console.log(chalk.white(`  ${message}`));
  if (details) {
    console.log(chalk.hex(THEME.dim)(`  ${details}`));
  }
}

/**
 * Display an info message
 */
export function info(message: string, details?: string): void {
  console.log(chalk.hex(THEME.secondary).bold('\n  ℹ INFO'));
  console.log(chalk.white(`  ${message}`));
  if (details) {
    console.log(chalk.hex(THEME.dim)(`  ${details}`));
  }
}

/**
 * Display a step in a process (Modern Minimalist)
 */
export function step(stepNum: number, total: number, message: string): void {
  const stepStr = `0${stepNum}`.slice(-2);
  const totalStr = `0${total}`.slice(-2);

  console.log(
    chalk.hex(THEME.dim)('  [') +
    chalk.hex(THEME.secondary)(`${stepStr}`) +
    chalk.hex(THEME.dim)('/') +
    chalk.hex(THEME.dim)(`${totalStr}`) +
    chalk.hex(THEME.dim)('] ') +
    chalk.white(message)
  );
}

/**
 * Display a list of items
 */
export function list(items: string[], title?: string): void {
  if (title) {
    console.log(chalk.hex(THEME.primary).bold(`\n  ${title}`));
  }
  items.forEach(item => {
    console.log(chalk.hex(THEME.secondary)('  → ') + chalk.white(item));
  });
}

/**
 * Display a key-value pair
 */
export function keyValue(key: string, value: string, indent = 2): void {
  const padding = ' '.repeat(indent);
  console.log(`${padding}${chalk.hex(THEME.dim)(key + ':')} ${chalk.white(value)}`);
}

/**
 * Display a modern table
 */
export function table(headers: string[], rows: string[][]): void {
  const colWidths = headers.map((h, i) => {
    const maxRowWidth = Math.max(...rows.map(r => stripAnsi(r[i] || '').length));
    return Math.max(stripAnsi(h).length, maxRowWidth);
  });

  // Header
  console.log();
  const headerRow = headers.map((h, i) => chalk.hex(THEME.dim)(h.toUpperCase().padEnd(colWidths[i]))).join('  ');
  console.log('  ' + headerRow);

  // Rows
  rows.forEach(row => {
    const rowStr = row.map((cell, i) => {
      // Highlight first column
      const content = (cell || '').padEnd(colWidths[i]);
      return i === 0 ? chalk.hex(THEME.primary)(content) : chalk.white(content);
    }).join('  ');
    console.log('  ' + rowStr);
  });
  console.log();
}

/**
 * Display a minimalist progress bar
 */
export function progressBar(current: number, total: number, width = 30): string {
  const percentage = Math.round((current / total) * 100);
  const filled = Math.round((current / total) * width);
  const empty = width - filled;

  const bar = chalk.hex(THEME.secondary)('━'.repeat(filled)) + chalk.hex(THEME.dim)('━'.repeat(empty));
  return `${bar} ${percentage}%`;
}

/**
 * Display a subtle divider
 */
export function divider(char = '─', length = 50): void {
  console.log(chalk.hex(THEME.dim)('\n  ' + char.repeat(length) + '\n'));
}

/**
 * Display "Next Steps" section
 */
export function nextSteps(steps: string[]): void {
  console.log(chalk.hex(THEME.success).bold('\n  READY TO BUILD\n'));
  steps.forEach((step, i) => {
    console.log(chalk.hex(THEME.dim)(`  ${i + 1}. `) + chalk.white(step));
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
  console.log(chalk.hex(THEME.primary).bold(`\n  :: ${title.toUpperCase()}\n`));
}

/**
 * Display code/command
 */
export function code(command: string, description?: string): void {
  console.log(chalk.bgHex(THEME.bg).hex(THEME.secondary)(`  $ ${command}  `));
  if (description) {
    console.log(chalk.hex(THEME.dim)(`    ${description}`));
  }
}

/**
 * Display a highlighted value
 */
export function highlight(text: string): string {
  return chalk.hex(THEME.accent)(text);
}

/**
 * Format a file path for display
 */
export function filePath(path: string): string {
  return chalk.underline.hex(THEME.dim)(path);
}

/**
 * Format a timestamp
 */
export function timestamp(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return chalk.hex(THEME.dim)(d.toISOString().split('T')[0]);
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
  theme: THEME, // Export theme for direct access
};

export default ui;
