export interface GeneratorStrategy {
    generate(spec: any, outputDir: string, options?: {
        allowOutsideProject?: boolean;
    }): Promise<void>;
}
//# sourceMappingURL=GeneratorStrategy.d.ts.map