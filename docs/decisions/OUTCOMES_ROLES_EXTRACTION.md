# Outcomes & Roles Extraction - Implementation Specification

> **Historical record (v2.1.0):** This document captures the spec for the v2.1.0 release. It is preserved for traceability and is no longer the current state of the model — see [`CHANGELOG.md`](../../CHANGELOG.md) for the current release.

**Created:** January 30, 2026  
**Status:** Implemented in v2.1.0

---

## Overview

This document specifies changes to extract the Outcomes and Roles dimensions from capability-level assessments and reposition them as organizational-level capability areas within a new Support Layer domain called "Enterprise Governance."

### Key Insight

Outcomes and Roles maturity questions are not specific to individual capability areas - they assess organizational maturity at the enterprise level. Therefore:

1. **Remove O&R from capability assessments** - All capability areas (Strategic, Core, Support) will only assess B-I-T dimensions
2. **Create new Enterprise Governance domain** - Contains two capability areas: Organizational Outcomes and Organizational Roles
3. **Direct aspect assessment** - These new capability areas are assessed directly at the aspect level (6 aspects each), not through the ORBIT dimension framework

### Conceptual Model

| Assessment Type                  | What's Assessed              | Dimensions/Aspects                |
| -------------------------------- | ---------------------------- | --------------------------------- |
| Standard capability area         | Business capability maturity | B-I-T (3 dimensions, ~40 aspects) |
| Enterprise Data Management areas | Enterprise data capabilities | B-T (aggregate I)                 |
| Enterprise Technology areas      | Enterprise tech capabilities | B-I (aggregate T)                 |
| Organizational Outcomes          | Enterprise outcomes maturity | 6 Outcomes aspects directly       |
| Organizational Roles             | Enterprise roles maturity    | 6 Roles aspects directly          |

---

## Summary of Changes

| #   | Change                           | Description                                                     |
| --- | -------------------------------- | --------------------------------------------------------------- |
| 1   | Add Enterprise Governance domain | New Support Layer domain with 2 capability areas                |
| 2   | Remove O&R from ORBIT dimensions | Outcomes and Roles no longer assessed per capability            |
| 3   | Update Enterprise domains        | Enterprise Data Management and Enterprise Technology drop O&R   |
| 4   | Dashboard layer grouping         | Visual separation of Strategic, Core, and Support layers        |
| 5   | Special assessment mode          | Organizational Outcomes/Roles assessed directly at aspect level |

---

## Detailed Specifications

### 1. New Domain: Enterprise Governance

**Domain Definition (to add to `capabilities.json`):**

```json
{
  "id": "enterprise-governance",
  "name": "Enterprise Governance",
  "layer": "support",
  "description": "The Enterprise Governance domain assesses organizational maturity in defining outcomes and managing roles across the Medicaid enterprise. These capabilities apply at the organizational level rather than to specific business functions.",
  "areas": [
    {
      "id": "organizational-outcomes",
      "name": "Organizational Outcomes",
      "description": "Assesses the organization's maturity in defining, tracking, and achieving desired outcomes across the Medicaid enterprise. Covers culture, capability, quality, alignment, metrics, and reusability of outcome practices.",
      "topics": [
        "Culture & Mindset",
        "Outcome Development Capability",
        "Quality & Consistency",
        "Goal Alignment",
        "Metrics & Measurement",
        "Reusability & Integration"
      ]
    },
    {
      "id": "organizational-roles",
      "name": "Organizational Roles",
      "description": "Assesses the organization's maturity in managing roles, resources, governance, and capacity across the Medicaid enterprise. Covers technology resources, goal alignment, governance, communication, leadership, and staffing.",
      "topics": [
        "Technology Resources",
        "Organizational Goals Alignment",
        "Governance & Standardization",
        "Communication",
        "Culture & Leadership",
        "Resourcing Capacity"
      ]
    }
  ]
}
```

**Files affected:**

- `src/data/capabilities.json` - Add new domain at end of domains array

---

### 2. Remove Outcomes & Roles from ORBIT Dimensions

**Current State:**

- `OrbitDimensionId` type includes: `'outcomes' | 'roles' | 'businessArchitecture' | 'information' | 'technology'`
- `orbit-model.json` has 5 dimensions in `dimensions` object
- Assessment sidebar shows all 5 dimensions (O, R, B, I, T)

**New State:**

- `OrbitDimensionId` type: `'businessArchitecture' | 'information' | 'technology'` (3 dimensions)
- `orbit-model.json` moves O&R to new `organizationalAssessments` section
- Assessment sidebar shows only B, I, T for standard capabilities

