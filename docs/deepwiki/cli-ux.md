# CLI UX & Accessibility

Focus on clear feedback, accessibility, and CI friendliness.  

## Global Flags

- `--no-spinner`: Disable spinners (for CI or screen readers).
- `--no-color`: Disable ANSI color output.

## Spinners & Feedback

- Visual spinner via `ora` shows progress for `init` and `generate` commands.
- Spinner wrapper (`createSpinner`) ensures fallback to no-op in non-TTY or CI.
- Success/failure uses clear Unicode icons (✅, ❌).

## Color Usage

- Positive feedback: Green.
- Warnings: Yellow.
- Errors: Red.

## Accessibility Considerations

- Support disabling all dynamic output.
- Ensure text alternatives via `console.log` messages.

See example usage in [Architecture Overview](architecture.md).