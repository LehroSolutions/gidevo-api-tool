import { createProgram } from '../src/cli/index.js';

describe('createProgram', () => {
  it('registers v0.2 core commands without parsing', () => {
    const program = createProgram({
      argv: ['node', 'gidevo-api-tool', '--no-color'],
    });
    const commandNames = program.commands.map((command) => command.name());

    expect(commandNames).toEqual(
      expect.arrayContaining([
        'init',
        'generate',
        'validate',
        'doctor',
        'workflow',
        'login',
        'logout',
        'whoami',
        'config',
        'plugin',
      ])
    );
  });
});
