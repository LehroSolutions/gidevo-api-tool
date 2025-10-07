// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import * as fs from 'fs';
import chalk from 'chalk';
import { Validator } from '../../core/validator';

export async function validateCommand(spec: string) {
  if (!fs.existsSync(spec)) {
    console.log(chalk.red(`Spec file not found: ${spec}`));
    return;
  }

  console.log(chalk.blue(`Validating ${spec}`));

  const validator = new Validator();
  
  try {
    const result = await validator.validate(spec);
    
    if (result.valid) {
      console.log(chalk.green('✅ Spec is valid!'));
    } else {
      console.log(chalk.red('❌ Validation failed:'));
      result.errors.forEach(error => {
        console.log(chalk.red(`  - ${error}`));
      });
    }
  } catch (error) {
    console.log(chalk.red('Validation error:'), error);
  }
}
