// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2025 LEHRO Solutions
import chalk from 'chalk';
import { Plugin } from './plugin.js';
import { CodeGenerator } from '../core/generator.js';

export default class TypeScriptGeneratorPlugin implements Plugin {
  name = 'TypeScriptGenerator';

  initialize(_program: any) {
    // no initialization needed
  }

  async run(specPath: string, outputDir: string): Promise<boolean> {
    console.log(chalk.blue(`TypeScriptGenerator: generating from ${specPath}`));
    const gen = new CodeGenerator();
    try {
      await gen.generate({ spec: specPath, language: 'typescript', outputDir });
      console.log(chalk.green(`✅ TS SDK generated at ${outputDir}`));
      return true;
    } catch (error) {
      console.log(chalk.red('Generation error:'), error);
      return false;
    }
  }
}
