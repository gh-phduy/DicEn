"""Extract level-specific parts of speech and printed casing from the Oxford PDF.

Usage: python scripts/extract-a1-metadata.py PDF [PDF ...] [A1|A2|B1|B2|C1]
"""
import json
import re
import sys
from pathlib import Path
from pypdf import PdfReader

level = sys.argv[-1] if sys.argv[-1] in {'A1', 'A2', 'B1', 'B2', 'C1'} else 'A1'
filenames = sys.argv[1:-1] if sys.argv[-1] == level else sys.argv[1:]
if level not in {'A1', 'A2', 'B1', 'B2', 'C1'}:
    raise ValueError(f'Invalid level: {level}')
target = Path(__file__).resolve().parent / 'data' / f'{level.lower()}-metadata.json'
pos = r'(?:n\.|v\.|adj\.|adv\.|prep\.|pron\.|det\.|conj\.|exclam\.|number|ordinal|modal v\.|auxiliary v\.|indefinite article|definite article|infinitive marker)'
words = {}
for page in (page for filename in filenames for page in PdfReader(filename).pages):
    lines = []
    for raw in page.extract_text().splitlines():
        raw = raw.strip()
        if lines and re.match(r'^(?:[A-C][12]\s*$|(?:n\.|v\.|adj\.|adv\.|prep\.|pron\.|det\.|conj\.|exclam\.)[\s,/])', raw):
            lines[-1] += ' ' + raw
        else:
            lines.append(raw)
    for line in lines:
        match = re.match(r'^(.+?)\s+(' + pos + r'.*)$', line)
        if not match:
            continue
        term, metadata = match.groups()
        for segment in re.finditer(r'(.+?)\b([A-C][12])\b', metadata):
            if segment[2] != level:
                continue
            part = segment[1].strip(' ,')
            key = term.lower().strip()
            if key in words:
                if part not in words[key]['partOfSpeech']:
                    words[key]['partOfSpeech'] += ', ' + part
            else:
                display = re.sub(r'\s*\(.*?\)', '', re.sub(r'(?<=[a-z])\d+', '', term)).strip()
                words[key] = {'term': display, 'sourceTerm': term, 'partOfSpeech': part}
index = json.loads((target.parents[2] / 'src/data/oxford-index.json').read_text(encoding='utf-8'))
expected = {word['id'] for word in index if level in word['levels']}
if set(words) != expected:
    raise ValueError(f'{level} mismatch: missing={expected-set(words)}, extra={set(words)-expected}')
target.write_text(json.dumps(words, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Extracted {level}-specific metadata for {len(words)} words.')
