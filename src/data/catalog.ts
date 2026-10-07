import curatedData from './curated.json';
import indexData from './oxford-index.json';
import trialData from './trial.json';
import type { Word } from '../lib/study';

export const preparedWords: Word[] = curatedData;
export const trialWords: Word[] = trialData;
const byTerm = new Map([...preparedWords, ...trialWords].map(word => [word.id, word]));
export const dictionary: Word[] = indexData.map(entry => ({ ...entry, ...byTerm.get(entry.id),
  level: entry.level, levels: entry.levels, partOfSpeech: entry.partOfSpeech,
}));
export const wordById = new Map([...dictionary, ...preparedWords, ...trialWords].map(word => [word.id, word]));
