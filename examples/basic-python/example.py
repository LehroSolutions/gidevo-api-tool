#!/usr/bin/env python3
"""
Example usage of the generated Petstore API client

Run: python example.py
"""

# Note: Import the generated client after running generation
# from generated.client import ApiClient


def main():
    print("Petstore API Client Example (Python)")
    print("=" * 40)
    print()

    # Example configuration
    config = {
        "base_url": "https://api.petstore.example.com/v1",
        "headers": {
            "Authorization": "Bearer your-api-token"
        }
    }

    print("Configuration:")
    for key, value in config.items():
        print(f"  {key}: {value}")
    print()
    print("-" * 40)
    print()

    # Demonstrate what the generated client can do
    print("Available Operations:")
    print("  - GET  /pets         → client.get('/pets')")
    print("  - POST /pets         → client.post('/pets', json=data)")
    print("  - GET  /pets/{id}    → client.get(f'/pets/{id}')")
    print("  - PUT  /pets/{id}    → client.put(f'/pets/{id}', json=data)")
    print("  - DELETE /pets/{id}  → client.delete(f'/pets/{id}')")
    print("  - GET  /store/inventory → client.get('/store/inventory')")
    print("  - POST /store/orders    → client.post('/store/orders', json=data)")
    print()
    print("-" * 40)
    print()

    # Example usage patterns
    print("Example Usage Patterns:")
    print('''
# Create client instance
client = ApiClient(
    base_url=config["base_url"],
    headers=config["headers"]
)

# List pets with pagination
pets = client.get('/pets', params={
    'limit': 10,
    'offset': 0,
    'status': 'available'
})

# Create a new pet
new_pet = client.post('/pets', json={
    'name': 'Buddy',
    'species': 'dog',
    'breed': 'Golden Retriever',
    'age': 3,
    'tags': ['friendly', 'trained']
})

# Update pet status
client.put(f'/pets/{new_pet["id"]}', json={
    'status': 'sold'
})

# Place an order
order = client.post('/store/orders', json={
    'petId': new_pet['id'],
    'quantity': 1
})
''')

    print("To run this example with a real API:")
    print("1. Run: gidevo-api-tool generate -s ../specs/petstore.yaml -l python -o ./generated")
    print("2. Uncomment the import statement")
    print("3. Update the base_url and token")
    print("4. Run: python example.py")


if __name__ == "__main__":
    main()