**Changes to `orbit-model.json`:**

```json
{
  "version": "4.0",
  "lastUpdated": "2026-01-30",
  "source": "...",
  "maturityLevels": { ... },
  "dimensions": {
    "businessArchitecture": { ... },
    "information": { ... },
    "technology": { ... }
  },
  "organizationalAssessments": {
    "outcomes": {
      "id": "outcomes",
      "name": "Organizational Outcomes",
      "description": "The definition of the desired outcomes that require the capability to be achieved.",
      "capabilityAreaId": "organizational-outcomes",
      "aspects": [
        // Same 6 aspects currently in outcomes dimension
        // (culture-mindset, capability, quality-consistency, alignment-goals-priorities, use-of-metrics, reusability-integration)
      ]
    },
    "roles": {
      "id": "roles",
      "name": "Organizational Roles",
      "description": "The individual roles responsible for providing the capability.",
      "capabilityAreaId": "organizational-roles",
      "aspects": [
        // Same 6 aspects currently in roles dimension
        // (technology-resources, organizational-goals-alignment, governance-standardization, communication, culture-leadership, resourcing-capacity)
      ]
    }
  }
}
```

**Files affected:**

- `src/data/orbit-model.json` - Restructure dimensions, add organizationalAssessments
- `src/types/index.ts` - Update `OrbitDimensionId` type, add organizational types

---

### 3. Update Enterprise Domains (Data Management & Technology)

**Current Assessment Models:**

- Enterprise Data Management: O-R-B-T (aggregate I)
- Enterprise Technology: O-R-B-I (aggregate T)

**New Assessment Models:**

- Enterprise Data Management: B-T (aggregate I)
- Enterprise Technology: B-I (aggregate T)

Since O&R are removed from all capability assessments, enterprise domains automatically lose them too. No special configuration needed beyond removing O&R from the dimension list.

**Files affected:**

- `src/pages/Assessment.tsx` - `buildNavItems()` function no longer includes O&R
- `src/components/assessment/AssessmentSidebar.tsx` - No O&R in dimension list
- `src/services/orbit.ts` - Update `getAllDimensionIds()`, `getRequiredDimensionIds()`

---

### 4. Dashboard Layer Grouping

**Current:** All 14 domains displayed in a flat list

**New:** Domains grouped by layer with visual section headers

```
┌─────────────────────────────────────────────────────────────────┐
│ STRATEGIC LAYER (2 domains)                                     │
├─────────────────────────────────────────────────────────────────┤
│ ▶ Plan and Policy Management                                    │
│ ▶ Strategy and Planning Management                              │
├─────────────────────────────────────────────────────────────────┤
│ CORE LAYER (8 domains)                                          │
├─────────────────────────────────────────────────────────────────┤
│ ▶ Business Relationship Management                              │
│ ▶ Care and Service Coordination                                 │
│ ▶ Claims and Encounter Management                               │
│ ▶ Contract Management                                           │
│ ▶ Financial Management                                          │
│ ▶ Member Management                                             │
│ ▶ Pharmacy Management                                           │
│ ▶ Provider Management                                           │
├─────────────────────────────────────────────────────────────────┤
│ SUPPORT LAYER (5 domains)                                       │
├─────────────────────────────────────────────────────────────────┤
│ ▶ Compliance Management                                         │
│ ▶ Communication Management                                      │
│ ▶ Enterprise Data Management                                    │
│ ▶ Enterprise Technology                                         │
│ ▶ Enterprise Governance                              ← NEW      │
└─────────────────────────────────────────────────────────────────┘
```

**Implementation approach:**

- Group domains by `domain.layer` property
- Render layer headers between groups
- Use existing `getDomainsByLayer()` helper from `capabilities.ts`

**Files affected:**

- `src/components/dashboard/DomainTable.tsx` - Add layer grouping logic and headers

---

### 5. Special Assessment Mode for Enterprise Governance

**Standard Capability Assessment Flow:**

1. User selects capability area from dashboard
2. Assessment page loads with sidebar showing dimensions (B, I, T)
3. User clicks dimension → sees aspects for that dimension
4. User rates each aspect via AspectCard component

**Organizational Assessment Flow (Outcomes/Roles):**

1. User selects "Organizational Outcomes" or "Organizational Roles" from dashboard
2. Assessment page loads with sidebar showing the 6 aspects directly (no dimension layer)
3. User clicks aspect → sees AspectCard for that aspect
4. User rates the aspect (same UI as standard AspectCard)

