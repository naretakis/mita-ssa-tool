# ORBIT Dimension & Domain Changes - Implementation Specification

**Created:** January 28, 2026  
**Status:** Approved for Implementation

---

## Overview

This document specifies changes to the ORBIT assessment model to better align with how Information and Data/Technology are conceptually distinct:

- **Information** = How data supports a specific capability (assessed per capability)
- **Data** = Enterprise-wide data management (the domain itself)
- **Technology** = Tech stack supporting a specific capability (assessed per capability)
- **Enterprise Technology** = The domain that enables all technology

### Key Conceptual Model

| Concept                                      | Assessed Where                              | Rationale                                                      |
| -------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------- |
| Information (how data supports a capability) | Each business capability area               | Capabilities may use information not stored as enterprise data |
| Data (enterprise data management)            | Enterprise Data Management domain (O-R-B-T) | Data governance, quality, etc. are enterprise concerns         |
| Technology (tech supporting a capability)    | Each business capability area               | Each capability has its own tech stack                         |
| Enterprise Technology (enabling platform)    | Enterprise Technology domain (O-R-B-I)      | Platform capabilities enable all other technology              |

---

## Summary of Changes

| #   | Change                     | Description                                                                             |
| --- | -------------------------- | --------------------------------------------------------------------------------------- |
| 1   | Rename ORBIT dimension     | "Information & Data" → "Information" (ID: `informationData` → `information`)            |
| 2   | Rename domains             | "Data Management" → "Enterprise Data Management", "Technical" → "Enterprise Technology" |
| 3   | Enterprise Data Management | Assess O-R-B-T only; Information shows aggregate score (read-only)                      |
| 4   | Enterprise Technology      | Assess O-R-B-I only; Technology shows aggregate score (read-only)                       |

---

## Detailed Specifications

### 1. Dimension Rename: "Information & Data" → "Information"

**Rationale:** The dimension assesses how information supports a capability. Data management is handled at the enterprise level through the Enterprise Data Management domain.

**Changes:**

- Dimension ID: `informationData` → `information`
- Display name: "Information & Data" → "Information"
- All 11 aspects remain unchanged
- Required status: Still required (for non-enterprise domains)

**Files affected:**

- `src/data/orbit-model.json`
- `src/types/index.ts`
- All services, hooks, components, and tests referencing `informationData`

**Note on Required Dimensions:**

- For standard domains: Business Architecture, Information, and Technology remain required
- For Enterprise Data Management: Business Architecture and Technology are required; Information is aggregate (not manually assessed)
- For Enterprise Technology: Business Architecture and Information are required; Technology is aggregate (not manually assessed)

---

### 2. Domain Renames

| Current ID        | Current Name    | New Name                   |
| ----------------- | --------------- | -------------------------- |
| `data-management` | Data Management | Enterprise Data Management |
| `technical`       | Technical       | Enterprise Technology      |

**Note:** Domain IDs remain unchanged to minimize code changes.

**Files affected:**

- `src/data/capabilities.json` (name field only)

---

### 3. Enterprise Data Management: ORBT Assessment

**Domain ID:** `data-management`

**Assessment Model:**
| Dimension | Assessment Type | Description |
|-----------|-----------------|-------------|
| Outcomes | Manual | User assesses 6 aspects |
| Roles | Manual | User assesses 6 aspects |
| Business Architecture | Manual | User assesses 7 aspects |
| **Information** | **Aggregate (Read-only)** | Average of Information scores from all other finalized assessments |
| Technology | Manual | User assesses 22 aspects (7 sub-dimensions) |

**Aggregate Calculation:**

```
Information Score = Average of Information dimension scores
                    from all finalized assessments
                    WHERE domainId ≠ 'data-management'
```

**UI Behavior:**

- Sidebar shows Information dimension with aggregate indicator
- Information dimension page shows:
  - Calculated aggregate score
  - Number of contributing assessments
  - Message explaining the aggregate
  - Optional breakdown view
- Users cannot rate individual Information aspects for this domain

---

