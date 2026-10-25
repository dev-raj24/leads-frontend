#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// Suspicious patterns that indicate obfuscation or backdoor injections
const SUSPICIOUS_PATTERNS = [
  /_0x[a-f0-9]{4,}/i,               // Obfuscated variable names like _0x499797
  /eval\s*\(/i,                     // Dynamic eval execution
  /new\s+Function\s*\(/i,           // Dynamic function construction from string
  /child_process.*spawn/i,          // Spawning detached child processes
  /eth_getBlockByNumber/i,         // Blockchain C2 lookup calls
  /global\s*\[\s*['"`]_V['"`]\s*\]/i,// Injection global variables
];

// Files critical for app startup to scan thoroughly
const CRITICAL_FILES = [
  'next.config.js',
  'package.json',
  'public/widget.js',
  'public/blog.js'
];

let failed = false;

console.log('🔒 [Security Check] Scanning codebase for unauthorized code patterns...');

for (const relativePath of CRITICAL_FILES) {
  const absolutePath = path.join(ROOT_DIR, relativePath);
  if (!fs.existsSync(absolutePath)) continue;

  const content = fs.readFileSync(absolutePath, 'utf8');

  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(content)) {
      console.error(`❌ SECURITY ALERT: Suspicious code pattern (${pattern}) detected in ${relativePath}!`);
      failed = true;
    }
  }
}

if (failed) {
  console.error('\n🚨 Security check failed! Malicious or obfuscated code detected. Build / Commit aborted.');
  process.exit(1);
} else {
  console.log('✅ [Security Check] All scanned configuration files are clean.');
  process.exit(0);
}