**Key insight:** The AspectCard component already handles everything needed:

- Maturity level selector (1-5, N/A)
- Level descriptions
- Questions and evidence checklists
- Notes, barriers, plans text fields
- Attachments

The only difference is the navigation structure - aspects are shown directly in the sidebar instead of being nested under dimensions.

**UI Design:**

Assessment Sidebar for Organizational Outcomes:

```
┌─────────────────────────────────────────────────────────────────┐
│ Progress: 50%                                    Avg: 3.2       │
├─────────────────────────────────────────────────────────────────┤
│ ASPECT                                      PROG    SCORE       │
├─────────────────────────────────────────────────────────────────┤
│ Culture & Mindset                           ✓       3           │
│ Capability                                  ✓       2           │
│ Quality & Consistency                       ✓       3           │
│ Alignment to Goals & Priorities             0/1     —           │
│ Use of Metrics                              0/1     —           │
│ Reusability & Integration                   0/1     —           │
├─────────────────────────────────────────────────────────────────┤
│ [Review & Finalize]                                             │
└─────────────────────────────────────────────────────────────────┘
```

**Files affected:**

- `src/pages/Assessment.tsx` - Detect organizational assessment, build different nav items
- `src/components/assessment/AssessmentSidebar.tsx` - Handle aspect-level navigation
- `src/hooks/useOrbitRatings.ts` - Handle organizational ratings (reuse existing structure)

---

## Type System Changes

### OrbitDimensionId (Updated)

```typescript
// BEFORE
export type OrbitDimensionId =
  | 'outcomes'
  | 'roles'
  | 'businessArchitecture'
  | 'information'
  | 'technology';

// AFTER
export type OrbitDimensionId = 'businessArchitecture' | 'information' | 'technology';
```

### New Types

```typescript
/**
 * Organizational assessment type IDs
 */
export type OrganizationalAssessmentId = 'outcomes' | 'roles';

/**
 * Organizational assessment definition (from orbit-model.json)
 */
export interface OrganizationalAssessmentDefinition {
  id: OrganizationalAssessmentId;
  name: string;
  description: string;
  capabilityAreaId: string;
  aspects: OrbitAspect[]; // Reuses existing OrbitAspect type
}

/**
 * Updated OrbitModel interface
 */
export interface OrbitModel {
  version: string;
  lastUpdated: string;
  source: string;
  maturityLevels: { ... };
  dimensions: {
    businessArchitecture: OrbitDimension;
    information: OrbitDimension;
    technology: TechnologyDimension;
  };
  organizationalAssessments: {
    outcomes: OrganizationalAssessmentDefinition;
    roles: OrganizationalAssessmentDefinition;
  };
}
```

### OrbitRating Storage Strategy

**Decision:** Reuse the existing `OrbitRating` table and interface.

For organizational assessments:

- `dimensionId` field stores `'outcomes'` or `'roles'` (even though these are no longer in `OrbitDimensionId` type)
- `subDimensionId` is not used (undefined)
- `aspectId` stores the aspect ID (e.g., `'culture-mindset'`)
- All other fields work the same (currentLevel, targetLevel, notes, etc.)

**Rationale:**

- Minimal database schema changes
- Reuses existing hooks and services
- AspectCard component works unchanged
- Export/import logic can handle both types

**Type handling:**

- Create a union type for storage: `type RatingDimensionId = OrbitDimensionId | OrganizationalAssessmentId`
- Or use string type for `dimensionId` in database operations and validate at runtime

```typescript
// In OrbitRating interface, change dimensionId type for flexibility
export interface OrbitRating {
  id: string;
  capabilityAssessmentId: string;
  dimensionId: string; // Was OrbitDimensionId, now allows 'outcomes' | 'roles' too
  subDimensionId?: TechnologySubDimensionId;
  aspectId: string;
  // ... rest unchanged
}
```

---

## Configuration Updates

### Constants (`src/constants/index.ts`)

