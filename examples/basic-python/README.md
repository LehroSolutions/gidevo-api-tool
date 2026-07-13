# Basic Python Example

This example demonstrates how to generate and use a Python SDK from an OpenAPI specification.

## Prerequisites

- Python 3.8+
- pip
- gidevo-api-tool installed globally (`npm install -g gidevo-api-tool`)

## Setup

```bash
# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Generate the SDK from the Petstore spec
gidevo-api-tool generate -s ../specs/petstore.yaml -l python -o ./generated
```

## Usage

After generating the SDK, you can use it in your Python code:

```python
from generated.client import ApiClient

# Create client instance
client = ApiClient(
    base_url='https://api.petstore.example.com/v1',
    headers={'Authorization': 'Bearer your-token-here'}
)

# List all pets
pets = client.get('/pets')
print(pets)

# Create a new pet
new_pet = client.post('/pets', json={
    'name': 'Fluffy',
    'species': 'cat',
    'age': 2
})
print(f'Created pet: {new_pet}')
```

## Files Generated

After generating, you'll find:

- `generated/client.py` - The API client

## Running the Example

```bash
python example.py
```

This will run a demo script showing how to use the generated client.
