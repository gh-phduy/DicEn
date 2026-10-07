import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchWords, recordKnown, dueWords, emptyProgress } from '../src/lib/study.ts';
import type { Word } from '../src/lib/study.ts';

const words: Word[] = [
  { id: 'afford', term: 'afford', definition: 'có đủ khả năng chi trả', partOfSpeech: 'v.', level: 'B1' },
  { id: 'bank (river)', term: 'bank (river)', definition: 'bờ sông', partOfSpeech: 'n.', level: 'B1' },
  { id: 'account', term: 'account', partOfSpeech: 'n., v.', level: 'B1', levels: ['B1', 'B2'] },
];
test('Vietnamese search works with and without accents and d-stroke', () => {
  assert.equal(searchWords(words, 'du kha nang')[0]?.id, 'afford');
  assert.equal(searchWords(words, 'bờ sông')[0]?.id, 'bank (river)');
  assert.equal(searchWords(words, '  AFFORD  ')[0]?.id, 'afford');
});
test('level filters preserve words with multiple Oxford levels', () => {
  assert.deepEqual(searchWords(words, '', 'B2').map(w => w.id), ['account']);
});
test('saved reviews return after 24 hours, including previously unseen words', () => {
  const next = recordKnown(emptyProgress(), 'afford', 1000);
  assert.equal(dueWords(words, ['afford'], next, 2000).length, 0);
  assert.equal(dueWords(words, ['afford'], next, 86_401_000).length, 1);
  assert.equal(dueWords(words, ['bank (river)'], next, 2000).length, 1);
});
