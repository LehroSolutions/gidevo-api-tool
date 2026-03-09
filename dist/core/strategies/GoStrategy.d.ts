import { GeneratorStrategy } from './GeneratorStrategy';
export declare class GoStrategy implements GeneratorStrategy {
    private templatesDir;
    constructor();
    generate(spec: any, outputDir: string): Promise<void>;
    private generateClient;
    private generateTypes;
    private buildOperations;
    private buildSchemas;
    private resolveGoType;
    private buildMethodName;
    private httpMethodConst;
    private toPascalCase;
}
//# sourceMappingURL=GoStrategy.d.ts.map