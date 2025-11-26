interface ValidationResult {
    valid: boolean;
    errors: string[];
}
interface ValidationOptions {
    strict?: boolean;
}
export declare class Validator {
    private ajv;
    private validateFn;
    private strictValidator;
    constructor();
    validate(specPath: string, options?: ValidationOptions): Promise<ValidationResult>;
}
export {};
//# sourceMappingURL=validator.d.ts.map