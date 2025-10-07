import { Plugin } from './plugin';
export default class TypeScriptGeneratorPlugin implements Plugin {
    name: string;
    initialize(): void;
    run(specPath: string, outputDir: string): Promise<boolean>;
}
//# sourceMappingURL=typescriptGenerator.d.ts.map