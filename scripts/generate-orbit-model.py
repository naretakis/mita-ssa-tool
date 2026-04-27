#!/usr/bin/env python3
"""
Generate the updated orbit-model.json from extracted source documents.

Sources:
- BA Criteria: docs/updated-documents/extracted/BA_Criteria.md (XLSX)
- EA Criteria: docs/updated-documents/extracted/EA_Criteria.md (XLSX)
- Technology: DOCX tables (direct extraction for accuracy)
- Information + Organizational: current orbit-model.json (unchanged)
"""

import json
import os
from docx import Document
import openpyxl

OUTPUT_FILE = 'src/data/orbit-model.json'
CURRENT_FILE = 'src/data/orbit-model.json'
XLSX_FILE = 'docs/updated-documents/Business and Enterprise Architecture Maturity Criteria.xlsx'
DOCX_FILE = 'docs/updated-documents/MITA 4 Maturity Model Guide_Pilot-TA Subgroup Update-0426.docx'


def load_current_model():
    """Load the current orbit-model.json to preserve unchanged sections."""
    with open(CURRENT_FILE, 'r') as f:
        return json.load(f)


def extract_ba_ea_from_xlsx():
    """Extract Business Architecture and Enterprise Architecture criteria from XLSX."""
    wb = openpyxl.load_workbook(XLSX_FILE, data_only=True)
    
    ba_aspects = extract_criteria_sheet(wb['BA Criteria'], {
        'Business Process Performance': {
            'id': 'business-process-performance',
            'description': 'Measurement, monitoring, and management of business process performance supporting the capability.'
        },
        'Business Process Documentation': {
            'id': 'business-process-documentation',
            'description': 'Identification, documentation, and maintenance of business processes supporting the capability.'
        },
        'Business Process Governance': {
            'id': 'business-process-governance',
            'description': 'Assignment and active participation of governance roles for business processes supporting the capability.'
        },
        'Business Process Automation': {
            'id': 'business-process-automation',
            'description': 'Design, implementation, governance, and optimization of automation for business processes supporting the capability.'
        },
        'Business Process Reporting': {
            'id': 'business-process-reporting',
            'description': 'Documentation and traceability of reports and measures produced to support business processes.'
        },
    })
    
    ea_aspects = extract_criteria_sheet(wb['EA Criteria'], {
        'Business Capability': {
            'id': 'business-capability',
            'description': 'Definition, documentation, governance, measurement, and improvement of business capabilities to support the enterprise.'
        },
        'Enterprise Architecture': {
            'id': 'enterprise-architecture',
            'description': 'Integration of enterprise architecture into MITA enterprise planning, governance, and execution.'
        },
        'Policy Management': {
            'id': 'policy-management',
            'description': 'Systematic integration of policies into enterprise architecture, capability planning, and governance processes.'
        },
        'Strategic Planning': {
            'id': 'strategic-planning',
            'description': 'Formal integration of strategic planning into enterprise architecture, capability planning, and governance processes.'
        },
    })
    
    return ba_aspects, ea_aspects


def extract_criteria_sheet(ws, aspect_meta):
    """Extract aspects from an XLSX criteria sheet."""
    aspects = []
    current_dimension = None
    current_aspect = None
    
    for row in ws.iter_rows(min_row=2, max_row=ws.max_row, values_only=False):
        values = [str(cell.value).strip() if cell.value is not None else '' for cell in row]
        if not any(v for v in values):
            continue
        
        dimension_name = values[0]
        level_str = values[1].strip()
        description = values[2]
        evidence = values[3] if len(values) > 3 else ''
        question = values[4] if len(values) > 4 else ''
        
        if dimension_name and dimension_name != current_dimension:
            current_dimension = dimension_name
            meta = aspect_meta.get(dimension_name, {})
            current_aspect = {
                'id': meta.get('id', dimension_name.lower().replace(' ', '-')),
                'name': dimension_name,
                'description': meta.get('description', ''),
                'levels': {}
            }
            # Store the question as the aspect description if we have one
            if question:
                current_aspect['description'] = question
            aspects.append(current_aspect)
        
        if level_str and description and current_aspect is not None:
            # Parse level number
            level_num = level_str.replace('Level', '').strip()
            level_key = f'level{level_num}'
            
            # Parse evidence into list
            evidence_list = []
            if evidence:
                # Split by newlines and bullet points
                for line in evidence.split('\n'):
                    line = line.strip()
                    if line.startswith('•') or line.startswith('-'):
                        line = line[1:].strip()
                    if line:
                        evidence_list.append(line)
            
            # Question is the same for all levels of an aspect
            question_list = []
            if question:
                question_list = [question]
            
            current_aspect['levels'][level_key] = {
                'description': description,
                'questions': question_list,
                'evidence': evidence_list
            }
    
    return aspects


