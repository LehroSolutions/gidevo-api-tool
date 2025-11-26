import { Plugin } from './plugin';
export default class SpecLintPlugin implements Plugin {
    name: string;
    initialize(_program: any): void;
    run(specPath: string): Promise<boolean>;
}
//# sourceMappingURL=specLint.d.ts.map