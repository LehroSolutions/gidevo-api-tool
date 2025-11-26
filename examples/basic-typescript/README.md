# Basic TypeScript Example

This example demonstrates how to generate and use a TypeScript SDK from an OpenAPI specification.

## Prerequisites

- Node.js 18+
- npm
- gidevo-api-tool installed globally (`npm install -g gidevo-api-tool`)

## Setup

```bash
# Install dependencies
npm install

# Generate the SDK from the Petstore spec
npm run generate

# Build the TypeScript code
npm run build
```

## Usage

After generating the SDK, you can use it in your TypeScript code:

```typescript
import { ApiClient } from './generated/client';

const client = new ApiClient({
  baseUrl: 'https://api.petstore.example.com/v1',
  headers: {
    'Authorization': 'Bearer your-token-here'
  }
});

// List all pets
const pets = await client.get('/pets');
console.log(pets);

// Create a new pet
const newPet = await client.post('/pets', {
  name: 'Fluffy',
  species: 'cat',
  age: 2
});
console.log('Created pet:', newPet);
```

## Files Generated

After running `npm run generate`, you'll find:

- `src/generated/client.ts` - The API client
- `src/generated/types.ts` - TypeScript type definitions

## Running the Example

```bash
npm run example
```

This will run a demo script showing how to use the generated client.
