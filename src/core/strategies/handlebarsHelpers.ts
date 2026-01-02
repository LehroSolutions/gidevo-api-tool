// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
/**
 * Handlebars Helpers Registry
 * 
 * Centralized registration of Handlebars helpers to avoid duplication
 * and ensure helpers are registered only once.
 */

import * as Handlebars from 'handlebars';

let helpersRegistered = false;

/**
 * Register all custom Handlebars helpers.
 * Safe to call multiple times - will only register once.
 */
export function registerHandlebarsHelpers(): void {
  if (helpersRegistered) return;

  // Equality check helper
  Handlebars.registerHelper('eq', function (a, b) {
    return a === b;
  });

  // Generate method name from HTTP method and path
  Handlebars.registerHelper('methodName', function (method, pathStr) {
    const cleanPath = pathStr.replace(/[^a-zA-Z0-9]/g, ' ').trim();
    const parts = cleanPath.split(' ').filter(Boolean);
    const pathName = parts.map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
    return method.toLowerCase() + pathName;
  });

  // Resolve OpenAPI schema to TypeScript type
  Handlebars.registerHelper('resolveType', function (schema): string {
    if (!schema) return 'unknown';

    if (schema.$ref) {
      const parts = schema.$ref.split('/');
      return parts[parts.length - 1];
    }

    if (schema.type === 'array') {
      const itemType = schema.items ? Handlebars.helpers.resolveType(schema.items) : 'unknown';
      return `${itemType}[]`;
    }

    if (schema.type === 'integer' || schema.type === 'number') return 'number';
    if (schema.type === 'boolean') return 'boolean';
    if (schema.type === 'string') {
      if (schema.format === 'date-time' || schema.format === 'date') return 'string';
      if (schema.enum) return schema.enum.map((e: string) => `'${e}'`).join(' | ');
      return 'string';
    }
    if (schema.type === 'object') {
      if (schema.additionalProperties) {
        const valueType = typeof schema.additionalProperties === 'object'
          ? Handlebars.helpers.resolveType(schema.additionalProperties)
          : 'unknown';
        return `Record<string, ${valueType}>`;
      }
      return 'Record<string, unknown>';
    }

    // Handle anyOf, oneOf, allOf
    if (schema.oneOf || schema.anyOf) {
      const variants = schema.oneOf || schema.anyOf;
      return variants.map((s: any) => Handlebars.helpers.resolveType(s)).join(' | ');
    }
    if (schema.allOf) {
      return schema.allOf.map((s: any) => Handlebars.helpers.resolveType(s)).join(' & ');
    }

    return 'unknown';
  });

  // Resolve OpenAPI schema to Python type
  Handlebars.registerHelper('resolvePyType', function (schema, requiredList, propName): string {
    let type = 'Any';

    if (!schema) return 'Any';

    if (schema.$ref) {
      const parts = schema.$ref.split('/');
      type = parts[parts.length - 1];
    } else if (schema.type === 'array') {
      const itemType = schema.items ? Handlebars.helpers.resolvePyType(schema.items, [], '') : 'Any';
      const cleanItemType = itemType.replace(/^Optional\[(.*)\]$/, '$1');
      type = `List[${cleanItemType}]`;
    } else if (schema.type === 'integer') {
      type = 'int';
    } else if (schema.type === 'number') {
      type = 'float';
    } else if (schema.type === 'boolean') {
      type = 'bool';
    } else if (schema.type === 'string') {
      if (schema.enum) {
        type = 'str';  // Could be Literal type in Python 3.8+
      } else {
        type = 'str';
      }
    } else if (schema.type === 'object') {
      type = 'Dict[str, Any]';
    }

    const isRequired = Array.isArray(requiredList) && requiredList.includes(propName);
    if (!isRequired && propName) {
      return `Optional[${type}]`;
    }
    return type;
  });

  // Lowercase helper
  Handlebars.registerHelper('lowercase', function (str) {
    return typeof str === 'string' ? str.toLowerCase() : str;
  });

  // Uppercase helper
  Handlebars.registerHelper('uppercase', function (str) {
    return typeof str === 'string' ? str.toUpperCase() : str;
  });

  // Capitalize helper
  Handlebars.registerHelper('capitalize', function (str) {
    if (typeof str !== 'string' || !str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  // Safe JSON stringify for debugging in templates
  Handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context, null, 2);
  });

  helpersRegistered = true;
}
