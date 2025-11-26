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
  ui.sectionHeader('Code Generation');

  // Show config file if used
  const configPath = getConfigPath();
  if (configPath) {
    ui.info('Using config', ui.filePath(configPath));
  }

  // Validate required spec option
  if (!spec) {
    ui.error('Missing required option', 'Please specify a spec file with -s or --spec');
    ui.info('Usage', 'gidevo-api-tool generate -s <spec-file> [-l language] [-o output]');
    process.exit(1);
  }

  // Validate language
  if (!SUPPORTED_LANGUAGES.includes(language.toLowerCase())) {
    ui.error('Unsupported language', `Language must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`);
    ui.info('Tip', 'Use -l typescript or -l python');
    process.exit(1);
  }

  // Check if spec file exists
  if (!fs.existsSync(spec)) {
    ui.error('Spec file not found', ui.filePath(spec));
    ui.info('Tip', 'Make sure the path is correct and the file exists');
    process.exit(1);
  }

  // Display configuration
  ui.table(
    ['Setting', 'Value'],
    [
      ['Spec File', ui.filePath(path.resolve(spec))],
      ['Language', ui.highlight(language)],
      ['Output Dir', ui.filePath(path.resolve(output))],
    ]
  );

  telemetry.track('generate_start', { language });

  const spinner = await createSpinner(`Generating ${language} SDK`);
  if (spinner.start) spinner.start();

  const generator = new CodeGenerator();

  try {
    const startTime = Date.now();
    
    ui.step(1, 3, 'Validating API specification...');
    ui.step(2, 3, `Generating ${language} SDK...`);
    
    await generator.generate({ spec, language, outputDir: output });
    
    ui.step(3, 3, 'Finalizing output...');
    
    const duration = Date.now() - startTime;

    spinner.stop();
    
    ui.divider();
    ui.success('Code generation completed!', `Duration: ${formatDuration(duration)}`);
    
    // List generated files
    const generatedFiles = listGeneratedFiles(output);
    if (generatedFiles.length > 0) {
      ui.sectionHeader('Generated Files');
      generatedFiles.forEach(file => {
        console.log(`    ${ui.filePath(file)}`);
      });
    }

    ui.nextSteps([
      `Review generated code in ${ui.filePath(output)}`,
      'Install dependencies if needed',
      'Import and use the generated SDK in your project',
    ]);

    telemetry.track('generate_success', { language, duration });
    logger.info('Generation completed successfully!');
    logger.info(`Output: ${path.resolve(output)}`);
  } catch (error: any) {
    spinner.stop();
    ui.error('Generation failed', error.message);
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
