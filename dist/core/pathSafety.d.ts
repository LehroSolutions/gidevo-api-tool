export interface PathSafetyOptions {
    allowOutsideProject?: boolean;
    projectRoot?: string;
}
export interface PreparedOutputDirectory {
    outputDir: string;
    projectRoot: string;
    allowOutsideProject: boolean;
}
export declare function isOutsideProjectAllowed(options?: PathSafetyOptions): boolean;
export declare function resolveProjectRoot(projectRoot?: string): string;
export declare function isPathWithin(basePath: string, targetPath: string): boolean;
export declare function resolveSpecPath(specPath: string, options?: PathSafetyOptions): string;
export declare function prepareOutputDirectory(outputDir: string, options?: PathSafetyOptions): Promise<PreparedOutputDirectory>;
export declare function safeWriteGeneratedFile(outputDir: string, relativeFilePath: string, content: string): Promise<void>;
//# sourceMappingURL=pathSafety.d.ts.map