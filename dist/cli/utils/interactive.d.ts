/**
 * Interactive Mode Utilities
 *
 * Provides a guided wizard for new users to configure and run
 * gidevo-api-tool commands interactively.
 */
/**
 * Prompt user for input with a question and Avant-Garde styling
 */
export declare function prompt(question: string, defaultValue?: string): Promise<string>;
/**
 * Prompt user to select from a list of options with detailed visualization
 */
export declare function select(question: string, options: string[], defaultIndex?: number): Promise<string>;
/**
 * Prompt for yes/no confirmation
 */
export declare function confirm(question: string, defaultYes?: boolean): Promise<boolean>;
/**
 * Prompt for password with masking
 */
export declare function password(question: string): Promise<string>;
/**
 * Interactive wizard for the init command
 */
export declare function initWizard(): Promise<{
    template: string;
    output: string;
}>;
/**
 * Interactive wizard for the generate command
 */
export declare function generateWizard(): Promise<{
    spec: string;
    language: string;
    output: string;
    template?: string;
}>;
/**
 * Interactive wizard for login
 */
export declare function loginWizard(): Promise<{
    token: string;
}>;
/**
 * Main interactive mode entry point
 */
export declare function interactiveMode(): Promise<{
    command: string;
    options: any;
}>;
//# sourceMappingURL=interactive.d.ts.map