import curatedData from './curated.json';
import indexData from './oxford-index.json';
import trialData from './trial.json';
import a1Data from './a1.json';
import b1Data from './b1.json';
import { buildLearningWords, type Word } from '../lib/study';

export const preparedWords: Word[] = curatedData;
export const trialWords: Word[] = trialData;
export const a1Words: Word[] = a1Data;
export const b1Words: Word[] = b1Data;
export const learningWords = buildLearningWords(trialWords, [a1Words, b1Words]);
const byTerm = new Map([...preparedWords, ...learningWords].map(word => [word.id, word]));
export const dictionary: Word[] = indexData.map(entry => ({ ...entry, ...byTerm.get(entry.id),
  level: entry.level, levels: entry.levels, partOfSpeech: entry.partOfSpeech,
}));
export const wordById = new Map([...dictionary, ...preparedWords, ...trialWords, ...learningWords].map(word => [word.id, word]));
