import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TRIAL_NOTES, CHECKED_REFERENCES } from './trial-notes.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Keep the bilingual source inside DicEn; regeneration needs no other checkout.
const words = JSON.parse(fs.readFileSync(path.join(root, 'scripts/data/bilingual.json'), 'utf8'))
  .sort((a, b) => a.term.localeCompare(b.term));
fs.mkdirSync(path.join(root, 'src/data'), { recursive: true });
fs.writeFileSync(path.join(root, 'src/data/curated.json'), JSON.stringify(words, null, 2) + '\n');
const oxford = JSON.parse(fs.readFileSync(path.join(root, 'src/data/oxford-index.json'), 'utf8'));
const trial = Object.entries(TRIAL_NOTES).map(([id, notes]) => {
  const original = words.find(word => word.id === id);
  if (!original) throw new Error(`Missing word: ${id}`);
  const metadata = oxford.find(word => word.id === id);
  return { ...original, ...notes, meanings: [notes.definition],
    level: metadata?.level ?? original.level, levels: metadata?.levels ?? [original.level],
    references: CHECKED_REFERENCES[id] ?? [],
  };
}).sort((a, b) => a.term.localeCompare(b.term));
if (trial.length !== 50) throw new Error('The trial must contain exactly 50 words.');
fs.writeFileSync(path.join(root, 'src/data/trial.json'), JSON.stringify(trial, null, 2) + '\n');
console.log(`Imported ${words.length} bilingual entries from the local source data.`);
console.log(`Prepared ${trial.length} trial words with word families and sense comparisons.`);
