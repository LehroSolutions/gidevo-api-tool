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
  ui.sectionHeader('Configuration');

  // If --init flag, create sample config
  if (options.init) {
    const configPath = path.resolve('.gidevorc.json');
    
    if (fs.existsSync(configPath)) {
      ui.warning('Config file already exists', ui.filePath(configPath));
      ui.info('Tip', 'Remove existing file first or edit it manually');
      return;
    }

    createSampleConfig('.gidevorc.json');
    ui.success('Created configuration file', ui.filePath(configPath));
    
    ui.nextSteps([
      'Edit .gidevorc.json to customize defaults',
      'Run gidevo-api-tool config --show to view current settings',
    ]);
    return;
  }

  // If --path flag, show config file path
  if (options.path) {
    const configPath = getConfigPath();
    if (configPath) {
      ui.success('Config file found', ui.filePath(configPath));
    } else {
      ui.info('No config file', 'No .gidevorc.json found in project directory');
      ui.info('Tip', 'Run gidevo-api-tool config --init to create one');
    }
    return;
  }

  // Default or --show: display current configuration
  const configPath = getConfigPath();
  const config = loadConfig();

  if (!configPath) {
    ui.info('No configuration file found', 'Using default settings');
    ui.nextSteps([
      'Run gidevo-api-tool config --init to create a config file',
    ]);
    return;
  }

  ui.success('Config file', ui.filePath(configPath));
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
    ui.sectionHeader('Plugin Settings');
    displayConfigSection(config.plugins);
  }

  if (config.telemetry) {
    ui.sectionHeader('Telemetry Settings');
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
