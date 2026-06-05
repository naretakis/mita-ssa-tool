#!/usr/bin/env python3
"""
Generate the updated orbit-model.json from the May 3 2026 PRA Submission docx.

Reads docs/source-documents/2026-05-03/extracted/aspects.json (produced by
scripts/extract-new-docx.py) and produces src/data/orbit-model.json that mirrors
the official source verbatim, with two intentional adjustments:

1. Aspect typo fix: "Identify, Access and Consent" -> "Identity, Access and Consent"
2. ID reuse: existing IDs are kept where the aspect is unchanged in name to
   avoid breaking compatibility within v3.0.0; new IDs are derived from the
   verbatim source name.

The schema simplifies:
- Each aspect has one description (the "aspect question" from the source).
- Each level has description + questions ([]) + evidence (the "Suggested
  Documentation" lines, split per line).
"""

import json
import os
import re

INPUT = 'docs/source-documents/2026-05-03/extracted/aspects.json'
OUTPUT = 'src/data/orbit-model.json'

LEVEL_KEYS = ['level1', 'level2', 'level3', 'level4', 'level5']

# Source-aspect-name -> stable ID (kebab-case from source name, except where we
# reuse an existing ID for an unchanged aspect to keep IDs stable).
ID_MAP = {
    # Outcomes (unchanged from current)
    'Culture & Mindset': 'culture-mindset',
    'Capability': 'capability',
    'Quality & Consistency': 'quality-consistency',
    'Alignment to Goals & Priorities': 'alignment-goals-priorities',
    'Use of Metrics': 'use-of-metrics',
    'Reusability & Integration': 'reusability-integration',
    # Roles (Technology Resources removed; rest unchanged)
    'Organizational Goals Alignment': 'organizational-goals-alignment',
    'Governance & Standardization': 'governance-standardization',
    'Communication (Internal / External)': 'communication',
    'Culture & Leadership': 'culture-leadership',
    'Resourcing Capacity (Staffing, Training, Recruitment)': 'resourcing-capacity',
    # Organizational EA (unchanged)
    'Business Capability': 'business-capability',
    'Enterprise Architecture': 'enterprise-architecture',
    'Policy Management': 'policy-management',
    'Strategic Planning': 'strategic-planning',
    # Business Architecture (unchanged)
    'Business Process Performance': 'business-process-performance',
    'Business Process Documentation': 'business-process-documentation',
    'Business Process Governance': 'business-process-governance',
    'Business Process Automation': 'business-process-automation',
    'Business Process Reporting': 'business-process-reporting',
    # Information Architecture (unchanged - same 10 aspects)
    'Information Classification': 'information-classification',
    'Information Quality': 'information-quality',
    'Information Analysis': 'information-analysis',
    'Information Exchange': 'information-exchange',
    'Information Content': 'information-content',
    'Information Governance': 'information-governance',
    'Information Design': 'information-design',
    'Reference Information': 'reference-information',
    'Master Information': 'master-information',
    'Information Storage': 'information-storage',
    # Technology - Infrastructure (typo fix on Identity, names verbatim)
    'Compute and Storage': 'compute-and-storage',
    'Networking and Technical Recovery': 'networking-and-technical-recovery',
    'Identity, Access and Consent': 'identity-access-and-consent',          # typo fix from "Identify"
    'Security Protection and Monitoring': 'security-protection-and-monitoring',
    'System Operations and Monitoring': 'system-operations-and-monitoring',
    'Development, Testing, Release and Security Compliance': 'development-testing-release-and-security-compliance',
    # Technology - Application Management (verbatim source naming)
    'API, Messaging, and Integration': 'api-messaging-and-integration',
    'Application Hosting and Platform Services': 'application-hosting-and-platform-services',
    'Business Rules and Workflows': 'business-rules-and-workflows',
    'Modular Architecture': 'modular-architecture',
    'User Interfaces and Session Management': 'user-interfaces-and-session-management',
}

# Apply the verbatim-with-typo-fix transformation to the source name.
NAME_FIXES = {
    'Identify, Access and Consent': 'Identity, Access and Consent',
}

