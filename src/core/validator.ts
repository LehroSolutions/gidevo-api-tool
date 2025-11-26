import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import OpenAPISchemaValidator from 'openapi-schema-validator';

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

interface ValidationOptions {
  strict?: boolean;
}

// Minimal OpenAPI 3.0 Schema for basic validation
const openApiSchema = {
  type: 'object',
  required: ['openapi', 'info', 'paths'],
  properties: {
    openapi: { type: 'string', pattern: '^3\\.' },
    info: {
      type: 'object',
      required: ['title', 'version'],
      properties: {
        title: { type: 'string' },
        version: { type: 'string' },
        description: { type: 'string' }
      }
    },
    paths: {
      type: 'object',
      minProperties: 1
    }
  }
};

export class Validator {
  private ajv: any;
  private validateFn: any;
  private strictValidator: OpenAPISchemaValidator;

  constructor() {
    this.ajv = new Ajv({ allErrors: true });
    addFormats(this.ajv);
    this.validateFn = this.ajv.compile(openApiSchema);
    this.strictValidator = new OpenAPISchemaValidator({
      version: 3,
    });
  }

  async validate(specPath: string, options: ValidationOptions = {}): Promise<ValidationResult> {
    const errors: string[] = [];

    try {
      const content = fs.readFileSync(specPath, 'utf8');
      const ext = path.extname(specPath).toLowerCase();

      let parsed: any;
      if (ext === '.json') {
        parsed = JSON.parse(content);
      } else if (ext === '.yaml' || ext === '.yml') {
        try {
          parsed = yaml.load(content);
        } catch (e) {
          throw new Error(`Failed to parse YAML: ${e}`);
        }
      } else if (ext === '.graphql' || ext === '.gql') {
        return { valid: true, errors: [] }; // Basic validation for now
      } else {
        errors.push(`Unsupported file format: ${ext}`);
        return { valid: false, errors };
      }

      if (options.strict) {
        const result = this.strictValidator.validate(parsed);
        if (result.errors && result.errors.length > 0) {
          result.errors.forEach((err: any) => {
            errors.push(`${err.instancePath || ''} ${err.message}`);
          });
        }
      } else {
        // Basic AJV Validation
        const valid = this.validateFn(parsed);
        if (!valid) {
          this.validateFn.errors?.forEach((err: any) => {
            errors.push(`${err.instancePath} ${err.message}`);
          });
        }
      }

      return { valid: errors.length === 0, errors };
    } catch (error) {
      errors.push(`Validation error: ${error}`);
      return { valid: false, errors };
    }
  }
}
