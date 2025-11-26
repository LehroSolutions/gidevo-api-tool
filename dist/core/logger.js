"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = exports.LogLevel = void 0;
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
const chalk_1 = __importDefault(require("chalk"));
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class Logger {
    constructor(options = {}) {
        this.level = options.level ?? (process.env.DEBUG ? LogLevel.DEBUG : LogLevel.INFO);
        this.isJson = options.json ?? (process.env.CI === 'true' || process.env.LOG_FORMAT === 'json');
        this.prefix = options.prefix ?? '';
    }
    setTraceId(id) {
        this.traceId = id;
    }
    setLevel(level) {
        this.level = level;
    }
    formatTimestamp() {
        return new Date().toISOString();
    }
    log(level, message, meta) {
        if (level < this.level)
            return;
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
        const prefixStr = this.prefix ? chalk_1.default.gray(`[${this.prefix}] `) : '';
        const metaStr = context && Object.keys(context).length > 0
            ? chalk_1.default.gray(` ${JSON.stringify(context)}`)
            : '';
        const levelColors = {
            [LogLevel.DEBUG]: chalk_1.default.gray,
            [LogLevel.INFO]: chalk_1.default.blue,
            [LogLevel.WARN]: chalk_1.default.yellow,
            [LogLevel.ERROR]: chalk_1.default.red,
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
        }
        else if (level === LogLevel.ERROR) {
            console.error(output);
        }
        else {
            console.log(output);
        }
    }
    debug(message, meta) {
        this.log(LogLevel.DEBUG, message, meta);
    }
    info(message, meta) {
        this.log(LogLevel.INFO, message, meta);
    }
    warn(message, meta) {
        this.log(LogLevel.WARN, message, meta);
    }
    error(message, meta) {
        this.log(LogLevel.ERROR, message, meta);
    }
    /**
     * Create a child logger with a prefix
     */
    child(prefix) {
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
    logAtLevel(level, message, meta) {
        this.log(level, message, meta);
    }
    /**
     * Check if a given log level is enabled
     */
    isLevelEnabled(level) {
        return level >= this.level;
    }
}
exports.Logger = Logger;
exports.logger = new Logger();
//# sourceMappingURL=logger.js.map