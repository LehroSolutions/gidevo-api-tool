interface GenerateOptions {
    spec: string;
    language: string;
    outputDir: string;
}
export declare class CodeGenerator {
    generate(options: GenerateOptions): Promise<void>;
    private parseSpec;
    private generateTypeScript;
    private generatePython;
    private generateTypeScriptClient;
    private generateTypeScriptTypes;
    private generatePythonClient;
}
export {};
//# sourceMappingURL=generator.d.ts.map