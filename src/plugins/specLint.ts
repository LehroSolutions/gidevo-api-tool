// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import { Plugin } from './plugin';
import { Validator } from '../core/validator';
import chalk from 'chalk';

export default class SpecLintPlugin implements Plugin {
  name = 'SpecLint';

  initialize() {
    // Plugin initialization logic if needed
  }

  async run(specPath: string): Promise<boolean> {
    console.log(chalk.blue(`SpecLint: validating ${specPath}`));
    const validator = new Validator();
    const result = await validator.validate(specPath);
    if (!result.valid) {
      console.log(chalk.red('🛑 SpecLint found issues:'));
      result.errors.forEach(error => console.log(chalk.red(` - ${error}`)));
    } else {
      console.log(chalk.green('✅ SpecLint: no issues found.'));   
    }
    return true;
  }
}
