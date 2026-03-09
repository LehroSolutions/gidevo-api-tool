interface GenerateOptions {
    spec: string;
    language: string;
    outputDir: string;
    allowOutsideProject?: boolean;
}
export declare class CodeGenerator {
    private strategies;
    constructor();
    generate(options: GenerateOptions): Promise<void>;
    private parseSpec;
}
export {};
//# sourceMappingURL=generator.d.ts.map