def extract_technology_from_docx():
    """Extract Technology criteria from DOCX tables."""
    doc = Document(DOCX_FILE)
    
    # Canonical names from Capability Reference Model
    canonical_names = {
        'Development, Testing, Release and Security Compliance': 'Development, Testing, Release, and Security Compliance',
        'User Interfaces and Session Management': 'User Interface and Session Management',
        'Identity, Access, and Consent ': 'Identity, Access, and Consent',
        'Security Protection and Monitoring ': 'Security Protection and Monitoring',
        'Development, Testing, Release and Security Compliance ': 'Development, Testing, Release, and Security Compliance',
    }
    
    def canonicalize(name):
        name = name.strip()
        return canonical_names.get(name, name)
    
    def name_to_id(name):
        """Convert aspect name to kebab-case ID."""
        return name.lower().replace(',', '').replace('&', 'and').replace('  ', ' ').replace(' ', '-')
    
    # Table 0: Infrastructure criteria, Table 1: Infrastructure Q&E
    # Table 2: Application criteria, Table 3: Application Q&E
    infra_criteria = extract_criteria_table(doc.tables[0], canonicalize)
    infra_qe = extract_qe_table(doc.tables[1], canonicalize)
    app_criteria = extract_criteria_table(doc.tables[2], canonicalize)
    app_qe = extract_qe_table(doc.tables[3], canonicalize)
    
    # Build infrastructure sub-dimension
    infra_aspects = build_tech_aspects(infra_criteria, infra_qe, name_to_id)
    app_aspects = build_tech_aspects(app_criteria, app_qe, name_to_id)
    
    return infra_aspects, app_aspects


def extract_criteria_table(table, canonicalize):
    """Extract criteria from a DOCX table."""
    rows_data = []
    for row_idx, row in enumerate(table.rows):
        if row_idx == 0:
            continue
        cells = [cell.text.strip() for cell in row.cells]
        parts = cells[0].split('\n', 1)
        name = canonicalize(parts[0])
        question = parts[1].strip() if len(parts) > 1 else ''
        
        levels = {}
        for level_num in range(1, 6):
            if level_num < len(cells):
                levels[level_num] = cells[level_num]
        
        rows_data.append({'name': name, 'question': question, 'levels': levels})
    return rows_data


def extract_qe_table(table, canonicalize):
    """Extract Q&E from a DOCX table."""
    rows_data = []
    for row_idx, row in enumerate(table.rows):
        if row_idx == 0:
            continue
        cells = [cell.text.strip() for cell in row.cells]
        name = canonicalize(cells[0])
        
        levels = {}
        for level_num in range(1, 6):
            cell_text = cells[level_num] if level_num < len(cells) else ''
            questions = []
            evidence = []
            current_type = None
            
            evidence_indicators = [
                'documentation', 'diagram', 'catalog', 'inventory',
                'architecture', 'report', 'log', 'checklist',
                'procedure', 'standard', 'metric', 'template',
                'artifact', 'sla', 'sop', 'planning', 'pattern',
                'schedule', 'results', 'rules', 'component',
                'configuration', 'workflow', 'testing', 'frontend',
                'monitoring', 'process doc', 'environment', 'service',
                'accessibility'
            ]
            
            for line in cell_text.split('\n'):
                line = line.strip()
                if not line:
                    continue
                if line.startswith('Q:'):
                    current_type = 'Q'
                    questions.append(line[2:].strip())
                elif line.startswith('E:'):
                    current_type = 'E'
                    text = line[2:].strip()
                    if text.startswith('E:'):
                        text = text[2:].strip()
                    evidence.append(text)
                elif current_type == 'Q':
                    lower = line.lower()
                    if any(ind in lower for ind in evidence_indicators) and not lower.startswith(('does', 'is', 'are', 'can', 'do', 'has', 'have', 'to what')):
                        current_type = 'E'
                        evidence.append(line)
                    else:
                        questions.append(line)
                elif current_type == 'E':
                    evidence.append(line)
                else:
                    evidence.append(line)
            
            levels[level_num] = {'questions': questions, 'evidence': evidence}
        
        rows_data.append({'name': name, 'levels': levels})
    return rows_data


def build_tech_aspects(criteria_data, qe_data, name_to_id):
    """Build aspect objects from criteria and Q&E data."""
    aspects = []
    for i, criteria in enumerate(criteria_data):
        qe = qe_data[i] if i < len(qe_data) else None
        
        aspect = {
            'id': name_to_id(criteria['name']),
            'name': criteria['name'],
            'description': criteria['question'],
            'levels': {}
        }
        
        for level_num in range(1, 6):
            level_key = f'level{level_num}'
            desc = criteria['levels'].get(level_num, '')
            
            q_list = []
            e_list = []
            if qe and level_num in qe['levels']:
                q_list = qe['levels'][level_num]['questions']
                e_list = qe['levels'][level_num]['evidence']
            
            aspect['levels'][level_key] = {
                'description': desc,
                'questions': q_list,
                'evidence': e_list
            }
        
        aspects.append(aspect)
    return aspects