```typescript
/**
 * Domain ID for Enterprise Governance (organizational assessments).
 */
export const ENTERPRISE_GOVERNANCE_DOMAIN_ID = 'enterprise-governance';

/**
 * Capability area IDs that use organizational assessment mode.
 * These areas assess Outcomes/Roles aspects directly, not through ORBIT dimensions.
 */
export const ORGANIZATIONAL_ASSESSMENT_AREAS: Record<string, OrganizationalAssessmentId> = {
  'organizational-outcomes': 'outcomes',
  'organizational-roles': 'roles',
};

/**
 * Check if a capability area uses organizational assessment mode.
 */
export function isOrganizationalAssessmentArea(areaId: string): boolean {
  return areaId in ORGANIZATIONAL_ASSESSMENT_AREAS;
}

/**
 * Get the organizational assessment type for a capability area.
 */
export function getOrganizationalAssessmentType(areaId: string): OrganizationalAssessmentId | null {
  return ORGANIZATIONAL_ASSESSMENT_AREAS[areaId] ?? null;
}
```

### Service Updates (`src/services/orbit.ts`)

```typescript
/**
 * Get all ORBIT dimension IDs (B, I, T only - O&R removed)
 */
export function getAllDimensionIds(): OrbitDimensionId[] {
  return ['businessArchitecture', 'information', 'technology'];
}

/**
 * Get required dimension IDs (all 3 are required for standard assessments)
 */
export function getRequiredDimensionIds(): OrbitDimensionId[] {
  return ['businessArchitecture', 'information', 'technology'];
}

/**
 * Get optional dimension IDs (none - O&R removed)
 */
export function getOptionalDimensionIds(): OrbitDimensionId[] {
  return [];
}

/**
 * Get organizational assessment definition by type
 */
export function getOrganizationalAssessment(
  type: OrganizationalAssessmentId
): OrganizationalAssessmentDefinition {
  return orbitModel.organizationalAssessments[type];
}

/**
 * Get aspects for an organizational assessment
 */
export function getOrganizationalAspects(type: OrganizationalAssessmentId): OrbitAspect[] {
  return orbitModel.organizationalAssessments[type].aspects;
}

/**
 * Get total aspect count for organizational assessments
 */
export function getOrganizationalAspectCount(type: OrganizationalAssessmentId): number {
  return orbitModel.organizationalAssessments[type].aspects.length; // 6
}
```

---

## Scoring Rules

### Standard Capability Score (B-I-T)

```
Capability Score = Average of (B, I, T) dimension scores
```

- N/A (-1) and unassessed (0) aspects excluded from averages
- Rounded to 1 decimal place
- If all aspects in a dimension are N/A or unassessed, that dimension is excluded

### Enterprise Data Management Score

```
Capability Score = Average of (B, I-aggregate, T) dimension scores
```

- I-aggregate calculated from all finalized non-enterprise assessments
- If no aggregate data available, I is excluded from average

### Enterprise Technology Score

```
Capability Score = Average of (B, I, T-aggregate) dimension scores
```

- T-aggregate calculated from all finalized non-enterprise assessments
- If no aggregate data available, T is excluded from average

### Organizational Outcomes/Roles Score

```
Capability Score = Average of 6 aspect scores
```

- Same N/A and unassessed exclusion rules
- Rounded to 1 decimal place
- Completion = aspects rated (excluding N/A) / 6

### Overall Organization Score

```
Overall Score = Average of all finalized capability area scores
```

- Includes all standard capability areas (B-I-T scores)
- Includes enterprise domain capability areas
- Includes Organizational Outcomes and Organizational Roles scores
- All capability areas weighted equally

---

## Assessment Page Logic

### Detecting Assessment Type

```typescript
// In Assessment.tsx
const isOrganizationalAssessment = useMemo(() => {
  if (!assessment) return false;
  return isOrganizationalAssessmentArea(assessment.capabilityAreaId);
}, [assessment]);

const organizationalType = useMemo(() => {
  if (!assessment) return null;
  return getOrganizationalAssessmentType(assessment.capabilityAreaId);
}, [assessment]);
```

### Building Navigation Items

```typescript
function buildNavItems(domainId: string | undefined, areaId: string | undefined): NavItem[] {
  // Check if this is an organizational assessment
  const orgType = areaId ? getOrganizationalAssessmentType(areaId) : null;

  if (orgType) {
    // Organizational assessment - show aspects directly
    const aspects = getOrganizationalAspects(orgType);
    return aspects.map((aspect) => ({
      type: 'organizational-aspect',
      organizationalType: orgType,
      aspectId: aspect.id,
      name: aspect.name,
      description: aspect.description,
      isRequired: true,
      aspectCount: 1, // Each nav item is one aspect
    }));
  }

  // Standard assessment - show dimensions (B, I, T)
  const items: NavItem[] = [];
  const aggregatedDimension = domainId ? getAggregatedDimensionForDomain(domainId) : null;

  // Only B, I, T dimensions (no O, R)
  for (const dimId of ['businessArchitecture', 'information', 'technology'] as const) {
    // ... existing logic for dimensions
  }

  return items;
}
```

