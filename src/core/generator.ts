// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { Validator } from './validator';
import { GeneratorStrategy } from './strategies/GeneratorStrategy';
import { TypeScriptStrategy } from './strategies/TypeScriptStrategy';
import { PythonStrategy } from './strategies/PythonStrategy';
import { logger } from './logger';

interface GenerateOptions {
  spec: string;
  language: string;
  outputDir: string;
}

export class CodeGenerator {
  private strategies: Map<string, GeneratorStrategy>;

  constructor() {
    this.strategies = new Map();
    this.strategies.set('typescript', new TypeScriptStrategy());
    this.strategies.set('python', new PythonStrategy());
  }

  async generate(options: GenerateOptions): Promise<void> {
    const { spec, language, outputDir } = options;
    
    logger.info(`Starting generation for ${language} from ${spec}`);

    // Validate first
    const validator = new Validator();
    const validation = await validator.validate(spec);
    if (!validation.valid) {
      const errorMsg = `Spec validation failed:\n${validation.errors.join('\n')}`;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    const specContent = await fs.promises.readFile(spec, 'utf8');
    const parsedSpec = this.parseSpec(spec, specContent);
    
    await fs.promises.mkdir(outputDir, { recursive: true });
    
    const strategy = this.strategies.get(language);
    if (!strategy) {
      const errorMsg = `Unsupported language: ${language}`;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    await strategy.generate(parsedSpec, outputDir);
    logger.info(`Generation completed successfully in ${outputDir}`);
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
