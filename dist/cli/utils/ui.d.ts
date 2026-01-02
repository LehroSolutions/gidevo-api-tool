/**
 * Display the application banner with premium styling
 */
export declare function showBanner(): void;
/**
 * Display a compact banner for subcommands
 */
export declare function showCompactBanner(): void;
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
export declare function box(content: string, options?: BoxOptions): string;
/**
 * Display a success message
 */
export declare function success(message: string, details?: string): void;
/**
 * Display an error message with high visibility
 */
export declare function error(message: string, details?: string): void;
/**
 * Display a warning message
 */
export declare function warning(message: string, details?: string): void;
/**
 * Display an info message
 */
export declare function info(message: string, details?: string): void;
/**
 * Display a step in a process (Modern Minimalist)
 */
export declare function step(stepNum: number, total: number, message: string): void;
/**
 * Display a list of items
 */
export declare function list(items: string[], title?: string): void;
/**
 * Display a key-value pair
 */
export declare function keyValue(key: string, value: string, indent?: number): void;
/**
 * Display a modern table
 */
export declare function table(headers: string[], rows: string[][]): void;
/**
 * Display a minimalist progress bar
 */
export declare function progressBar(current: number, total: number, width?: number): string;
/**
 * Display a subtle divider
 */
export declare function divider(char?: string, length?: number): void;
/**
 * Display "Next Steps" section
 */
export declare function nextSteps(steps: string[]): void;
/**
 * Display a section header
 */
export declare function sectionHeader(title: string): void;
/**
 * Display code/command
 */
export declare function code(command: string, description?: string): void;
/**
 * Display a highlighted value
 */
export declare function highlight(text: string): string;
/**
 * Format a file path for display
 */
export declare function filePath(path: string): string;
/**
 * Format a timestamp
 */
export declare function timestamp(date: Date | string): string;
export declare const ui: {
    showBanner: typeof showBanner;
    showCompactBanner: typeof showCompactBanner;
    box: typeof box;
    success: typeof success;
    error: typeof error;
    warning: typeof warning;
    info: typeof info;
    step: typeof step;
    list: typeof list;
    keyValue: typeof keyValue;
    table: typeof table;
    progressBar: typeof progressBar;
    divider: typeof divider;
    nextSteps: typeof nextSteps;
    sectionHeader: typeof sectionHeader;
    code: typeof code;
    highlight: typeof highlight;
    filePath: typeof filePath;
    timestamp: typeof timestamp;
    theme: {
        primary: string;
        secondary: string;
        accent: string;
        dim: string;
        bg: string;
        success: string;
        error: string;
        warning: string;
    };
};
export default ui;
//# sourceMappingURL=ui.d.ts.map