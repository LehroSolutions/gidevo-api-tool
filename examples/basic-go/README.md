# Basic Go Example

This example demonstrates Go SDK generation from an OpenAPI specification.

## Generate

```bash
gidevo-api-tool generate -s ../specs/petstore.yaml -l go -o ./generated
```

## Output

The generated Go artifacts include:

- `generated/client.go`
- `generated/types.go`
