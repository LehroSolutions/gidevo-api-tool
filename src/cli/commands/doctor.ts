// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2025 LEHRO Solutions
import * as fs from 'fs';
import * as path from 'path';
import { loadPlugins } from '../../plugins/plugin.js';
import { checkOutputPath, resolveSpecPath } from '../../core/pathSafety.js';
import { dirnameFromMetaUrl } from '../../core/runtime.js';
import { Validator } from '../../core/validator.js';
import { type GidevoConfig, findConfigFile, loadConfigFile } from '../utils/config.js';
import { ui } from '../utils/ui.js';

const currentDir = dirnameFromMetaUrl(import.meta.url);
const REQUIRED_NODE_MAJOR = 24;

interface DoctorOptions {
  spec?: string;
  output?: string;
  strict?: boolean;
  json?: boolean;
  allowOutsideProject?: boolean;
}

type CheckStatus = 'pass' | 'warn' | 'fail';

interface DoctorCheck {
  name: string;
  status: CheckStatus;
  message: string;
  details?: string;
}

interface DoctorReport {
  ok: boolean;
  summary: {
    pass: number;
    warn: number;
    fail: number;
  };
  checks: DoctorCheck[];
}

export async function doctorCommand(options: DoctorOptions = {}): Promise<void> {
  const checks: DoctorCheck[] = [];
  const configPath = findConfigFile();
  let config: GidevoConfig = {};

  addNodeCheck(checks);

  if (configPath) {
    try {
      config = loadConfigFile(configPath);
      checks.push({
        name: 'config',
        status: 'pass',
        message: 'Config file is valid',
        details: configPath,
      });
    } catch (error: any) {
      checks.push({
        name: 'config',
        status: 'fail',
        message: 'Config file is invalid',
        details: error.message,
      });
    }
  } else {
    checks.push({
      name: 'config',
      status: 'warn',
      message: 'No project config file found',
      details: 'Run gidevo-api-tool config --init to create one.',
    });
  }

  await addPluginCheck(checks);
  await addSpecCheck(checks, options, config);
  addOutputCheck(checks, options, config);

  const report = buildReport(checks);

  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printHumanReport(report);
  }

  if (!report.ok) {
    process.exit(1);
  }
}

function addNodeCheck(checks: DoctorCheck[]): void {
  const major = Number(/^v(\d+)/.exec(process.version)?.[1] ?? 0);
  checks.push({
    name: 'node',
    status: major >= REQUIRED_NODE_MAJOR ? 'pass' : 'fail',
    message:
      major >= REQUIRED_NODE_MAJOR
        ? `Node ${process.version} satisfies Node ${REQUIRED_NODE_MAJOR}+`
        : `Node ${process.version} is below the Node ${REQUIRED_NODE_MAJOR}+ requirement`,
  });
}

async function addPluginCheck(checks: DoctorCheck[]): Promise<void> {
  const candidatePluginDirs = [
    path.resolve(currentDir, '..', '..', 'plugins'),
    path.resolve(currentDir, '..', '..', '..', 'src', 'plugins'),
  ];
  const pluginDir = candidatePluginDirs.find((dir) => fs.existsSync(dir)) || candidatePluginDirs[0];

  try {
    const plugins = await loadPlugins(pluginDir);
    checks.push({
      name: 'plugins',
      status: plugins.length > 0 ? 'pass' : 'warn',
      message:
        plugins.length > 0
          ? `${plugins.length} plugin(s) loaded`
          : 'No compiled plugins were found',
      details: pluginDir,
    });
  } catch (error: any) {
    checks.push({
      name: 'plugins',
      status: 'fail',
      message: 'Plugin loading failed',
      details: error.message,
    });
  }
}

async function addSpecCheck(
  checks: DoctorCheck[],
  options: DoctorOptions,
  config: GidevoConfig
): Promise<void> {
  const spec = options.spec ?? config.generate?.spec;
  if (!spec) {
    checks.push({
      name: 'spec',
      status: 'warn',
      message: 'No spec path provided',
      details: 'Pass --spec or set generate.spec in .gidevorc.json.',
    });
    return;
  }

  try {
    const resolvedSpec = resolveSpecPath(spec, {
      allowOutsideProject: options.allowOutsideProject ?? config.generate?.allowOutsideProject,
    });
    const validator = new Validator();
    const result = await validator.validate(resolvedSpec, { strict: options.strict });

    checks.push({
      name: 'spec',
      status: result.valid ? 'pass' : 'fail',
      message: result.valid ? 'Specification is readable and valid' : 'Specification is invalid',
      details: result.valid ? resolvedSpec : result.errors.join('; '),
    });
  } catch (error: any) {
    checks.push({
      name: 'spec',
      status: 'fail',
      message: 'Specification check failed',
      details: error.message,
    });
  }
}

function addOutputCheck(checks: DoctorCheck[], options: DoctorOptions, config: GidevoConfig): void {
  const output = options.output ?? config.generate?.output ?? './generated';

  try {
    const checked = checkOutputPath(output, {
      allowOutsideProject: options.allowOutsideProject ?? config.generate?.allowOutsideProject,
    });
    checks.push({
      name: 'output',
      status: 'pass',
      message: checked.exists ? 'Output directory is writable candidate' : 'Output path is safe',
      details: checked.outputDir,
    });
  } catch (error: any) {
    checks.push({
      name: 'output',
      status: 'fail',
      message: 'Output path is unsafe',
      details: error.message,
    });
  }
}

function buildReport(checks: DoctorCheck[]): DoctorReport {
  const summary = {
    pass: checks.filter((check) => check.status === 'pass').length,
    warn: checks.filter((check) => check.status === 'warn').length,
    fail: checks.filter((check) => check.status === 'fail').length,
  };

  return {
    ok: summary.fail === 0,
    summary,
    checks,
  };
}

function printHumanReport(report: DoctorReport): void {
  ui.showCompactBanner();
  ui.sectionHeader('Project Doctor');
  ui.table(
    ['Check', 'Status', 'Details'],
    report.checks.map((check) => [
      check.name,
      formatStatus(check.status),
      check.details ? `${check.message} (${check.details})` : check.message,
    ])
  );

  if (report.summary.fail > 0) {
    ui.error('Project doctor found blocking issues');
  } else if (report.summary.warn > 0) {
    ui.warning('Project doctor completed with warnings');
  } else {
    ui.success('Project doctor passed');
  }
}

function formatStatus(status: CheckStatus): string {
  if (status === 'pass') return ui.highlight('PASS');
  if (status === 'warn') return 'WARN';
  return 'FAIL';
}
