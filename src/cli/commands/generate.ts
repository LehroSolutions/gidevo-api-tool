// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import * as fs from 'fs';
import * as path from 'path';
import { createSpinner } from '../utils/spinner';
import { CodeGenerator } from '../../core/generator';
import { logger } from '../../core/logger';
import { telemetry } from '../../core/telemetry';
import { ui } from '../utils/ui';
import { mergeWithConfig, getConfigPath } from '../utils/config';

interface GenerateOptions {
  spec?: string;
  language?: string;
  output?: string;
  template?: string;
}

const SUPPORTED_LANGUAGES = ['typescript', 'python'];

export async function generateCommand(options: GenerateOptions) {
  // Merge with config file defaults
  const mergedOptions = mergeWithConfig(options, 'generate');
  const { spec, language = 'typescript', output = './generated' } = mergedOptions;

  ui.showCompactBanner();
  ui.sectionHeader('SDK SYNTHESIS PROTOCOL');

  // Show config file if used
  const configPath = getConfigPath();
  if (configPath) {
    ui.info('Context Loaded', ui.filePath(configPath));
  }

  // Validate required spec option
  if (!spec) {
    ui.error('Missing Directive', 'Specification file required via -s or --spec');
    ui.info('Usage', 'gidevo-api-tool generate -s <spec-file>');
    process.exit(1);
  }

  // Validate language
  if (!SUPPORTED_LANGUAGES.includes(language.toLowerCase())) {
    ui.error('Target Unsupported', `Runtime environment must be: ${SUPPORTED_LANGUAGES.join(', ')}`);
    process.exit(1);
  }

  // Check if spec file exists
  if (!fs.existsSync(spec)) {
    ui.error('Source Not Found', ui.filePath(spec));
    process.exit(1);
  }

  // Display configuration
  ui.table(
    ['Parameter', 'Value'],
    [
      ['Source Spec', ui.filePath(path.basename(spec))],
      ['Target Runtime', ui.highlight(language)],
      ['Output Artifact', ui.filePath(path.resolve(output))],
    ]
  );

  telemetry.track('generate_start', { language });

  const spinner = await createSpinner(`Synthesizing ${language} SDK...`);
  if (spinner.start) spinner.start();

  const generator = new CodeGenerator();

  try {
    const startTime = Date.now();

    // Steps are handled by the generator internally or we can denote phases here
    // But since generator is a black box call, we just show the spinner.
    // Ideally we would hook into generator events.
    if (spinner.text) spinner.text = 'Parsing Neural Schema...';
    await new Promise(r => setTimeout(r, 400)); // Visual pacing

    if (spinner.text) spinner.text = `Compiling ${language} Definitions...`;

    await generator.generate({ spec, language, outputDir: output });

    if (spinner.text) spinner.text = 'Optimizing Artifacts...';

    const duration = Date.now() - startTime;

    if (spinner.stop) spinner.stop();

    ui.divider();
    ui.success('Synthesis Complete', `Execution Time: ${formatDuration(duration)}`);

    // List generated files
    const generatedFiles = listGeneratedFiles(output);
    if (generatedFiles.length > 0) {
      ui.list(generatedFiles.map(f => ui.filePath(f)), 'ARTIFACT MANIFEST');
    }

    ui.nextSteps([
      `Integrate artifacts from ${ui.filePath(output)}`,
      'Install required runtime dependencies',
      'Initialize client with generated tokens',
    ]);

    telemetry.track('generate_success', { language, duration });
    logger.info('Generation completed successfully!');
    logger.info(`Output: ${path.resolve(output)}`);
  } catch (error: any) {
    if (spinner.stop) spinner.stop();
    ui.error('Synthesis Failed', error.message);
    logger.error('Generation failed', { error });
    telemetry.captureException(error, { language });
    telemetry.track('generate_fail', { language, error: error.message });
    process.exit(1);
  }
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function listGeneratedFiles(dir: string, prefix = ''): string[] {
  const files: string[] = [];
  try {
    if (!fs.existsSync(dir)) return files;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(prefix, entry.name);
      if (entry.isDirectory()) {
        files.push(...listGeneratedFiles(path.join(dir, entry.name), fullPath));
      } else {
        files.push(fullPath);
      }
    }
  } catch {
    // Ignore errors when listing files
  }
  return files;
}
