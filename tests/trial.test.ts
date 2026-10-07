import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { searchWords, type Word } from '../src/lib/study.ts';

const trial: Word[] = JSON.parse(readFileSync(new URL('../src/data/trial.json', import.meta.url), 'utf8'));
test('the 50-word trial has usable family and sense content for every entry', () => {
  assert.equal(trial.length, 50);
  assert.equal(new Set(trial.map(word => word.id)).size, 50);
  for (const word of trial) {
    assert.ok(word.definition && word.usageNote && word.phonetic, word.id);
    assert.ok(word.wordFamily, word.id);
    assert.ok(word.wordFamily.verbs.some(member => member.term === word.term), word.id);
    assert.ok(word.comparisons && word.comparisons.length >= 2, word.id);
    for (const members of Object.values(word.wordFamily)) {
      assert.ok(members.every(member => member.term && member.vi), word.id);
    }
    for (const comparison of word.comparisons) {
      assert.ok(comparison.nuance && comparison.example.en && comparison.example.vi, word.id);
      assert.notEqual(comparison.term, word.term, word.id);
    }
  }
});
test('a family search returns its root word, including Vietnamese without accents', () => {
  assert.equal(searchWords(trial, 'affordable')[0]?.id, 'afford');
  assert.equal(searchWords(trial, 'assistance')[0]?.id, 'assist');
  assert.equal(searchWords(trial, 'kha nang chi tra')[0]?.id, 'afford');
});
test('leading people is kept separate from the homograph for metal', () => {
  const lead = trial.find(word => word.id === 'lead')!;
  assert.ok(!lead.definition!.includes('chì'));
  assert.ok(!Object.values(lead.wordFamily!).flat().some(member => member.vi === 'kim loại chì'));
  assert.ok(lead.usageNote!.includes('/liːd/'));
});
test('the rise / raise comparison explains the transitivity difference', () => {
  const rise = trial.find(word => word.id === 'rise')!;
  assert.ok(rise.usageNote!.includes('không cần tân ngữ'));
  assert.ok(rise.comparisons!.find(item => item.term === 'raise')!.nuance.includes('Cần tân ngữ'));
});
