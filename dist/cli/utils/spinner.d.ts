export interface SpinnerLike {
    start?: () => SpinnerLike;
    stop: () => void;
    succeed?: (text?: string) => void;
    fail?: (text?: string) => void;
    text?: string;
}
export declare function createSpinner(message: string): Promise<SpinnerLike>;
//# sourceMappingURL=spinner.d.ts.map