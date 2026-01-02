import { ApiClient } from '../generated/client';
import { Pet } from '../generated/types';

async function main() {
  // Initialize the client
  const client = new ApiClient({
    baseUrl: 'https://petstore.swagger.io/v2',
    token: 'special-key'
  });

  try {
    console.log('🐶 Fetching pets...');
    
    // Example: Get pet by ID
    // Note: This assumes the generated client has this method based on the spec
    // In a real scenario, you'd generate the SDK first using:
    // gidevo-api-tool generate -s ../specs/petstore.yaml -l typescript -o ./generated
    
    // const pet = await client.getPetById(1);
    // console.log(`Found pet: ${pet.name}`);

    console.log('✅ Example finished successfully');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main();
