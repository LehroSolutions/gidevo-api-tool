/**
 * Interactive Mode Utilities
 * 
 * Provides a guided wizard for new users to configure and run
 * gidevo-api-tool commands interactively.
 */

import * as readline from 'readline';
import { ui } from './ui';

/**
 * Prompt user for input with a question
 */
export function prompt(question: string, defaultValue?: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const displayQuestion = defaultValue
    ? `${question} [${defaultValue}]: `
    : `${question}: `;

  return new Promise((resolve) => {
    rl.question(displayQuestion, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue || '');
    });
  });
}

/**
 * Prompt user to select from a list of options
 */
export async function select(question: string, options: string[], defaultIndex = 0): Promise<string> {
  console.log(`\n${question}`);
  options.forEach((opt, idx) => {
    const marker = idx === defaultIndex ? '●' : '○';
    console.log(`  ${marker} ${idx + 1}. ${opt}`);
  });

  const answer = await prompt(`Enter choice (1-${options.length})`, String(defaultIndex + 1));
  const index = parseInt(answer, 10) - 1;
  
  if (index >= 0 && index < options.length) {
    return options[index];
  }
  return options[defaultIndex];
}

/**
 * Prompt for yes/no confirmation
 */
export async function confirm(question: string, defaultYes = true): Promise<boolean> {
  const hint = defaultYes ? '[Y/n]' : '[y/N]';
  const answer = await prompt(`${question} ${hint}`);
  
  if (!answer) return defaultYes;
  return answer.toLowerCase().startsWith('y');
}

/**
 * Interactive wizard for the init command
 */
export async function initWizard(): Promise<{ template: string; output: string }> {
  ui.sectionHeader('Project Initialization Wizard');
  
  console.log('  Let\'s set up your new API project!\n');

  const template = await select('Which type of API project?', ['openapi', 'graphql'], 0);
  const output = await prompt('Output directory', './my-api');

  console.log();
  ui.divider();
  
  console.log('\n  📋 Configuration Summary:\n');
  console.log(`     Template:  ${template}`);
  console.log(`     Output:    ${output}\n`);

  const proceed = await confirm('Create project with these settings?');
  
  if (!proceed) {
    throw new Error('Wizard cancelled by user');
  }

  return { template, output };
}

/**
 * Interactive wizard for the generate command
 */
export async function generateWizard(): Promise<{ spec: string; language: string; output: string; template?: string }> {
  ui.sectionHeader('SDK Generation Wizard');
  
  console.log('  Let\'s generate your API client SDK!\n');

  const spec = await prompt('Path to API specification file');
  
  if (!spec) {
    throw new Error('Specification file is required');
  }

  const language = await select('Target language', ['typescript', 'python'], 0);
  const output = await prompt('Output directory', './generated');
  
  let template: string | undefined;
  if (language === 'typescript') {
    const useCustomTemplate = await confirm('Use custom template?', false);
    if (useCustomTemplate) {
      template = await select('Select template', ['rest', 'axios'], 0);
    }
  }

  console.log();
  ui.divider();
  
  console.log('\n  📋 Configuration Summary:\n');
  console.log(`     Spec:      ${spec}`);
  console.log(`     Language:  ${language}`);
  console.log(`     Output:    ${output}`);
  if (template) {
    console.log(`     Template:  ${template}`);
  }
  console.log();

  const proceed = await confirm('Generate SDK with these settings?');
  
  if (!proceed) {
    throw new Error('Wizard cancelled by user');
  }

  return { spec, language, output, template };
}

/**
 * Interactive wizard for login
 */
export async function loginWizard(): Promise<{ token: string }> {
  ui.sectionHeader('Authentication Wizard');
  
  console.log('  Let\'s authenticate with the GIDEVO API service!\n');
  console.log('  You can get an API token from: https://gidevo.io/settings/tokens\n');

  const token = await prompt('Enter your API token');
  
  if (!token || token.length < 10) {
    throw new Error('Invalid token. Token must be at least 10 characters.');
  }

  return { token };
}

/**
 * Main interactive mode entry point
 */
export async function interactiveMode(): Promise<{ command: string; options: any }> {
  ui.showBanner();
  ui.sectionHeader('Interactive Mode');
  
  console.log('  Welcome! This wizard will guide you through using gidevo-api-tool.\n');

  const command = await select('What would you like to do?', [
    'init - Create a new API project',
    'generate - Generate SDK from API spec',
    'validate - Validate an API specification',
    'login - Authenticate with the service',
    'whoami - Check authentication status',
    'Exit'
  ], 0);

  const commandName = command.split(' - ')[0].trim();

  switch (commandName) {
    case 'init':
      return { command: 'init', options: await initWizard() };
    
    case 'generate':
      return { command: 'generate', options: await generateWizard() };
    
    case 'validate': {
      const spec = await prompt('Path to API specification file');
      const strict = await confirm('Enable strict validation?', false);
      return { command: 'validate', options: { spec, strict } };
    }
    
    case 'login':
      return { command: 'login', options: await loginWizard() };
    
    case 'whoami':
      return { command: 'whoami', options: {} };
    
    case 'Exit':
      console.log('\n  Goodbye! 👋\n');
      process.exit(0);
    
    default:
      throw new Error(`Unknown command: ${commandName}`);
  }
}
