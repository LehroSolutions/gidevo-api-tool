// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2025 LEHRO Solutions
import * as fs from 'fs';
import * as path from 'path';
import { CodeGenerator } from '../../core/generator.js';
import { checkOutputPath, resolveSpecPath } from '../../core/pathSafety.js';
import { Validator } from '../../core/validator.js';
import { loadConfig } from '../utils/config.js';
import { createSpinner } from '../utils/spinner.js';
import { ui } from '../utils/ui.js';

interface WorkflowOptions {
  spec?: string;
  language?: string;
  output?: string;
  strict?: boolean;
  dryRun?: boolean;
  json?: boolean;
  allowOutsideProject?: boolean;
}

const SUPPORTED_LANGUAGES = ['typescript', 'python', 'go'];

export async function workflowCommand(options: WorkflowOptions = {}): Promise<void> {
  const config = loadConfig();
  const spec = options.spec ?? config.generate?.spec;
  const language = (options.language ?? config.generate?.language ?? 'typescript').toLowerCase();
  const output = options.output ?? config.generate?.output ?? './generated';
  const strict = options.strict ?? config.validate?.strict ?? false;
  const allowOutsideProject =
    options.allowOutsideProject ?? config.generate?.allowOutsideProject ?? false;

  const report = {
    ok: false,
    dryRun: Boolean(options.dryRun),
    spec,
    language,
    output,
    strict,
    steps: [] as Array<{ name: string; status: 'pass' | 'skip' | 'fail'; details?: string }>,
    generatedFiles: [] as string[],
  };

  try {
    if (!spec) {
      throw new Error('Specification file required via --spec or generate.spec config.');
    }
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      throw new Error(
        `Unsupported language: ${language}. Choose ${SUPPORTED_LANGUAGES.join(', ')}.`
      );
    }

    const resolvedSpec = resolveSpecPath(spec, { allowOutsideProject });
    report.steps.push({ name: 'resolve-spec', status: 'pass', details: resolvedSpec });

    const checkedOutput = checkOutputPath(output, { allowOutsideProject });
    report.steps.push({ name: 'check-output', status: 'pass', details: checkedOutput.outputDir });

    if (!options.json) {
      ui.showCompactBanner();
      ui.sectionHeader('Agentic Workflow');
      ui.table(
        ['Parameter', 'Value'],
        [
          ['Specification', ui.filePath(resolvedSpec)],
          ['Language', ui.highlight(language)],
          ['Output', ui.filePath(path.resolve(output))],
          ['Validation', strict ? 'strict' : 'basic'],
          ['Mode', options.dryRun ? 'dry run' : 'write files'],
        ]
      );
    }

    const validator = new Validator();
    const validation = await validator.validate(resolvedSpec, { strict });
    if (!validation.valid) {
      report.steps.push({
        name: 'validate',
        status: 'fail',
        details: validation.errors.join('; '),
      });
      throw new Error(`Validation failed: ${validation.errors.join('; ')}`);
    }
    report.steps.push({ name: 'validate', status: 'pass' });

    if (options.dryRun) {
      report.steps.push({ name: 'generate', status: 'skip', details: 'Dry run enabled' });
      report.ok = true;
      finishWorkflow(report, options);
      return;
    }

    const spinner = await createSpinner(`Running validate -> generate workflow...`);
    if (spinner.start) spinner.start();

    try {
      const generator = new CodeGenerator();
      await generator.generate({
        spec: resolvedSpec,
        language,
        outputDir: output,
        allowOutsideProject,
      });
      report.steps.push({ name: 'generate', status: 'pass' });
      report.generatedFiles = listGeneratedFiles(output);
      report.ok = true;
      if (spinner.stop) spinner.stop();
    } catch (error) {
      if (spinner.stop) spinner.stop();
      throw error;
    }

    finishWorkflow(report, options);
  } catch (error: any) {
    report.ok = false;
    if (report.steps.every((step) => step.status !== 'fail')) {
      report.steps.push({ name: 'workflow', status: 'fail', details: error.message });
    }

    if (options.json) {
      console.log(JSON.stringify({ ...report, error: error.message }, null, 2));
    } else {
      ui.error('Workflow failed', error.message);
    }
    process.exit(1);
  }
}

function finishWorkflow(
  report: {
    ok: boolean;
    dryRun: boolean;
    generatedFiles: string[];
    steps: Array<{ name: string; status: 'pass' | 'skip' | 'fail'; details?: string }>;
  },
  options: WorkflowOptions
): void {
  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  if (report.dryRun) {
    ui.success('Workflow dry run passed');
    ui.nextSteps(['Run without --dry-run to generate files']);
    return;
  }

  ui.success('Workflow complete');
  if (report.generatedFiles.length > 0) {
    ui.list(
      report.generatedFiles.map((file) => ui.filePath(file)),
      'Generated Files'
    );
  }
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
    // Ignore errors when listing generated files.
  }
  return files;
}
