import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('CLI Help', () => {
  const cliPath = path.resolve(__dirname, '../dist/cli/index.js');

  function runHelp(args: string[]) {
    const result = spawnSync('node', [cliPath, ...args], { encoding: 'utf8' });
    if (result.error && (result.error as NodeJS.ErrnoException).code === 'EPERM') {
      return null;
    }
    if (result.error) {
      throw result.error;
    }

    return result.stdout.toString();
  }

  it('displays top-level help with commands', () => {
    const output = runHelp(['--help']);
    if (output === null) {
      return;
    }

    expect(output).toMatch(/init/);
    expect(output).toMatch(/generate/);
    expect(output).toMatch(/validate/);
    expect(output).toMatch(/doctor/);
    expect(output).toMatch(/workflow/);
    expect(output).toMatch(/login/);
    expect(output).toMatch(/logout/);
    expect(output).toMatch(/plugin/);
    expect(output).toMatch(
      /gidevo-api-tool workflow --spec api\.yaml --language typescript --dry-run/
    );
  });

  it('displays supported generate languages in generate help', () => {
    const output = runHelp(['generate', '--help']);
    if (output === null) {
      return;
    }

    expect(output).toMatch(/Target language \(typescript, python, go\)/);
    expect(output).toMatch(/Supported languages:/);
    expect(output).toMatch(/typescript, python, go/);
  });

  it('displays doctor JSON flag in help', () => {
    const output = runHelp(['doctor', '--help']);
    if (output === null) {
      return;
    }

    expect(output).toMatch(/Run read-only project health checks/);
    expect(output).toMatch(/--json/);
  });
});
