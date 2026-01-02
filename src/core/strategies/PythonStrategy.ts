import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { GeneratorStrategy } from './GeneratorStrategy';
import { registerHandlebarsHelpers } from './handlebarsHelpers';

export class PythonStrategy implements GeneratorStrategy {
  private templatesDir = path.resolve(__dirname, '../../templates/python');

  constructor() {
    // Register helpers once (idempotent)
    registerHandlebarsHelpers();
  }

  async generate(spec: any, outputDir: string): Promise<void> {
    const clientCode = await this.generateClient(spec);
    const modelsCode = await this.generateModels(spec);

    await fs.promises.writeFile(
      path.join(outputDir, 'client.py'),
      clientCode
    );

    await fs.promises.writeFile(
      path.join(outputDir, 'models.py'),
      modelsCode
    );
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
