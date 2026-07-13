// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2025 LEHRO Solutions
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { Validator } from '../../core/validator.js';
import { telemetry } from '../../core/telemetry.js';
import { ui } from '../utils/ui.js';
import { createSpinner } from '../utils/spinner.js';
import { mergeWithConfig } from '../utils/config.js';

export async function validateCommand(spec: string, options: { strict?: boolean }) {
  // Merge with config file defaults
  const mergedOptions = mergeWithConfig(options, 'validate');

  ui.showCompactBanner();
  ui.sectionHeader('Specification Validation');

  // Check if spec file exists
  if (!fs.existsSync(spec)) {
    ui.error('Specification not found', ui.filePath(spec));
    ui.info('Resolution', 'Verify the path and try again');
    process.exit(1);
  }

  const mode = mergedOptions.strict ? 'strict' : 'basic';
  const specPath = path.resolve(spec);

  ui.table(
    ['Parameter', 'Value'],
    [
      ['Specification', ui.filePath(specPath)],
      ['Mode', ui.highlight(mode.toUpperCase())],
    ]
  );

  telemetry.track('validate_start', { mode });

  const spinner = await createSpinner(`Validating specification...`);
  if (spinner.start) spinner.start();

  const validator = new Validator();
  const startTime = Date.now();

  try {
    const result = await validator.validate(spec, { strict: mergedOptions.strict });
    const duration = Date.now() - startTime;

    spinner.stop();
    ui.divider();

    if (result.valid) {
      ui.success('Specification is valid', `Completed in ${formatDuration(duration)}`);

      // Show spec info
      const specContent = fs.readFileSync(spec, 'utf8');
      const ext = path.extname(spec).toLowerCase();

      if (ext === '.yaml' || ext === '.yml' || ext === '.json') {
        try {
          const parsed = ext === '.json' ? JSON.parse(specContent) : yaml.load(specContent);

          if (parsed.openapi) {
            ui.sectionHeader('Specification Summary');
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
      ui.error('Specification is invalid', `Found ${result.errors.length} issue(s)`);

      ui.sectionHeader('Validation Issues');
      result.errors.forEach((error, index) => {
        console.log(`    ${ui.highlight(`${index + 1}.`)} ${error}`);
      });

      ui.nextSteps([
        'Fix the issues listed above',
        'Cross-reference with OpenAPI 3.x specification',
        'Run with --strict for full OpenAPI schema validation',
      ]);

      telemetry.track('validate_fail', { mode, errorCount: result.errors.length });
      process.exit(1);
    }
  } catch (error: any) {
    spinner.stop();
    ui.error('Validation failed', error.message);
    telemetry.captureException(error);
    process.exit(1);
  }
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}
