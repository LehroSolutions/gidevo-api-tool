import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';
import { GeneratorStrategy } from './GeneratorStrategy.js';
import { registerHandlebarsHelpers } from './handlebarsHelpers.js';
import { safeWriteGeneratedFile } from '../pathSafety.js';
import { dirnameFromMetaUrl } from '../runtime.js';

const currentDir = dirnameFromMetaUrl(import.meta.url);

export class PythonStrategy implements GeneratorStrategy {
  private templatesDir = path.resolve(currentDir, '../../templates/python');

  constructor() {
    // Register helpers once (idempotent)
    registerHandlebarsHelpers();
  }

  async generate(spec: any, outputDir: string): Promise<void> {
    const clientCode = await this.generateClient(spec);
    const modelsCode = await this.generateModels(spec);

    await safeWriteGeneratedFile(outputDir, 'client.py', clientCode);
    await safeWriteGeneratedFile(outputDir, 'models.py', modelsCode);
  }

  private async generateClient(spec: any): Promise<string> {
    const templatePath = path.join(this.templatesDir, 'client.hbs');

    try {
      const templateContent = await fs.promises.readFile(templatePath, 'utf-8');
      const template = Handlebars.compile(templateContent);
      return template(spec);
    } catch (error) {
      throw new Error(`Failed to load template from ${templatePath}: ${error}`);
    }
  }

  private async generateModels(spec: any): Promise<string> {
    const templatePath = path.join(this.templatesDir, 'models.hbs');

    try {
      const templateContent = await fs.promises.readFile(templatePath, 'utf-8');
      const template = Handlebars.compile(templateContent);
      return template(spec);
    } catch (error) {
      throw new Error(`Failed to load template from ${templatePath}: ${error}`);
    }
  }
}