### 4. Enterprise Technology: ORBI Assessment

**Domain ID:** `technical`

**Assessment Model:**
| Dimension | Assessment Type | Description |
|-----------|-----------------|-------------|
| Outcomes | Manual | User assesses 6 aspects |
| Roles | Manual | User assesses 6 aspects |
| Business Architecture | Manual | User assesses 7 aspects |
| Information | Manual | User assesses 11 aspects |
| **Technology** | **Aggregate (Read-only)** | Average of Technology scores from all other finalized assessments |

**Aggregate Calculation:**

```
Technology Score = Average of Technology dimension scores
                   from all finalized assessments
                   WHERE domainId ≠ 'technical'
```

**UI Behavior:**

- Sidebar shows Technology dimension with aggregate indicator
- Technology dimension page shows:
  - Calculated aggregate score
  - Number of contributing assessments
  - Message explaining the aggregate
  - Optional breakdown view
- Users cannot rate individual Technology aspects/sub-dimensions for this domain

---

## Scoring Rules

### Overall Capability Score Calculation

**For standard domains (not Enterprise Data Management or Enterprise Technology):**

```
Overall Score = Average of all 5 dimension scores (O, R, B, I, T)
```

**For Enterprise Data Management:**

```
Overall Score = Average of (O, R, B, I-aggregate, T)
```

- The aggregate Information score IS included in the overall score
- If no aggregate data available, Information is excluded from the average

**For Enterprise Technology:**

```
Overall Score = Average of (O, R, B, I, T-aggregate)
```

- The aggregate Technology score IS included in the overall score
- If no aggregate data available, Technology is excluded from the average

### Aggregate Score Behavior

1. **No finalized assessments:** Display "No data available" (score = null)
2. **Some finalized assessments:** Calculate average, round to 1 decimal
3. **Dynamic updates:** Aggregate scores update as other assessments are finalized/updated
4. **Finalized enterprise assessments:** Overall score may change as aggregate inputs change

---

## Configuration

### Domain Aggregate Configuration

```typescript
// src/constants/index.ts

/**
 * Maps domain IDs to their aggregated dimension.
 * These domains show an aggregate score for the specified dimension
 * instead of allowing manual assessment.
 */
export const DOMAIN_AGGREGATE_DIMENSIONS: Record<string, OrbitDimensionId> = {
  'data-management': 'information', // Enterprise Data Management
  technical: 'technology', // Enterprise Technology
};
```

### Helper Functions

```typescript
// src/constants/index.ts

import type { OrbitDimensionId } from '../types';

/**
 * Domain IDs that have aggregate dimensions (enterprise domains).
 * These domains should not contribute to each other's aggregates.
 */
export const ENTERPRISE_DOMAIN_IDS = ['data-management', 'technical'] as const;

/**
 * Maps domain IDs to their aggregated dimension.
 * These domains show an aggregate score for the specified dimension
 * instead of allowing manual assessment.
 */
export const DOMAIN_AGGREGATE_DIMENSIONS: Partial<Record<string, OrbitDimensionId>> = {
  'data-management': 'information', // Enterprise Data Management: ORBT (no I)
  technical: 'technology', // Enterprise Technology: ORBI (no T)
};
```

```typescript
// src/services/orbit.ts

import { DOMAIN_AGGREGATE_DIMENSIONS, ENTERPRISE_DOMAIN_IDS } from '../constants';

/**
 * Get the aggregated dimension for a domain, if any.
 * @returns The dimension ID that should show aggregate scores, or null
 */
export function getAggregatedDimensionForDomain(domainId: string): OrbitDimensionId | null {
  return DOMAIN_AGGREGATE_DIMENSIONS[domainId] ?? null;
}

/**
 * Check if a dimension should show aggregate scores for a given domain.
 */
export function isAggregatedDimension(domainId: string, dimensionId: OrbitDimensionId): boolean {
  return DOMAIN_AGGREGATE_DIMENSIONS[domainId] === dimensionId;
}

/**
 * Check if a domain has any aggregated dimensions (is an enterprise domain).
 */
export function hasAggregatedDimension(domainId: string): boolean {
  return domainId in DOMAIN_AGGREGATE_DIMENSIONS;
}

/**
 * Check if a domain is an enterprise domain.
 */
export function isEnterpriseDomain(domainId: string): boolean {
  return ENTERPRISE_DOMAIN_IDS.includes(domainId as (typeof ENTERPRISE_DOMAIN_IDS)[number]);
}
```

