import { Validator } from '../src/core/validator';
import * as fs from 'fs';
import * as path from 'path';

describe('Validator.validate', () => {
  const validator = new Validator();
  const validSpec = path.resolve(__dirname, 'fixtures', 'api.yaml');

  it('returns valid for a correct OpenAPI spec', async () => {
    const result = await validator.validate(validSpec);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('returns error for unsupported file format', async () => {
    const tmpFile = path.join(__dirname, 'tmp.invalid');
    fs.writeFileSync(tmpFile, 'just text');
    const result = await validator.validate(tmpFile);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Unsupported file format: .invalid');
    fs.unlinkSync(tmpFile);
  });

  it('detects missing required fields', async () => {
    const tmpSpec = path.join(__dirname, 'tmp-spec.yaml');
    const content = [
      'openapi: "3.0.0"',
      'info:',
      '  title: "Test API"',
      'paths: {}'
    ].join('\n');
    fs.writeFileSync(tmpSpec, content);
    const result = await validator.validate(tmpSpec);
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining("/info must have required property 'version'"),
        expect.stringContaining("/paths must NOT have fewer than 1 properties")
      ])
    );
    fs.unlinkSync(tmpSpec);
  });

  it('handles parse errors gracefully', async () => {
    const badSpec = path.join(__dirname, 'tmp-bad.yaml');
    fs.writeFileSync(badSpec, 'unclosed: [');
    const result = await validator.validate(badSpec);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/Failed to parse YAML:/);
    fs.unlinkSync(badSpec);
  });

  it('strict mode catches deeper issues', async () => {
    const tmpSpec = path.join(__dirname, 'tmp-strict.yaml');
    // Valid structure for basic check, but invalid for strict (invalid HTTP method)
    const content = [
      'openapi: "3.0.0"',
      'info:',
      '  title: "Test API"',
      '  version: "1.0.0"',
      'paths:',
      '  /test:',
      '    invalidMethod:',
      '      responses:',
      '        "200":',
      '          description: "OK"'
    ].join('\n');
    fs.writeFileSync(tmpSpec, content);

    // Basic should pass (as we only check paths exists)
    const basicResult = await validator.validate(tmpSpec, { strict: false });
    expect(basicResult.valid).toBe(true);

    // Strict should fail
    const strictResult = await validator.validate(tmpSpec, { strict: true });
    expect(strictResult.valid).toBe(false);
    expect(strictResult.errors.length).toBeGreaterThan(0);

    fs.unlinkSync(tmpSpec);
  });
});
