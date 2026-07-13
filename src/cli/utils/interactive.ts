/**
 * Interactive Mode Utilities
 *
 * Provides a guided wizard for new users to configure and run
 * gidevo-api-tool commands interactively.
 */

import {
  confirm as confirmPrompt,
  input,
  password as passwordPrompt,
  select as selectPrompt,
} from '@inquirer/prompts';
import { ui } from './ui.js';

export function prompt(question: string, defaultValue?: string): Promise<string> {
  return input({
    message: question,
    default: defaultValue,
  });
}

export function select(question: string, options: string[], defaultIndex = 0): Promise<string> {
  return selectPrompt({
    message: question,
    choices: options.map((option) => ({ name: option, value: option })),
    default: options[defaultIndex],
  });
}

export function confirm(question: string, defaultYes = true): Promise<boolean> {
  return confirmPrompt({
    message: question,
    default: defaultYes,
  });
}

export function password(question: string): Promise<string> {
  return passwordPrompt({
    message: question,
    mask: '*',
  });
}

export async function initWizard(): Promise<{ template: string; output: string }> {
  ui.sectionHeader('Project Initialization');

  const template = await select('Select project template', ['openapi', 'graphql'], 0);
  const defaultDir = `./${template}-api`;
  const output = await prompt('Output directory', defaultDir);

  console.log(
    ui.box(`Template:  ${ui.highlight(template)}\nOutput:    ${ui.highlight(output)}`, {
      title: 'Planned Project',
      borderColor: ui.theme.success,
      dimBorder: true,
    })
  );

  const proceed = await confirm('Create this project?');
  if (!proceed) throw new Error('Wizard cancelled by user');

  return { template, output };
}

export async function generateWizard(): Promise<{
  spec: string;
  language: string;
  output: string;
  template?: string;
}> {
  ui.sectionHeader('SDK Generation');

  const spec = await prompt('Specification path');
  if (!spec) throw new Error('Specification file is required');

  const language = await select('Target language', ['typescript', 'python', 'go'], 0);
  const output = await prompt('Output directory', './generated');

  let template: string | undefined;
  if (language === 'typescript') {
    const useCustomTemplate = await confirm('Use a custom TypeScript template?', false);
    if (useCustomTemplate) {
      template = await select('Template', ['rest', 'axios'], 0);
    }
  }

  const summary = `
Spec:      ${ui.highlight(spec)}
Language:  ${ui.highlight(language)}
Output:    ${ui.highlight(output)}
${template ? `Template:  ${ui.highlight(template)}` : ''}
`.trim();

  console.log(
    ui.box(summary, {
      title: 'Generation Plan',
      borderColor: ui.theme.success,
      dimBorder: true,
    })
  );

  const proceed = await confirm('Generate SDK now?');
  if (!proceed) throw new Error('Wizard cancelled by user');

  return { spec, language, output, template };
}

export async function loginWizard(): Promise<{ token: string }> {
  ui.sectionHeader('Authentication');

  const token = await password('API token');
  if (!token || token.length < 10) {
    throw new Error('Token appears to be invalid.');
  }

  return { token };
}

export async function interactiveMode(): Promise<{ command: string; options: any }> {
  ui.showBanner();

  const commandName = (
    await select(
      'Select workflow',
      [
        'init      - Initialize a new API project',
        'generate  - Generate an SDK from a spec',
        'validate  - Validate an API specification',
        'doctor    - Check project health',
        'workflow  - Validate and generate in one run',
        'login     - Store an API token',
        'whoami    - Show authentication status',
        'exit      - Close interactive mode',
      ],
      0
    )
  )
    .split(/\s+/)[0]
    .trim()
    .toLowerCase();

  switch (commandName) {
    case 'init':
      return { command: 'init', options: await initWizard() };

    case 'generate':
      return { command: 'generate', options: await generateWizard() };

    case 'validate': {
      ui.sectionHeader('Specification Validation');
      const spec = await prompt('Specification path');
      const strict = await confirm('Use strict OpenAPI validation?', false);
      return { command: 'validate', options: { spec, strict } };
    }

    case 'doctor': {
      const spec = await prompt('Specification path (optional)');
      return { command: 'doctor', options: spec ? { spec } : {} };
    }

    case 'workflow': {
      const options = await generateWizard();
      const strict = await confirm('Use strict validation before generation?', false);
      return { command: 'workflow', options: { ...options, strict } };
    }

    case 'login':
      return { command: 'login', options: await loginWizard() };

    case 'whoami':
      return { command: 'whoami', options: {} };

    case 'exit':
      console.log('\n  Interactive mode closed.\n');
      process.exit(0);
      break;

    default:
      throw new Error(`Unknown workflow: ${commandName}`);
  }
}
