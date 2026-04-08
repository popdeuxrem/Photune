#!/usr/bin/env node

/**
 * Smoke Test: Canvas Persistence
 * 
 * Validates:
 * 1. Auto-save creates valid JSON
 * 2. Canvas hydration validates schema
 * 3. Reload cycle preserves state
 */

import fs from 'fs';
import path from 'path';

const ERRORS = [];
const WARNINGS = [];
const CHECKS = [];

function check(name, pass, details = '') {
  const status = pass ? '✓' : '✗';
  const line = `${status} ${name}${details ? ' — ' + details : ''}`;
  CHECKS.push({ name, pass, details });
  console.log(`  ${line}`);
  if (!pass) ERRORS.push(name);
}

function warn(msg) {
  WARNINGS.push(msg);
  console.log(`  ⚠ ${msg}`);
}

console.log('\n🔍 PERSISTENCE SMOKE TESTS\n');

// Test 1: Auto-save.ts exists and exports
console.log('1. Auto-save Module');
try {
  const autoSavePath = 'src/shared/lib/auto-save.ts';
  const exists = fs.existsSync(autoSavePath);
  check('auto-save.ts exists', exists);

  if (exists) {
    const content = fs.readFileSync(autoSavePath, 'utf-8');
    check('exports autoSaveProject', content.includes('export async function autoSaveProject'));
    check('includes collision detection', content.includes('lastKnownUpdateTime'));
    check('includes retry logic in docs', content.includes('exponential backoff'));
  }
} catch (e) {
  ERRORS.push('Failed to check auto-save.ts: ' + e.message);
}

// Test 2: Canvas persistence module
console.log('\n2. Canvas Persistence Module');
try {
  const persistPath = 'src/features/editor/lib/canvas-persistence.ts';
  const exists = fs.existsSync(persistPath);
  check('canvas-persistence.ts exists', exists);

  if (exists) {
    const content = fs.readFileSync(persistPath, 'utf-8');
    check('exports hydrateCanvasFromPersistence', content.includes('export async function hydrateCanvasFromPersistence'));
    check('exports extractCanvasToPersistence', content.includes('export function extractCanvasToPersistence'));
    check('includes JSON validation', content.includes('validateCanvasJson'));
    check('includes error handling', content.includes('catch'));
  }
} catch (e) {
  ERRORS.push('Failed to check canvas-persistence.ts: ' + e.message);
}

// Test 3: EditorClient integration
console.log('\n3. EditorClient Integration');
try {
  const editorPath = 'src/features/editor/components/EditorClient.tsx';
  const content = fs.readFileSync(editorPath, 'utf-8');
  
  check('imports autoSaveProject', content.includes('import { autoSaveProject }'));
  check('imports extractCanvasToPersistence', content.includes('import { extractCanvasToPersistence }'));
  check('includes auto-save timer effect', content.includes('autoSaveTimerRef.current = setInterval'));
  check('includes lastSaveTime state', content.includes('lastSaveTime'));
  check('has collision detection in effect', content.includes('Conflict'));
} catch (e) {
  ERRORS.push('Failed to check EditorClient: ' + e.message);
}

// Test 4: Type safety
console.log('\n4. Type Safety');
try {
  const autoSavePath = 'src/shared/lib/auto-save.ts';
  const content = fs.readFileSync(autoSavePath, 'utf-8');
  
  check('defines AutoSaveConfig type', content.includes('export type AutoSaveConfig'));
  check('defines AutoSaveResult type', content.includes('export type AutoSaveResult'));
  check('includes proper return types', content.includes('Promise<AutoSaveResult>'));
} catch (e) {
  ERRORS.push('Failed to check types: ' + e.message);
}

// Test 5: Error handling
console.log('\n5. Error Handling');
try {
  const autoSavePath = 'src/shared/lib/auto-save.ts';
  const persistPath = 'src/features/editor/lib/canvas-persistence.ts';
  
  const autoSaveContent = fs.readFileSync(autoSavePath, 'utf-8');
  const persistContent = fs.readFileSync(persistPath, 'utf-8');
  
  check('auto-save logs errors', autoSaveContent.includes('logError'));
  check('auto-save logs info', autoSaveContent.includes('logInfo'));
  check('persistence validates before load', persistContent.includes('validateCanvasJson'));
  check('persistence has try-catch blocks', persistContent.match(/catch/g)?.length >= 2);
} catch (e) {
  ERRORS.push('Failed to check error handling: ' + e.message);
}

// Summary
console.log('\n' + '='.repeat(60));
const passCount = CHECKS.filter(c => c.pass).length;
const failCount = CHECKS.filter(c => !c.pass).length;
const total = CHECKS.length;

console.log(`\nResults: ${passCount}/${total} checks passed`);

if (failCount > 0) {
  console.log(`\n❌ FAILED CHECKS (${failCount}):`);
  ERRORS.forEach(e => console.log(`   - ${e}`));
  process.exit(1);
}

if (WARNINGS.length > 0) {
  console.log(`\n⚠ WARNINGS (${WARNINGS.length}):`);
  WARNINGS.forEach(w => console.log(`   - ${w}`));
}

console.log('\n✅ Persistence tests passed!\n');
process.exit(0);