# Maturity level metadata (kept verbatim from current orbit-model.json since
# the May 3 docx does not redefine these definitions).
MATURITY_LEVELS = {
    'level1': {
        'name': 'Initial',
        'description': 'SMA seeks to adopt enterprise-wide planning and architectural frameworks to improve program delivery. Current processes are unstructured, reactive, and inconsistent.',
    },
    'level2': {
        'name': 'Developing',
        'description': 'SMA complies with federal regulations and guidance and has begun adopting MES industry-recognized planning and architectural frameworks. Although basic processes and systems exist, they are not fully standardized or documented. The SMA collects and reports state-specific and MES metrics as well as performance data.',
    },
    'level3': {
        'name': 'Defined',
        'description': 'SMA complies with federal regulations and guidance and has fully implemented MES industry-recognized planning and architectural frameworks. Processes, systems, and strategies are standardized, well-documented, and aligned across the organization. The SMA actively monitors and analyzes state-specific and MES metrics as well as performance data for improvements.',
    },
    'level4': {
        'name': 'Managed',
        'description': "SMA maintains compliance, follows industry-recognized planning and architectural frameworks, and monitors MES performance to meet goals. Processes are fully operational, consistent, and well executed. The SMA actively monitors and analyzes state-specific and MES metrics as well as performance data for improvements. The organization is a thought-leader in the MES ecosystem and actively collaborates and shares approaches with other SMAs.",
    },
    'level5': {
        'name': 'Optimized',
        'description': "The SMA employs advanced, data-driven strategies to manage MES planning and architecture to align predictive decision-making with the SMA's long-term goals. Integrated processes, technologies, and data drive enterprise optimization. The SMA's institutionalized innovation supports adaptability, scalability, and continuous improvement. The organization is nationally recognized and actively collaborates and shares solutions with other SMAs.",
    },
    'notApplicable': {
        'name': 'Not Applicable',
        'description': 'Not applicable was added by request of SMAs during listening sessions in late 2024. SMAs noted that some maturity criteria are inapplicable to their business operations or MES.',
    },
}


def split_lines(text):
    """Split a Suggested Documentation cell into trimmed lines."""
    if not text:
        return []
    items = []
    for raw in text.replace('\u2022', '\n').split('\n'):
        line = raw.strip().lstrip('-').lstrip('•').strip()
        if line:
            items.append(line)
    return items


def normalize_text(text):
    """Normalize whitespace/punctuation that DOCX export sometimes mangles."""
    if text is None:
        return ''
    # Replace non-breaking spaces with regular spaces
    text = text.replace('\u00a0', ' ')
    # Replace fancy quotes / dashes for consistency
    text = text.replace('\u2019', "'").replace('\u2018', "'")
    # Collapse internal multi-spaces but preserve newlines
    lines = [re.sub(r'[ \t]+', ' ', line).strip() for line in text.split('\n')]
    return '\n'.join(line for line in lines if line)


def normalize_name(name):
    """Apply name fixes and whitespace normalization to an aspect name."""
    name = NAME_FIXES.get(name, name)
    # Strip non-breaking spaces and collapse whitespace
    name = name.replace('\u00a0', ' ')
    name = re.sub(r'\s+', ' ', name).strip()
    return name


def build_aspect(src):
    """Build an OrbitAspect dict from an extracted source aspect."""
    name = normalize_name(src['name'])
    aspect_id = ID_MAP.get(name)
    if not aspect_id:
        # Fallback: derive from name
        aspect_id = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
        print(f"  ! No ID mapping for {name!r}; using {aspect_id!r}")

    levels = {}
    for i, key in enumerate(LEVEL_KEYS, start=1):
        desc = normalize_text(src['criteria'].get(str(i), '')) or normalize_text(src['criteria'].get(i, ''))
        evidence_text = src['documentation'].get(str(i), '') or src['documentation'].get(i, '')
        evidence = split_lines(evidence_text)
        levels[key] = {
            'description': desc,
            'questions': [],
            'evidence': evidence,
        }

    return {
        'id': aspect_id,
        'name': name,
        'description': normalize_text(src['question']),
        'levels': levels,
    }


