# GIDEVO API Tool Examples

This directory contains example projects and sample plugins to help you get started with the GIDEVO API Tool.

## 📁 Directory Structure

```
examples/
├── basic-typescript/     # Basic TypeScript SDK generation example
├── basic-python/         # Basic Python SDK generation example
├── sample-plugin/        # Example custom plugin
└── specs/               # Sample API specifications
```

## 🚀 Quick Start

### TypeScript Example

```bash
cd examples/basic-typescript
npm install
npm run generate
npm run build
```

### Python Example

```bash
cd examples/basic-python
pip install -r requirements.txt
python generate.py
```

### Sample Plugin

```bash
cd examples/sample-plugin
npm install
npm run build
# Copy to your project's plugins directory
```

## 📋 Sample Specifications

The `specs/` directory contains sample OpenAPI specifications you can use for testing:

- `petstore.yaml` - Classic Petstore API example
- `todo-api.yaml` - Simple Todo List API

## 🔗 Resources

- [Main Documentation](../docs/)
- [Plugin Development Guide](../docs/deepwiki/plugin-design.md)
- [CLI Usage Guide](../README.md)
