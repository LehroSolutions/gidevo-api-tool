// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import * as fs from 'fs';
import * as path from 'path';

export interface PathSafetyOptions {
  allowOutsideProject?: boolean;
  projectRoot?: string;
}

export interface PreparedOutputDirectory {
  outputDir: string;
  projectRoot: string;
  allowOutsideProject: boolean;
}

const UNSAFE_PATHS_ENV = 'GIDEVO_ALLOW_UNSAFE_PATHS';

export function isOutsideProjectAllowed(options: PathSafetyOptions = {}): boolean {
  return options.allowOutsideProject === true || process.env[UNSAFE_PATHS_ENV] === '1';
}

export function resolveProjectRoot(projectRoot: string = process.cwd()): string {
  return fs.realpathSync(path.resolve(projectRoot));
}

export function isPathWithin(basePath: string, targetPath: string): boolean {
  const relative = path.relative(basePath, targetPath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

export function resolveSpecPath(specPath: string, options: PathSafetyOptions = {}): string {
  validatePathInput(specPath, 'Specification path');

  const resolvedSpec = path.resolve(specPath);
  const realSpecPath = fs.realpathSync(resolvedSpec);

  const projectRoot = resolveProjectRoot(options.projectRoot);
  const outsideAllowed = isOutsideProjectAllowed(options);
  if (!outsideAllowed && !isPathWithin(projectRoot, realSpecPath)) {
    throw new Error(
      `Specification path is outside project root. Use --allow-outside-project or ${UNSAFE_PATHS_ENV}=1 to override.`
    );
  }

  return realSpecPath;
}

export async function prepareOutputDirectory(
  outputDir: string,
  options: PathSafetyOptions = {}
): Promise<PreparedOutputDirectory> {
  validatePathInput(outputDir, 'Output directory');

  const projectRoot = resolveProjectRoot(options.projectRoot);
  const outsideAllowed = isOutsideProjectAllowed(options);
  const resolvedOutput = path.resolve(outputDir);

  if (!outsideAllowed && !isPathWithin(projectRoot, resolvedOutput)) {
    throw new Error(
      `Output directory is outside project root. Use --allow-outside-project or ${UNSAFE_PATHS_ENV}=1 to override.`
    );
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

export async function safeWriteGeneratedFile(
  outputDir: string,
  relativeFilePath: string,
  content: string
): Promise<void> {
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

function validatePathInput(value: string, label: string): void {
  if (!value || typeof value !== 'string') {
    throw new Error(`${label} must be a non-empty string.`);
  }
  if (value.includes('\0')) {
    throw new Error(`${label} contains invalid null bytes.`);
  }
}

async function ensurePathHasNoSymlinks(baseDir: string, targetDir: string): Promise<void> {
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
