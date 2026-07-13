// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2025 LEHRO Solutions

import chalk, { Chalk } from 'chalk';
import { createRequire } from 'module';

const moduleRequire = createRequire(import.meta.url);
const packageJson = moduleRequire('../../../package.json') as { version: string };

const THEME = {
  primary: '#2563EB',
  secondary: '#0891B2',
  accent: '#7C3AED',
  dim: '#64748B',
  bg: '#111827',
  success: '#059669',
  error: '#DC2626',
  warning: '#D97706',
};

export interface UiRuntimeOptions {
  quiet?: boolean;
  noColor?: boolean;
  noSpinner?: boolean;
}

const runtimeOptions: Required<UiRuntimeOptions> = {
  quiet: false,
  noColor: Boolean(process.env.NO_COLOR),
  noSpinner: Boolean(process.env.NO_SPINNER),
};

let color = new Chalk({ level: runtimeOptions.noColor ? 0 : chalk.level });

export function configureUi(options: UiRuntimeOptions = {}): void {
  runtimeOptions.quiet = options.quiet ?? runtimeOptions.quiet;
  runtimeOptions.noColor = options.noColor ?? runtimeOptions.noColor;
  runtimeOptions.noSpinner = options.noSpinner ?? runtimeOptions.noSpinner;

  if (runtimeOptions.noColor) {
    process.env.NO_COLOR = '1';
  }

  color = new Chalk({ level: runtimeOptions.noColor ? 0 : chalk.level });
}

export function getUiOptions(): Required<UiRuntimeOptions> {
  return { ...runtimeOptions };
}

export function shouldUseSpinner(): boolean {
  return (
    !runtimeOptions.noSpinner && !process.env.NO_SPINNER && !process.env.CI && process.stdout.isTTY
  );
}

export function showBanner(): void {
  if (runtimeOptions.quiet) return;

  console.log('');
  console.log(color.hex(THEME.primary).bold('  GIDEVO API Tool'));
  console.log(color.hex(THEME.dim)('  Agentic SDK generation for OpenAPI and GraphQL'));
  console.log(color.hex(THEME.dim)(`  v${packageJson.version}`));
  console.log('');
}

export function showCompactBanner(): void {
  if (runtimeOptions.quiet) return;
  console.log(color.hex(THEME.primary).bold('\n  GIDEVO') + color.hex(THEME.dim)(' API Tool'));
}

export interface BoxOptions {
  title?: string;
  padding?: number;
  borderColor?: string;
  dimBorder?: boolean;
}

export function box(content: string, options: BoxOptions = {}): string {
  const { title, padding = 1, borderColor = THEME.primary, dimBorder = false } = options;
  const lines = content.split('\n');
  const maxLen = Math.max(
    ...lines.map((line) => stripAnsi(line).length),
    title ? stripAnsi(title).length + 4 : 0
  );
  const width = maxLen + padding * 2;
  const border = dimBorder ? color.hex(THEME.dim) : color.hex(borderColor);
  const paddingStr = ' '.repeat(padding);
  const hLine = '-'.repeat(width);

  let result = title
    ? border(`+- ${title} ${'-'.repeat(Math.max(width - stripAnsi(title).length - 3, 0))}+\n`)
    : border(`+${hLine}+\n`);

  for (const line of lines) {
    const lineLen = stripAnsi(line).length;
    const rightPadding = ' '.repeat(width - padding - lineLen);
    result += border('|') + paddingStr + line + rightPadding + border('|\n');
  }

  result += border(`+${hLine}+`);
  return result;
}

export function success(message: string, details?: string): void {
  console.log(color.hex(THEME.success).bold('\n  [OK]'));
  console.log(color.white(`  ${message}`));
  if (details) console.log(color.hex(THEME.dim)(`  ${details}`));
}

export function error(message: string, details?: string): void {
  console.log(color.hex(THEME.error).bold('\n  [ERROR]'));
  console.log(color.white(`  ${message}`));
  if (details) console.log(color.hex(THEME.dim)(`  ${details}`));
}