def main():
    with open(INPUT, 'r', encoding='utf-8') as f:
        src_aspects = json.load(f)

    # Bucket aspects by section/subsection
    by_key = {}
    for a in src_aspects:
        key = (a['section'], a['subsection'])
        by_key.setdefault(key, []).append(a)

    def take(section, subsection):
        return by_key.get((section, subsection), [])

    outcomes_src = take('Enterprise Architecture (EA)', 'Optional Outcomes Maturity Criteria')
    roles_src = take('Enterprise Architecture (EA)', 'Optional Roles Maturity Criteria')
    org_ea_src = take('Enterprise Architecture (EA)', 'Organizational Enterprise Architecture')
    ba_src = take('Business Architecture (BA)', None)
    ia_src = take('Information Architecture (IA)', None)
    infra_src = take('Technical Architecture (TA)', 'Technical Infrastructure Management')
    app_src = take('Technical Architecture (TA)', 'Application Management')

    # Validate counts
    counts = {
        'Outcomes': (len(outcomes_src), 6),
        'Roles': (len(roles_src), 5),
        'Organizational EA': (len(org_ea_src), 4),
        'Business Architecture': (len(ba_src), 5),
        'Information': (len(ia_src), 10),
        'Technical Infrastructure Management': (len(infra_src), 6),
        'Application Management': (len(app_src), 5),
    }
    print('=== ASPECT COUNTS ===')
    for label, (got, exp) in counts.items():
        ok = '✓' if got == exp else '✗'
        print(f'  {ok} {label}: {got} (expected {exp})')

    # Build the model
    model = {
        'version': '4.0',
        'lastUpdated': '2026-05-03',
        'source': 'MITA 4.0 Maturity Model - PRA Submission (May 2026)',
        'maturityLevels': MATURITY_LEVELS,
        'dimensions': {
            'businessArchitecture': {
                'id': 'businessArchitecture',
                'name': 'Business Architecture',
                'description': 'The business processes performed to deliver the capability.',
                'required': True,
                'aspects': [build_aspect(a) for a in ba_src],
            },
            'information': {
                'id': 'information',
                'name': 'Information',
                'description': 'The information architecture and data management capabilities needed to deliver the capability.',
                'required': True,
                'aspects': [build_aspect(a) for a in ia_src],
            },
            'technology': {
                'id': 'technology',
                'name': 'Technology',
                'description': 'The technology infrastructure and application architecture supporting the capability.',
                'required': True,
                'subDimensions': [
                    {
                        'id': 'technologyInfrastructureManagement',
                        'name': 'Technical Infrastructure Management',
                        'description': 'Assess the Technical Architecture maturity of the Medicaid Enterprise System (MES).',
                        'aspects': [build_aspect(a) for a in infra_src],
                    },
                    {
                        'id': 'applicationManagement',
                        'name': 'Application Management',
                        'description': "Assess the Technical Architecture maturity of the application or module for a Domain/Area's capability.",
                        'aspects': [build_aspect(a) for a in app_src],
                    },
                ],
            },
        },
        'organizationalAssessments': {
            'outcomes': {
                'id': 'outcomes',
                'name': 'Organizational Outcomes',
                'description': 'The definition of the desired outcomes that require the capability to be achieved. (Optional)',
                'capabilityAreaId': 'organizational-outcomes',
                'aspects': [build_aspect(a) for a in outcomes_src],
            },
            'roles': {
                'id': 'roles',
                'name': 'Organizational Roles',
                'description': 'The individual roles responsible for providing the capability. (Optional)',
                'capabilityAreaId': 'organizational-roles',
                'aspects': [build_aspect(a) for a in roles_src],
            },
            'enterprise-architecture': {
                'id': 'enterprise-architecture',
                'name': 'Organizational Enterprise Architecture',
                "description": "Assesses the organization's maturity in enterprise-level planning, governance, and architectural frameworks across the Medicaid enterprise.",
                'capabilityAreaId': 'organizational-enterprise-architecture',
                'aspects': [build_aspect(a) for a in org_ea_src],
            },
        },
    }

    # Validate every aspect has all 5 levels with description
    print('\n=== VALIDATION ===')
    issues = []
    def walk_aspects(label, aspects):
        for a in aspects:
            for k in LEVEL_KEYS:
                if k not in a['levels']:
                    issues.append(f"{label}/{a['id']} missing {k}")
                elif not a['levels'][k]['description']:
                    issues.append(f"{label}/{a['id']}/{k} empty description")

    for dim_id, dim in model['dimensions'].items():
        if 'subDimensions' in dim:
            for sd in dim['subDimensions']:
                walk_aspects(f"{dim_id}/{sd['id']}", sd['aspects'])
        else:
            walk_aspects(dim_id, dim['aspects'])
    for org_id, org in model['organizationalAssessments'].items():
        walk_aspects(f"organizational/{org_id}", org['aspects'])

    if issues:
        print(f"  Found {len(issues)} issues:")
        for i in issues:
            print(f"    ✗ {i}")
    else:
        print('  ✓ All aspects have complete level descriptions')

    # Total counts
    total_standard = (
        len(model['dimensions']['businessArchitecture']['aspects'])
        + len(model['dimensions']['information']['aspects'])
        + sum(len(sd['aspects']) for sd in model['dimensions']['technology']['subDimensions'])
    )
    total_org = sum(len(org['aspects']) for org in model['organizationalAssessments'].values())
    print(f"\nTotal standard aspects: {total_standard}")
    print(f"Total organizational aspects: {total_org}")
    print(f"Grand total: {total_standard + total_org}")

    # Write output
    with open(OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(model, f, indent=2, ensure_ascii=False)
        f.write('\n')

    with open(OUTPUT, 'r') as f:
        line_count = sum(1 for _ in f)
    print(f"\nWritten to {OUTPUT} ({line_count} lines)")


if __name__ == '__main__':
    main()
