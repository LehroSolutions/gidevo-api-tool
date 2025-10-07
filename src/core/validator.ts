// SPDX-License-Identifier: Apache-2.0 OR LicenseRef-LEHRO-Solutions-Commercial
// Copyright (c) 2025 LEHRO Solutions
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class Validator {
  async validate(specPath: string): Promise<ValidationResult> {
    const errors: string[] = [];
    
    try {
      const content = fs.readFileSync(specPath, 'utf8');
      const ext = path.extname(specPath).toLowerCase();
      
      let parsed;
      if (ext === '.json') {
        parsed = JSON.parse(content);
      } else if (ext === '.yaml' || ext === '.yml') {
        // Load YAML and enforce presence of openapi field
        try {
          parsed = yaml.load(content);
        } catch (e) {
          throw new Error(`Failed to parse spec: ${e}`);
        }
        if (parsed === null || typeof parsed !== 'object' || !('openapi' in parsed)) {
          throw new Error('Failed to parse spec: Invalid or missing openapi field');
        }
      } else if (ext === '.graphql' || ext === '.gql') {
        return { valid: true, errors: [] }; // Basic validation for now
      } else {
        errors.push(`Unsupported file format: ${ext}`);
        return { valid: false, errors };
      }

      // Basic OpenAPI validation
      if (parsed.openapi) {
        if (!parsed.info || !parsed.info.title) {
          errors.push('Missing required field: info.title');
        }
        if (!parsed.info || !parsed.info.version) {
          errors.push('Missing required field: info.version');
        }
        if (!parsed.paths || Object.keys(parsed.paths).length === 0) {
          errors.push('No paths defined');
        }
      }
      
      return { valid: errors.length === 0, errors };
    } catch (error) {
      errors.push(`Failed to parse spec: ${error}`);
      return { valid: false, errors };
    }
  }
}
