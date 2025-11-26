export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}
export interface LoggerOptions {
    level?: LogLevel;
    json?: boolean;
    prefix?: string;
}
export declare class Logger {
    private level;
    private isJson;
    private traceId?;
    private prefix;
    constructor(options?: LoggerOptions);
    setTraceId(id: string): void;
    setLevel(level: LogLevel): void;
    private formatTimestamp;
    private log;
    debug(message: string, meta?: any): void;
    info(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
    error(message: string, meta?: any): void;
    /**
     * Create a child logger with a prefix
     */
    child(prefix: string): Logger;
    /**
     * Log with a specific level
     */
    logAtLevel(level: LogLevel, message: string, meta?: any): void;
    /**
     * Check if a given log level is enabled
     */
    isLevelEnabled(level: LogLevel): boolean;
}
export declare const logger: Logger;
//# sourceMappingURL=logger.d.ts.map