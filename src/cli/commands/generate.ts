// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2025 LEHRO Solutions
import * as fs from 'fs';
import * as path from 'path';
import { createSpinner } from '../utils/spinner.js';
import { CodeGenerator } from '../../core/generator.js';
import { logger } from '../../core/logger.js';
import { telemetry } from '../../core/telemetry.js';
import { ui } from '../utils/ui.js';
import { mergeWithConfig, getConfigPath } from '../utils/config.js';

interface GenerateOptions {
  spec?: string;
  language?: string;
  output?: string;
  template?: string;
  allowOutsideProject?: boolean;
}

const SUPPORTED_LANGUAGES = ['typescript', 'python', 'go'];

export async function generateCommand(options: GenerateOptions) {
  // Merge with config file defaults
  const mergedOptions = mergeWithConfig(options, 'generate');
  const {
    spec,
    language = 'typescript',
    output = './generated',
    allowOutsideProject,
  } = mergedOptions;
  const cliRequestedAllowOutside = process.argv.includes('--allow-outside-project');
  const outsideProjectAllowed = cliRequestedAllowOutside ? true : Boolean(allowOutsideProject);

  ui.showCompactBanner();
  ui.sectionHeader('SDK Generation');

  // Show config file if used
  const configPath = getConfigPath();
  if (configPath) {
    ui.info('Config loaded', ui.filePath(configPath));
  }

  // Validate required spec option
  if (!spec) {
    ui.error('Missing specification', 'Pass a spec file with -s or --spec');
    ui.info('Usage', 'gidevo-api-tool generate -s <spec-file>');
    process.exit(1);
  }

  // Validate language
  if (!SUPPORTED_LANGUAGES.includes(language.toLowerCase())) {
    ui.error('Unsupported language', `Choose one of: ${SUPPORTED_LANGUAGES.join(', ')}`);
    process.exit(1);
  }

  // Check if spec file exists
  if (!fs.existsSync(spec)) {
    ui.error('Specification not found', ui.filePath(spec));
    process.exit(1);
  }

  // Display configuration
  ui.table(
    ['Parameter', 'Value'],
    [
      ['Source Spec', ui.filePath(path.basename(spec))],
      ['Target Language', ui.highlight(language)],
      ['Output Directory', ui.filePath(path.resolve(output))],
      [
        'Path Policy',
        outsideProjectAllowed ? ui.highlight('UNSAFE OVERRIDE') : 'Project-bound (default)',
      ],
    ]
  );

  if (outsideProjectAllowed || process.env.GIDEVO_ALLOW_UNSAFE_PATHS === '1') {
    ui.warning(
      'Unsafe path override active',
      'External spec/output paths are allowed for this run.'
    );
  }

  telemetry.track('generate_start', { language });

  const spinner = await createSpinner(`Generating ${language} SDK...`);
  if (spinner.start) spinner.start();

  const generator = new CodeGenerator();

  try {
    const startTime = Date.now();

    // Steps are handled by the generator internally or we can denote phases here
    // But since generator is a black box call, we just show the spinner.
    // Ideally we would hook into generator events.
    if (spinner.text) spinner.text = 'Parsing specification...';

    await generator.generate({
      spec,
      language,
      outputDir: output,
      allowOutsideProject: outsideProjectAllowed,
    });

    if (spinner.text) spinner.text = 'Writing generated files...';

    const duration = Date.now() - startTime;

    if (spinner.stop) spinner.stop();

    ui.divider();
    ui.success('SDK generated', `Completed in ${formatDuration(duration)}`);

    // List generated files
    const generatedFiles = listGeneratedFiles(output);
    if (generatedFiles.length > 0) {
      ui.list(
        generatedFiles.map((f) => ui.filePath(f)),
        'Generated Files'
      );
    }

    ui.nextSteps([
      `Review generated files in ${ui.filePath(output)}`,
      'Install required runtime dependencies',
      'Initialize the generated client in your application',
    ]);

    telemetry.track('generate_success', { language, duration });
    logger.info('Generation completed successfully!');
    logger.info(`Output: ${path.resolve(output)}`);
  } catch (error: any) {
    if (spinner.stop) spinner.stop();
    ui.error('SDK generation failed', error.message);
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