```typescript
// src/hooks/useScores.ts (new functions)

/**
 * Calculate aggregate score for a dimension across all qualifying finalized assessments.
 * Excludes enterprise domains from the calculation.
 */
export function calculateAggregateDimensionScore(
  dimensionId: OrbitDimensionId,
  allAssessments: CapabilityAssessment[],
  getDimensionScore: (assessmentId: string, dimId: OrbitDimensionId) => number | null
): { score: number | null; contributingCount: number; assessmentIds: string[] } {
  // Filter to finalized, non-enterprise domain assessments
  const qualifyingAssessments = allAssessments.filter(
    (a) => a.status === 'finalized' && !isEnterpriseDomain(a.capabilityDomainId)
  );

  // Get scores for each
  const scoresWithIds: { id: string; score: number }[] = [];
  for (const assessment of qualifyingAssessments) {
    const score = getDimensionScore(assessment.id, dimensionId);
    if (score !== null) {
      scoresWithIds.push({ id: assessment.id, score });
    }
  }

  if (scoresWithIds.length === 0) {
    return { score: null, contributingCount: 0, assessmentIds: [] };
  }

  const avgScore = scoresWithIds.reduce((sum, s) => sum + s.score, 0) / scoresWithIds.length;
  return {
    score: Math.round(avgScore * 10) / 10, // Round to 1 decimal
    contributingCount: scoresWithIds.length,
    assessmentIds: scoresWithIds.map((s) => s.id),
  };
}
```

---

## UI Specifications

### Assessment Sidebar

**Standard Domain:**

```
☐ Outcomes
☐ Roles
☐ Business Architecture
☐ Information
☐ Technology
```

**Enterprise Data Management:**

```
☐ Outcomes
☐ Roles
☐ Business Architecture
📊 Information (Aggregate)    ← Different styling, shows score if available
☐ Technology
```

**Enterprise Technology:**

```
☐ Outcomes
☐ Roles
☐ Business Architecture
☐ Information
📊 Technology (Aggregate)     ← Different styling, shows score if available
```

### Aggregate Dimension Page

When user clicks on an aggregated dimension:

```
┌─────────────────────────────────────────────────────────────────┐
│ [Dimension Name] - Aggregate Score                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ⓘ This score is automatically calculated from the       │   │
│  │   [Information/Technology] dimension scores of all      │   │
│  │   finalized capability assessments across other domains.│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │              Aggregate Score: 3.2                       │   │
│  │                                                         │   │
│  │         Contributing Assessments: 12                    │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Optional: Expandable breakdown by domain/capability]          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**When no data available:**

```
┌─────────────────────────────────────────────────────────────────┐
│ [Dimension Name] - Aggregate Score                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ⓘ No finalized capability assessments available yet.    │   │
│  │   Complete and finalize assessments in other capability │   │
│  │   areas to see the aggregate [Information/Technology]   │   │
│  │   score here.                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │              No Data Available                          │   │
│  │                                                         │   │
│  │         Contributing Assessments: 0                     │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Export Specifications

### CSV Maturity Profile

**Header row (updated):**

```csv
ORBIT,As Is,To Be,Notes
Outcomes,<level>,<target>,<notes>
Roles,<level>,<target>,<notes>
Business Architecture,<level>,<target>,<notes>
Information,<level>,<target>,<notes>      ← Renamed from "Information & Data"
Technology,<level>,<target>,<notes>
```

**For Enterprise Data Management / Enterprise Technology:**

- Include the aggregate score in the appropriate row
- Add "(Aggregate)" suffix or note in the Notes column
- Example: `Information,3.2,,(Aggregate from 12 assessments)`

