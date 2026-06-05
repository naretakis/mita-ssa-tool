#!/usr/bin/env python3
"""
Extract content from the MITA 4 Maturity Model Guide DOCX file.
This file contains Technology maturity criteria and questions in table format.
Structure: 4 tables (2 criteria tables + 2 Q&E tables) for 2 sections:
  - Technology Infrastructure Management (Tables 0, 1)
  - Application Management (Tables 2, 3)
"""

import os
from docx import Document

INPUT_FILE = 'docs/source-documents/2026-04-26/MITA 4 Maturity Model Guide_Pilot-TA Subgroup Update-0426.docx'
OUTPUT_DIR = 'docs/source-documents/2026-04-26/extracted'


def clean_text(text):
    """Clean up text from DOCX cells."""
    if not text:
        return ''
    # Normalize whitespace but preserve intentional newlines
    lines = text.strip().split('\n')
    cleaned = '\n'.join(line.strip() for line in lines)
    return cleaned


def extract_criteria_table(table, section_name):
    """Extract a criteria table (Aspect x Level matrix)."""
    rows_data = []
    
    for row_idx, row in enumerate(table.rows):
        if row_idx == 0:
            # Header row - verify structure
            headers = [clean_text(cell.text) for cell in row.cells]
            continue
        
        cells = [clean_text(cell.text) for cell in row.cells]
        aspect_text = cells[0]
        
        # Split aspect name from description (separated by newline)
        parts = aspect_text.split('\n', 1)
        aspect_name = parts[0].strip()
        aspect_question = parts[1].strip() if len(parts) > 1 else ''
        
        levels = {}
        for level_num in range(1, 6):
            levels[level_num] = cells[level_num] if level_num < len(cells) else ''
        
        rows_data.append({
            'name': aspect_name,
            'question': aspect_question,
            'levels': levels
        })
    
    return rows_data


def extract_qe_table(table, section_name):
    """Extract a Questions & Evidence table."""
    rows_data = []
    
    for row_idx, row in enumerate(table.rows):
        if row_idx == 0:
            continue  # Skip header
        
        cells = [clean_text(cell.text) for cell in row.cells]
        aspect_name = cells[0].strip()
        
        levels = {}
        for level_num in range(1, 6):
            cell_text = cells[level_num] if level_num < len(cells) else ''
            # Parse Q: and E: pairs
            questions = []
            evidence = []
            current_type = None
            
            for line in cell_text.split('\n'):
                line = line.strip()
                if not line:
                    continue
                if line.startswith('Q:'):
                    current_type = 'Q'
                    questions.append(line[2:].strip())
                elif line.startswith('E:'):
                    current_type = 'E'
                    # Handle "E: E:" typo pattern
                    text = line[2:].strip()
                    if text.startswith('E:'):
                        text = text[2:].strip()
                    evidence.append(text)
                elif current_type == 'Q':
                    # Check if this looks like evidence (no Q: prefix, follows a question)
                    # Heuristic: if it doesn't start with a question word and contains
                    # document/artifact-like terms, treat as evidence
                    lower = line.lower()
                    evidence_indicators = ['documentation', 'diagram', 'catalog', 'inventory',
                                          'architecture', 'report', 'log', 'checklist',
                                          'procedure', 'standard', 'metric', 'template',
                                          'artifact', 'sla', 'sop']
                    if any(ind in lower for ind in evidence_indicators) and not lower.startswith(('does', 'is', 'are', 'can', 'do', 'has', 'have', 'to what')):
                        current_type = 'E'
                        evidence.append(line)
                    else:
                        questions.append(line)
                elif current_type == 'E':
                    evidence.append(line)
                else:
                    # Lines without Q:/E: prefix - treat as evidence if it looks like it
                    evidence.append(line)
            
            levels[level_num] = {
                'questions': questions,
                'evidence': evidence
            }
        
        rows_data.append({
            'name': aspect_name,
            'levels': levels
        })
    
    return rows_data


