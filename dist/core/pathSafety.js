"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOutsideProjectAllowed = isOutsideProjectAllowed;
exports.resolveProjectRoot = resolveProjectRoot;
exports.isPathWithin = isPathWithin;
exports.resolveSpecPath = resolveSpecPath;
exports.prepareOutputDirectory = prepareOutputDirectory;
exports.safeWriteGeneratedFile = safeWriteGeneratedFile;
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const UNSAFE_PATHS_ENV = 'GIDEVO_ALLOW_UNSAFE_PATHS';
function isOutsideProjectAllowed(options = {}) {
    return options.allowOutsideProject === true || process.env[UNSAFE_PATHS_ENV] === '1';
}
function resolveProjectRoot(projectRoot = process.cwd()) {
    return fs.realpathSync(path.resolve(projectRoot));
}
function isPathWithin(basePath, targetPath) {
    const relative = path.relative(basePath, targetPath);
    return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}
function resolveSpecPath(specPath, options = {}) {
    validatePathInput(specPath, 'Specification path');
    const resolvedSpec = path.resolve(specPath);
    const realSpecPath = fs.realpathSync(resolvedSpec);
    const projectRoot = resolveProjectRoot(options.projectRoot);
    const outsideAllowed = isOutsideProjectAllowed(options);
    if (!outsideAllowed && !isPathWithin(projectRoot, realSpecPath)) {
        throw new Error(`Specification path is outside project root. Use --allow-outside-project or ${UNSAFE_PATHS_ENV}=1 to override.`);
    }
    return realSpecPath;
}
async function prepareOutputDirectory(outputDir, options = {}) {
    validatePathInput(outputDir, 'Output directory');
    const projectRoot = resolveProjectRoot(options.projectRoot);
    const outsideAllowed = isOutsideProjectAllowed(options);
    const resolvedOutput = path.resolve(outputDir);
    if (!outsideAllowed && !isPathWithin(projectRoot, resolvedOutput)) {
        throw new Error(`Output directory is outside project root. Use --allow-outside-project or ${UNSAFE_PATHS_ENV}=1 to override.`);
    }
    await fs.promises.mkdir(resolvedOutput, { recursive: true });
    const realOutput = await fs.promises.realpath(resolvedOutput);
    if (!outsideAllowed && !isPathWithin(projectRoot, realOutput)) {
        throw new Error('Symlink traversal detected in output directory.');
    }
    await ensurePathHasNoSymlinks(realOutput, realOutput);
    return {
        outputDir: realOutput,
        projectRoot,
        allowOutsideProject: outsideAllowed,
    };
}
async function safeWriteGeneratedFile(outputDir, relativeFilePath, content) {
    validatePathInput(relativeFilePath, 'Generated file path');
    if (path.isAbsolute(relativeFilePath)) {
        throw new Error(`Generated file path must be relative: ${relativeFilePath}`);
    }
    const normalized = path.normalize(relativeFilePath);
    if (normalized.startsWith('..') || path.isAbsolute(normalized)) {
        throw new Error(`Generated file path traversal detected: ${relativeFilePath}`);
    }
    const outputRoot = await fs.promises.realpath(outputDir);
    const targetFile = path.resolve(outputRoot, normalized);
    if (!isPathWithin(outputRoot, targetFile)) {
        throw new Error(`Generated file path escapes output directory: ${relativeFilePath}`);
    }
    const targetDir = path.dirname(targetFile);
    await fs.promises.mkdir(targetDir, { recursive: true });
    const realTargetDir = await fs.promises.realpath(targetDir);
    if (!isPathWithin(outputRoot, realTargetDir)) {
        throw new Error(`Symlink traversal detected while preparing output file: ${relativeFilePath}`);
    }
    await ensurePathHasNoSymlinks(outputRoot, realTargetDir);
    await fs.promises.writeFile(targetFile, content, 'utf8');
}
function validatePathInput(value, label) {
    if (!value || typeof value !== 'string') {
        throw new Error(`${label} must be a non-empty string.`);
    }
    if (value.includes('\0')) {
        throw new Error(`${label} contains invalid null bytes.`);
    }
}
async function ensurePathHasNoSymlinks(baseDir, targetDir) {
    const relative = path.relative(baseDir, targetDir);
    if (!relative || relative === '.') {
        const stat = await fs.promises.lstat(baseDir);
        if (stat.isSymbolicLink()) {
            throw new Error(`Symlink detected in output path: ${baseDir}`);
        }
        return;
    }
    let current = baseDir;
    const parts = relative.split(path.sep).filter(Boolean);
    const baseStat = await fs.promises.lstat(baseDir);
    if (baseStat.isSymbolicLink()) {
        throw new Error(`Symlink detected in output path: ${baseDir}`);
    }
    for (const part of parts) {
        current = path.join(current, part);
        const stat = await fs.promises.lstat(current);
        if (stat.isSymbolicLink()) {
            throw new Error(`Symlink detected in output path: ${current}`);
        }
    }
}
//# sourceMappingURL=pathSafety.js.map