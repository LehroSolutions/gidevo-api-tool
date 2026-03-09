"use strict";
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
exports.GoStrategy = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const Handlebars = __importStar(require("handlebars"));
const handlebarsHelpers_1 = require("./handlebarsHelpers");
const pathSafety_1 = require("../pathSafety");
const HTTP_METHODS = new Set(['get', 'post', 'put', 'patch', 'delete']);
const PAYLOAD_METHODS = new Set(['post', 'put', 'patch']);
class GoStrategy {
    constructor() {
        this.templatesDir = path.resolve(__dirname, '../../templates/go');
        (0, handlebarsHelpers_1.registerHandlebarsHelpers)();
    }
    async generate(spec, outputDir) {
        const clientCode = await this.generateClient(spec);
        const typesCode = await this.generateTypes(spec);
        await (0, pathSafety_1.safeWriteGeneratedFile)(outputDir, 'client.go', clientCode);
        await (0, pathSafety_1.safeWriteGeneratedFile)(outputDir, 'types.go', typesCode);
    }
    async generateClient(spec) {
        const templatePath = path.join(this.templatesDir, 'client.hbs');
        try {
            const templateContent = await fs.promises.readFile(templatePath, 'utf-8');
            const template = Handlebars.compile(templateContent);
            return template({ operations: this.buildOperations(spec) });
        }
        catch (error) {
            throw new Error(`Failed to load template from ${templatePath}: ${error}`);
        }
    }
    async generateTypes(spec) {
        const templatePath = path.join(this.templatesDir, 'types.hbs');
        try {
            const templateContent = await fs.promises.readFile(templatePath, 'utf-8');
            const template = Handlebars.compile(templateContent);
            return template({ schemas: this.buildSchemas(spec) });
        }
        catch (error) {
            throw new Error(`Failed to load template from ${templatePath}: ${error}`);
        }
    }
    buildOperations(spec) {
        const paths = spec?.paths ?? {};
        const operations = [];
        for (const [routePath, pathItem] of Object.entries(paths)) {
            for (const [method, operation] of Object.entries(pathItem ?? {})) {
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
    buildSchemas(spec) {
        const schemas = spec?.components?.schemas ?? {};
        return Object.entries(schemas).map(([name, schema]) => {
            if (schema?.type === 'string' && Array.isArray(schema.enum)) {
                return {
                    kind: 'enum',
                    name,
                    baseType: 'string',
                    enumValues: schema.enum.map((value) => ({
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
                const fields = Object.entries(schema?.properties ?? {}).map(([fieldName, fieldSchema]) => ({
                    name: this.toPascalCase(fieldName) || 'Field',
                    jsonName: fieldName,
                    type: this.resolveGoType(fieldSchema, required, fieldName),
                    required: required.includes(fieldName),
                }));
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
    resolveGoType(schema, requiredList = [], propName = '') {
        const helper = Handlebars.helpers.resolveGoType;
        return helper(schema, requiredList, propName);
    }
    buildMethodName(method, routePath) {
        return `${this.toPascalCase(method)}${this.toPascalCase(routePath)}`;
    }
    httpMethodConst(method) {
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
    toPascalCase(value) {
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
exports.GoStrategy = GoStrategy;
//# sourceMappingURL=GoStrategy.js.map