import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { searchWords, type Word } from '../src/lib/study.ts';

const words: Word[] = JSON.parse(readFileSync(new URL('../src/data/a1.json', import.meta.url), 'utf8'));
const index: Word[] = JSON.parse(readFileSync(new URL('../src/data/oxford-index.json', import.meta.url), 'utf8'));
const get = (id: string) => words.find(word => word.id === id)!;

test('A1 coverage matches every headword in the supplied Oxford metadata without extras', () => {
  const expected = index.filter(word => word.levels?.includes('A1')).map(word => word.id).sort();
  assert.equal(expected.length, 899);
  assert.deepEqual(words.map(word => word.id).sort(), expected);
  assert.equal(new Set(words.map(word => word.id)).size, words.length);
  for (const word of words) {
    assert.equal(word.level, 'A1', word.id);
    assert.ok(word.levels?.includes('A1') && word.definition && word.phonetic, word.id);
    assert.ok(word.examples?.length && word.examples.every(example => example.en && example.vi), word.id);
    assert.ok(word.wordFamily && word.familyNote, word.id);
    assert.ok(!JSON.stringify(word).match(/TODO|placeholder|badness\?/), word.id);
  }
});
test('A1 learning parts of speech do not inherit higher-level verb senses', () => {
  assert.equal(get('address').partOfSpeech, 'n.');
  assert.equal(get('adult').partOfSpeech, 'n.');
  assert.equal(get('object').partOfSpeech, 'n.');
  assert.equal(get('book').partOfSpeech, 'n.');
  assert.equal(get('may').partOfSpeech, 'n.');
  assert.equal(get('may').term, 'May');
  assert.equal(get('i').term, 'I');
});
test('homographs retain source IDs while showing and pronouncing the intended A1 sense', () => {
  assert.equal(get('can1').term, 'can');
  assert.equal(get('live1').phonetic, '/lɪv/');
  assert.equal(get('close1').phonetic, '/kloʊz/');
  assert.equal(get('minute1').phonetic, '/ˈmɪnɪt/');
  assert.equal(get('bank (money)').definition, 'ngân hàng');
  assert.ok(!Object.values(get('light (from the sun/a lamp)').wordFamily!).flat().some(item => item.term === 'lightly'));
  assert.ok(get('like (similar)').partOfSpeech.includes('prep.'));
  assert.ok(get('like (find sb/sth pleasant)').partOfSpeech.includes('v.'));
});
test('function words have grammar forms without pretending to be noun/verb families', () => {
  const i = get('i');
  assert.ok(i.forms?.some(form => form.term === 'me'));
  assert.ok(Object.values(i.wordFamily!).every(group => !group.length));
  const article = get('a, an');
  assert.ok(article.forms?.some(form => form.term === 'an'));
  assert.ok(article.usageNote?.includes('âm mở đầu'));
  assert.ok(get('each').usageNote?.includes('động từ số ít'));
  assert.ok(!get('each').usageNote?.includes('Both đi'));
});
test('A1 search finds derived forms, irregular forms, accented Vietnamese and root matches', () => {
  assert.equal(searchWords(words, 'wrote')[0]?.id, 'write');
  assert.ok(searchWords(words, 'children').some(word => word.id === 'child'));
  assert.ok(searchWords(words, 'happiness').some(word => word.id === 'happy'));
  assert.equal(searchWords(words, 'dia chi')[0]?.id, 'address');
  assert.equal(searchWords(words, 'April')[0]?.id, 'april');
  assert.equal(searchWords(words, 'teacher')[0]?.id, 'teacher');
});
test('comparisons carry individual bilingual examples and explain differences, not blanket synonyms', () => {
  for (const word of words) {
    for (const comparison of word.comparisons ?? []) {
      assert.ok(comparison.term && comparison.vi && comparison.nuance, word.id);
      assert.ok(comparison.example.en && comparison.example.vi, word.id);
      assert.notEqual(comparison.term, word.term, word.id);
    }
  }
  assert.ok(get('hard').comparisons?.find(item => item.term === 'hardly')?.nuance.includes('hầu như không'));
  assert.ok(get('say').usageNote?.includes('tell'));
  assert.ok(get('bored').usageNote?.includes('gây chán'));
  assert.ok(get('house').usageNote?.includes('home'));
  assert.ok(get('write').comparisons?.find(item => item.term === 'type')?.example.en.includes('I type'));
  assert.equal(get('good').comparisons?.find(item => item.term === 'well')?.example.en, 'She sings well.');
});
test('root categories and unrelated concepts stay distinct inside word families', () => {
  assert.ok(get('teach').wordFamily!.verbs.some(member => member.term === 'teach'));
  assert.ok(get('teach').wordFamily!.nouns.some(member => member.term === 'teacher'));
  assert.ok(get('bank (money)').wordFamily!.nouns.some(member => member.term === 'banker'));
  assert.ok(get('day').wordFamily!.adverbs.some(member => member.term === 'daily'));
  assert.ok(get('common').wordFamily!.adverbs.some(member => member.term === 'commonly'));
  assert.ok(get('happy').wordFamily!.adjectives.some(member => member.term === 'happy'));
  assert.ok(get('quickly').wordFamily!.adverbs.some(member => member.term === 'quickly'));
  assert.ok(!Object.values(get('die').wordFamily!).flat().some(member => member.term === 'life'));
  assert.ok(!Object.values(get('same').wordFamily!).flat().some(member => member.term === 'similar'));
});
