import { validateCommand } from '../src/cli/commands/validate';
import * as fs from 'fs';
import * as path from 'path';

describe('validateCommand', () => {
  const fixtureValid = path.resolve(__dirname, 'fixtures', 'api.yaml');
  const tmpInvalid = path.join(__dirname, 'tmp-invalid.yaml');

  let logSpy: jest.SpyInstance;
  let exitSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
    exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => { throw new Error('process.exit'); }) as any);
    if (fs.existsSync(tmpInvalid)) fs.unlinkSync(tmpInvalid);
  });

  afterEach(() => {
    logSpy.mockRestore();
    exitSpy.mockRestore();
    if (fs.existsSync(tmpInvalid)) fs.unlinkSync(tmpInvalid);
  });

  it('exits with error for file not found', async () => {
    const missing = 'nonexistent.yaml';
    await expect(validateCommand(missing, {})).rejects.toThrow('process.exit');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Source Not Found'));
  });

  it('valid spec logs valid', async () => {
    await validateCommand(fixtureValid, {});
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('SCHEMA INTEGRITY VERIFICATION'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Schema Integrity Verified'));
  });

  it('invalid spec exits with error', async () => {
    const content = 'openapi: "3.0.0"\ninfo:\n  title: ""\npaths: {}';
    fs.writeFileSync(tmpInvalid, content);
    await expect(validateCommand(tmpInvalid, {})).rejects.toThrow('process.exit');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Integrity Check Failed'));
  });
});