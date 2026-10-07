"""Extract A1-only parts of speech and printed casing from the supplied Oxford PDF."""
import json
import re
import sys
from pathlib import Path
from pypdf import PdfReader

target = Path(__file__).resolve().parent / 'data' / 'a1-metadata.json'
pos = r'(?:n\.|v\.|adj\.|adv\.|prep\.|pron\.|det\.|conj\.|exclam\.|number|ordinal|modal v\.|auxiliary v\.|indefinite article|definite article|infinitive marker)'
words = {}
for page in PdfReader(sys.argv[1]).pages:
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
            if segment[2] != 'A1':
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
expected = {word['id'] for word in index if 'A1' in word['levels']}
if set(words) != expected:
    raise ValueError(f'A1 mismatch: missing={expected-set(words)}, extra={set(words)-expected}')
target.write_text(json.dumps(words, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Extracted A1-specific metadata for {len(words)} words.')