def main():
    print("Loading current orbit-model.json...")
    current = load_current_model()
    
    print("Extracting BA and EA criteria from XLSX...")
    ba_aspects, ea_aspects = extract_ba_ea_from_xlsx()
    
    print("Extracting Technology criteria from DOCX...")
    infra_aspects, app_aspects = extract_technology_from_docx()
    
    # Build the new model
    new_model = {
        'version': '4.0',
        'lastUpdated': '2026-04-27',
        'source': 'MITA 4.0 Maturity Model - PRA Pilot Update (April 2026)',
        'maturityLevels': current['maturityLevels'],
        'dimensions': {
            'businessArchitecture': {
                'id': 'businessArchitecture',
                'name': 'Business Architecture',
                'description': 'The business processes performed to deliver the capability.',
                'required': True,
                'aspects': ba_aspects
            },
            'enterpriseArchitecture': {
                'id': 'enterpriseArchitecture',
                'name': 'Enterprise Architecture',
                'description': 'The enterprise-level planning, governance, and architectural frameworks that guide capability development.',
                'required': True,
                'aspects': ea_aspects
            },
            'information': current['dimensions']['information'],
            'technology': {
                'id': 'technology',
                'name': 'Technology',
                'description': 'The technology infrastructure and application architecture supporting the capability.',
                'required': True,
                'subDimensions': [
                    {
                        'id': 'technologyInfrastructureManagement',
                        'name': 'Technology Infrastructure Management',
                        'description': 'Assess the Technical Architecture maturity of the Medicaid Enterprise System (MES).',
                        'aspects': infra_aspects
                    },
                    {
                        'id': 'applicationManagement',
                        'name': 'Application Management',
                        'description': "Assess the Technical Architecture maturity of the application or module for a Domain/Area's capability.",
                        'aspects': app_aspects
                    }
                ]
            }
        },
        'organizationalAssessments': current['organizationalAssessments']
    }
    
    # Validate
    print("\n=== VALIDATION ===")
    ba_count = len(new_model['dimensions']['businessArchitecture']['aspects'])
    ea_count = len(new_model['dimensions']['enterpriseArchitecture']['aspects'])
    info_count = len(new_model['dimensions']['information']['aspects'])
    tech_count = sum(len(sd['aspects']) for sd in new_model['dimensions']['technology']['subDimensions'])
    tech_subdims = len(new_model['dimensions']['technology']['subDimensions'])
    outcomes_count = len(new_model['organizationalAssessments']['outcomes']['aspects'])
    roles_count = len(new_model['organizationalAssessments']['roles']['aspects'])
    
    print(f"Business Architecture: {ba_count} aspects (expected 5)")
    print(f"Enterprise Architecture: {ea_count} aspects (expected 4)")
    print(f"Information: {info_count} aspects (expected 11)")
    print(f"Technology: {tech_count} aspects across {tech_subdims} sub-dimensions (expected 11 across 2)")
    print(f"Outcomes: {outcomes_count} aspects (expected 6)")
    print(f"Roles: {roles_count} aspects (expected 6)")
    print(f"Total: {ba_count + ea_count + info_count + tech_count + outcomes_count + roles_count} (expected 43)")
    
    # Validate all aspects have 5 levels
    errors = []
    for dim_id, dim in new_model['dimensions'].items():
        if dim_id == 'technology':
            for sd in dim['subDimensions']:
                for aspect in sd['aspects']:
                    for lk in ['level1', 'level2', 'level3', 'level4', 'level5']:
                        if lk not in aspect['levels']:
                            errors.append(f"Technology/{sd['id']}/{aspect['id']} missing {lk}")
                        elif not aspect['levels'][lk]['description']:
                            errors.append(f"Technology/{sd['id']}/{aspect['id']}/{lk} has empty description")
        else:
            for aspect in dim['aspects']:
                for lk in ['level1', 'level2', 'level3', 'level4', 'level5']:
                    if lk not in aspect['levels']:
                        errors.append(f"{dim_id}/{aspect['id']} missing {lk}")
                    elif not aspect['levels'][lk]['description']:
                        errors.append(f"{dim_id}/{aspect['id']}/{lk} has empty description")
    
    if errors:
        print(f"\nERRORS ({len(errors)}):")
        for e in errors:
            print(f"  ✗ {e}")
    else:
        print("\n✓ All aspects have complete level definitions")
    
    # Validate Technology aspects have questions
    tech_with_q = 0
    tech_total = 0
    for sd in new_model['dimensions']['technology']['subDimensions']:
        for aspect in sd['aspects']:
            for lk in ['level1', 'level2', 'level3', 'level4', 'level5']:
                tech_total += 1
                if aspect['levels'][lk]['questions']:
                    tech_with_q += 1
    print(f"Technology levels with questions: {tech_with_q}/{tech_total}")
    
    # Write output
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(new_model, f, indent=2, ensure_ascii=False)
    
    print(f"\nWritten to {OUTPUT_FILE}")
    
    # Count lines
    with open(OUTPUT_FILE, 'r') as f:
        lines = f.readlines()
    print(f"File size: {len(lines)} lines")


if __name__ == '__main__':
    main()
