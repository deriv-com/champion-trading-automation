# Git Hooks Documentation

This document provides detailed information about the Git hooks used in this project.

## Pre-commit Hook

The pre-commit hook is designed to ensure code quality by verifying syntax and successful builds before allowing commits. This helps prevent broken code from being committed to the repository.

### How It Works

1. When you run `git commit`, the pre-commit hook is automatically triggered
2. The hook runs `npm run lint` to check for syntax errors
3. If the lint check passes, the hook runs `npm run build` to verify that the code builds successfully
4. If both checks succeed, the commit proceeds normally
5. If either check fails, the commit is aborted with an error message

### Features

- **Syntax Verification**: Automatically runs `npm run lint` to check for syntax errors
- **Build Verification**: Automatically runs `npm run build` to verify successful builds
- **Error Handling**: Prevents commits if syntax or build checks fail and displays helpful error messages
- **Cross-Platform Compatibility**: Works on Windows, macOS, and Linux
- **Automatic Installation**: Installed when you run `npm run setup-hooks`

### Bypass Options

In emergency situations, you may need to bypass the pre-commit hook. There are two ways to do this:

1. Using the `--no-verify` flag:
   ```bash
   git commit --no-verify
   ```

2. Using the `SKIP_BUILD_CHECK` environment variable:
   ```bash
   # On Unix-like systems (macOS, Linux)
   SKIP_BUILD_CHECK=1 git commit

   # On Windows (Command Prompt)
   set SKIP_BUILD_CHECK=1 && git commit

   # On Windows (PowerShell)
   $env:SKIP_BUILD_CHECK=1; git commit
   ```

### Testing the Hook

You can test the pre-commit hook without making a commit by running:

```bash
npm run test:pre-commit
```

This will simulate what happens when you try to commit changes and verify that the pre-commit hook is working correctly.

#### Testing with Build Errors

To test how the pre-commit hook handles build errors:

1. Introduce a temporary TypeScript error:
   ```bash
   npm run test:build-error
   ```

2. Run the pre-commit hook test:
   ```bash
   npm run test:pre-commit
   ```
   The hook should fail because of the TypeScript error.

3. Restore the original file:
   ```bash
   npm run test:build-error:restore
   ```

### Troubleshooting

#### Hook Not Running

If the pre-commit hook is not running when you commit, check the following:

1. Make sure the hook is installed:
   ```bash
   ls -la .git/hooks/pre-commit
   ```

2. Make sure the hook is executable:
   ```bash
   chmod +x .git/hooks/pre-commit
   ```

3. Reinstall the hook:
   ```bash
   npm run setup-hooks
   ```

#### Build Errors

If the pre-commit hook is failing due to build errors:

1. Run `npm run build` manually to see the detailed error messages
2. Fix the build errors
3. Try committing again

#### Other Issues

If you encounter other issues with the pre-commit hook:

1. Check the Git hook logs (if available)
2. Try running the hook manually:
   ```bash
   .git/hooks/pre-commit
   ```
3. If the issue persists, report it to the project maintainers

## Other Git Hooks

Currently, this project only uses the pre-commit hook. Additional hooks may be added in the future as needed.

## Adding New Hooks

To add a new Git hook:

1. Create a new hook script in the `.git/hooks` directory
2. Make it executable with `chmod +x .git/hooks/hook-name`
3. Update the `scripts/setup-hooks.js` script to include the new hook
4. Update this documentation to describe the new hook

## References

- [Git Hooks Documentation](https://git-scm.com/docs/githooks)
- [Customizing Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
