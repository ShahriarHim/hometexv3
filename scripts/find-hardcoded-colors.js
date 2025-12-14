#!/usr/bin/env node

/**
 * Color Migration Helper Script
 *
 * This script helps you find and migrate remaining hardcoded colors
 * to the new dynamic color system.
 *
 * USAGE:
 * node scripts/find-hardcoded-colors.js
 *
 * Or in PowerShell:
 * node .\scripts\find-hardcoded-colors.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const searchDirs = ['src/components', 'src/views', 'src/app'];

// Patterns to find hardcoded colors
const patterns = [
  /bg-\[#[0-9a-fA-F]+\]/g,          // bg-[#hex]
  /text-\[#[0-9a-fA-F]+\]/g,        // text-[#hex]
  /border-\[#[0-9a-fA-F]+\]/g,      // border-[#hex]
  /bg-\[rgba?\([^\]]+\)\]/g,        // bg-[rgba()]
  /text-\[rgba?\([^\]]+\)\]/g,      // text-[rgba()]
  /#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g, // Direct hex in strings
];

// Color migration suggestions
const suggestions = {
  '#2d8659': 'accent (emerald green)',
  '#93D991': 'accent-light',
  '#fb6c08': 'accent-secondary (orange)',
  '#E8FE00': 'primary',
  '#e8fe00': 'primary',
  '#C5CEE8': 'secondary-light',
  '#c5cee8': 'secondary-light',
  '#d4ed30': 'primary',
  '#00ffff': 'Consider using info or accent',
  '#f53c78': 'Consider using error or accent-secondary',
  '#f3f30a': 'primary-light',
  '#333333': 'text-primary or secondary',
  '#ababab': 'text-tertiary',
  '#f5f5f5': 'surface or surface-dark',
};

function searchFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const matches = [];

  patterns.forEach(pattern => {
    const found = content.match(pattern);
    if (found) {
      matches.push(...found);
    }
  });

  return [...new Set(matches)]; // Remove duplicates
}

function walkDirectory(dir, results = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDirectory(filePath, results);
    } else if (file.match(/\.(tsx|ts|jsx|js|css)$/)) {
      const matches = searchFile(filePath);
      if (matches.length > 0) {
        results.push({ file: filePath, matches });
      }
    }
  });

  return results;
}

console.log('🔍 Searching for hardcoded colors...\n');

let totalFiles = 0;
let totalMatches = 0;

searchDirs.forEach(dir => {
  const fullPath = path.join(path.dirname(__dirname), dir);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Directory not found: ${dir}`);
    return;
  }

  const results = walkDirectory(fullPath);

  if (results.length > 0) {
    console.log(`\n📁 ${dir}/`);
    console.log('─'.repeat(80));

    results.forEach(({ file, matches }) => {
      totalFiles++;
      totalMatches += matches.length;

      const relativePath = path.relative(path.dirname(__dirname), file);
      console.log(`\n📄 ${relativePath}`);

      matches.forEach(match => {
        console.log(`   ${match}`);

        // Check for suggestions
        const colorCode = match.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/)?.[0];
        if (colorCode && suggestions[colorCode.toLowerCase()]) {
          console.log(`   → Suggestion: ${suggestions[colorCode.toLowerCase()]}`);
        }
      });
    });
  }
});

console.log(`\n\n${'═'.repeat(80)}`);
console.log(`\n📊 Summary:`);
console.log(`   Files with hardcoded colors: ${totalFiles}`);
console.log(`   Total hardcoded color instances: ${totalMatches}`);

if (totalMatches > 0) {
  console.log('\n💡 Migration Guide:');
  console.log('   1. Replace bg-[#hex] with bg-primary, bg-accent, etc.');
  console.log('   2. Replace text-[#hex] with text-primary, text-accent, etc.');
  console.log('   3. Use semantic names: text-price, bg-success, etc.');
  console.log('   4. Refer to COLOR_SYSTEM_GUIDE.md for complete mapping');
  console.log('\n   Common replacements:');
  Object.entries(suggestions).forEach(([color, suggestion]) => {
    console.log(`   ${color} → ${suggestion}`);
  });
} else {
  console.log('\n✅ No hardcoded colors found! Great job!');
}

console.log(`\n${'═'.repeat(80)}\n`);
