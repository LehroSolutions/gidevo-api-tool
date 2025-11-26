// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import chalk from 'chalk';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LoggerOptions {
  level?: LogLevel;
  json?: boolean;
  prefix?: string;
}

export class Logger {
  private level: LogLevel;
  private isJson: boolean;
  private traceId?: string;
  private prefix: string;

  constructor(options: LoggerOptions = {}) {
    this.level = options.level ?? (process.env.DEBUG ? LogLevel.DEBUG : LogLevel.INFO);
    this.isJson = options.json ?? (process.env.CI === 'true' || process.env.LOG_FORMAT === 'json');
    this.prefix = options.prefix ?? '';
  }

  setTraceId(id: string): void {
    this.traceId = id;
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private log(level: LogLevel, message: string, meta?: any): void {
    if (level < this.level) return;

    const context = this.traceId ? { traceId: this.traceId, ...meta } : meta;
    const timestamp = this.formatTimestamp();

    if (this.isJson) {
      const logEntry = {
        level: LogLevel[level],
        message: this.prefix ? `${this.prefix} ${message}` : message,
        timestamp,
        ...context
      };
      console.log(JSON.stringify(logEntry));
      return;
    }

    const prefixStr = this.prefix ? chalk.gray(`[${this.prefix}] `) : '';
    const metaStr = context && Object.keys(context).length > 0 
      ? chalk.gray(` ${JSON.stringify(context)}`)
      : '';

    const levelColors = {
      [LogLevel.DEBUG]: chalk.gray,
      [LogLevel.INFO]: chalk.blue,
      [LogLevel.WARN]: chalk.yellow,
      [LogLevel.ERROR]: chalk.red,
    };

    const levelLabels = {
      [LogLevel.DEBUG]: '  DEBUG ',
      [LogLevel.INFO]: '  INFO  ',
      [LogLevel.WARN]: '  WARN  ',
      [LogLevel.ERROR]: '  ERROR ',
    };

    const colorFn = levelColors[level];
    const label = levelLabels[level];

    const output = `${colorFn(label)} ${prefixStr}${message}${metaStr}`;

    if (level === LogLevel.WARN) {
      console.warn(output);
    } else if (level === LogLevel.ERROR) {
      console.error(output);
    } else {
      console.log(output);
    }
  }

  debug(message: string, meta?: any): void {
    this.log(LogLevel.DEBUG, message, meta);
  }

  info(message: string, meta?: any): void {
    this.log(LogLevel.INFO, message, meta);
  }

  warn(message: string, meta?: any): void {
    this.log(LogLevel.WARN, message, meta);
  }

  error(message: string, meta?: any): void {
    this.log(LogLevel.ERROR, message, meta);
  }

  /**
   * Create a child logger with a prefix
   */
  child(prefix: string): Logger {
    const childLogger = new Logger({
      level: this.level,
      json: this.isJson,
      prefix: this.prefix ? `${this.prefix}:${prefix}` : prefix,
    });
    if (this.traceId) {
      childLogger.setTraceId(this.traceId);
    }
    return childLogger;
  }

  /**
   * Log with a specific level
   */
  logAtLevel(level: LogLevel, message: string, meta?: any): void {
    this.log(level, message, meta);
  }

  /**
   * Check if a given log level is enabled
   */
  isLevelEnabled(level: LogLevel): boolean {
    return level >= this.level;
  }
}

export const logger = new Logger();
