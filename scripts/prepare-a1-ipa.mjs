import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { IPA_OVERRIDES } from './a1-extra.mjs';
import { IPA_OVERRIDES as B1_IPA_OVERRIDES } from './b1-extra.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
if (!process.argv[2]) throw new Error('Provide the downloaded ipa-dict data/en_US.txt file as the argument.');
const dictionary = new Map(fs.readFileSync(process.argv[2], 'utf8').split(/\r?\n/).map(line => line.split('\t')));
const level = process.argv[3] ?? 'A1';
if (!['A1', 'B1'].includes(level)) throw new Error(`Unsupported pronunciation level: ${level}`);
const overrides = level === 'B1' ? B1_IPA_OVERRIDES : IPA_OVERRIDES;
const words = JSON.parse(fs.readFileSync(path.join(root, 'src/data/oxford-index.json'), 'utf8')).filter(word => word.levels.includes(level));
const result = Object.fromEntries(words.map(word => {
  const term = word.id.replace(/\s*\(.*?\)/g, '').replace(/(?<=[a-z])\d+/g, '');
  const phonetic = overrides[word.id] ?? dictionary.get(term);
  if (!phonetic) throw new Error(`Missing pronunciation: ${word.id}`);
  return [word.id, phonetic];
}));
fs.writeFileSync(path.join(root, `scripts/data/${level.toLowerCase()}-pronunciations.json`), JSON.stringify(result, null, 2) + '\n');
console.log(`Prepared a licensed IPA snapshot for ${words.length} ${level} entries.`);
