// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import * as fs from 'fs';
import * as path from 'path';
import { ui } from '../utils/ui';
import { loadConfig, getConfigPath, createSampleConfig, GidevoConfig } from '../utils/config';

interface ConfigOptions {
  init?: boolean;
  show?: boolean;
  path?: boolean;
}

export async function configCommand(options: ConfigOptions) {
  ui.showCompactBanner();
  ui.sectionHeader('ENVIRONMENT CONFIGURATION');

  // If --init flag, create sample config
  if (options.init) {
    const configPath = path.resolve('.gidevorc.json');

    if (fs.existsSync(configPath)) {
      ui.warning('Manifest Already Exists', ui.filePath(configPath));
      ui.info('Resolution', 'Remove existing manifest or modify directly');
      return;
    }

    createSampleConfig('.gidevorc.json');
    ui.success('Manifest Synthesized', ui.filePath(configPath));

    ui.nextSteps([
      'Modify .gidevorc.json to define project defaults',
      'Inspect: gidevo-api-tool config --show',
    ]);
    return;
  }

  // If --path flag, show config file path
  if (options.path) {
    const configPath = getConfigPath();
    if (configPath) {
      ui.success('Manifest Located', ui.filePath(configPath));
    } else {
      ui.info('No Manifest Detected', 'Workspace lacks .gidevorc.json');
      ui.info('Initialize', 'gidevo-api-tool config --init');
    }
    return;
  }

  // Default or --show: display current configuration
  const configPath = getConfigPath();
  const config = loadConfig();

  if (!configPath) {
    ui.info('Operating in Default Mode', 'No project manifest detected');
    ui.nextSteps([
      'Initialize manifest: gidevo-api-tool config --init',
    ]);
    return;
  }

  ui.success('Active Manifest', ui.filePath(configPath));
  ui.divider();

  // Display configuration sections
  if (config.generate) {
    ui.sectionHeader('SYNTHESIS DEFAULTS');
    displayConfigSection(config.generate);
  }

  if (config.init) {
    ui.sectionHeader('INITIALIZATION DEFAULTS');
    displayConfigSection(config.init);
  }

  if (config.validate) {
    ui.sectionHeader('VERIFICATION DEFAULTS');
    displayConfigSection(config.validate);
  }

  if (config.plugins) {
    ui.sectionHeader('EXTENSION CONFIGURATION');
    displayConfigSection(config.plugins);
  }

  if (config.telemetry) {
    ui.sectionHeader('TELEMETRY CONFIGURATION');
    displayConfigSection(config.telemetry);
  }
}

function displayConfigSection(section: Record<string, any>) {
  for (const [key, value] of Object.entries(section)) {
    const displayValue = typeof value === 'object'
      ? JSON.stringify(value)
      : String(value);
    ui.keyValue(key, displayValue);
  }
}
