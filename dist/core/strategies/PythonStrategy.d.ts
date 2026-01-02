import { GeneratorStrategy } from './GeneratorStrategy';
export declare class PythonStrategy implements GeneratorStrategy {
    private templatesDir;
    constructor();
    generate(spec: any, outputDir: string): Promise<void>;
    private generateClient;
    private generateModels;
}
//# sourceMappingURL=PythonStrategy.d.ts.map