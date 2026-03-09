import { spawnSync } from 'child_process';
import path from 'path';

describe('CLI Help', () => {
  it('displays help with commands', () => {
    const cliPath = path.resolve(__dirname, '../dist/cli/index.js');
    const result = spawnSync('node', [cliPath, '--help'], { encoding: 'utf8' });
    if (result.error && (result.error as NodeJS.ErrnoException).code === 'EPERM') {
      return;
    }
    if (result.error) {
      throw result.error;
    }

    const output = result.stdout.toString();
    expect(output).toMatch(/init/);
    expect(output).toMatch(/generate/);
    expect(output).toMatch(/validate/);
    expect(output).toMatch(/login/);
    expect(output).toMatch(/logout/);
    expect(output).toMatch(/plugin/);
    expect(output).toMatch(/typescript, python, go/);
  });
});
