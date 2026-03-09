import { Plugin } from './plugin';
export default class GoGeneratorPlugin implements Plugin {
    name: string;
    initialize(_program: any): void;
    run(specPath: string, outputDir: string): Promise<boolean>;
}
//# sourceMappingURL=goGenerator.d.ts.map