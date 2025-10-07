interface ValidationResult {
    valid: boolean;
    errors: string[];
}
export declare class Validator {
    validate(specPath: string): Promise<ValidationResult>;
}
export {};
//# sourceMappingURL=validator.d.ts.map