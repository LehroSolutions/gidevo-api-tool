import { Plugin } from './plugin';
export default class PythonGeneratorPlugin implements Plugin {
    name: string;
    initialize(_program: any): void;
    run(specPath: string, outputDir: string): Promise<boolean>;
}
//# sourceMappingURL=pythonGenerator.d.ts.map