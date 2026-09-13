import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const files = [];
function walk(dir) { for (const entry of readdirSync(dir, { withFileTypes: true })) { const path = join(dir, entry.name); if (entry.isDirectory()) walk(path); else if (path.endsWith('.ts') && !path.includes('__tests__') && !path.endsWith('.spec.ts')) files.push(path); } }
walk(join(root, 'api/src')); walk(join(root, 'frontend/src'));
const persistence = /@InjectModel|\bModel<|\.getDb\(|\bdb\s*\[/;
const violations = files.filter(path => persistence.test(readFileSync(path, 'utf8')) && !path.includes('/repositories/') && !path.endsWith('/core/db/database.service.ts') && !path.endsWith('/schemas.ts'));
if (violations.length) { console.error(`Persistência fora de repositories:\n${violations.join('\n')}`); process.exit(1); }
