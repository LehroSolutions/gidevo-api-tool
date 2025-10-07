import { Plugin } from './plugin';
export default class PythonGeneratorPlugin implements Plugin {
    name: string;
    initialize(): void;
    run(specPath: string, outputDir: string): Promise<boolean>;
}
//# sourceMappingURL=pythonGenerator.d.ts.map