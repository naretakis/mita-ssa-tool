#!/usr/bin/env python3
"""
Update capabilities.json - replace the Technical domain's categories and areas.
All other domains remain unchanged.
"""

import json
from docx import Document

CAPABILITIES_FILE = 'src/data/capabilities.json'
DOCX_FILE = 'docs/source-documents/2026-04-26/MITA 4.0 Capability Reference Model Document for MGB-TA Subgroup Update-0426.docx'


def name_to_id(name):
    """Convert area name to kebab-case ID."""
    return name.lower().replace(',', '').replace('&', 'and').replace('  ', ' ').replace(' ', '-')


def extract_technical_areas():
    """Extract the new Technical domain areas from the Capability Reference Model DOCX."""
    doc = Document(DOCX_FILE)
    table = doc.tables[0]
    
    categories = []
    current_category = None
    
    for row in table.rows[1:]:
        name = row.cells[0].text.strip()
        definition = row.cells[1].text.strip()
        topics_text = row.cells[2].text.strip()
        
        if not name:
            continue
        
        # Category header: name matches definition and topics, or definition/topics are empty
        if (name == definition == topics_text) or (not definition and not topics_text):
            current_category = {
                'id': name_to_id(name),
                'name': name,
                'description': '',  # Will be set from first area or left empty
                'areas': []
            }
            categories.append(current_category)
            continue
        
        # Regular area
        topic_list = [t.strip() for t in topics_text.split('\n') if t.strip()]
        
        area = {
            'id': name_to_id(name),
            'name': name,
            'description': definition,
            'topics': topic_list
        }
        
        if current_category:
            current_category['areas'].append(area)
    
    return categories


def main():
    print("Loading capabilities.json...")
    with open(CAPABILITIES_FILE, 'r') as f:
        caps = json.load(f)
    
    print("Extracting new Technical domain areas from DOCX...")
    new_categories = extract_technical_areas()
    
    # Find and replace the technical domain
    for i, domain in enumerate(caps['domains']):
        if domain['id'] == 'technical':
            print(f"Found technical domain at index {i}")
            print(f"  Old: {len(domain.get('categories', []))} categories")
            old_area_count = sum(len(c['areas']) for c in domain.get('categories', []))
            print(f"  Old areas: {old_area_count}")
            
            # Replace categories
            domain['categories'] = new_categories
            new_area_count = sum(len(c['areas']) for c in new_categories)
            print(f"  New: {len(new_categories)} categories")
            print(f"  New areas: {new_area_count}")
            
            for cat in new_categories:
                print(f"    {cat['id']}: {cat['name']} ({len(cat['areas'])} areas)")
                for area in cat['areas']:
                    print(f"      {area['id']}: {area['name']} ({len(area['topics'])} topics)")
            break
    
    # Update version and date
    caps['lastUpdated'] = '2026-04-27'
    
    # Count total areas
    total_areas = 0
    for domain in caps['domains']:
        if 'categories' in domain and domain['categories']:
            for cat in domain['categories']:
                total_areas += len(cat['areas'])
        elif 'areas' in domain and domain['areas']:
            total_areas += len(domain['areas'])
    
    print(f"\nTotal capability areas: {total_areas} (was 75, expected 64)")
    
    # Write output
    with open(CAPABILITIES_FILE, 'w') as f:
        json.dump(caps, f, indent=2, ensure_ascii=False)
    
    print(f"Written to {CAPABILITIES_FILE}")


if __name__ == '__main__':
    main()
