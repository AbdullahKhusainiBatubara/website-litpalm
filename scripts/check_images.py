#!/usr/bin/env python3
"""
Check `index.html` for potential causes of a stray 'm' appearing on images.

Checks performed:
- Finds <img> tags and prints their `alt` values and `src` paths.
- Searches for standalone 'm' text nodes between tags (pattern >m< with optional whitespace).
- Reports image filenames that start with 'm' (e.g., 'm-image.jpg') which may indicate editing prefixes.

Usage:
  python scripts/check_images.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / 'index.html'

html = HTML.read_text(encoding='utf-8')

img_pattern = re.compile(r'<img\s+([^>]*?)>', re.IGNORECASE | re.DOTALL)
attr_pattern = re.compile(r'(\w+)\s*=\s*"([^"]*)"')

issues = []

print(f"Checking {HTML}\n")

for m in img_pattern.finditer(html):
    tag = m.group(0)
    attrs = dict(attr_pattern.findall(m.group(1)))
    src = attrs.get('src','')
    alt = attrs.get('alt','')
    if alt.strip().lower() == 'm':
        issues.append(('alt_m', tag.strip()))
    # filename starts with m
    filename = Path(src).name
    if filename.lower().startswith('m'):
        issues.append(('filename_start_m', src))

# search for standalone m between tags
between_tags = re.findall(r'>\s*m\s*<', html, flags=re.IGNORECASE)
if between_tags:
    issues.append(('text_node_m', f"{len(between_tags)} occurrences of >m<"))

if not issues:
    print('No obvious issues found: no alt="m", no image filenames starting with "m", and no >m< text nodes.')
else:
    print('Potential issues found:')
    for itype, info in issues:
        print(f'- {itype}: {info}')

print('\nIf you still see the letter "m" on images in the browser, try these checks:')
print('- Inspect element on the image (right-click → Inspect) and check the image element and computed styles.')
print('- Check if the letter is inside the image file itself (open the image in an image viewer).')
print('- Disable CSS (in DevTools) to see if a pseudo-element (::before/::after) is adding the letter.')