### Sidebar Rendering

The AssessmentSidebar component needs to handle two modes:

1. **Dimension mode** (standard assessments): Shows B, I, T with Technology sub-dimensions
2. **Aspect mode** (organizational assessments): Shows 6 aspects directly

```typescript
// In AssessmentSidebar.tsx
interface AssessmentSidebarProps {
  // ... existing props
  isOrganizationalAssessment?: boolean;
}

// Render logic
{isOrganizationalAssessment ? (
  // Render aspects directly (similar to how sub-dimensions are rendered)
  dimensions.map(dim => (
    <ListItemButton
      key={dim.aspectId}
      selected={currentAspectId === dim.aspectId}
      onClick={() => onAspectSelect(dim.aspectId)}
    >
      {/* Aspect name, progress (0/1 or 1/1), score */}
    </ListItemButton>
  ))
) : (
  // Existing dimension rendering logic
)}
```

---

## Export/Import Considerations

### CSV Export

**Standard capability areas:**

```csv
Capability Area,Domain,Status,Overall Score
Health Plan Administration,Plan and Policy Management,Finalized,3.5

ORBIT,As Is,To Be,Notes
Business Architecture,3.2,4.0,Notes here
Information,3.5,4.0,
Technology,3.8,4.5,
```

**Organizational assessments:**

```csv
Capability Area,Domain,Status,Overall Score
Organizational Outcomes,Enterprise Governance,Finalized,3.2

Aspect,As Is,To Be,Notes
Culture & Mindset,3,4,Notes here
Capability,2,3,
Quality & Consistency,3,4,
Alignment to Goals & Priorities,4,5,
Use of Metrics,3,4,
Reusability & Integration,4,4,
```

### JSON Export

```json
{
  "assessment": {
    "capabilityAreaId": "organizational-outcomes",
    "capabilityDomainId": "enterprise-governance",
    "isOrganizationalAssessment": true,
    "organizationalType": "outcomes"
  },
  "ratings": [
    {
      "dimensionId": "outcomes",
      "aspectId": "culture-mindset",
      "currentLevel": 3,
      "targetLevel": 4
    }
  ]
}
```

### Import Backwards Compatibility

- Old exports with O&R dimension ratings in standard assessments: **Skip** (orphaned data)
- New exports with organizational assessments: Import normally
- No migration needed since we're starting fresh

---

## Implementation Order

### Phase 1: Data Model Changes

1. Update `src/data/capabilities.json` - Add Enterprise Governance domain
2. Update `src/data/orbit-model.json` - Move O&R to organizationalAssessments, remove from dimensions
3. Update `src/types/index.ts` - Update OrbitDimensionId, add organizational types, update OrbitModel
4. Update `src/constants/index.ts` - Add organizational assessment configuration

### Phase 2: Service Layer

1. Update `src/services/orbit.ts`:
   - Update `getAllDimensionIds()` to return only B, I, T
   - Update `getRequiredDimensionIds()` and `getOptionalDimensionIds()`
   - Add `getOrganizationalAssessment()`, `getOrganizationalAspects()`
2. Update `src/services/capabilities.ts`:
   - Add `isOrganizationalAssessmentArea()`, `getOrganizationalAssessmentType()`
3. Update `src/hooks/useOrbitRatings.ts`:
   - Handle organizational assessment ratings (dimensionId = 'outcomes' | 'roles')
4. Update `src/hooks/useScores.ts`:
   - Update scoring for 3-dimension model
   - Handle organizational assessment scores
5. Update `src/services/scoring.ts`:
   - Add `calculateOrganizationalScore()` function

### Phase 3: Dashboard Layer Grouping

1. Update `src/components/dashboard/DomainTable.tsx`:
   - Group domains by layer
   - Add layer section headers
   - Style layer headers appropriately

### Phase 4: Assessment UI

1. Update `src/pages/Assessment.tsx`:
   - Detect organizational assessment mode
   - Build appropriate nav items (aspects vs dimensions)
   - Route to correct content view
2. Update `src/components/assessment/AssessmentSidebar.tsx`:
   - Handle aspect-level navigation for organizational assessments
   - Reuse existing progress/score display logic
3. Verify `src/components/assessment/AspectCard.tsx` works unchanged
4. Verify `src/components/assessment/DimensionPage.tsx` works for organizational assessments

