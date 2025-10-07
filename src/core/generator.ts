// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

interface GenerateOptions {
  spec: string;
  language: string;
  outputDir: string;
}

export class CodeGenerator {
  async generate(options: GenerateOptions): Promise<void> {
    const { spec, language, outputDir } = options;
    
    const specContent = fs.readFileSync(spec, 'utf8');
    const parsedSpec = this.parseSpec(spec, specContent);
    
    fs.mkdirSync(outputDir, { recursive: true });
    
    if (language === 'typescript') {
      await this.generateTypeScript(parsedSpec, outputDir);
    } else if (language === 'python') {
      await this.generatePython(parsedSpec, outputDir);
    } else {
      throw new Error(`Unsupported language: ${language}`);
    }
  }

  private parseSpec(filePath: string, content: string): any {
    const ext = path.extname(filePath).toLowerCase();
    
    if (ext === '.json') {
      return JSON.parse(content);
    } else if (ext === '.yaml' || ext === '.yml') {
      return yaml.load(content);
    } else if (ext === '.graphql' || ext === '.gql') {
      return { type: 'graphql', schema: content };
    }
    
    throw new Error(`Unsupported spec format: ${ext}`);
  }

  private async generateTypeScript(spec: any, outputDir: string): Promise<void> {
    const clientCode = this.generateTypeScriptClient(spec);
    
    fs.writeFileSync(
      path.join(outputDir, 'client.ts'),
      clientCode
    );
    
    fs.writeFileSync(
      path.join(outputDir, 'types.ts'),
      this.generateTypeScriptTypes(spec)
    );
  }

  private async generatePython(spec: any, outputDir: string): Promise<void> {
    const clientCode = this.generatePythonClient(spec);
    
    fs.writeFileSync(
      path.join(outputDir, 'client.py'),
      clientCode
    );
  }

  private generateTypeScriptClient(_spec: any): string {
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

  private generateTypeScriptTypes(_spec: any): string {
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

  private generatePythonClient(_spec: any): string {
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
