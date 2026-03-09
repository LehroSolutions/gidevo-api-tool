import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { GeneratorStrategy } from './GeneratorStrategy';
import { registerHandlebarsHelpers } from './handlebarsHelpers';
import { safeWriteGeneratedFile } from '../pathSafety';

type GoOperation = {
  funcName: string;
  hasPayload: boolean;
  httpMethodConst: string;
  path: string;
};

type GoField = {
  jsonName: string;
  name: string;
  required: boolean;
  type: string;
};

type GoSchema =
  | {
      kind: 'struct';
      fields: GoField[];
      hasFields: boolean;
      name: string;
    }
  | {
      baseType: string;
      enumValues: Array<{ constName: string; value: string }>;
      kind: 'enum';
      name: string;
    }
  | {
      kind: 'alias';
      name: string;
      targetType: string;
    };

const HTTP_METHODS = new Set(['get', 'post', 'put', 'patch', 'delete']);
const PAYLOAD_METHODS = new Set(['post', 'put', 'patch']);

export class GoStrategy implements GeneratorStrategy {
  private templatesDir = path.resolve(__dirname, '../../templates/go');

  constructor() {
    registerHandlebarsHelpers();
  }

  async generate(spec: any, outputDir: string): Promise<void> {
    const clientCode = await this.generateClient(spec);
    const typesCode = await this.generateTypes(spec);

    await safeWriteGeneratedFile(outputDir, 'client.go', clientCode);
    await safeWriteGeneratedFile(outputDir, 'types.go', typesCode);
  }

  private async generateClient(spec: any): Promise<string> {
    const templatePath = path.join(this.templatesDir, 'client.hbs');

    try {
      const templateContent = await fs.promises.readFile(templatePath, 'utf-8');
      const template = Handlebars.compile(templateContent);
      return template({ operations: this.buildOperations(spec) });
    } catch (error) {
      throw new Error(`Failed to load template from ${templatePath}: ${error}`);
    }
  }

  private async generateTypes(spec: any): Promise<string> {
    const templatePath = path.join(this.templatesDir, 'types.hbs');

    try {
      const templateContent = await fs.promises.readFile(templatePath, 'utf-8');
      const template = Handlebars.compile(templateContent);
      return template({ schemas: this.buildSchemas(spec) });
    } catch (error) {
      throw new Error(`Failed to load template from ${templatePath}: ${error}`);
    }
  }

  private buildOperations(spec: any): GoOperation[] {
    const paths = spec?.paths ?? {};
    const operations: GoOperation[] = [];

    for (const [routePath, pathItem] of Object.entries<any>(paths)) {
      for (const [method, operation] of Object.entries<any>(pathItem ?? {})) {
        const normalizedMethod = String(method).toLowerCase();
        if (!HTTP_METHODS.has(normalizedMethod) || !operation || typeof operation !== 'object') {
          continue;
        }

        operations.push({
          funcName: this.buildMethodName(normalizedMethod, routePath),
          hasPayload: PAYLOAD_METHODS.has(normalizedMethod),
          httpMethodConst: this.httpMethodConst(normalizedMethod),
          path: routePath,
        });
      }
    }

    return operations;
  }

  private buildSchemas(spec: any): GoSchema[] {
    const schemas = spec?.components?.schemas ?? {};

    return Object.entries<any>(schemas).map(([name, schema]) => {
      if (schema?.type === 'string' && Array.isArray(schema.enum)) {
        return {
          kind: 'enum',
          name,
          baseType: 'string',
          enumValues: schema.enum.map((value: unknown) => ({
            constName: `${name}${this.toPascalCase(String(value)) || 'Value'}`,
            value: String(value),
          })),
        };
      }

      if (schema?.type === 'object' && schema.additionalProperties) {
        return {
          kind: 'alias',
          name,
          targetType: this.resolveGoType(schema),
        };
      }

      if (schema?.type === 'object' || schema?.properties) {
        const required = Array.isArray(schema?.required) ? schema.required : [];
        const fields = Object.entries<any>(schema?.properties ?? {}).map(
          ([fieldName, fieldSchema]) => ({
            name: this.toPascalCase(fieldName) || 'Field',
            jsonName: fieldName,
            type: this.resolveGoType(fieldSchema, required, fieldName),
            required: required.includes(fieldName),
          })
        );

        return {
          kind: 'struct',
          name,
          fields,
          hasFields: fields.length > 0,
        };
      }

      return {
        kind: 'alias',
        name,
        targetType: this.resolveGoType(schema),
      };
    });
  }

  private resolveGoType(schema: any, requiredList: string[] = [], propName = ''): string {
    const helper = Handlebars.helpers.resolveGoType as (
      schema: any,
      requiredList: string[],
      propName: string
    ) => string;
    return helper(schema, requiredList, propName);
  }

  private buildMethodName(method: string, routePath: string): string {
    return `${this.toPascalCase(method)}${this.toPascalCase(routePath)}`;
  }

  private httpMethodConst(method: string): string {
    switch (method) {
      case 'get':
        return 'http.MethodGet';
      case 'post':
        return 'http.MethodPost';
      case 'put':
        return 'http.MethodPut';
      case 'patch':
        return 'http.MethodPatch';
      case 'delete':
        return 'http.MethodDelete';
      default:
        return 'http.MethodGet';
    }
  }

  private toPascalCase(value: string): string {
    return value
      .replace(/\{([^}]+)\}/g, ' $1 ')
      .replace(/[^a-zA-Z0-9]+/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  }
}
