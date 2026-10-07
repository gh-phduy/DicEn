import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { IPA_OVERRIDES } from './a1-extra.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
if (!process.argv[2]) throw new Error('Provide the downloaded ipa-dict data/en_US.txt file as the argument.');
const dictionary = new Map(fs.readFileSync(process.argv[2], 'utf8').split(/\r?\n/).map(line => line.split('\t')));
const a1 = JSON.parse(fs.readFileSync(path.join(root, 'src/data/oxford-index.json'), 'utf8')).filter(word => word.levels.includes('A1'));
const result = Object.fromEntries(a1.map(word => {
  const term = word.id.replace(/\s*\(.*?\)/g, '').replace(/(?<=[a-z])\d+/g, '');
  const phonetic = IPA_OVERRIDES[word.id] ?? dictionary.get(term);
  if (!phonetic) throw new Error(`Missing pronunciation: ${word.id}`);
  return [word.id, phonetic];
}));
fs.writeFileSync(path.join(root, 'scripts/data/a1-pronunciations.json'), JSON.stringify(result, null, 2) + '\n');
console.log(`Prepared a licensed IPA snapshot for ${a1.length} A1 entries.`);
