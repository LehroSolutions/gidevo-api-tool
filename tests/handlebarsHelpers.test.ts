import * as Handlebars from 'handlebars';
import { registerHandlebarsHelpers } from '../src/core/strategies/handlebarsHelpers';

describe('handlebars helpers hardening', () => {
  beforeAll(() => {
    registerHandlebarsHelpers();
  });

  it('escapes enum literals in TypeScript union types', () => {
    const result = Handlebars.helpers.resolveType({
      type: 'string',
      enum: ["admin'{{#each users}}{}", 'reader'],
    }) as string;

    expect(result).toContain("\\'");
    expect(result).toContain('\\{\\{');
    expect(result).toContain('\\}\\}');
    expect(result).not.toContain('{{#each');
  });

  it('resolves go types for optional and required fields', () => {
    const required = ['id'];
    const requiredType = Handlebars.helpers.resolveGoType(
      { type: 'integer' },
      required,
      'id'
    ) as string;
    const optionalType = Handlebars.helpers.resolveGoType(
      { type: 'integer' },
      required,
      'count'
    ) as string;

    expect(requiredType).toBe('int');
    expect(optionalType).toBe('*int');
  });
});
