#!/usr/bin/env python3
"""
Verify that src/data/orbit-model.json matches the verbatim source extraction
in docs/source-documents/2026-05-03/extracted/aspects.json.

For every source aspect:
  - Name matches (with the documented typo fix applied)
  - Description matches the source aspect question
  - Each level's description matches the source criteria text
  - Each level's evidence list matches the source documentation lines

Reports any mismatches in detail. Exits 0 on a perfect match, 1 otherwise.
"""

import json
import re
import sys

SOURCE = 'docs/source-documents/2026-05-03/extracted/aspects.json'
TARGET = 'src/data/orbit-model.json'

# Documented adjustment to source content
NAME_FIXES = {
    'Identify, Access and Consent': 'Identity, Access and Consent',
}


def normalize_text(text):
    """Match the same normalization the generator applies."""
    if text is None:
        return ''
    text = text.replace('\u00a0', ' ')
    text = text.replace('\u2019', "'").replace('\u2018', "'")
    lines = [re.sub(r'[ \t]+', ' ', line).strip() for line in text.split('\n')]
    return '\n'.join(line for line in lines if line)


def normalize_name(name):
    name = NAME_FIXES.get(name, name)
    name = name.replace('\u00a0', ' ')
    name = re.sub(r'\s+', ' ', name).strip()
    return name


def split_lines(text):
    if not text:
        return []
    items = []
    for raw in text.replace('\u2022', '\n').split('\n'):
        line = raw.strip().lstrip('-').lstrip('•').strip()
        if line:
            items.append(line)
    return items


def collect_target_aspects(model):
    """Return a list of (location_label, aspect_dict) for every aspect in orbit-model."""
    out = []
    for dim_id, dim in model['dimensions'].items():
        if 'subDimensions' in dim:
            for sd in dim['subDimensions']:
                for a in sd['aspects']:
                    out.append((f'dimensions.technology.{sd["id"]}', a))
        else:
            for a in dim['aspects']:
                out.append((f'dimensions.{dim_id}', a))
    for org_id, org in model['organizationalAssessments'].items():
        for a in org['aspects']:
            out.append((f'organizationalAssessments.{org_id}', a))
    return out


def main():
    with open(SOURCE, 'r', encoding='utf-8') as f:
        source = json.load(f)
    with open(TARGET, 'r', encoding='utf-8') as f:
        target = json.load(f)

    target_aspects = collect_target_aspects(target)

    # Build name -> (location, aspect) map; if a name is duplicated we'll fail loudly
    target_by_name = {}
    for location, a in target_aspects:
        if a['name'] in target_by_name:
            print(f"  ⚠ Duplicate aspect name in target: {a['name']!r}")
        target_by_name[a['name']] = (location, a)

    issues = []
    info = []

    src_count = len(source)
    tgt_count = len(target_aspects)
    if src_count != tgt_count:
        issues.append(f'COUNT MISMATCH: source has {src_count} aspects, target has {tgt_count}')
    else:
        info.append(f'Aspect count matches: {src_count}')

    matched_target_names = set()

    for src in source:
        expected_name = normalize_name(src['name'])
        match = target_by_name.get(expected_name)
        if not match:
            issues.append(f'MISSING in target: source aspect {expected_name!r}')
            continue
        location, tgt = match
        matched_target_names.add(expected_name)

        # Check description (aspect-level question)
        expected_desc = normalize_text(src.get('question', ''))
        if normalize_text(tgt.get('description', '')) != expected_desc:
            issues.append(
                f"DESCRIPTION MISMATCH at {location}/{tgt['id']}\n"
                f'    expected: {expected_desc!r}\n'
                f'    actual:   {tgt.get("description", "")!r}'
            )

        # Check each level
        for i in range(1, 6):
            level_key = f'level{i}'
            tgt_level = tgt.get('levels', {}).get(level_key)
            if not tgt_level:
                issues.append(f'MISSING LEVEL at {location}/{tgt["id"]} {level_key}')
                continue

            # Description
            expected_level_desc = normalize_text(
                src['criteria'].get(str(i), '') or src['criteria'].get(i, '')
            )
            actual_level_desc = normalize_text(tgt_level.get('description', ''))
            if expected_level_desc != actual_level_desc:
                issues.append(
                    f'LEVEL DESCRIPTION MISMATCH at {location}/{tgt["id"]} {level_key}\n'
                    f'    expected: {expected_level_desc!r}\n'
                    f'    actual:   {actual_level_desc!r}'
                )

            # Questions should be empty per schema simplification
            if tgt_level.get('questions'):
                issues.append(
                    f'UNEXPECTED LEVEL QUESTIONS at {location}/{tgt["id"]} {level_key}: '
                    f'{tgt_level["questions"]!r}'
                )

            # Evidence
            expected_evidence = split_lines(
                src['documentation'].get(str(i), '') or src['documentation'].get(i, '')
            )
            actual_evidence = list(tgt_level.get('evidence', []))
            if expected_evidence != actual_evidence:
                issues.append(
                    f'EVIDENCE MISMATCH at {location}/{tgt["id"]} {level_key}\n'
                    f'    expected: {expected_evidence!r}\n'
                    f'    actual:   {actual_evidence!r}'
                )

    # Anything in target that isn't in source?
    target_names = set(target_by_name.keys())
    extra = target_names - matched_target_names
    for name in sorted(extra):
        issues.append(f'EXTRA in target (not in source): {name!r}')

    # Report
    print('=== INFO ===')
    for i in info:
        print(f'  ✓ {i}')

    if issues:
        print(f'\n=== ISSUES ({len(issues)}) ===')
        for issue in issues:
            print(f'  ✗ {issue}')
        sys.exit(1)

    print('\n✓ All aspects match the source verbatim (with documented typo fix).')


if __name__ == '__main__':
    main()
