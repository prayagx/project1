#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.bright}${colors.cyan}Starting build process...${colors.reset}`);

// Function to execute shell commands and log output
function execCommand(command) {
  console.log(`\n> Executing: ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`\n❌ Command failed: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

try {
  // Clean up the build directory first
  console.log('\n🧹 Cleaning up previous build artifacts...');
  if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
    console.log('  Removed .next directory');
  }
  if (fs.existsSync('out')) {
    fs.rmSync('out', { recursive: true, force: true });
    console.log('  Removed out directory');
  }

  // Install dependencies
  console.log('\n📦 Installing dependencies...');
  execCommand('npm install');

  // Run the build
  console.log('\n🏗️ Building the project...');
  execCommand('npx next build');

  // Verify the output directory
  if (fs.existsSync('out')) {
    console.log('\n✅ Build completed successfully!');
    
    // Count files in the output directory
    const countFiles = (dir) => {
      let count = 0;
      const items = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const item of items) {
        const itemPath = path.join(dir, item.name);
        if (item.isDirectory()) {
          count += countFiles(itemPath);
        } else {
          count++;
        }
      }
      
      return count;
    };
    
    const fileCount = countFiles('out');
    console.log(`📊 Generated ${fileCount} files in the 'out' directory`);
  } else {
    console.error('\n❌ Build failed: Output directory was not created');
    process.exit(1);
  }
} catch (error) {
  console.error(`\n${colors.red}Build failed:${colors.reset}`, error);
  process.exit(1);
} 