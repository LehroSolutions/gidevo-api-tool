/**
 * Sample Plugin: API Stats
 * 
 * This plugin analyzes an OpenAPI specification and displays
 * statistics about the API endpoints, operations, and schemas.
 * 
 * Usage: gidevo-api-tool plugin --run apiStats ./path/to/spec.yaml
 */

import * as fs from 'fs';
import * as path from 'path';

// Plugin interface (matches gidevo-api-tool's Plugin interface)
interface Plugin {
  name: string;
  initialize(options?: any): void;
  run(...args: any[]): Promise<boolean>;
}

/**
 * API Statistics Plugin
 * 
 * Analyzes OpenAPI specifications and provides useful statistics.
 */
export default class ApiStatsPlugin implements Plugin {
  name = 'apiStats';

  initialize(options?: any): void {
    // Plugin initialization
    console.log('API Stats Plugin initialized');
  }

  async run(...args: any[]): Promise<boolean> {
    const specPath = args[0];

    if (!specPath) {
      console.error('❌ Error: Please provide a path to an OpenAPI specification');
      console.log('Usage: gidevo-api-tool plugin --run apiStats ./path/to/spec.yaml');
      return false;
    }

    // Resolve the path
    const resolvedPath = path.resolve(process.cwd(), specPath);

    if (!fs.existsSync(resolvedPath)) {
      console.error(`❌ Error: File not found: ${resolvedPath}`);
      return false;
    }

    try {
      // Read and parse the spec
      const content = fs.readFileSync(resolvedPath, 'utf-8');
      const spec = this.parseSpec(content, resolvedPath);

      // Analyze and display stats
      this.displayStats(spec, resolvedPath);

      return true;
    } catch (error) {
      console.error(`❌ Error analyzing specification: ${(error as Error).message}`);
      return false;
    }
  }

  /**
   * Parse YAML or JSON specification
   */
  private parseSpec(content: string, filePath: string): any {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.json') {
      return JSON.parse(content);
    }

    // Simple YAML parsing (in production, use a proper YAML library)
    // For this example, we'll do basic parsing
    try {
      return JSON.parse(content);
    } catch {
      // If JSON parsing fails, try to extract basic info from YAML
      // This is a simplified example - use js-yaml in production
      const spec: any = {
        info: {},
        paths: {},
        components: { schemas: {} }
      };

      // Extract title
      const titleMatch = content.match(/title:\s*(.+)/);
      if (titleMatch) spec.info.title = titleMatch[1].trim();

      // Extract version
      const versionMatch = content.match(/version:\s*(.+)/);
      if (versionMatch) spec.info.version = versionMatch[1].trim();

      // Count paths (simplified)
      const pathMatches = content.match(/^\s{2}\/[^\s:]+:/gm);
      if (pathMatches) {
        pathMatches.forEach(p => {
          const pathName = p.trim().replace(':', '');
          spec.paths[pathName] = {};
        });
      }

      return spec;
    }
  }

  /**
   * Display statistics about the specification
   */
  private displayStats(spec: any, filePath: string): void {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                    📊 API Statistics                       ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // Basic info
    console.log('📋 Specification Info');
    console.log('───────────────────────────────────────');
    console.log(`   File:     ${path.basename(filePath)}`);
    console.log(`   Title:    ${spec.info?.title || 'N/A'}`);
    console.log(`   Version:  ${spec.info?.version || 'N/A'}`);
    console.log();

    // Count paths and operations
    const paths = Object.keys(spec.paths || {});
    const operations = this.countOperations(spec.paths || {});
    const schemas = Object.keys(spec.components?.schemas || {});

    console.log('📈 Counts');
    console.log('───────────────────────────────────────');
    console.log(`   Paths:      ${paths.length}`);
    console.log(`   Operations: ${operations.total}`);
    console.log(`   Schemas:    ${schemas.length}`);
    console.log();

    // Operation breakdown
    if (operations.total > 0) {
      console.log('🔧 Operations by Method');
      console.log('───────────────────────────────────────');
      const methods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];
      methods.forEach(method => {
        const count = operations.byMethod[method] || 0;
        if (count > 0) {
          const bar = '█'.repeat(Math.min(count, 20));
          console.log(`   ${method.toUpperCase().padEnd(7)} ${String(count).padStart(3)} ${bar}`);
        }
      });
      console.log();
    }

    // List paths
    if (paths.length > 0) {
      console.log('📍 Endpoints');
      console.log('───────────────────────────────────────');
      paths.slice(0, 10).forEach(p => {
        console.log(`   ${p}`);
      });
      if (paths.length > 10) {
        console.log(`   ... and ${paths.length - 10} more`);
      }
      console.log();
    }

    // Security schemes
    const securitySchemes = spec.components?.securitySchemes || {};
    const securityKeys = Object.keys(securitySchemes);
    if (securityKeys.length > 0) {
      console.log('🔐 Security Schemes');
      console.log('───────────────────────────────────────');
      securityKeys.forEach(key => {
        const scheme = securitySchemes[key];
        console.log(`   ${key}: ${scheme.type || 'unknown'}`);
      });
      console.log();
    }

    console.log('✅ Analysis complete!\n');
  }

  /**
   * Count operations by HTTP method
   */
  private countOperations(paths: any): { total: number; byMethod: Record<string, number> } {
    const methods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];
    const byMethod: Record<string, number> = {};
    let total = 0;

    Object.values(paths).forEach((pathItem: any) => {
      methods.forEach(method => {
        if (pathItem[method]) {
          byMethod[method] = (byMethod[method] || 0) + 1;
          total++;
        }
      });
    });

    return { total, byMethod };
  }
}
