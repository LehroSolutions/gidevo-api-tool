// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { createSpinner } from '../utils/spinner';

interface InitOptions {
  template: string;
  output: string;
}

export async function initCommand(options: InitOptions) {
  const { template, output } = options;
  const targetDir = path.resolve(output);


  if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
    console.log(chalk.red('Directory is not empty. Aborting.'));
    return;
  }

  // Spinner for initialization
  const spinner = await createSpinner(`Initializing new ${template} project in ${targetDir}`);
  // Start if start method exists (for real spinner)
  if (spinner.start) spinner.start();

  // Create directory structure
  fs.mkdirSync(targetDir, { recursive: true });
  fs.mkdirSync(path.join(targetDir, 'specs'));
  fs.mkdirSync(path.join(targetDir, 'generated'));
  fs.mkdirSync(path.join(targetDir, 'tests'));

  // Create base files
  const packageJson = {
    name: path.basename(targetDir),
    version: '1.0.0',
    description: 'Generated API project',
    scripts: {
      generate: 'gidevo-api-tool generate',
      validate: 'gidevo-api-tool validate'
    }
  };

  fs.writeFileSync(
    path.join(targetDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Create sample spec based on template
  if (template === 'openapi') {
    const spec = {
      openapi: '3.0.0',
      info: { title: 'My API', version: '1.0.0' },
      paths: {
        '/health': {
          get: {
            summary: 'Health check',
            responses: { '200': { description: 'OK' } }
          }
        }
      }
    };
    fs.writeFileSync(
      path.join(targetDir, 'specs', 'api.yaml'),
      JSON.stringify(spec, null, 2)
    );
  } else if (template === 'graphql') {
    const schema = `
type Query {
  hello: String
}

schema {
  query: Query
}
    `.trim();
    fs.writeFileSync(path.join(targetDir, 'specs', 'schema.graphql'), schema);
  }

  // Stop spinner and display success messages
  spinner.stop();
  console.log(chalk.green('✅ Project initialized successfully!'));
  console.log(chalk.yellow('Next steps:'));
  console.log('  cd', path.basename(targetDir));
  console.log('  gidevo-api-tool generate');
}
