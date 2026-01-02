/**
 * Interactive Mode Utilities
 * 
 * Provides a guided wizard for new users to configure and run
 * gidevo-api-tool commands interactively.
 */

import * as readline from 'readline';
import inquirer from 'inquirer';
import { ui } from './ui';
import chalk from 'chalk';

/**
 * Prompt user for input with a question and Avant-Garde styling
 */
export function prompt(question: string, defaultValue?: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const questionMark = chalk.hex(ui.theme.secondary)('?');
  const questionText = chalk.bold(question);
  const defaultText = defaultValue ? chalk.hex(ui.theme.dim)(` (${defaultValue})`) : '';
  const pointer = chalk.hex(ui.theme.secondary)(' › ');

  const displayQuestion = `${questionMark} ${questionText}${defaultText}${pointer}`;

  return new Promise((resolve) => {
    rl.question(displayQuestion, (answer) => {
      rl.close();
      const final = answer.trim() || defaultValue || '';
      // Clear line and print result for cleaner log
      // readline leaves the input there, which is fine
      resolve(final);
    });
  });
}

/**
 * Prompt user to select from a list of options with detailed visualization
 */
export async function select(question: string, options: string[], defaultIndex = 0): Promise<string> {
  console.log();
  console.log(`${chalk.hex(ui.theme.secondary)('?')} ${chalk.bold(question)}`);

  options.forEach((opt, idx) => {
    const isSelected = idx === defaultIndex; // Visual hint for default, though real selection logic is via number input
    // We are simulating a selection list but staying with simple numbering for robustness without 'inquirer'
    const marker = chalk.hex(ui.theme.dim)(`${idx + 1}.`);
    const text = isSelected ? chalk.hex(ui.theme.secondary)(opt) + chalk.hex(ui.theme.dim)(' (default)') : chalk.white(opt);
    console.log(`  ${marker} ${text}`);
  });
  console.log();

  const answer = await prompt(`Enter selection`, String(defaultIndex + 1));
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
  const hint = defaultYes ? 'Y/n' : 'y/N';
  const answer = await prompt(question, hint);

  if (!answer || answer === hint) return defaultYes;
  return answer.toLowerCase().startsWith('y');
}

/**
 * Prompt for password with masking
 */
export async function password(question: string): Promise<string> {
  const { answer } = await inquirer.prompt<{ answer: string }>([
    {
      type: 'password',
      name: 'answer',
      message: chalk.bold(question),
      prefix: chalk.hex(ui.theme.secondary)('?'),
      mask: '*'
    }
  ]);
  return answer;
}

/**
 * Interactive wizard for the init command
 */
export async function initWizard(): Promise<{ template: string; output: string }> {
  ui.sectionHeader('PROJECT INITIALIZATION PROTOCOL');

  const template = await select('Select Architecture Template', ['openapi', 'graphql'], 0);
  const defaultDir = `./${template}-api`;
  const output = await prompt('Target Workspace', defaultDir);

  const summary = `Template:  ${ui.highlight(template)}\nOutput:    ${ui.highlight(output)}`;
  console.log(ui.box(summary, { title: 'CONFIGURATION LOCKED', borderColor: ui.theme.success, dimBorder: true }));

  const proceed = await confirm('Execute Initialization?');

  if (!proceed) {
    throw new Error('Wizard cancelled by user');
  }

  return { template, output };
}

/**
 * Interactive wizard for the generate command
 */
export async function generateWizard(): Promise<{ spec: string; language: string; output: string; template?: string }> {
  ui.sectionHeader('SDK SYNTHESIS PROTOCOL');

  const spec = await prompt('Source Specification Path');

  if (!spec) {
    throw new Error('Specification file is required');
  }

  const language = await select('Target Runtime Environment', ['typescript', 'python'], 0);
  const output = await prompt('Artifact Output Directory', './generated');

  let template: string | undefined;
  if (language === 'typescript') {
    const useCustomTemplate = await confirm('Inject Custom Template?', false);
    if (useCustomTemplate) {
      template = await select('Select Blueprint', ['rest', 'axios'], 0);
    }
  }

  const summary = `
Spec:      ${ui.highlight(spec)}
Language:  ${ui.highlight(language)}
Output:    ${ui.highlight(output)}
${template ? `Template:  ${ui.highlight(template)}` : ''}
`.trim();

  console.log(ui.box(summary, { title: 'SYNTHESIS PARAMETERS', borderColor: ui.theme.success, dimBorder: true }));

  const proceed = await confirm('Initiate Synthesis?');

  if (!proceed) {
    throw new Error('Wizard cancelled by user');
  }

  return { spec, language, output, template };
}

/**
 * Interactive wizard for login
 */
export async function loginWizard(): Promise<{ token: string }> {
  ui.sectionHeader('SECURE CONTEXT HANDSHAKE');

  console.log(chalk.hex(ui.theme.dim)('  Authenticate with GIDEVO Cloud Node to access premium features.'));
  console.log(chalk.hex(ui.theme.dim)('  Token Authority: https://gidevo.io/settings/tokens\n'));

  const token = await password('Access Token');

  if (!token || token.length < 10) {
    throw new Error('Invalid token. Token integrity check failed.');
  }

  return { token };
}

/**
 * Main interactive mode entry point
 */
export async function interactiveMode(): Promise<{ command: string; options: any }> {
  ui.showBanner();

  const commandRaw = await select('Select Directice', [
    'init      :: Initialize new neural architecture',
    'generate  :: Synthesize SDK from specs',
    'validate  :: Verify specification integrity',
    'login     :: Establish secure cloud context',
    'whoami    :: Identity verification',
    'Exit      :: Terminate session'
  ], 0);

  const commandName = commandRaw.split(/\s+/)[0].trim().toLowerCase();

  switch (commandName) {
    case 'init':
      return { command: 'init', options: await initWizard() };

    case 'generate':
      return { command: 'generate', options: await generateWizard() };

    case 'validate': {
      ui.sectionHeader('INTEGRITY VERIFICATION');
      const spec = await prompt('Specification Path');
      const strict = await confirm('Enforce Strict Schema Compliance?', false);
      return { command: 'validate', options: { spec, strict } };
    }

    case 'login':
      return { command: 'login', options: await loginWizard() };

    case 'whoami':
      return { command: 'whoami', options: {} };

    case 'exit':
      console.log(chalk.hex(ui.theme.secondary)('\n  Session Terminated. Output flushed.\n'));
      process.exit(0);

    default:
      throw new Error(`Unknown command directive: ${commandName}`);
  }
}
