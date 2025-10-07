// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { createSpinner } from '../utils/spinner';
import { CodeGenerator } from '../../core/generator';

interface GenerateOptions {
  spec: string;
  language: string;
  output: string;
}

export async function generateCommand(options: GenerateOptions) {
  const { spec, language, output } = options;

  if (!fs.existsSync(spec)) {
    console.log(chalk.red(`Spec file not found: ${spec}`));
    return;
  }

  const spinner = await createSpinner(`Generating ${language} SDK from ${spec}`);
  if (spinner.start) spinner.start();

  const generator = new CodeGenerator();
  
  try {
    await generator.generate({ spec, language, outputDir: output });
  spinner.stop();
    console.log(chalk.green('✅ Generation completed successfully!'));
    console.log(chalk.yellow(`Output: ${path.resolve(output)}`));
  } catch (error) {
  spinner.stop();
    console.log(chalk.red('Generation failed:'), error);
  }
}
