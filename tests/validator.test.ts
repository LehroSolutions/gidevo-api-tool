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
        'Missing required field: info.version',
        'No paths defined'
      ])
    );
    fs.unlinkSync(tmpSpec);
  });

  it('handles parse errors gracefully', async () => {
    const badSpec = path.join(__dirname, 'tmp-bad.yaml');
    fs.writeFileSync(badSpec, ':: bad yaml');
    const result = await validator.validate(badSpec);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/Failed to parse spec:/);
    fs.unlinkSync(badSpec);
  });
});
