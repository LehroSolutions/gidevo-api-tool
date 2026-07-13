/**
 * Example usage of the generated Petstore API client
 * 
 * Run: npm run example
 */

// Note: Import the generated client after running 'npm run generate'
// import { ApiClient } from './generated/client';

async function main() {
  console.log('Petstore API Client Example');
  console.log('===========================\n');

  // Example configuration
  const config = {
    baseUrl: 'https://api.petstore.example.com/v1',
    headers: {
      'Authorization': 'Bearer your-api-token'
    }
  };

  console.log('Configuration:', JSON.stringify(config, null, 2));
  console.log('\n---\n');

  // Demonstrate what the generated client can do
  console.log('Available Operations:');
  console.log('  - GET  /pets         → listPets()');
  console.log('  - POST /pets         → createPet(data)');
  console.log('  - GET  /pets/{id}    → getPet(id)');
  console.log('  - PUT  /pets/{id}    → updatePet(id, data)');
  console.log('  - DELETE /pets/{id}  → deletePet(id)');
  console.log('  - GET  /store/inventory → getInventory()');
  console.log('  - POST /store/orders    → placeOrder(data)');

  console.log('\n---\n');

  // Example usage patterns
  console.log('Example Usage Patterns:');
  
  console.log(`
// Create client instance
const client = new ApiClient(config);

// List pets with pagination
const pets = await client.get('/pets', {
  params: { limit: 10, offset: 0, status: 'available' }
});

// Create a new pet
const newPet = await client.post('/pets', {
  body: {
    name: 'Buddy',
    species: 'dog',
    breed: 'Golden Retriever',
    age: 3,
    tags: ['friendly', 'trained']
  }
});

// Update pet status
await client.put('/pets/' + newPet.id, {
  body: { status: 'sold' }
});

// Place an order
const order = await client.post('/store/orders', {
  body: { petId: newPet.id, quantity: 1 }
});
`);

  console.log('To run this example with a real API:');
  console.log('1. Run: npm run generate');
  console.log('2. Uncomment the import statement');
  console.log('3. Update the baseUrl and token');
  console.log('4. Run: npm run example');
}

main().catch(console.error);
