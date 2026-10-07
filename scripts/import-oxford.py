"""Import the two user-supplied Oxford PDFs. PDFs contain metadata, not definitions."""
import json
import re
import sys
from pathlib import Path
from pypdf import PdfReader

target = Path(__file__).resolve().parents[1] / 'src' / 'data'
target.mkdir(parents=True, exist_ok=True)
entries = {}
counts = {}
pos_pattern = r'(?:n\.|v\.|adj\.|adv\.|prep\.|pron\.|det\.|conj\.|exclam\.|number|ordinal|modal v\.|auxiliary v\.|indefinite article|definite article|infinitive marker)'
for filename in sys.argv[1:]:
    source = Path(filename)
    count = 0
    for page in PdfReader(source).pages:
        lines = []
        for raw in page.extract_text().splitlines():
            raw = raw.strip()
            if lines and re.match(r'^(?:[A-C][12]\s*$|(?:n\.|v\.|adj\.|adv\.|prep\.|pron\.|det\.|conj\.|exclam\.)[\s,/])', raw):
                lines[-1] += ' ' + raw
            else:
                lines.append(raw)
        for line in lines:
            line = line.strip()
            match = re.match(r'^(.+?)\s+(' + pos_pattern + r'.*)$', line)
            if not match or not re.search(r'\b[A-C][12]\b', match.group(2)):
                continue
            term, metadata = match.groups()
            # PDF superscripts distinguish homographs; keep the printed identifier.
            key = term.lower().strip()
            levels = sorted(set(re.findall(r'\b[A-C][12]\b', metadata)))
            parts = re.sub(r'\b[A-C][12]\b', '', metadata).strip(' ,')
            if key in entries:
                entries[key]['levels'] = sorted(set(entries[key]['levels'] + levels))
                if parts not in entries[key]['partOfSpeech']:
                    entries[key]['partOfSpeech'] += ', ' + parts
            else:
                entries[key] = dict(id=key, term=term, partOfSpeech=parts, level=levels[0], levels=levels, source=source.name)
            count += 1
    counts[source.name] = count
output = sorted(entries.values(), key=lambda word: word['id'])
(target / 'oxford-index.json').write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
(target / 'import-report.json').write_text(json.dumps(dict(sourceEntries=counts, uniqueEntries=len(output)), indent=2) + '\n', encoding='utf-8')
print(json.dumps(dict(sourceEntries=counts, uniqueEntries=len(output))))
