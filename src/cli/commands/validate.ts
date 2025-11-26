// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import * as fs from 'fs';
import * as path from 'path';
import { Validator } from '../../core/validator';
import { telemetry } from '../../core/telemetry';
import { ui } from '../utils/ui';
import { createSpinner } from '../utils/spinner';
import { mergeWithConfig } from '../utils/config';

export async function validateCommand(spec: string, options: { strict?: boolean }) {
  // Merge with config file defaults
  const mergedOptions = mergeWithConfig(options, 'validate');
  
  ui.showCompactBanner();
  ui.sectionHeader('API Specification Validation');

  // Check if spec file exists
  if (!fs.existsSync(spec)) {
    ui.error('Spec file not found', ui.filePath(spec));
    ui.info('Tip', 'Make sure the path is correct and the file exists');
    process.exit(1);
  }

  const mode = mergedOptions.strict ? 'strict' : 'basic';
  const specPath = path.resolve(spec);

  ui.table(
    ['Setting', 'Value'],
    [
      ['Spec File', ui.filePath(specPath)],
      ['Validation Mode', ui.highlight(mode)],
    ]
  );

  telemetry.track('validate_start', { mode });

  const spinner = await createSpinner(`Validating specification (${mode} mode)`);
  if (spinner.start) spinner.start();

  const validator = new Validator();
  const startTime = Date.now();

  try {
    const result = await validator.validate(spec, { strict: mergedOptions.strict });
    const duration = Date.now() - startTime;
    
    spinner.stop();
    ui.divider();

    if (result.valid) {
      ui.success('Specification is valid!', `Validated in ${formatDuration(duration)}`);
      
      // Show spec info
      const specContent = fs.readFileSync(spec, 'utf8');
      const ext = path.extname(spec).toLowerCase();
      
      if (ext === '.yaml' || ext === '.yml' || ext === '.json') {
        try {
          const yaml = require('js-yaml');
          const parsed = ext === '.json' ? JSON.parse(specContent) : yaml.load(specContent);
          
          if (parsed.openapi) {
            ui.sectionHeader('Specification Info');
            ui.keyValue('OpenAPI Version', parsed.openapi);
            ui.keyValue('Title', parsed.info?.title || 'N/A');
            ui.keyValue('Version', parsed.info?.version || 'N/A');
            
            const pathCount = Object.keys(parsed.paths || {}).length;
            ui.keyValue('Endpoints', String(pathCount));
          }
        } catch {
          // Silently ignore parsing errors for info display
        }
      }
      
      telemetry.track('validate_success', { mode, duration });
    } else {
      ui.error('Validation failed', `Found ${result.errors.length} error(s)`);
      
      ui.sectionHeader('Errors');
      result.errors.forEach((error, index) => {
        console.log(`    ${ui.highlight(`${index + 1}.`)} ${error}`);
      });
      
      ui.nextSteps([
        'Review and fix the errors above',
        'Check OpenAPI 3.0 specification for correct format',
        'Run with --strict for detailed validation',
      ]);
      
      telemetry.track('validate_fail', { mode, errorCount: result.errors.length });
      process.exit(1);
    }
  } catch (error: any) {
    spinner.stop();
    ui.error('Validation error', error.message);
    telemetry.captureException(error);
    process.exit(1);
  }
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}
