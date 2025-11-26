import { execSync } from 'child_process';
import path from 'path';

describe('CLI Help', () => {
  it('displays help with commands', () => {
    const cliPath = path.resolve(__dirname, '../dist/cli/index.js');
    const output = execSync(`node "${cliPath}" --help`).toString();
    expect(output).toMatch(/init/);
    expect(output).toMatch(/generate/);
    expect(output).toMatch(/validate/);
    expect(output).toMatch(/login/);
    expect(output).toMatch(/logout/);
    expect(output).toMatch(/plugin/);
  });
});