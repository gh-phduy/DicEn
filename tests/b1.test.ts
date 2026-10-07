import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildLearningWords, searchWords, type Word } from '../src/lib/study.ts';

const read = (name: string) => JSON.parse(readFileSync(new URL(`../${name}`, import.meta.url), 'utf8'));
const words: Word[] = read('src/data/b1.json');
const a1: Word[] = read('src/data/a1.json');
const trial: Word[] = read('src/data/trial.json');
const index: Word[] = read('src/data/oxford-index.json');
const metadata = read('scripts/data/b1-metadata.json');
const get = (sourceId: string) => words.find(word => word.sourceId === sourceId)!;
const catalog = buildLearningWords(trial, [a1, words]);

test('B1 covers all 810 source entries, including specialize from the supplemental PDF', () => {
  const expected = index.filter(word => word.levels?.includes('B1')).map(word => word.id).sort();
  assert.equal(expected.length, 810);
  assert.deepEqual(words.map(word => word.sourceId).sort(), expected);
  assert.equal(new Set(words.map(word => word.id)).size, 810);
  assert.ok(get('specialize').definition?.includes('chuyên'));
  for (const word of words) {
    assert.equal(word.level, 'B1');
    assert.equal(word.partOfSpeech, metadata[word.sourceId!].partOfSpeech, word.id);
    assert.ok(word.definition && word.phonetic && word.familyNote, word.id);
    assert.ok(word.examples?.length && word.examples.every(example => example.en && example.vi), word.id);
    assert.ok(!JSON.stringify(word).match(/TODO|placeholder|undefined|\u00ad|b breathing/), word.id);
  }
});
test('B1 verb and noun senses follow their level instead of inheriting A1 or B2 translations', () => {
  assert.equal(get('water').partOfSpeech, 'v.');
  assert.ok(get('water').definition?.startsWith('tưới'));
  assert.equal(get('age').partOfSpeech, 'v.');
  assert.equal(get('type').definition, 'gõ, đánh máy');
  assert.equal(get('principal').partOfSpeech, 'n.');
  assert.equal(get('principal').definition, 'hiệu trưởng');
  assert.equal(get('raise').definition, 'khoản tăng lương (tiếng Anh Mỹ)');
  assert.equal(get('cream').definition, 'màu kem');
  assert.equal(get('market').partOfSpeech, 'v.');
});
test('B1 homographs have the intended casing, pronunciation and word family', () => {
  assert.equal(get('it').term, 'IT');
  assert.equal(get('it').phonetic, '/ˌaɪ ˈtiː/');
  assert.equal(get('live2').phonetic, '/laɪv/');
  assert.equal(get('lead1').phonetic, '/liːd/');
  assert.equal(get('close2').phonetic, '/kloʊs/');
  assert.equal(get('content1').phonetic, '/ˈkɑntɛnt/');
  assert.equal(get('used1').phonetic, '/juːzd/');
  assert.equal(get('used2').phonetic, '/juːst/');
  assert.equal(get('separate').phonetic, '/ˈsɛpəreɪt/');
  assert.ok(!Object.values(get('bank (river)').wordFamily!).flat().some(member => member.term === 'banker'));
  assert.ok(!Object.values(get('spring').wordFamily!).flat().some(member => member.term === 'springtime'));
  assert.ok(!Object.values(get('management').wordFamily!).flat().some(member => member.term === 'market'));
  assert.ok(get('kind (caring)').wordFamily!.nouns.some(member => member.term === 'kindness'));
});
test('level filters retain 899 A1 and 810 B1 meanings without duplicate IDs or lower-level leakage', () => {
  assert.equal(new Set(catalog.map(word => word.id)).size, catalog.length);
  assert.equal(searchWords(catalog, '', 'A1').length, 899);
  assert.equal(searchWords(catalog, '', 'B1').length, 810);
  assert.equal(searchWords(catalog, 'water', 'A1')[0]?.definition, 'nước');
  assert.equal(searchWords(catalog, 'water', 'B1')[0]?.id, 'b1:water');
  assert.equal(searchWords(catalog, 'IT', 'B1')[0]?.definition, 'công nghệ thông tin (IT)');
  assert.equal(searchWords(catalog, 'IT', 'A1')[0]?.id, 'it');
  // IDs for each sense survive a save/reload independently; legacy A1 IDs stay intact.
  const savedIds = JSON.parse(JSON.stringify(['water', 'b1:water', 'it', 'b1:it']));
  const byId = new Map(catalog.map(word => [word.id, word]));
  assert.deepEqual(savedIds.map((id: string) => byId.get(id)?.level), ['A1', 'B1', 'A1', 'B1']);
});
test('B1 search finds irregular forms and Vietnamese without accents', () => {
  assert.equal(searchWords(catalog, 'bitten', 'B1')[0]?.id, 'b1:bite');
  assert.equal(searchWords(catalog, 'analyses', 'B1')[0]?.id, 'b1:analysis');
  assert.equal(searchWords(catalog, 'ngan hang', 'B1').some(word => word.id === 'b1:bank (river)'), false);
  assert.equal(searchWords(catalog, 'bo song', 'B1')[0]?.id, 'b1:bank (river)');
  assert.ok(searchWords(catalog, 'kindness', 'B1').some(word => word.id === 'b1:kind (caring)'));
});
test('B1 comparisons and examples distinguish meanings and grammar forms', () => {
  for (const word of words) {
    for (const item of word.comparisons ?? []) {
      assert.ok(item.term && item.vi && item.nuance && item.example.en && item.example.vi, word.id);
      assert.notEqual(item.term, word.term, word.id);
    }
  }
  assert.ok(get('historic').comparisons?.some(item => item.term === 'historical'));
  assert.ok(get('sensible').comparisons?.some(item => item.term === 'sensitive'));
  assert.ok(get('used1').comparisons?.find(item => item.term === 'be used to')?.example.en.includes('used to getting'));
  assert.ok(get('used2').usageNote?.includes('V-ing'));
  assert.ok(get('worth').usageNote?.includes('không dùng worth to read'));
  assert.ok(get('result').usageNote?.includes('Result from'));
});
