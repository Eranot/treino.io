/**
 * Gera src/icons.json com APENAS os ícones usados no código-fonte, pra registrar
 * offline via addCollection() — sem isso o iconify-icon busca cada ícone da API
 * deles em runtime (ícones somem em rede lenta/bloqueada).
 *
 * Rodar `yarn icons` sempre que adicionar/remover ícones no template.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { getIcons } from '@iconify/utils';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// varre src/ atrás de referências prefixo:nome
const iconPattern = /['"]([a-z0-9-]+):([a-z0-9-]+)['"]/g;
const found = new Map(); // prefixo -> Set de nomes

function scanDir(dir) {
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
            scanDir(full);
        } else if (/\.(vue|js)$/.test(entry) && entry !== 'icons.json') {
            const content = readFileSync(full, 'utf8');
            for (const match of content.matchAll(iconPattern)) {
                const [, prefix, name] = match;
                if (!found.has(prefix)) found.set(prefix, new Set());
                found.get(prefix).add(name);
            }
        }
    }
}

scanDir(join(root, 'src'));

const collections = [];
let total = 0;

for (const [prefix, names] of [...found.entries()].sort()) {
    let fullSet;
    try {
        fullSet = require(`@iconify-json/${prefix}/icons.json`);
    } catch {
        continue; // prefixo que não é um icon set (ex.: falso positivo do regex)
    }

    const subset = getIcons(fullSet, [...names]);
    if (!subset) continue;

    const missing = (subset.not_found || []).filter(Boolean);
    if (missing.length) {
        console.warn(`⚠ ícones não encontrados em ${prefix}:`, missing.join(', '));
    }
    delete subset.not_found;

    const count = Object.keys(subset.icons || {}).length;
    if (count > 0) {
        collections.push(subset);
        total += count;
        console.log(`✔ ${prefix}: ${count} ícone(s)`);
    }
}

writeFileSync(join(root, 'src', 'icons.json'), JSON.stringify(collections));
console.log(`\n${total} ícones gravados em src/icons.json`);
