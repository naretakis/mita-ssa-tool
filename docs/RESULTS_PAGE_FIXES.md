# Results Page Bug Fixes

This document outlines three bugs found in the Results page "Results by Domain" section and the implementation plan to fix them.

## Status

| Bug   | Description                                                    | Status      |
| ----- | -------------------------------------------------------------- | ----------- |
| Bug 1 | Missing layer category/grouping                                | ✅ Complete |
| Bug 2 | Enterprise Governance displays B-I-T instead of Outcomes/Roles | ✅ Complete |
| Bug 3 | Enterprise domains don't display aggregate scores              | ✅ Complete |

## Context

The MITA 4.0 application has undergone significant changes to the ORBIT model structure:

1. **Standard Assessments (B-I-T):** Most capability areas use Business Architecture, Information, and Technology dimensions
2. **Organizational Assessments:** The Enterprise Governance domain has two special areas:
   - `organizational-outcomes` - Uses Outcomes aspects (6 aspects)
   - `organizational-roles` - Uses Roles aspects (6 aspects)
3. **Enterprise Domains:** Two domains have aggregate dimensions:
   - `data-management` (Enterprise Data Management) - Information dimension is aggregated from other domains
   - `technical` (Enterprise Technology) - Technology dimension is aggregated from other domains

## Bug 1: Missing Layer Category/Grouping ✅

### Current Behavior

The `NavigationPanel` in `ResultsMasterDetail.tsx` lists all domains in a flat list without grouping by layer (Strategic, Core, Support).

### Expected Behavior

Domains should be grouped by layer with visual headers, consistent with how the chart already groups them.

### Files Modified

- `src/components/results/ResultsMasterDetail.tsx` - Updated `NavigationPanel` to group domains by layer

### Implementation

- Added `LAYER_ORDER` and `LAYER_DISPLAY` constants for layer configuration
- Added `expandedLayers` state to track which layers are expanded
- Added `domainsByLayer` memoized grouping of domains by layer
- Added collapsible layer headers with visual indicators (colored dots, expand/collapse icons)
- Nested domain list items within their respective layer sections

---

## Bug 2: Enterprise Governance Displays B-I-T Instead of Outcomes/Roles ✅

### Current Behavior

The `AreaDetailPanel` and `DimensionScoresTableWithTarget` components display B-I-T dimension scores for all assessments, including organizational assessments (Outcomes/Roles areas).

### Expected Behavior

For organizational assessments:

- `organizational-outcomes` should display Outcomes aspects (6 aspects)
- `organizational-roles` should display Roles aspects (6 aspects)

### Root Cause

- `useScores.getDimensionScoresForAssessment()` only iterates over `getAllDimensionIds()` which returns `['businessArchitecture', 'information', 'technology']`
- It doesn't handle organizational assessments which use `outcomes` or `roles` as their dimension IDs

### Files Modified

- `src/hooks/useScores.ts` - Added `getOrganizationalScoresForAssessment()` function
- `src/components/results/ResultsMasterDetail.tsx` - Updated `AreaDetailPanel` to detect and handle organizational assessments

### Implementation

1. Added `getOrganizationalScoresForAssessment()` function to `useScores.ts` that:
   - Detects organizational assessment type using `getOrganizationalAssessmentType()`
   - Gets organizational aspects using `getOrganizationalAspects()`
   - Returns a single dimension score representing the organizational assessment
2. Updated `AreaDetailPanel` to:
   - Detect organizational assessments using `isOrganizationalAssessmentArea()`
   - Call `getOrganizationalScoresForAssessment()` for organizational areas
   - Display organizational aspects in radar chart and dimension table

---

## Bug 3: Enterprise Domains Don't Display Aggregate Scores ✅

### Current Behavior

The `AreaDetailPanel` shows standard B-I-T dimension scores for enterprise domain assessments without showing the aggregate dimension scores.

### Expected Behavior

- **Enterprise Data Management:** B + T dimensions manually assessed, **Information** shown as aggregate score
- **Enterprise Technology:** B + I dimensions manually assessed, **Technology** shown as aggregate score

The aggregated dimension should:

- Show the aggregate score calculated from all qualifying finalized assessments
- Be visually distinguished (e.g., badge indicating "Aggregate")
- Optionally show contributing assessment count

### Root Cause

- `getDimensionScoresForAssessment()` doesn't know about aggregate dimensions
- The UI doesn't call `getAggregateDimensionScore()` for enterprise domains

### Files Modified

- `src/components/results/ResultsMasterDetail.tsx` - Updated `AreaDetailPanel` to handle enterprise domain aggregate scores
- `src/components/results/DimensionScoresTableWithTarget.tsx` - Added support for displaying aggregate dimension info

### Implementation

1. Updated `AreaDetailPanel` to:
   - Detect enterprise domain assessments using `isEnterpriseDomain()` and `getAggregatedDimensionForDomain()`
   - For the aggregated dimension, replace the manual score with `getAggregateDimensionScore()` result
   - Inject `isAggregate` and `aggregateContributingCount` properties into dimension scores
2. Created `ExtendedDimensionScore` interface extending `DimensionScore` with aggregate metadata
3. Updated `DimensionRow` component to:
   - Accept `isAggregate` and `aggregateContributingCount` props
   - Display "Aggregate (N areas)" chip for aggregate dimensions
   - Disable expand/collapse for aggregate dimensions (no individual aspect ratings)
4. Updated main table to pass aggregate props to `DimensionRow`

---

## Implementation Order (Completed)

1. **Bug 1 (Layer grouping)** ✅ - Simplest change, isolated to navigation UI
2. **Bug 2 (Organizational assessments)** ✅ - Added new scoring logic for organizational assessments
3. **Bug 3 (Enterprise aggregates)** ✅ - Added aggregate dimension display with visual indicators

---

## Related Files Reference

### Key Services

- `src/services/orbit.ts` - ORBIT model access, enterprise domain helpers, organizational assessment helpers
- `src/services/scoring.ts` - Score calculation functions
- `src/hooks/useScores.ts` - Score hooks including `getAggregateDimensionScore()`

### Key Constants

- `src/constants/index.ts`:
  - `ENTERPRISE_DOMAIN_IDS` - `['data-management', 'technical']`
  - `DOMAIN_AGGREGATE_DIMENSIONS` - Maps domain to aggregated dimension
  - `ORGANIZATIONAL_ASSESSMENT_AREAS` - Maps area ID to assessment type
  - `isOrganizationalAssessmentArea()` - Check if area is organizational
  - `getOrganizationalAssessmentType()` - Get assessment type for area

### Key Components

- `src/components/results/ResultsMasterDetail.tsx` - Main results view with navigation and detail panels
- `src/components/results/DimensionScoresTableWithTarget.tsx` - Dimension scores display with As-Is/To-Be
