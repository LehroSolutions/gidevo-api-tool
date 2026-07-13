// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2025 LEHRO Solutions
import * as fs from 'fs';
import * as path from 'path';
import { ui } from '../utils/ui.js';
import { loadConfig, getConfigPath, createSampleConfig } from '../utils/config.js';

interface ConfigOptions {
  init?: boolean;
  show?: boolean;
  path?: boolean;
}

export async function configCommand(options: ConfigOptions) {
  ui.showCompactBanner();
  ui.sectionHeader('Config');

  // If --init flag, create sample config
  if (options.init) {
    const configPath = path.resolve('.gidevorc.json');

    if (fs.existsSync(configPath)) {
      ui.warning('Config already exists', ui.filePath(configPath));
      ui.info('Resolution', 'Edit the existing config file or remove it first');
      return;
    }

    createSampleConfig('.gidevorc.json');
    ui.success('Config file created', ui.filePath(configPath));

    ui.nextSteps([
      'Modify .gidevorc.json to define project defaults',
      'Inspect it with: gidevo-api-tool config --show',
    ]);
    return;
  }

  // If --path flag, show config file path
  if (options.path) {
    const configPath = getConfigPath();
    if (configPath) {
      ui.success('Config file found', ui.filePath(configPath));
    } else {
      ui.info('No config file found', 'This project is using defaults');
      ui.info('Create one', 'gidevo-api-tool config --init');
    }
    return;
  }

  // Default or --show: display current configuration
  const configPath = getConfigPath();
  const config = loadConfig();

  if (!configPath) {
    ui.info('Using defaults', 'No project config file was found');
    ui.nextSteps(['Create a config file: gidevo-api-tool config --init']);
    return;
  }

  ui.success('Active config', ui.filePath(configPath));
  ui.divider();

  // Display configuration sections
  if (config.generate) {
    ui.sectionHeader('Generate Defaults');
    displayConfigSection(config.generate);
  }

  if (config.init) {
    ui.sectionHeader('Init Defaults');
    displayConfigSection(config.init);
  }

  if (config.validate) {
    ui.sectionHeader('Validate Defaults');
    displayConfigSection(config.validate);
  }

  if (config.plugins) {
    ui.sectionHeader('Plugin Config');
    displayConfigSection(config.plugins);
  }

  if (config.telemetry) {
    ui.sectionHeader('Telemetry Config');
    displayConfigSection(config.telemetry);
  }
}

function displayConfigSection(section: Record<string, any>) {
  for (const [key, value] of Object.entries(section)) {
    const displayValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    ui.keyValue(key, displayValue);
  }
}
