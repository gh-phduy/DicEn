import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { IPA_OVERRIDES, FORMS, EXTRA, REFERENCES } from './b1-extra.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const rows = name => fs.readFileSync(path.join(root, 'scripts/data', name), 'utf8')
  .split(/\r?\n/).map(line => line.trim()).filter(line => line && !line.startsWith('#'));
const write = (name, value) => fs.writeFileSync(path.join(root, name), JSON.stringify(value, null, 2) + '\n');
const groups = ['nouns', 'verbs', 'adjectives', 'adverbs'];
const patterns = [/\bn\./, /\bv\./, /\badj\./, /\badv\./];
const emptyFamily = () => Object.fromEntries(groups.map(group => [group, []]));
const members = value => value ? value.split(/;(?=[^;=]+?=)/).map(item => {
  const separator = item.indexOf('=');
  const term = item.slice(0, separator).trim();
  const vi = item.slice(separator + 1).trim();
  if (separator < 1 || !term || !vi) throw new Error(`Invalid family/form: ${item}`);
  return { term, vi };
}) : [];

export function buildB1() {
  const index = read('src/data/oxford-index.json').filter(word => word.levels.includes('B1'));
  const ids = new Set(index.map(word => word.id));
  const metadata = read('scripts/data/b1-metadata.json');
  const ipa = read('scripts/data/b1-pronunciations.json');
  const definitions = new Map();
  for (const row of rows('b1-definitions.txt')) {
    const [id, vi, ...extra] = row.split('|');
    if (!ids.has(id) || !vi || extra.length || definitions.has(id)) throw new Error(`Invalid B1 definition: ${row}`);
    definitions.set(id, vi);
  }
  const examples = new Map();
  for (const row of rows('b1-examples.txt')) {
    const [keys, en, vi, ...extra] = row.split('|');
    if (!en || !vi || extra.length) throw new Error(`Invalid B1 example: ${row}`);
    for (const id of keys.split(';')) {
      if (!ids.has(id)) throw new Error(`Unknown B1 example headword: ${id}`);
      const list = examples.get(id) ?? [];
      if (!list.some(example => example.en === en)) list.push({ en, vi });
      examples.set(id, list);
    }
  }
  const families = new Map();
  for (const row of rows('b1-families.txt')) {
    const [keys, ...columns] = row.split('|');
    if (columns.length !== 4) throw new Error(`Invalid B1 family: ${row}`);
    for (const id of keys.split(';')) {
      if (!ids.has(id)) throw new Error(`Unknown B1 family headword: ${id}`);
      const family = families.get(id) ?? emptyFamily();
      columns.forEach((column, i) => members(column).forEach(member => {
        if (!family[groups[i]].some(previous => previous.term === member.term)) family[groups[i]].push(member);
      }));
      families.set(id, family);
    }
  }
  const notes = new Map();
  for (const row of rows('b1-usage.txt')) {
    const [keys, note, ...extra] = row.split('|');
    if (!note || extra.length) throw new Error(`Invalid B1 note: ${row}`);
    for (const id of keys.split(';')) {
      if (!ids.has(id) || notes.has(id)) throw new Error(`Unknown or duplicate B1 usage headword: ${id}`);
      notes.set(id, note);
    }
  }
  for (const id of Object.keys(FORMS)) if (!ids.has(id)) throw new Error(`Unknown B1 grammar headword: ${id}`);
  const words = index.map(source => {
    const meta = metadata[source.id];
    const definition = definitions.get(source.id);
    const phonetic = IPA_OVERRIDES[source.id] ?? ipa[source.id];
    const entryExamples = examples.get(source.id);
    if (!meta || !definition || !phonetic || !entryExamples?.length) throw new Error(`Incomplete B1 entry: ${source.id}`);
    const family = families.get(source.id) ?? emptyFamily();
    patterns.forEach((pattern, i) => {
      if (pattern.test(meta.partOfSpeech) && !family[groups[i]].some(member => member.term === meta.term)) {
        family[groups[i]].unshift({ term: meta.term, vi: definition });
      }
    });
    const related = Object.values(family).flat().some(member => member.term !== meta.term);
    const forms = members(FORMS[source.id] ?? '');
    return {
      // Persist B1 senses separately, including IT vs it and water (verb) vs water (noun).
      id: `b1:${source.id}`, sourceId: source.id, term: meta.term, partOfSpeech: meta.partOfSpeech,
      level: 'B1', levels: ['B1'], definition, phonetic,
      meanings: definition.split(';').map(value => value.trim()), examples: entryExamples.slice(0, 2),
      wordFamily: family,
      familyNote: related ? 'Các dạng cùng họ thông dụng; một số dạng có thể thuộc trình độ cao hơn B1.' :
        patterns.some(pattern => pattern.test(meta.partOfSpeech)) ? 'Chưa chọn thêm dạng phái sinh cho nghĩa B1 này. Xem ví dụ và cách dùng để học từ trong ngữ cảnh.' :
          'Đây là từ chức năng. Xem cách dùng và các dạng ngữ pháp nếu có.',
      ...(forms.length ? { forms } : {}), ...(notes.has(source.id) ? { usageNote: notes.get(source.id) } : {}),
      comparisons: [], ...(REFERENCES[source.id] ? { references: REFERENCES[source.id] } : {}),
    };
  });
  const bySource = new Map(words.map(word => [word.sourceId, word]));
  const a1 = new Map(read('src/data/a1.json').map(word => [word.id, word]));
  for (const row of rows('b1-comparisons.txt')) {
    const [a, b, nuance, ...extra] = row.split('|');
    if (!a || !b || !nuance || extra.length || (!bySource.has(a) && !bySource.has(b))) throw new Error(`Invalid B1 comparison: ${row}`);
    for (const [from, to] of [[a, b], [b, a]]) {
      const word = bySource.get(from);
      if (!word) continue;
      const other = EXTRA[to] ?? bySource.get(to) ?? a1.get(to);
      if (!other?.examples?.length) throw new Error(`Missing B1 comparison content: ${to}`);
      if (word.comparisons.some(item => item.term === other.term)) throw new Error(`Duplicate B1 comparison: ${row}`);
      word.comparisons.push({ term: other.term, vi: other.definition, nuance, register: '', example: other.examples[0] });
    }
  }
  write('src/data/b1.json', words);
  const report = {
    level: 'B1', expected: ids.size, completed: words.length,
    withPronunciation: words.filter(word => word.phonetic).length,
    withExamples: words.filter(word => word.examples.length).length,
    withRelatedFamilyForms: words.filter(word => Object.values(word.wordFamily).flat().some(member => member.term !== word.term)).length,
    withGrammarForms: words.filter(word => word.forms?.length).length,
    withUsageNotes: words.filter(word => word.usageNote).length,
    withComparisons: words.filter(word => word.comparisons.length).length,
    sources: ['American_Oxford_3000.pdf', 'American_Oxford_5000.pdf'],
    sourceCounts: Object.fromEntries([...new Set(index.map(word => word.source))].map(name => [name, index.filter(word => word.source === name).length])),
    missing: [],
  };
  write('src/data/b1-report.json', report);
  console.log(`Prepared ${words.length} B1 entries with original Vietnamese glosses and bilingual examples.`);
  console.log(JSON.stringify(report));
  return words;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) buildB1();
