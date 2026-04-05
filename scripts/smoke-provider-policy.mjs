import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const srcRoot = path.join(repoRoot, 'src');

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') {
      continue;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath, files);
      continue;
    }

    if (
      entry.isFile() &&
      (fullPath.endsWith('.ts') ||
        fullPath.endsWith('.tsx') ||
        fullPath.endsWith('.js') ||
        fullPath.endsWith('.jsx') ||
        fullPath.endsWith('.mjs'))
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function normalize(file) {
  return file.replace(repoRoot + path.sep, '').split(path.sep).join('/');
}

const deferredProviders = [
  {
    name: 'paystack',
    patterns: ['paystack', 'PAYSTACK_'],
    allowedSubpaths: [
      'src/app/api/payments/paystack/',
      'src/shared/lib/paystack',
    ],
  },
  {
    name: 'nowpayments',
    patterns: ['nowpayments', 'NOWPAYMENTS_'],
    allowedSubpaths: [
      'src/app/api/payments/crypto/',
      'src/shared/lib/nowpayments',
    ],
  },
  {
    name: 'resend',
    patterns: ['resend', 'RESEND_'],
    allowedSubpaths: [],
  },
];

const files = walk(srcRoot);
const violations = [];

for (const file of files) {
  const rel = normalize(file);
  const contentLower = read(file).toLowerCase();

  for (const provider of deferredProviders) {
    const matched = provider.patterns.some((pattern) => contentLower.includes(pattern.toLowerCase()));
    if (!matched) continue;

    const allowed = provider.allowedSubpaths.some((prefix) => rel.startsWith(prefix));
    if (!allowed) {
      violations.push({
        provider: provider.name,
        file: rel,
      });
    }
  }
}

if (violations.length > 0) {
  console.error('provider-policy-smoke-failed');
  for (const v of violations) {
    console.error(`deferred provider "${v.provider}" found in disallowed file: ${v.file}`);
  }
  process.exit(1);
}

console.log('smoke-provider-policy-ok');
