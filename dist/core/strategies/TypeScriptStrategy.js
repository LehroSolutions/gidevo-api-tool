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
exports.TypeScriptStrategy = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const Handlebars = __importStar(require("handlebars"));
class TypeScriptStrategy {
    constructor() {
        // Resolve templates directory relative to this file
        // In production (dist), this will be .../dist/templates/typescript
        // In development (src), this will be .../src/templates/typescript
        this.templatesDir = path.join(__dirname, '../../templates/typescript');
        Handlebars.registerHelper('eq', function (a, b) {
            return a === b;
        });
        Handlebars.registerHelper('methodName', function (method, path) {
            const cleanPath = path.replace(/[^a-zA-Z0-9]/g, ' ').trim();
            const parts = cleanPath.split(' ');
            const pathName = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
            return method + pathName;
        });
    }
    async generate(spec, outputDir) {
        const clientCode = await this.generateClient(spec);
        await fs.promises.writeFile(path.join(outputDir, 'client.ts'), clientCode);
        await fs.promises.writeFile(path.join(outputDir, 'types.ts'), await this.generateTypes(spec));
    }
    async generateClient(spec) {
        const templateName = spec.type === 'graphql' ? 'client-graphql.hbs' : 'client-rest.hbs';
        const templatePath = path.join(this.templatesDir, templateName);
        try {
            const templateContent = await fs.promises.readFile(templatePath, 'utf-8');
            const template = Handlebars.compile(templateContent);
            return template(spec);
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
            return template(spec);
        }
        catch (error) {
            throw new Error(`Failed to load template from ${templatePath}: ${error}`);
        }
    }
}
exports.TypeScriptStrategy = TypeScriptStrategy;
//# sourceMappingURL=TypeScriptStrategy.js.map