import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { GeneratorStrategy } from './GeneratorStrategy';
import { registerHandlebarsHelpers } from './handlebarsHelpers';

export class TypeScriptStrategy implements GeneratorStrategy {
  // Resolve templates directory relative to this file
  // In production (dist), this will be .../dist/templates/typescript
  // In development (src), this will be .../src/templates/typescript
  private templatesDir = path.join(__dirname, '../../templates/typescript');

  constructor() {
    // Register helpers once (idempotent)
    registerHandlebarsHelpers();
  }

  async generate(spec: any, outputDir: string): Promise<void> {
    const clientCode = await this.generateClient(spec);

    await fs.promises.writeFile(
      path.join(outputDir, 'client.ts'),
      clientCode
    );

    await fs.promises.writeFile(
      path.join(outputDir, 'types.ts'),
      await this.generateTypes(spec)
    );
  }

  private async generateClient(spec: any): Promise<string> {
    const templateName = spec.type === 'graphql' ? 'client-graphql.hbs' : 'client-rest.hbs';
    const templatePath = path.join(this.templatesDir, templateName);

    try {
      const templateContent = await fs.promises.readFile(templatePath, 'utf-8');
      const template = Handlebars.compile(templateContent);
      return template(spec);
    } catch (error) {
      throw new Error(`Failed to load template from ${templatePath}: ${error}`);
    }
  }

  private async generateTypes(spec: any): Promise<string> {
    const templatePath = path.join(this.templatesDir, 'types.hbs');

    try {
      const templateContent = await fs.promises.readFile(templatePath, 'utf-8');
      const template = Handlebars.compile(templateContent);
      return template(spec);
    } catch (error) {
      throw new Error(`Failed to load template from ${templatePath}: ${error}`);
    }
  }
}