export function warning(message: string, details?: string): void {
  console.log(color.hex(THEME.warning).bold('\n  [WARN]'));
  console.log(color.white(`  ${message}`));
  if (details) console.log(color.hex(THEME.dim)(`  ${details}`));
}

export function info(message: string, details?: string): void {
  console.log(color.hex(THEME.secondary).bold('\n  [INFO]'));
  console.log(color.white(`  ${message}`));
  if (details) console.log(color.hex(THEME.dim)(`  ${details}`));
}

export function step(stepNum: number, total: number, message: string): void {
  const stepStr = String(stepNum).padStart(2, '0');
  const totalStr = String(total).padStart(2, '0');

  console.log(
    color.hex(THEME.dim)('  [') +
      color.hex(THEME.secondary)(stepStr) +
      color.hex(THEME.dim)(`/${totalStr}] `) +
      color.white(message)
  );
}

export function list(items: string[], title?: string): void {
  if (title) console.log(color.hex(THEME.primary).bold(`\n  ${title}`));
  items.forEach((item) => console.log(color.hex(THEME.secondary)('  - ') + color.white(item)));
}

export function keyValue(key: string, value: string, indent = 2): void {
  const padding = ' '.repeat(indent);
  console.log(`${padding}${color.hex(THEME.dim)(`${key}:`)} ${color.white(value)}`);
}

export function table(headers: string[], rows: string[][]): void {
  const colWidths = headers.map((header, i) => {
    const maxRowWidth = Math.max(0, ...rows.map((row) => stripAnsi(row[i] || '').length));
    return Math.max(stripAnsi(header).length, maxRowWidth);
  });

  console.log('');
  console.log(
    '  ' +
      headers
        .map((header, i) => color.hex(THEME.dim)(header.toUpperCase().padEnd(colWidths[i])))
        .join('  ')
  );

  rows.forEach((row) => {
    const rowStr = row
      .map((cell, i) => {
        const content = (cell || '').padEnd(colWidths[i]);
        return i === 0 ? color.hex(THEME.primary)(content) : color.white(content);
      })
      .join('  ');
    console.log(`  ${rowStr}`);
  });
  console.log('');
}

export function progressBar(current: number, total: number, width = 30): string {
  const percentage = total === 0 ? 0 : Math.round((current / total) * 100);
  const filled = total === 0 ? 0 : Math.round((current / total) * width);
  const empty = width - filled;
  return `${color.hex(THEME.secondary)('#'.repeat(filled))}${color.hex(THEME.dim)(
    '-'.repeat(empty)
  )} ${percentage}%`;
}

export function divider(char = '-', length = 50): void {
  console.log(color.hex(THEME.dim)(`\n  ${char.repeat(length)}\n`));
}

export function nextSteps(steps: string[]): void {
  console.log(color.hex(THEME.success).bold('\n  NEXT STEPS\n'));
  steps.forEach((stepText, i) => {
    console.log(color.hex(THEME.dim)(`  ${i + 1}. `) + color.white(stepText));
  });
  console.log('');
}

export function sectionHeader(title: string): void {
  console.log(color.hex(THEME.primary).bold(`\n  ${title.toUpperCase()}\n`));
}

export function code(command: string, description?: string): void {
  console.log(color.bgHex(THEME.bg).hex(THEME.secondary)(`  $ ${command}  `));
  if (description) console.log(color.hex(THEME.dim)(`    ${description}`));
}

export function highlight(text: string): string {
  return color.hex(THEME.accent)(text);
}

export function filePath(filePathValue: string): string {
  return color.underline.hex(THEME.dim)(filePathValue);
}

export function timestamp(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return color.hex(THEME.dim)(d.toISOString().split('T')[0]);
}

function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '');
}

export const ui = {
  configureUi,
  getUiOptions,
  shouldUseSpinner,
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
  theme: THEME,
};

export default ui;
