import fs from 'node:fs';
import path from 'node:path';

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function assertContains(file, needle, label) {
  const content = read(file);
  if (!content.includes(needle)) {
    throw new Error(`Smoke failure: missing "${label}" in ${file}`);
  }
}

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
        fullPath.endsWith('.jsx'))
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

function assertAnySourceFileContains(rootDir, needles, label) {
  const files = walk(rootDir);
  const found = files.some((file) => {
    const content = read(file);
    return needles.some((needle) => content.includes(needle));
  });

  if (!found) {
    throw new Error(`Smoke failure: missing "${label}" anywhere under ${rootDir}`);
  }
}

const repoRoot = process.cwd();

const migrationDir = path.join(repoRoot, 'supabase', 'migrations');
const schemaFile = path.join(repoRoot, 'supabase', 'schema.sql');
const editorPage = path.join(repoRoot, 'src', 'app', '(main)', 'editor', '[projectId]', 'page.tsx');
const srcRoot = path.join(repoRoot, 'src');

if (!fs.existsSync(migrationDir)) {
  throw new Error('Smoke failure: supabase/migrations directory is missing');
}

const migrationFiles = fs.readdirSync(migrationDir).filter((name) => name.endsWith('.sql'));
if (migrationFiles.length === 0) {
  throw new Error('Smoke failure: no SQL migration files found in supabase/migrations');
}

const hasProjectsMigration = migrationFiles.some((name) => {
  const content = read(path.join(migrationDir, name));
  return content.includes('CREATE TABLE IF NOT EXISTS projects');
});

if (!hasProjectsMigration) {
  throw new Error('Smoke failure: no migration creates the projects table');
}

assertContains(schemaFile, 'CREATE TABLE IF NOT EXISTS projects', 'projects table in checked-in schema');
assertContains(editorPage, ".from('projects')", 'editor projects query');
assertContains(editorPage, ".eq('user_id', user.id)", 'owner-scoped project lookup');

assertAnySourceFileContains(
  srcRoot,
  [".from('projects')", '.from("projects")'],
  'projects query in application source'
);

console.log('smoke-projects-ok');
