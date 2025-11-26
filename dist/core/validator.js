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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const yaml = __importStar(require("js-yaml"));
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const openapi_schema_validator_1 = __importDefault(require("openapi-schema-validator"));
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
class Validator {
    constructor() {
        this.ajv = new ajv_1.default({ allErrors: true });
        (0, ajv_formats_1.default)(this.ajv);
        this.validateFn = this.ajv.compile(openApiSchema);
        this.strictValidator = new openapi_schema_validator_1.default({
            version: 3,
        });
    }
    async validate(specPath, options = {}) {
        const errors = [];
        try {
            const content = fs.readFileSync(specPath, 'utf8');
            const ext = path.extname(specPath).toLowerCase();
            let parsed;
            if (ext === '.json') {
                parsed = JSON.parse(content);
            }
            else if (ext === '.yaml' || ext === '.yml') {
                try {
                    parsed = yaml.load(content);
                }
                catch (e) {
                    throw new Error(`Failed to parse YAML: ${e}`);
                }
            }
            else if (ext === '.graphql' || ext === '.gql') {
                return { valid: true, errors: [] }; // Basic validation for now
            }
            else {
                errors.push(`Unsupported file format: ${ext}`);
                return { valid: false, errors };
            }
            if (options.strict) {
                const result = this.strictValidator.validate(parsed);
                if (result.errors && result.errors.length > 0) {
                    result.errors.forEach((err) => {
                        errors.push(`${err.instancePath || ''} ${err.message}`);
                    });
                }
            }
            else {
                // Basic AJV Validation
                const valid = this.validateFn(parsed);
                if (!valid) {
                    this.validateFn.errors?.forEach((err) => {
                        errors.push(`${err.instancePath} ${err.message}`);
                    });
                }
            }
            return { valid: errors.length === 0, errors };
        }
        catch (error) {
            errors.push(`Validation error: ${error}`);
            return { valid: false, errors };
        }
    }
}
exports.Validator = Validator;
//# sourceMappingURL=validator.js.map