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
exports.CodeGenerator = void 0;
// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const yaml = __importStar(require("js-yaml"));
class CodeGenerator {
    async generate(options) {
        const { spec, language, outputDir } = options;
        const specContent = fs.readFileSync(spec, 'utf8');
        const parsedSpec = this.parseSpec(spec, specContent);
        fs.mkdirSync(outputDir, { recursive: true });
        if (language === 'typescript') {
            await this.generateTypeScript(parsedSpec, outputDir);
        }
        else if (language === 'python') {
            await this.generatePython(parsedSpec, outputDir);
        }
        else {
            throw new Error(`Unsupported language: ${language}`);
        }
    }
    parseSpec(filePath, content) {
        const ext = path.extname(filePath).toLowerCase();
        if (ext === '.json') {
            return JSON.parse(content);
        }
        else if (ext === '.yaml' || ext === '.yml') {
            return yaml.load(content);
        }
        else if (ext === '.graphql' || ext === '.gql') {
            return { type: 'graphql', schema: content };
        }
        throw new Error(`Unsupported spec format: ${ext}`);
    }
    async generateTypeScript(spec, outputDir) {
        const clientCode = this.generateTypeScriptClient(spec);
        fs.writeFileSync(path.join(outputDir, 'client.ts'), clientCode);
        fs.writeFileSync(path.join(outputDir, 'types.ts'), this.generateTypeScriptTypes(spec));
    }
    async generatePython(spec, outputDir) {
        const clientCode = this.generatePythonClient(spec);
        fs.writeFileSync(path.join(outputDir, 'client.py'), clientCode);
    }
    generateTypeScriptClient(_spec) {
        if (_spec.type === 'graphql') {
            return `
import { GraphQLClient } from 'graphql-request';

export class ApiClient {
  private client: GraphQLClient;

  constructor(endpoint: string, token?: string) {
    this.client = new GraphQLClient(endpoint, {
      headers: token ? { Authorization: \`Bearer \${token}\` } : {}
    });
  }

  async query<T>(query: string, variables?: any): Promise<T> {
    return this.client.request<T>(query, variables);
  }
}
      `.trim();
        }
        return `
import axios, { AxiosInstance } from 'axios';

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string, token?: string) {
    this.client = axios.create({
      baseURL,
      headers: token ? { Authorization: \`Bearer \${token}\` } : {}
    });
  }

  async get<T>(path: string): Promise<T> {
    const response = await this.client.get<T>(path);
    return response.data;
  }

  async post<T>(path: string, data: any): Promise<T> {
    const response = await this.client.post<T>(path, data);
    return response.data;
  }
}
    `.trim();
    }
    generateTypeScriptTypes(_spec) {
        return `
export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface ErrorResponse {
  message: string;
  code: string;
}
    `.trim();
    }
    generatePythonClient(_spec) {
        return `
import requests
from typing import Optional, Dict, Any

class ApiClient:
    def __init__(self, base_url: str, token: Optional[str] = None):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        if token:
            self.session.headers['Authorization'] = f'Bearer {token}'

    def get(self, path: str) -> Dict[str, Any]:
        response = self.session.get(f'{self.base_url}{path}')
        response.raise_for_status()
        return response.json()

    def post(self, path: str, data: Dict[str, Any]) -> Dict[str, Any]:
        response = self.session.post(f'{self.base_url}{path}', json=data)
        response.raise_for_status()
        return response.json()
    `.trim();
    }
}
exports.CodeGenerator = CodeGenerator;
//# sourceMappingURL=generator.js.map