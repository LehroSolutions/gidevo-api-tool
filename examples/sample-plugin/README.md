# Sample Plugin

This is an example plugin for gidevo-api-tool that demonstrates how to create custom plugins.

## Overview

This sample plugin adds an `api-stats` command that analyzes OpenAPI specifications and displays statistics about the API.

## Installation

```bash
# Build the plugin
npm install
npm run build

# Copy to your project's plugins directory
cp dist/index.js /path/to/your/project/node_modules/gidevo-api-tool/dist/plugins/
```

## Usage

After installation, the plugin adds a new command:

```bash
gidevo-api-tool plugin --run apiStats ./path/to/spec.yaml
```

## Output

The plugin displays:
- Number of paths (endpoints)
- Number of operations (HTTP methods)
- Number of schemas (data models)
- Operation breakdown by HTTP method
- Security schemes used

## Creating Your Own Plugin

1. Create a new TypeScript file implementing the `Plugin` interface:

```typescript
import { Plugin } from 'gidevo-api-tool';

export default class MyPlugin implements Plugin {
  name = 'myPlugin';
  
  initialize(options?: any): void {
    // Setup code
  }
  
  async run(...args: any[]): Promise<boolean> {
    // Plugin logic
    return true;
  }
}
```

2. Build and copy to the plugins directory

3. Use with `gidevo-api-tool plugin --run myPlugin [args]`

## Plugin Interface

```typescript
interface Plugin {
  /** Unique name for the plugin */
  name: string;
  
  /** Called when plugin is loaded */
  initialize(options?: any): void;
  
  /** Main execution method */
  run(...args: any[]): Promise<boolean>;
}
```

## Tips

- Keep plugins focused on a single task
- Use the UI utilities from gidevo-api-tool for consistent output
- Add proper error handling
- Document your plugin's usage