### Phase 5: Export/Import

1. Update `src/services/export/csvExport.ts`:
   - Handle organizational assessments (aspects instead of dimensions)
2. Update `src/services/export/pdfExport.ts`:
   - Handle organizational assessments
3. Update `src/services/export/exportService.ts`:
   - Add organizational assessment metadata
4. Update `src/services/export/importService.ts`:
   - Handle organizational assessment imports
   - Skip orphaned O&R data from old exports

### Phase 6: Tests & Documentation

1. Update test files:
   - `src/services/orbit.test.ts`
   - `src/services/capabilities.test.ts`
   - `src/hooks/useScores.test.ts`
   - `src/hooks/useOrbitRatings.test.ts`
   - `src/services/export/*.test.ts`
2. Update `scripts/generate-test-import.js`
3. Update `PROJECT_FOUNDATION_v2.md`
4. Update `CHANGELOG.md`

### Phase 7: Results (Deferred)

- Results visualization changes deferred to separate effort
- Current results pages may show incomplete data for organizational assessments

---

## Migration & Backwards Compatibility

**Decision:** No migration needed - users can start fresh.

- Existing assessments with O&R ratings will be orphaned (ignored in scoring)
- Import of old exports will skip O&R dimension data for standard assessments
- No database schema migration required
- Clear IndexedDB if needed for clean slate

---

## Testing Checklist

### Data Model

- [ ] Enterprise Governance domain appears in capabilities.json
- [ ] Organizational Outcomes and Roles areas exist with correct topics
- [ ] O&R removed from OrbitDimensionId type
- [ ] organizationalAssessments structure in orbit-model.json
- [ ] TypeScript compiles without errors

### Dashboard

- [ ] Domains grouped by layer (Strategic, Core, Support)
- [ ] Layer headers display with domain counts
- [ ] Enterprise Governance domain appears in Support layer
- [ ] Organizational Outcomes/Roles areas expandable under Enterprise Governance
- [ ] Search and tag filtering work across all layers

### Assessment - Standard Capabilities

- [ ] Only B-I-T dimensions shown in sidebar
- [ ] O&R no longer appear
- [ ] Technology sub-dimensions still work
- [ ] Aggregate dimensions still work for enterprise domains
- [ ] Scoring uses 3 dimensions only

### Assessment - Organizational Outcomes

- [ ] 6 aspects shown directly in sidebar
- [ ] Each aspect clickable, shows AspectCard
- [ ] Maturity level selector works (1-5, N/A)
- [ ] Level descriptions display correctly
- [ ] Questions and evidence checklists work
- [ ] Notes, barriers, plans auto-save
- [ ] Attachments upload/delete work
- [ ] Progress shows X/6 aspects rated
- [ ] Score calculated from 6 aspects
- [ ] Finalization works

### Assessment - Organizational Roles

- [ ] Same as Organizational Outcomes checklist

### Scoring

- [ ] Standard capability score = avg(B, I, T)
- [ ] Enterprise Data Management score includes aggregate I
- [ ] Enterprise Technology score includes aggregate T
- [ ] Organizational Outcomes score = avg(6 aspects)
- [ ] Organizational Roles score = avg(6 aspects)
- [ ] Overall score includes all capability areas equally

### Export

- [ ] CSV shows only B-I-T for standard capabilities
- [ ] CSV shows aspects for organizational assessments
- [ ] PDF reflects new structure
- [ ] JSON includes organizational assessment metadata

### Import

- [ ] Can import new organizational assessment exports
- [ ] Old exports with O&R data: O&R ratings skipped, rest imported

---

## Open Questions (Resolved)

1. **Aspect card reuse:** ✅ Yes, reuse existing AspectCard unchanged
2. **Results visualization:** ✅ Deferred to separate effort
3. **Completion tracking:** ✅ Yes, completion = aspects rated / 6

---

## Approval Checklist

- [ ] Domain name "Enterprise Governance" confirmed
- [ ] Assessment model confirmed (direct aspect rating, 6 aspects each)
- [ ] Scoring approach confirmed (avg of 6 aspects, included in overall)
- [ ] No migration needed confirmed
- [ ] Dashboard layer grouping approach confirmed
- [ ] Results changes deferred confirmed

---

## Revision History

| Date       | Author  | Changes                                                                  |
| ---------- | ------- | ------------------------------------------------------------------------ |
| 2026-01-30 | Initial | Document created                                                         |
| 2026-01-30 | Update  | Added detailed implementation specs, type changes, assessment page logic |
