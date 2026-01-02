"use strict";
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
/**
 * Handlebars Helpers Registry
 *
 * Centralized registration of Handlebars helpers to avoid duplication
 * and ensure helpers are registered only once.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHandlebarsHelpers = registerHandlebarsHelpers;
const Handlebars = __importStar(require("handlebars"));
let helpersRegistered = false;
/**
 * Register all custom Handlebars helpers.
 * Safe to call multiple times - will only register once.
 */
function registerHandlebarsHelpers() {
    if (helpersRegistered)
        return;
    // Equality check helper
    Handlebars.registerHelper('eq', function (a, b) {
        return a === b;
    });
    // Generate method name from HTTP method and path
    Handlebars.registerHelper('methodName', function (method, pathStr) {
        const cleanPath = pathStr.replace(/[^a-zA-Z0-9]/g, ' ').trim();
        const parts = cleanPath.split(' ').filter(Boolean);
        const pathName = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
        return method.toLowerCase() + pathName;
    });
    // Resolve OpenAPI schema to TypeScript type
    Handlebars.registerHelper('resolveType', function (schema) {
        if (!schema)
            return 'unknown';
        if (schema.$ref) {
            const parts = schema.$ref.split('/');
            return parts[parts.length - 1];
        }
        if (schema.type === 'array') {
            const itemType = schema.items ? Handlebars.helpers.resolveType(schema.items) : 'unknown';
            return `${itemType}[]`;
        }
        if (schema.type === 'integer' || schema.type === 'number')
            return 'number';
        if (schema.type === 'boolean')
            return 'boolean';
        if (schema.type === 'string') {
            if (schema.format === 'date-time' || schema.format === 'date')
                return 'string';
            if (schema.enum)
                return schema.enum.map((e) => `'${e}'`).join(' | ');
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
            return variants.map((s) => Handlebars.helpers.resolveType(s)).join(' | ');
        }
        if (schema.allOf) {
            return schema.allOf.map((s) => Handlebars.helpers.resolveType(s)).join(' & ');
        }
        return 'unknown';
    });
    // Resolve OpenAPI schema to Python type
    Handlebars.registerHelper('resolvePyType', function (schema, requiredList, propName) {
        let type = 'Any';
        if (!schema)
            return 'Any';
        if (schema.$ref) {
            const parts = schema.$ref.split('/');
            type = parts[parts.length - 1];
        }
        else if (schema.type === 'array') {
            const itemType = schema.items ? Handlebars.helpers.resolvePyType(schema.items, [], '') : 'Any';
            const cleanItemType = itemType.replace(/^Optional\[(.*)\]$/, '$1');
            type = `List[${cleanItemType}]`;
        }
        else if (schema.type === 'integer') {
            type = 'int';
        }
        else if (schema.type === 'number') {
            type = 'float';
        }
        else if (schema.type === 'boolean') {
            type = 'bool';
        }
        else if (schema.type === 'string') {
            if (schema.enum) {
                type = 'str'; // Could be Literal type in Python 3.8+
            }
            else {
                type = 'str';
            }
        }
        else if (schema.type === 'object') {
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
        if (typeof str !== 'string' || !str)
            return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    });
    // Safe JSON stringify for debugging in templates
    Handlebars.registerHelper('json', function (context) {
        return JSON.stringify(context, null, 2);
    });
    helpersRegistered = true;
}
//# sourceMappingURL=handlebarsHelpers.js.map