// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { Validator } from './validator';
import { GeneratorStrategy } from './strategies/GeneratorStrategy';
import { TypeScriptStrategy } from './strategies/TypeScriptStrategy';
import { PythonStrategy } from './strategies/PythonStrategy';
import { GoStrategy } from './strategies/GoStrategy';
import { logger } from './logger';
import { prepareOutputDirectory, resolveSpecPath } from './pathSafety';

interface GenerateOptions {
  spec: string;
  language: string;
  outputDir: string;
  allowOutsideProject?: boolean;
}

export class CodeGenerator {
  private strategies: Map<string, GeneratorStrategy>;

  constructor() {
    this.strategies = new Map();
    this.strategies.set('typescript', new TypeScriptStrategy());
    this.strategies.set('python', new PythonStrategy());
    this.strategies.set('go', new GoStrategy());
  }

  async generate(options: GenerateOptions): Promise<void> {
    const { spec, language, outputDir, allowOutsideProject } = options;
    
    logger.info(`Starting generation for ${language} from ${spec}`);

    const resolvedSpec = resolveSpecPath(spec, { allowOutsideProject });

    // Validate first
    const validator = new Validator();
    const validation = await validator.validate(resolvedSpec);
    if (!validation.valid) {
      const errorMsg = `Spec validation failed:\n${validation.errors.join('\n')}`;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    const specContent = await fs.promises.readFile(resolvedSpec, 'utf8');
    const parsedSpec = this.parseSpec(resolvedSpec, specContent);

    const preparedOutput = await prepareOutputDirectory(outputDir, { allowOutsideProject });
    
    const strategy = this.strategies.get(language);
    if (!strategy) {
      const errorMsg = `Unsupported language: ${language}`;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    await strategy.generate(parsedSpec, preparedOutput.outputDir, {
      allowOutsideProject: preparedOutput.allowOutsideProject,
    });
    logger.info(`Generation completed successfully in ${preparedOutput.outputDir}`);
  }

  private parseSpec(filePath: string, content: string): any {
    const ext = path.extname(filePath).toLowerCase();
    
    if (ext === '.json') {
      return JSON.parse(content);
    } else if (ext === '.yaml' || ext === '.yml') {
      return yaml.load(content);
    } else if (ext === '.graphql' || ext === '.gql') {
      return { type: 'graphql', schema: content };
    }
    
    throw new Error(`Unsupported spec format: ${ext}`);
  }
}
