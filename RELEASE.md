# Release Process

1. Ensure main branch is green (build, lint, tests pass).
2. Update CHANGELOG.md (if present) or summarize changes in release notes.
3. Choose version bump:
   - Patch: `npm run release:patch`
   - Minor: `npm run release:minor`
   - Major: `npm run release:major`
4. Push tags: The release script already pushes tags.
5. Create GitHub Release from the new tag and paste notes.
6. Publish to npm (ensure you are logged in and have permission):

```
npm publish --access public
```

7. Announce internally & update documentation if needed.
