// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import chalk from 'chalk';
import { Plugin } from './plugin';
import { CodeGenerator } from '../core/generator';

export default class PythonGeneratorPlugin implements Plugin {
  name = 'PythonGenerator';

  initialize() {
    // No special initialization required
  }

  async run(specPath: string, outputDir: string): Promise<boolean> {
    console.log(chalk.blue(`PythonGenerator: generating from ${specPath}`));
    const gen = new CodeGenerator();
    try {
      await gen.generate({ spec: specPath, language: 'python', outputDir });
      console.log(chalk.green(`✅ Python SDK generated at ${outputDir}`));
      return true;
    } catch (error) {
      console.log(chalk.red('Generation error:'), error);
      return false;
    }
  }
}