def write_section_markdown(f, section_name, section_desc, criteria_data, qe_data):
    """Write a complete section to markdown."""
    f.write(f"## {section_name}\n\n")
    f.write(f"{section_desc}\n\n")
    
    aspect_count = 0
    for i, criteria in enumerate(criteria_data):
        aspect_count += 1
        f.write(f"### {criteria['name']}\n\n")
        if criteria['question']:
            f.write(f"**Aspect Question:** {criteria['question']}\n\n")
        
        # Find matching Q&E data
        qe = None
        if i < len(qe_data):
            qe = qe_data[i]
        
        for level_num in range(1, 6):
            level_names = {1: 'Initial', 2: 'Developing', 3: 'Defined', 4: 'Managed', 5: 'Optimized'}
            f.write(f"#### Level {level_num}: {level_names[level_num]}\n\n")
            
            desc = criteria['levels'].get(level_num, '')
            if desc:
                f.write(f"**Description:** {desc}\n\n")
            
            if qe and level_num in qe['levels']:
                qe_level = qe['levels'][level_num]
                if qe_level['questions']:
                    f.write("**Questions:**\n")
                    for q in qe_level['questions']:
                        f.write(f"- {q}\n")
                    f.write("\n")
                if qe_level['evidence']:
                    f.write("**Evidence:**\n")
                    for e in qe_level['evidence']:
                        f.write(f"- {e}\n")
                    f.write("\n")
    
    return aspect_count


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print(f"Loading: {INPUT_FILE}")
    doc = Document(INPUT_FILE)
    
    print(f"Paragraphs: {len(doc.paragraphs)}")
    print(f"Tables: {len(doc.tables)}")
    
    # Extract section info from paragraphs
    sections = []
    for p in doc.paragraphs:
        if p.style.name == 'Heading 1' and p.text.strip():
            sections.append(p.text.strip())
    
    print(f"Sections found: {sections}")
    
    # Table mapping:
    # Table 0: Technology Infrastructure Management - Criteria
    # Table 1: Technology Infrastructure Management - Questions & Evidence
    # Table 2: Application Management - Criteria
    # Table 3: Application Management - Questions & Evidence
    
    infra_criteria = extract_criteria_table(doc.tables[0], "Technology Infrastructure Management")
    infra_qe = extract_qe_table(doc.tables[1], "Technology Infrastructure Management")
    app_criteria = extract_criteria_table(doc.tables[2], "Application Management")
    app_qe = extract_qe_table(doc.tables[3], "Application Management")
    
    output_path = os.path.join(OUTPUT_DIR, 'Technology_Maturity_Criteria.md')
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("# Technology Maturity Criteria\n\n")
        f.write(f"Extracted from: {os.path.basename(INPUT_FILE)}\n\n")
        
        infra_count = write_section_markdown(
            f, 
            "Technology Infrastructure Management",
            "Assess the Technical Architecture maturity of the Medicaid Enterprise System (MES).",
            infra_criteria, infra_qe
        )
        
        app_count = write_section_markdown(
            f,
            "Application Management",
            "Assess the Technical Architecture maturity of the application or module for a Domain/Area's capability.",
            app_criteria, app_qe
        )
    
    print(f"\n=== VALIDATION ===")
    print(f"Technology Infrastructure Management: {infra_count} aspects x 5 levels = {infra_count * 5} entries")
    print(f"Application Management: {app_count} aspects x 5 levels = {app_count * 5} entries")
    print(f"Total Technology aspects: {infra_count + app_count}")
    
    # Cross-validate aspect names match between criteria and Q&E tables
    print(f"\n=== ASPECT NAME CROSS-VALIDATION ===")
    for i, (c, q) in enumerate(zip(infra_criteria, infra_qe)):
        match = "✓" if c['name'] == q['name'] else f"✗ ({c['name']} vs {q['name']})"
        print(f"  Infra [{i}]: {match}")
    for i, (c, q) in enumerate(zip(app_criteria, app_qe)):
        match = "✓" if c['name'] == q['name'] else f"✗ ({c['name']} vs {q['name']})"
        print(f"  App [{i}]: {match}")
    
    print(f"\nOutput: {output_path}")


if __name__ == '__main__':
    main()
