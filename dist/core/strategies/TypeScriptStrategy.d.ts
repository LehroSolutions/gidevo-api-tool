import { GeneratorStrategy } from './GeneratorStrategy';
export declare class TypeScriptStrategy implements GeneratorStrategy {
    private templatesDir;
    constructor();
    generate(spec: any, outputDir: string): Promise<void>;
    private generateClient;
    private generateTypes;
}
//# sourceMappingURL=TypeScriptStrategy.d.ts.map