### PDF Export

- Update dimension labels to "Information"
- For aggregate dimensions, include note indicating it's calculated
- Show contributing assessment count

### JSON/ZIP Export

- Include aggregate scores in the data structure
- Add metadata indicating which dimensions are aggregates
- Include list of contributing assessment IDs for traceability

---

## Database Considerations

### No Schema Changes Required

The existing schema supports this model:

- `OrbitRating` records are only created for manually-assessed dimensions
- Aggregate scores are calculated on-the-fly, not stored
- Enterprise Data Management assessments will have no `OrbitRating` records for `information` dimension
- Enterprise Technology assessments will have no `OrbitRating` records for `technology` dimension

### Data Integrity

- Aggregate scores are always calculated fresh from current finalized assessments
- No stale data concerns since nothing is persisted
- Finalized enterprise assessments may show different overall scores over time as aggregates change

---

## Edge Cases & Special Scenarios

### 1. Circular Dependency Prevention

**Scenario:** Enterprise Data Management and Enterprise Technology should NOT contribute to each other's aggregates.

**Rule:** When calculating aggregates:

- Enterprise Data Management's Information aggregate excludes assessments from `data-management` domain
- Enterprise Technology's Technology aggregate excludes assessments from `technical` domain
- Neither domain's scores contribute to the other's aggregate (they only aggregate from business capability domains)

**Implementation:**

```typescript
// Exclude both enterprise domains from aggregate calculations
const ENTERPRISE_DOMAIN_IDS = ['data-management', 'technical'];

function getAssessmentsForAggregate(excludeDomainId: string): CapabilityAssessment[] {
  return getFinalizedAssessments().filter(
    (a) => !ENTERPRISE_DOMAIN_IDS.includes(a.capabilityDomainId)
  );
}
```

### 2. Partial Assessment Scenarios

**Scenario:** A finalized assessment has some dimensions rated but not the one being aggregated.

**Rule:** Only include assessments that have a valid score for the dimension being aggregated.

**Example:** If calculating Technology aggregate and Assessment A has no Technology ratings (all N/A or unassessed), exclude Assessment A from the aggregate calculation.

### 3. All N/A Ratings

**Scenario:** A finalized assessment has all aspects in a dimension marked as N/A.

**Rule:** N/A ratings are excluded from dimension score calculation. If all aspects are N/A, the dimension score is null and should not contribute to the aggregate.

### 4. Target Level Aggregation

**Scenario:** Should aggregate dimensions also show a "To Be" target level?

**Decision:** Yes, calculate aggregate target level the same way as current level:

- Average of target levels from all contributing assessments
- Only include assessments where target level is set
- Display as read-only alongside current level

### 5. History Snapshots

**Scenario:** When viewing a historical snapshot of an Enterprise assessment, what aggregate score should display?

**Decision:** Historical snapshots should store the aggregate score at the time of snapshot creation. This preserves the point-in-time view even though the live aggregate may have changed.

**Implementation:** When creating a history snapshot for Enterprise Data Management or Enterprise Technology:

- Calculate and store the aggregate score in the snapshot
- Store metadata about contributing assessments at that time
- Historical view shows the stored value, not recalculated

### 6. Results & Reporting Views

**Scenario:** How should aggregate dimensions appear in results pages?

**Rules:**

- Domain results page: Show aggregate score with indicator
- Area results page: Show aggregate score with breakdown option
- Overall results: Include aggregate in domain/area averages
- Charts: Include aggregate scores (visually distinguished if possible)

---

## Implementation Order

### Phase 1: Data & Type Changes

1. Update `src/data/orbit-model.json` - rename dimension ID and name
2. Update `src/data/capabilities.json` - rename domain display names
3. Update `src/types/index.ts` - update `OrbitDimensionId` type and `OrbitModel` interface
4. Update `src/data/templates/maturity-profile-template.csv` - update dimension header

### Phase 2: Service Layer

