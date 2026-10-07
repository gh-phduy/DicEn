import curatedData from './curated.json';
import indexData from './oxford-index.json';
import trialData from './trial.json';
import a1Data from './a1.json';
import type { Word } from '../lib/study';

export const preparedWords: Word[] = curatedData;
export const trialWords: Word[] = trialData;
export const a1Words: Word[] = a1Data;
export const learningWords: Word[] = Array.from(new Map([...trialWords, ...a1Words].map(word => [word.id, word])).values())
  .sort((a, b) => a.term.localeCompare(b.term));
const byTerm = new Map([...preparedWords, ...learningWords].map(word => [word.id, word]));
export const dictionary: Word[] = indexData.map(entry => ({ ...entry, ...byTerm.get(entry.id),
  level: entry.level, levels: entry.levels, partOfSpeech: entry.partOfSpeech,
}));
export const wordById = new Map([...dictionary, ...preparedWords, ...learningWords].map(word => [word.id, word]));
