import * as fs from 'fs';
import * as path from 'path';
import { generateCommand } from '../src/cli/commands/generate';

describe('CLI Generate Command', () => {
  const fixtureSpec = path.resolve(__dirname, 'fixtures', 'api.yaml');
  const tmpTs = path.resolve(__dirname, 'tmp-generate-ts');
  const tmpPy = path.resolve(__dirname, 'tmp-generate-py');
  const tmpGo = path.resolve(__dirname, 'tmp-generate-go');

  let logSpy: jest.SpyInstance;

  beforeAll(() => {
    [tmpTs, tmpPy, tmpGo].forEach((dir) => {
      if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
    });
  });

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('generates TypeScript client', async () => {
    await generateCommand({ spec: fixtureSpec, language: 'typescript', output: tmpTs });
    expect(fs.existsSync(path.join(tmpTs, 'client.ts'))).toBe(true);
    expect(fs.existsSync(path.join(tmpTs, 'types.ts'))).toBe(true);

    const clientContent = fs.readFileSync(path.join(tmpTs, 'client.ts'), 'utf8');
    expect(clientContent).toMatchSnapshot();
  }, 30000);

  it('generates Python client', async () => {
    await generateCommand({ spec: fixtureSpec, language: 'python', output: tmpPy });
    expect(fs.existsSync(path.join(tmpPy, 'client.py'))).toBe(true);

    const clientContent = fs.readFileSync(path.join(tmpPy, 'client.py'), 'utf8');
    expect(clientContent).toMatchSnapshot();
  });

  it('generates Go client', async () => {
    await generateCommand({ spec: fixtureSpec, language: 'go', output: tmpGo });
    expect(fs.existsSync(path.join(tmpGo, 'client.go'))).toBe(true);
    expect(fs.existsSync(path.join(tmpGo, 'types.go'))).toBe(true);

    const clientContent = fs.readFileSync(path.join(tmpGo, 'client.go'), 'utf8');
    const typesContent = fs.readFileSync(path.join(tmpGo, 'types.go'), 'utf8');
    expect(clientContent).toMatchSnapshot();
    expect(typesContent).toMatchSnapshot();
  });

  it('exits with error for missing spec', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => {
      throw new Error('process.exit');
    }) as any);
    await expect(
      generateCommand({ spec: undefined as any, language: 'typescript', output: tmpTs })
    ).rejects.toThrow('process.exit');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Missing Directive'));
    exitSpy.mockRestore();
  });

  it('exits with error for unsupported language', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => {
      throw new Error('process.exit');
    }) as any);
    await expect(
      generateCommand({ spec: fixtureSpec, language: 'ruby', output: tmpTs } as any)
    ).rejects.toThrow('process.exit');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Target Unsupported'));
    exitSpy.mockRestore();
  });
});
