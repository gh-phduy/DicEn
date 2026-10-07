import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { EXTRA, FORMS, IPA_OVERRIDES, COMPARISON_SENSES, REGISTERS } from './a1-extra.mjs';
import { A1_REFERENCES } from './a1-references.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const load = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const rows = name => fs.readFileSync(path.join(root, 'scripts/data', name), 'utf8')
  .split(/\r?\n/).map(line => line.trim()).filter(line => line && !line.startsWith('#'));
const write = (name, value) => fs.writeFileSync(path.join(root, name), JSON.stringify(value, null, 2) + '\n');
const members = value => value ? value.split(/;(?=[^;=]+?=)/).map(item => {
  const separator = item.indexOf('=');
  if (separator < 1 || !item.slice(separator + 1).trim()) throw new Error(`Invalid family/form: ${item}`);
  return { term: item.slice(0, separator).trim(), vi: item.slice(separator + 1).trim() };
}) : [];
const groups = ['nouns', 'verbs', 'adjectives', 'adverbs'];
const patterns = [/\bn\./, /\bv\./, /\badj\./, /\badv\./];

export function buildA1() {
  const index = load('src/data/oxford-index.json').filter(word => word.levels.includes('A1'));
  const ids = new Set(index.map(word => word.id));
  const metadata = load('scripts/data/a1-metadata.json');
  const pronunciations = load('scripts/data/a1-pronunciations.json');
  const definitions = new Map();
  for (const row of rows('a1-definitions.txt')) {
    const [id, definition, ...extra] = row.split('|');
    if (!ids.has(id) || !definition || extra.length || definitions.has(id)) throw new Error(`Invalid definition: ${row}`);
    definitions.set(id, definition);
  }
  const examples = new Map();
  for (const row of rows('a1-examples.txt')) {
    const [keys, en, vi, ...extra] = row.split('|');
    if (!en || !vi || extra.length) throw new Error(`Invalid example: ${row}`);
    for (const id of keys.split(';').filter(id => ids.has(id))) {
      const list = examples.get(id) ?? [];
      if (!list.some(example => example.en === en)) list.push({ en, vi });
      examples.set(id, list);
    }
  }
  const families = new Map();
  for (const row of rows('a1-families.txt')) {
    const [keys, ...columns] = row.split('|');
    if (columns.length !== 4) throw new Error(`Invalid family row: ${row}`);
    for (const id of keys.split(';')) {
      if (!ids.has(id)) throw new Error(`Unknown family headword: ${id}`);
      const family = families.get(id) ?? Object.fromEntries(groups.map(group => [group, []]));
      columns.forEach((column, i) => members(column).forEach(member => {
        if (!family[groups[i]].some(previous => previous.term === member.term)) family[groups[i]].push(member);
      }));
      families.set(id, family);
    }
  }
  const notes = new Map();
  for (const row of rows('a1-usage.txt')) {
    const [keys, note, ...extra] = row.split('|');
    if (!note || extra.length) throw new Error(`Invalid usage note: ${row}`);
    for (const id of keys.split(';')) {
      if (!ids.has(id)) throw new Error(`Unknown usage headword: ${id}`);
      const previous = notes.get(id);
      notes.set(id, previous ? `${previous}\n\n${note}` : note);
    }
  }
  const words = index.map(source => {
    const meta = metadata[source.id];
    const definition = definitions.get(source.id);
    const phonetic = IPA_OVERRIDES[source.id] ?? pronunciations[source.id];
    const entryExamples = examples.get(source.id);
    if (!meta || !definition || !phonetic || !entryExamples?.length) throw new Error(`Incomplete A1 entry: ${source.id}`);
    const family = families.get(source.id) ?? Object.fromEntries(groups.map(group => [group, []]));
    // Root categories follow the PDF's A1 parts of speech, never higher-level uses.
    patterns.forEach((pattern, i) => {
      if (pattern.test(meta.partOfSpeech) && !family[groups[i]].some(member => member.term === meta.term)) {
        family[groups[i]].unshift({ term: meta.term, vi: definition });
      }
    });
    const related = Object.values(family).flat().some(member => member.term !== meta.term);
    const forms = members(FORMS[source.id] ?? '');
    return { id: source.id, term: meta.term, partOfSpeech: meta.partOfSpeech,
      level: 'A1', levels: source.levels, definition, meanings: definition.split(';').map(value => value.trim()),
      phonetic, examples: entryExamples.slice(0, 2), wordFamily: family,
      familyNote: related ? 'Các dạng cùng họ thông dụng; một số dạng có thể thuộc trình độ cao hơn A1.' :
        patterns.some(pattern => pattern.test(meta.partOfSpeech)) ? 'Bộ này chưa chọn thêm dạng phái sinh thông dụng cho nghĩa đang học. Không thêm hậu tố để đoán một từ không có thật.' :
          'Đây là từ chức năng hoặc số. Học cách dùng và các dạng ngữ pháp nếu có, thay vì ép vào họ danh từ–động từ–tính từ–trạng từ.',
      ...(forms.length ? { forms } : {}), ...(notes.has(source.id) ? { usageNote: notes.get(source.id) } : {}),
      comparisons: [],
      ...(A1_REFERENCES[source.id] ? { references: A1_REFERENCES[source.id] } : {}),
    };
  });
  const byId = new Map(words.map(word => [word.id, word]));
  for (const row of rows('a1-comparisons.txt')) {
    const [a, b, nuance, ...extra] = row.split('|');
    if (!a || !b || !nuance || extra.length) throw new Error(`Invalid comparison: ${row}`);
    if (!byId.has(a) && !byId.has(b)) throw new Error(`Comparison has no A1 entry: ${row}`);
    for (const [from, to] of [[a, b], [b, a]]) {
      const word = byId.get(from);
      if (!word) continue;
      const other = COMPARISON_SENSES[`${from}|${to}`] ?? EXTRA[to] ?? byId.get(to);
      if (!other) throw new Error(`Missing comparison content: ${to}`);
      if (word.comparisons.some(item => item.term === (other.term ?? to))) continue;
      word.comparisons.push({ term: other.term ?? to, vi: other.definition,
        nuance, register: REGISTERS[to] ?? '', example: other.examples[0] });
    }
  }
  write('src/data/a1.json', words);
  const report = { level: 'A1', expected: ids.size, completed: words.length,
    withPronunciation: words.filter(word => word.phonetic).length,
    withExamples: words.filter(word => word.examples.length).length,
    withRelatedFamilyForms: words.filter(word => Object.values(word.wordFamily).flat().some(member => member.term !== word.term)).length,
    withGrammarForms: words.filter(word => word.forms?.length).length,
    withUsageNotes: words.filter(word => word.usageNote).length,
    withComparisons: words.filter(word => word.comparisons.length).length,
    source: 'American_Oxford_3000.pdf', missing: [],
  };
  write('src/data/a1-report.json', report);
  console.log(`Prepared all ${words.length} A1 entries with original Vietnamese glosses and bilingual examples.`);
  console.log(JSON.stringify(report));
  return words;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) buildA1();
