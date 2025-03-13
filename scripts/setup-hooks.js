#!/usr/bin/env node

/**
 * Script to set up Git hooks for the project
 * This script copies the pre-commit hook to the .git/hooks directory and makes it executable
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const gitRootPath = execSync('git rev-parse --show-toplevel').toString().trim();
const hooksDir = path.join(gitRootPath, '.git', 'hooks');
const preCommitSource = path.join(__dirname, 'pre-commit');
const preCommitDest = path.join(hooksDir, 'pre-commit');

// Ensure the hooks directory exists
if (!fs.existsSync(hooksDir)) {
  console.error('❌ Git hooks directory not found:', hooksDir);
  console.error('Make sure you are in a Git repository.');
  process.exit(1);
}

// Check if the pre-commit hook source exists
if (!fs.existsSync(preCommitSource)) {
  console.error('❌ Pre-commit hook source not found:', preCommitSource);
  process.exit(1);
}

try {
  // Copy the pre-commit hook
  fs.copyFileSync(preCommitSource, preCommitDest);
  console.log('✅ Pre-commit hook installed successfully.');

  // Make the hook executable
  try {
    // For Unix-like systems
    execSync(`chmod +x "${preCommitDest}"`);
    console.log('✅ Made pre-commit hook executable.');
  } catch (error) {
    // For Windows, executable permission is not required
    console.log('ℹ️ Note: On Windows, executable permission is not required.');
  }

  console.log('\n🎉 Git hooks setup complete!');
  console.log('\nThe pre-commit hook will now run before each commit to verify successful builds.');
  console.log('To bypass the hook in emergency situations, use:');
  console.log('  git commit --no-verify');
  console.log('or');
  console.log('  SKIP_BUILD_CHECK=1 git commit');
} catch (error) {
  console.error('❌ Failed to set up Git hooks:', error.message);
  process.exit(1);
}
