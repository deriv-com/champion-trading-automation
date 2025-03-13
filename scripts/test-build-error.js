#!/usr/bin/env node

/**
 * Script to test the pre-commit hook with a build error
 * This script temporarily introduces a TypeScript error to test that the pre-commit hook
 * correctly prevents commits when the build fails
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
const appTsxPath = path.join(gitRootPath, 'src', 'App.tsx');

// Check if App.tsx exists
if (!fs.existsSync(appTsxPath)) {
  console.error('❌ App.tsx not found:', appTsxPath);
  process.exit(1);
}

// Backup the original file
const originalContent = fs.readFileSync(appTsxPath, 'utf8');
// Store the original content in memory, no need for a backup file

console.log('🧪 Testing pre-commit hook with a build error...');
console.log('This will temporarily introduce a TypeScript error to test that the pre-commit hook');
console.log('correctly prevents commits when the build fails.');
console.log('');

try {
  // Introduce a TypeScript error
  const errorContent = originalContent + '\n\nconst invalidVariable: string = 123; // TypeScript error: Type number is not assignable to type string';
  fs.writeFileSync(appTsxPath, errorContent);

  console.log('✅ Introduced a TypeScript error in App.tsx');
  console.log('');
  console.log('Now run the pre-commit hook test:');
  console.log('npm run test:pre-commit');
  console.log('');
  console.log('The pre-commit hook should fail because of the TypeScript error.');
  console.log('');
  console.log('After testing, run this script again to restore the original file:');
  console.log('npm run test:build-error:restore');
  console.log('');
} catch (error) {
  // Restore the original file in case of an error
  fs.writeFileSync(appTsxPath, originalContent);
  console.error('❌ Failed to introduce a TypeScript error:', error.message);
  process.exit(1);
}

// Check if we should restore the original file
if (process.argv.includes('--restore')) {
  try {
    // Restore the original file by removing the TypeScript error
    const currentContent = fs.readFileSync(appTsxPath, 'utf8');
    const cleanedContent = currentContent.replace(/\n\nconst invalidVariable: string = 123; \/\/ TypeScript error: Type number is not assignable to type string/, '');
    fs.writeFileSync(appTsxPath, cleanedContent);
    console.log('✅ Restored the original App.tsx file');
  } catch (error) {
    console.error('❌ Failed to restore the original file:', error.message);
    process.exit(1);
  }
}