1. Add `DOMAIN_AGGREGATE_DIMENSIONS` and `ENTERPRISE_DOMAIN_IDS` to `src/constants/index.ts`
2. Update `src/services/orbit.ts`:
   - Rename all `informationData` references to `information`
   - Add `getAggregatedDimensionForDomain()`, `isAggregatedDimension()`, `hasAggregatedDimension()`
   - Update `getRequiredDimensionIds()` to return `information` instead of `informationData`
3. Update `src/hooks/useScores.ts`:
   - Add `calculateAggregateDimensionScore()` function
   - Add `getAggregateScoreDetails()` for breakdown data
   - Update `getDimensionDisplayName()`
   - Update `isDimensionRequired()`
4. Update `src/services/scoring.ts` if needed for aggregate handling

### Phase 3: UI Components

1. Update `src/components/assessment/AssessmentSidebar.tsx`:
   - Add visual indicator for aggregate dimensions
   - Show aggregate score preview in sidebar
2. Update `src/pages/Assessment.tsx`:
   - Update dimension iteration to use `information`
   - Add routing logic for aggregate dimension pages
3. Create `src/components/assessment/AggregateDimensionView.tsx`:
   - New component for displaying aggregate score
   - Include info message, score display, contributing count
   - Optional breakdown accordion
4. Update `src/components/assessment/DimensionPage.tsx`:
   - Conditionally render `AggregateDimensionView` for aggregate dimensions
5. Update `src/pages/HistoryView.tsx`:
   - Update dimension iteration
   - Handle stored aggregate scores in snapshots
6. Update `src/components/results/ResultsMasterDetail.tsx`:
   - Update `SHORT_DIMENSION_NAMES` mapping
7. Update other results components as needed

### Phase 4: Export

1. Update `src/services/export/csvExport.ts`:
   - Update `DIMENSION_ORDER` array
   - Handle aggregate dimensions in output
2. Update `src/services/export/pdfExport.ts`:
   - Update dimension labels
   - Add aggregate indicators
3. Update `src/services/export/pdfStyles.ts`:
   - Update `DIMENSION_NAMES` constant
4. Update `src/services/export/exportService.ts`:
   - Update dimension name mapping
   - Handle aggregate metadata in JSON export
5. Update `src/services/export/importService.ts`:
   - Handle imported data with old `informationData` ID (graceful migration)

### Phase 5: History Service

1. Update `src/services/history.ts`:
   - Store aggregate scores in snapshots for enterprise domains
   - Store contributing assessment metadata

### Phase 6: Tests & Documentation

1. Update test files:
   - `src/services/orbit.test.ts`
   - `src/services/capabilities.test.ts`
   - `src/services/export/exportService.test.ts`
   - `src/services/export/csvExport.test.ts` (if exists)
   - `src/hooks/useScores.test.ts`
   - `src/hooks/useOrbitRatings.test.ts` (if affected)
   - `src/services/history.test.ts`
2. Add new tests for aggregate functionality
3. Update `scripts/generate-test-import.js`
4. Update `PROJECT_FOUNDATION_v2.md`
5. Update `CHANGELOG.md`
6. Update `README.md` if needed

---

## Testing Checklist

### Dimension Rename

- [ ] `informationData` → `information` updated in all files
- [ ] "Information & Data" → "Information" displays correctly in UI
- [ ] Type checking passes with new dimension ID

### Domain Renames

- [ ] "Enterprise Data Management" displays in dashboard
- [ ] "Enterprise Technology" displays in dashboard
- [ ] Domain IDs unchanged (no broken references)

### Aggregate Functionality - Enterprise Data Management

- [ ] Information dimension shows as aggregate in sidebar
- [ ] Clicking Information shows aggregate view (not aspect list)
- [ ] Aggregate score calculated correctly from finalized assessments
- [ ] Excludes assessments from `data-management` and `technical` domains
- [ ] "No data available" when no qualifying finalized assessments
- [ ] Aggregate updates when other assessments are finalized
- [ ] Can still assess O, R, B, T dimensions normally

