import { validateCommand } from '../src/cli/commands/validate';
import * as fs from 'fs';
import * as path from 'path';

describe('validateCommand', () => {
  const fixtureValid = path.resolve(__dirname, 'fixtures', 'api.yaml');
  const tmpInvalid = path.join(__dirname, 'tmp-invalid.yaml');

  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    if (fs.existsSync(tmpInvalid)) fs.unlinkSync(tmpInvalid);
  });

  afterEach(() => {
    logSpy.mockRestore();
    if (fs.existsSync(tmpInvalid)) fs.unlinkSync(tmpInvalid);
  });

  it('logs file not found', async () => {
    const missing = 'nonexistent.yaml';
    await validateCommand(missing);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(`Spec file not found: ${missing}`));
  });

  it('valid spec logs valid', async () => {
    await validateCommand(fixtureValid);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(`Validating ${fixtureValid}`));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('✅ Spec is valid!'));
  });

  it('invalid spec logs errors', async () => {
    const content = 'openapi: "3.0.0"\ninfo:\n  title: ""\npaths: {}';
    fs.writeFileSync(tmpInvalid, content);
    await validateCommand(tmpInvalid);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(`Validating ${tmpInvalid}`));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('❌ Validation failed:'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Missing required field: info.version'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('No paths defined'));
  });
});