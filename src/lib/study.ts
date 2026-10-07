export type FamilyMember = { term: string; vi: string };
export type WordFamily = { nouns: FamilyMember[]; verbs: FamilyMember[]; adjectives: FamilyMember[]; adverbs: FamilyMember[] };
export type Comparison = { term: string; vi: string; nuance: string; register: string; example: { en: string; vi: string } };
export type Word = {
  id: string; term: string; partOfSpeech: string; level: string;
  levels?: string[]; definition?: string; phonetic?: string;
  meanings?: string[]; examples?: { en: string; vi: string }[];
  collocations?: { phrase: string; vi: string }[];
  wordFamily?: WordFamily; usageNote?: string; comparisons?: Comparison[];
  references?: { title: string; url: string }[];
};
// Retain the legacy heard field so existing local study records stay compatible.
export type Progress = { heard: Record<string, number>; known: Record<string, number> };
export const emptyProgress = (): Progress => ({ heard: {}, known: {} });

export function normalizeSearch(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
}
export function searchWords(words: Word[], query: string, level = 'All'): Word[] {
  const q = normalizeSearch(query);
  const familyTerms = (word: Word) => word.wordFamily ? Object.values(word.wordFamily).flat() : [];
  return words.filter(word => (level === 'All' || (word.levels ?? [word.level]).includes(level)) &&
    (!q || normalizeSearch([word.term, word.definition ?? '', ...(word.meanings ?? []),
      ...familyTerms(word).flatMap(member => [member.term, member.vi]),
      ...(word.comparisons ?? []).flatMap(item => [item.term, item.vi]),
    ].join(' ')).includes(q)))
    .sort((a, b) => {
      const rank = (word: Word) => normalizeSearch(word.term) === q ? 0 :
        familyTerms(word).some(member => normalizeSearch(member.term) === q) ? 1 :
        normalizeSearch(word.term).startsWith(q) ? 2 : 3;
      return rank(a) - rank(b) || a.term.localeCompare(b.term);
    });
}
// One successful self-check spaces the next review.
export function recordKnown(progress: Progress, id: string, now = Date.now()): Progress {
  return { ...progress, known: { ...progress.known, [id]: now } };
}
export function dueWords(words: Word[], saved: string[], progress: Progress, now = Date.now()): Word[] {
  return words.filter(word => saved.includes(word.id) && (!progress.known[word.id] || now - progress.known[word.id] >= 86_400_000));
}