### Aggregate Functionality - Enterprise Technology

- [ ] Technology dimension shows as aggregate in sidebar
- [ ] Clicking Technology shows aggregate view (not sub-dimensions)
- [ ] Aggregate score calculated correctly from finalized assessments
- [ ] Excludes assessments from `data-management` and `technical` domains
- [ ] "No data available" when no qualifying finalized assessments
- [ ] Aggregate updates when other assessments are finalized
- [ ] Can still assess O, R, B, I dimensions normally

### Scoring

- [ ] Overall score for Enterprise Data Management includes I-aggregate
- [ ] Overall score for Enterprise Technology includes T-aggregate
- [ ] Null aggregate excluded from overall score calculation
- [ ] Domain scores in results include aggregate dimensions
- [ ] Target level aggregation works correctly

### Export

- [ ] CSV shows "Information" (not "Information & Data")
- [ ] CSV includes aggregate scores with "(Aggregate)" note
- [ ] PDF shows updated dimension names
- [ ] PDF indicates aggregate dimensions
- [ ] JSON export includes aggregate metadata
- [ ] ZIP export handles aggregates correctly

### History

- [ ] Snapshots store aggregate score at time of creation
- [ ] Historical view shows stored aggregate (not recalculated)
- [ ] Contributing assessment count stored in snapshot

### Import (Backwards Compatibility)

- [ ] Can import files with old `informationData` dimension ID
- [ ] Gracefully maps to new `information` ID

### Regression

- [ ] All existing tests pass (after updates)
- [ ] Standard domain assessments unaffected
- [ ] Finalization workflow works for enterprise domains
- [ ] Results pages display correctly
- [ ] Dashboard displays correctly

---

## Accessibility Considerations

- [ ] Aggregate indicator has appropriate ARIA label
- [ ] "No data available" state is announced to screen readers
- [ ] Aggregate breakdown (if implemented) is keyboard navigable
- [ ] Color is not the only indicator of aggregate status

---

## Performance Considerations

- Aggregate calculations should be memoized to avoid recalculation on every render
- Consider caching aggregate scores in the `useScores` hook
- Breakdown data (list of contributing assessments) should be lazy-loaded

---

## Open Items

1. **Breakdown view design:** Should the aggregate dimension page show a detailed breakdown of contributing assessments? If yes, what level of detail?
   - Option A: Just count and score range
   - Option B: List of domain/area names with their scores
   - Option C: Full expandable table with links to each assessment
   - **Recommendation:** Start with Option A, add Option B as enhancement

2. **Visual indicator:** What icon/styling should indicate an aggregate dimension?
   - Options: 📊 chart icon, 🔗 link icon, different background color, badge
   - **Recommendation:** Use a small chart/aggregate icon + "(Aggregate)" text label

---

## Glossary

| Term                        | Definition                                                                                           |
| --------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Aggregate Dimension**     | A dimension whose score is calculated from other assessments rather than manually assessed           |
| **Enterprise Domain**       | Either Enterprise Data Management or Enterprise Technology - domains with aggregate dimensions       |
| **Contributing Assessment** | A finalized assessment from a non-enterprise domain that contributes to an aggregate score           |
| **ORBT**                    | Assessment model for Enterprise Data Management (Outcomes, Roles, Business Architecture, Technology) |
| **ORBI**                    | Assessment model for Enterprise Technology (Outcomes, Roles, Business Architecture, Information)     |

---

## Approval

- [x] Requirements confirmed
- [x] Aggregate scoring approach confirmed (Option A - include in overall)
- [x] "No data" handling confirmed
- [x] Finalization behavior confirmed (score may change over time)
- [x] Circular dependency prevention confirmed (enterprise domains excluded from each other's aggregates)
- [x] Target level aggregation confirmed (aggregate target levels same as current levels)
- [x] History snapshot behavior confirmed (store aggregate at snapshot time)

---

## Revision History

| Date       | Author  | Changes                                  |
| ---------- | ------- | ---------------------------------------- |
| 2026-01-28 | Initial | Document created with full specification |
