# MITA 4.0 Maturity Model Update — Implementation Plan

**Created:** April 27, 2026
**Status:** Draft — Pending Review (Audited)
**Current App Version:** 2.1.0
**Target App Version:** 3.0.0

> **Audit Note:** This plan has been audited against the extracted source documents,
> the full codebase (including grep for every hardcoded dimension/aspect reference),
> and the project's development standards. Gaps found during audit have been
> incorporated into the relevant sections below.

---

## 1. Executive Summary

The MITA workgroups have reworked the maturity model ahead of the PRA official release. Three updated documents drive changes to the application:

1. **Business and Enterprise Architecture Maturity Criteria** (XLSX) — Splits the old Business Architecture dimension into two: a reworked Business Architecture (5 aspects) and a new Enterprise Architecture dimension (4 aspects)
2. **MITA 4 Maturity Model Guide** (DOCX) — Consolidates Technology from 22 aspects across 7 sub-dimensions down to 11 aspects across 2 sub-dimensions, with full questions and evidence
3. **MITA 4.0 Capability Reference Model** (DOCX) — Restructures the Technical capability domain from 7 categories / 22 areas to 2 categories / 11 areas

No backwards compatibility is required. This is a clean break (major version bump to 3.0.0). The database will be reset via a version increment.

---

## 2. What Changed — Detailed Comparison

### 2.1 Business Architecture Dimension: Reworked (7 → 5 aspects)

The old Business Architecture mixed business-process concerns with enterprise-level concerns. The new model makes BA purely about business processes.

| Old BA Aspect           | Disposition                               |
| ----------------------- | ----------------------------------------- |
| Business Capability     | Moved → Enterprise Architecture dimension |
| Business Process        | Replaced → Business Process Performance   |
| Business Process Model  | Replaced → Business Process Documentation |
| Role Management         | Replaced → Business Process Governance    |
| Strategic Planning      | Moved → Enterprise Architecture dimension |
| Enterprise Architecture | Moved → Enterprise Architecture dimension |
| Policy Management       | Moved → Enterprise Architecture dimension |

**New Business Architecture aspects (5):**

| #   | Aspect Name                    | ID (proposed)                    | Source             |
| --- | ------------------------------ | -------------------------------- | ------------------ |
| 1   | Business Process Performance   | `business-process-performance`   | XLSX → BA Criteria |
| 2   | Business Process Documentation | `business-process-documentation` | XLSX → BA Criteria |
| 3   | Business Process Governance    | `business-process-governance`    | XLSX → BA Criteria |
| 4   | Business Process Automation    | `business-process-automation`    | XLSX → BA Criteria |
| 5   | Business Process Reporting     | `business-process-reporting`     | XLSX → BA Criteria |

All 5 aspects have descriptions, questions, and evidence for all 5 maturity levels (currently empty in the app).

### 2.2 New Enterprise Architecture Dimension (4 aspects)

A brand-new ORBIT dimension. Four aspects that were previously inside Business Architecture are extracted into their own dimension with updated content.

| #   | Aspect Name             | ID (proposed)             | Origin                         |
| --- | ----------------------- | ------------------------- | ------------------------------ |
| 1   | Business Capability     | `business-capability`     | Was BA aspect, content updated |
| 2   | Enterprise Architecture | `enterprise-architecture` | Was BA aspect, content updated |
| 3   | Policy Management       | `policy-management`       | Was BA aspect, content updated |
| 4   | Strategic Planning      | `strategic-planning`      | Was BA aspect, content updated |

All 4 aspects have descriptions, questions, and evidence for all 5 maturity levels.

Enterprise Architecture is a **required** dimension, assessed alongside BA, I, and T for all standard capability areas.

### 2.3 Technology Dimension: Consolidated (22 → 11 aspects, 7 → 2 sub-dimensions)

The old 7 sub-dimensions with 22 granular aspects are consolidated into 2 sub-dimensions with 11 broader aspects. The sub-dimension scoring pattern is preserved (average each sub-dimension, then average those).

**Old → New Mapping:**

| New Sub-Dimension                        | New Aspect                                             | Old Aspects Consolidated                                                   |
| ---------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------- |
| **Technology Infrastructure Management** | Compute and Storage                                    | compute-hosting + storage                                                  |
|                                          | Networking and Technical Recovery                      | networking-connectivity + resilience-scaling                               |
|                                          | Identity, Access, and Consent                          | identity-access-services + consent-management                              |
|                                          | Security Protection and Monitoring                     | system-data-protection + security-monitoring                               |
|                                          | System Operations and Monitoring                       | system-monitoring + system-operations                                      |
|                                          | Development, Testing, Release, and Security Compliance | code-configuration-management + testing-release + security-compliance      |
| **Application Management**               | API, Messaging, and Integration                        | api-interface-management + system-messaging + external-partner-integration |
|                                          | Application Hosting and Platform Services              | application-hosting + common-platform-functions                            |
|                                          | Business Rules and Workflow                            | business-rules-workflow                                                    |
|                                          | Modular Architecture                                   | modular-architecture                                                       |
|                                          | User Interface and Session Management                  | user-interfaces + session-state-management                                 |

All 11 aspects have full descriptions, questions, AND evidence for all 5 levels (currently all empty in the app).

**Source Document Naming Discrepancies (to resolve during implementation):**

The two source documents have minor naming inconsistencies for 2 aspects. We will use the **Capability Reference Model** names as canonical (since those are the official area names) and align the maturity criteria aspect names to match:

| Maturity Model Guide Name                             | Capability Reference Model Name                        | Canonical Name (use this)                              |
| ----------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------ |
| Development, Testing, Release and Security Compliance | Development, Testing, Release, and Security Compliance | Development, Testing, Release, and Security Compliance |
| User Interfaces and Session Management                | User Interface and Session Management                  | User Interface and Session Management                  |

### 2.4 Technical Capability Domain: Restructured (22 → 11 areas)

The `capabilities.json` Technical domain mirrors the Technology maturity model exactly:

| New Category                         | Areas                                                                |
| ------------------------------------ | -------------------------------------------------------------------- |
| Technology Infrastructure Management | 6 areas (same names as Technology Infrastructure Management aspects) |
| Application Management               | 5 areas (same names as Application Management aspects)               |

Each area has updated definitions and topics from the Capability Reference Model document.

### 2.5 Unchanged

- **Information dimension** (11 aspects) — No changes in any document
- **Organizational Assessments** — Outcomes (6 aspects) and Roles (6 aspects) unchanged
- **All non-Technical capability domains** — 13 domains unchanged (Strategic, Core, and other Support domains)
- **Maturity level definitions** (1-5 + N/A) — Unchanged
- **Enterprise Governance domain** — Unchanged (Organizational Outcomes, Organizational Roles)

### 2.6 Aspect Count Summary

| Dimension                 | Current         | New             | Change                     |
| ------------------------- | --------------- | --------------- | -------------------------- |
| Business Architecture     | 7               | 5               | Reworked (all new aspects) |
| Enterprise Architecture   | —               | 4               | New dimension              |
| Information               | 11              | 11              | Unchanged                  |
| Technology                | 22 (7 sub-dims) | 11 (2 sub-dims) | Consolidated               |
| Outcomes (organizational) | 6               | 6               | Unchanged                  |
| Roles (organizational)    | 6               | 6               | Unchanged                  |
| **Total**                 | **52**          | **43**          | **-9 aspects**             |

---

## 3. Decisions Made

| #   | Decision                                | Resolution                                                                                                                       |
| --- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Technology sub-dimension scoring        | Keep sub-dimension scoring pattern. Average each of the 2 sub-dimensions, then average those for the Technology dimension score. |
| 2   | Enterprise Architecture required status | Yes, EA is a required dimension. Standard assessments now have 4 required dimensions: B-EA-I-T.                                  |
| 3   | Enterprise domain EA handling           | Both Enterprise Data Management and Enterprise Technology assess EA manually alongside their other manual dimensions.            |
| 4   | Backwards compatibility                 | Clean break. No legacy import mapping needed.                                                                                    |
| 5   | Existing assessment data                | Clean break. Increment Dexie database version to clear all existing data.                                                        |
| 6   | Version bump                            | Major version: 2.1.0 → 3.0.0 (breaking changes to data model)                                                                    |

---

## 4. Enterprise Domain Assessment Model (Updated)

With the new EA dimension, the enterprise domain assessment models update as follows:

| Domain                     | Manual Dimensions  | Aggregate Dimension | Rationale                                   |
| -------------------------- | ------------------ | ------------------- | ------------------------------------------- |
| Standard capability areas  | B, EA, I, T        | —                   | All 4 dimensions assessed manually          |
| Enterprise Data Management | B, EA, T           | I (aggregate)       | Information is enterprise-wide data concern |
| Enterprise Technology      | B, EA, I           | T (aggregate)       | Technology is enterprise-wide tech concern  |
| Organizational Outcomes    | 6 aspects directly | —                   | No dimension layer                          |
| Organizational Roles       | 6 aspects directly | —                   | No dimension layer                          |

---

## 5. Implementation Phases

### Phase 1: Data Files (Foundation)

Everything depends on the data files being correct first. No code changes yet.

**5.1.1 Update `src/data/orbit-model.json`**

- Replace `businessArchitecture` dimension: 7 aspects → 5 new aspects
  - New aspects: business-process-performance, business-process-documentation, business-process-governance, business-process-automation, business-process-reporting
  - Each aspect gets: id, name, description, levels (level1-level5 with description, questions[], evidence[])
  - Populate questions and evidence from the XLSX BA Criteria sheet
- Add `enterpriseArchitecture` dimension: 4 aspects (new)
  - Aspects: business-capability, enterprise-architecture, policy-management, strategic-planning
  - Each aspect gets full level definitions with questions and evidence from XLSX EA Criteria sheet
  - Set `required: true`
- Keep `information` dimension unchanged (11 aspects)
- Replace `technology` dimension: 7 sub-dimensions → 2 sub-dimensions
  - Sub-dimension `technologyInfrastructureManagement`: 6 aspects
  - Sub-dimension `applicationManagement`: 5 aspects
  - Each aspect gets full level definitions with descriptions, questions, and evidence from the DOCX Maturity Model Guide
- Keep `organizationalAssessments` unchanged (outcomes + roles)
- Update `version` and `lastUpdated` fields

**5.1.2 Update `src/data/capabilities.json`**

- Replace the `technical` domain's categories and areas:
  - Old: 7 categories, 22 areas
  - New: 2 categories, 11 areas
  - Category IDs: `technology-infrastructure-management`, `application-management`
  - Area IDs derived from aspect names (e.g., `compute-and-storage`, `networking-and-technical-recovery`)
  - Each area gets: id, name, description, topics from the Capability Reference Model DOCX
- Update `version` and `lastUpdated` fields
- Keep all other domains unchanged

**Validation:** After this phase, verify:

- orbit-model.json parses correctly and has expected structure
- capabilities.json parses correctly
- Total aspects: BA(5) + EA(4) + I(11) + T(11) = 31 standard + 12 organizational = 43
- Total capability areas: count should decrease by 11 (22 old tech areas → 11 new)
- Technology sub-dimensions: exactly 2

---

### Phase 2: Type System

Update TypeScript types to match the new data model. TypeScript strict mode will then flag every downstream reference that needs updating.

**5.2.1 Update `src/types/index.ts`**

- Update `OrbitDimensionId` type (line 103) — add `'enterpriseArchitecture'`:
  ```typescript
  export type OrbitDimensionId =
    | 'businessArchitecture'
    | 'enterpriseArchitecture'
    | 'information'
    | 'technology';
  ```
- Update `TechnologySubDimensionId` to match new sub-dimensions:
  ```typescript
  export type TechnologySubDimensionId =
    | 'technologyInfrastructureManagement'
    | 'applicationManagement';
  ```
- Update `OrbitModel` interface to include `enterpriseArchitecture` in the `dimensions` record:
  ```typescript
  dimensions: {
    businessArchitecture: OrbitDimension;
    enterpriseArchitecture: OrbitDimension;
    information: OrbitDimension;
    technology: TechnologyDimension;
  }
  ```
- Update JSDoc comments:
  - Line 100: `"The three ORBIT dimension IDs (B-I-T)"` → `"The four ORBIT dimension IDs (B-EA-I-T)"`
  - Line 307: `"For standard assessments: dimensionId is OrbitDimensionId (B, I, T)"` → `"(B, EA, I, T)"`

**Validation:** Run `npm run typecheck` — expect many errors. These errors are the roadmap for Phase 3-5.

---

### Phase 3: Service Layer & Constants

Fix all service-layer code flagged by TypeScript.

**5.3.1 Update `src/constants/index.ts`**

- Update `DOMAIN_AGGREGATE_DIMENSIONS`:
  - `data-management` still aggregates `information`
  - `technical` still aggregates `technology`
  - No change needed here — EA is manually assessed for both enterprise domains

**5.3.2 Update `src/services/orbit.ts`**

- `getAllDimensionIds()`: return 4 IDs instead of 3:
  ```typescript
  return ['businessArchitecture', 'enterpriseArchitecture', 'information', 'technology'];
  ```
- `getRequiredDimensionIds()`: return all 4 (all required now)
- `getDimension()`: already uses `orbitModel.dimensions[dimensionId]` — will work automatically once the OrbitModel interface is updated.
- `getStandardDimensions()`: currently returns `[orbitModel.dimensions.businessArchitecture, orbitModel.dimensions.information]`. Update to include `orbitModel.dimensions.enterpriseArchitecture`.
- `getTechnologySubDimensions()`: returns 2 sub-dimensions (was 7) — no code change needed, reads from JSON.
- `getTotalAspectCount()`: currently iterates `['businessArchitecture', 'information'] as const` for standard dimensions — must add `'enterpriseArchitecture'`.
- `getAspectCountForDimension()`: handle EA — already uses `getDimension()` so should work automatically.
- `getAspectsForDimension()`: handle EA — already uses `getDimension()` so should work automatically.
- `getAspect()`: handle EA — already uses `getDimension()` so should work automatically.
- `getAspectLocation()`: currently iterates `['businessArchitecture', 'information'] as const` — must add `'enterpriseArchitecture'`.
- Update JSDoc comment on `getAllDimensionIds()`: "three" → "four", "B-I-T" → "B-EA-I-T".

**5.3.3 Update `src/services/scoring.ts`**

- `calculateDimensionScore()`: No structural change needed. The Technology branch already averages sub-dimensions then averages those. With 2 sub-dimensions instead of 7, it works the same way. Non-Technology dimensions (including EA) use simple averaging.
- **However:** the function calls `getTechnologySubDimensions()` which reads from the JSON — this will automatically return 2 sub-dimensions after the data file update. No code change needed.
- Note: test files (`scoring.test.ts`) reference old sub-dimension IDs like `'infrastructure'` and `'integration'` in test fixtures — these must be updated to `'technologyInfrastructureManagement'` and `'applicationManagement'`.

**5.3.4 Update `src/services/history.ts`**

- No structural changes needed. `calculateDimensionScores()` groups by `dimensionId` dynamically, so EA ratings will naturally be grouped.

**Validation:** `npm run typecheck` should have fewer errors after this phase.

---

### Phase 4: Hooks

**5.4.1 Update `src/hooks/useScores.ts`**

- `getDimensionDisplayName()`: add Enterprise Architecture mapping
- `isDimensionRequired()`: add `enterpriseArchitecture` as required
- `getDimensionScoresForAssessment()`: now iterates 4 dimensions instead of 3
- `getAggregateDimensionScore()`: no structural change (still filters by dimensionId)

**5.4.2 Update `src/hooks/useOrbitRatings.ts`**

- No structural changes expected. The hook operates on `RatingDimensionId` which will include `enterpriseArchitecture` via the updated `OrbitDimensionId`.

**5.4.3 Update `src/hooks/useCapabilityAssessments.ts`**

- `finalizeAssessment()`: scoring calculation now includes EA dimension scores. The logic already calls `getAllDimensionIds()` dynamically, so this should work automatically once orbit.ts is updated.
- Line 224: comment says `"Filter to only B-I-T dimensions"` — update to B-EA-I-T.
- Line 226: the filter checks `getAllDimensionIds().includes(...)` — this is already dynamic, so no code change needed, just the comment.

**Validation:** `npm run typecheck` should pass cleanly after this phase.

---

### Phase 5: UI Components & Pages

**5.5.1 Update `src/pages/Assessment.tsx`**

- `buildStandardNavItems()`: currently iterates `['businessArchitecture', 'information'] as const` for standard dimensions — needs to add `'enterpriseArchitecture'` to become `['businessArchitecture', 'enterpriseArchitecture', 'information'] as const`.
- Technology sub-dimension navigation: 2 items instead of 7.

**5.5.2 Update `src/pages/HistoryView.tsx`** _(missed in initial plan)_

- `buildNavItems()`: has the **same hardcoded pattern** as Assessment.tsx — iterates `['businessArchitecture', 'information'] as const`. Must add `'enterpriseArchitecture'`.
- This page reuses `AssessmentSidebar`, `DimensionPage`, and `AggregateDimensionView` so it will benefit from those components being data-driven, but the nav item builder is local and must be updated.

**5.5.3 Update `src/components/assessment/AssessmentSidebar.tsx`**

- Contains comment `// Standard dimension navigation (B-I-T)` — update to B-EA-I-T.
- Will naturally show 4 dimensions + 2 Technology sub-dimensions in sidebar (was 3 + 7). No structural changes expected since it reads from navItems passed as props.

**5.5.4 Update `src/pages/AreaResults.tsx`**

- `SHORT_DIMENSION_LABELS`: add Enterprise Architecture label for radar chart:
  ```typescript
  'Enterprise Architecture': 'Ent. Arch.',
  ```
- Radar chart now has 4 points instead of 3 (B-EA-I-T).
- Update comments referencing "B-I-T" to "B-EA-I-T" (lines 6, 75, 130, 137, 422).

**5.5.5 Update `src/pages/Landing.tsx`**

- Line 61: `"areas and 5 ORBIT dimensions"` — update dimension count and description to reflect the new model structure (4 standard dimensions + organizational assessments).
- Line 135: `"Evaluate your maturity across the five ORBIT dimensions"` — same update.

**5.5.6 Update `src/pages/About.tsx`**

- Line 72: `"Each capability is assessed across five ORBIT dimensions: Outcomes, Roles, Business Architecture, Information, and Technology"` — rewrite to describe the new structure: 4 standard dimensions (B, EA, I, T) plus organizational assessments.
- Lines 181-220: The ORBIT Dimensions list shows Outcomes (Optional), Roles (Optional), Business Architecture (Required), Information (Required), Technology (Required with "7 sub-dimensions"). Must be rewritten:
  - Add Enterprise Architecture (Required)
  - Remove Outcomes and Roles from this list (they're organizational assessments now)
  - Update Technology to "2 sub-dimensions"
  - Add a separate section explaining Organizational Assessments (Outcomes, Roles)

**5.5.7 Update `src/components/results/ResultsMasterDetail.tsx`**

- `SHORT_DIMENSION_LABELS` record (line ~82): add `'Enterprise Architecture': 'Ent. Arch.'`
- Comment on line 344: `"For standard assessments, get B-I-T dimension scores"` — update to B-EA-I-T.

**5.5.8 Update `src/pages/Results.tsx`**

- No structural changes expected — reads domain data dynamically.

**5.5.9 Update `src/pages/DomainResults.tsx`**

- Review for any hardcoded dimension references.

**5.5.10 Update `src/components/results/DimensionScoresTable.tsx`**

- Review for any hardcoded dimension names or counts. Component appears data-driven.

**5.5.11 Update `src/components/results/DimensionScoresTableWithTarget.tsx`**

- Same review as above.

**Validation:** Visual review of all pages. Run the app and verify:

- Dashboard shows updated Technical domain (2 categories, 11 areas)
- Assessment sidebar shows B, EA, I, T (with T expanded to 2 sub-dimensions)
- Results radar chart has 4 axes
- Enterprise domain assessments show correct aggregate behavior

---

### Phase 6: Export/Import Services

**5.6.1 Update `src/services/export/csvExport.ts`**

- `ORBIT_DIMENSIONS` array: add 'Enterprise Architecture' (now 4 entries):
  ```typescript
  const ORBIT_DIMENSIONS = [
    'Business Architecture',
    'Enterprise Architecture',
    'Information',
    'Technology',
  ];
  ```
- `CSV_HEADERS_STANDARD`: still 'ORBIT' header, but rows now include EA.
- CSV output will have 4 dimension rows per capability area instead of 3.

**5.6.2 Update `src/services/export/pdfExport.ts`**

- `generateExecutiveSummary()`: line 230 says `"five ORBIT dimensions: Outcomes, Roles, Business Architecture, Information, and Technology"` — rewrite to describe the new structure.
- `dimensionScores` record (line 303): add `enterpriseArchitecture: []` to the initialization.
- `generateDimensionDetails()`: will naturally handle EA since it iterates by dimensionId.

**5.6.3 Update `src/services/export/pdfStyles.ts`**

- `DIMENSION_NAMES` record: add `enterpriseArchitecture: 'Enterprise Architecture'`

**5.6.4 Update `src/services/export/importService.ts`**

- Remove `LEGACY_DIMENSION_ID_MAP` (clean break — no `informationData` mapping needed).
- Update `STANDARD_DIMENSION_IDS` to include `'enterpriseArchitecture'`:
  ```typescript
  const STANDARD_DIMENSION_IDS: OrbitDimensionId[] = [
    'businessArchitecture',
    'enterpriseArchitecture',
    'information',
    'technology',
  ];
  ```
- Remove `normalizeDimensionId()` function (no legacy mapping needed).
- Simplify `shouldImportRating()` to remove legacy normalization.
- Update `EXPORT_VERSION` to `'2.0'` to distinguish from old format.

**5.6.5 Update `src/services/export/exportService.ts`**

- `generateStandardAreaProfile()`: the `dimensionMap` record (line 602) is hardcoded to B-I-T:
  ```typescript
  const dimensionMap: Record<OrbitDimensionId, string> = {
    businessArchitecture: 'Business Architecture',
    information: 'Information',
    technology: 'Technology',
  };
  ```
  Must add `enterpriseArchitecture: 'Enterprise Architecture'`.
- Update comments referencing "B-I-T" throughout the file (~10 occurrences).
- Update `EXPORT_VERSION` to `'2.0'`.

**5.6.6 Update `src/services/export/types.ts`**

- No structural changes expected — types reference `OrbitDimensionId` which will be updated.

**5.6.7 Update `src/data/templates/maturity-profile-template.csv`**

- Currently lists 5 dimension rows: Outcomes, Roles, Business Architecture, Information, Technology.
- Update to 4 dimension rows: Business Architecture, Enterprise Architecture, Information, Technology.
- Remove Outcomes and Roles rows (those are organizational assessments, not standard dimensions).

---

### Phase 7: Database Reset

**5.7.1 Update `src/services/db.ts`**

- Increment Dexie database version from 1 to 2
- The version 2 schema can be identical to version 1 (table structure hasn't changed, only the data model within the JSON fields)
- Add an upgrade function that clears all tables:
  ```typescript
  db.version(2)
    .stores({
      // Same schema as v1
    })
    .upgrade(async (tx) => {
      // Clear all data for clean break
      await tx.table('capabilityAssessments').clear();
      await tx.table('orbitRatings').clear();
      await tx.table('attachments').clear();
      await tx.table('assessmentHistory').clear();
      await tx.table('tags').clear();
    });
  ```
- This ensures any cached browser data is wiped cleanly on first load after update.

---

### Phase 8: Tests

**5.8.1 Fix existing tests**

All 490 existing tests will need review. Key areas:

- Tests referencing old aspect IDs (e.g., `compute-hosting`, `business-process`)
- Tests referencing old sub-dimension IDs (e.g., `infrastructure`, `integration`)
- Tests with hardcoded aspect counts (e.g., `getTotalAspectCount()` returning 40 → 31)
- Tests referencing 3 dimensions instead of 4
- Import/export tests with old dimension IDs

**5.8.2 Test files likely affected:**

| Test File                                               | Reason                                          |
| ------------------------------------------------------- | ----------------------------------------------- |
| `src/services/orbit.test.ts` (48 tests)                 | Dimension IDs, aspect counts, sub-dimension IDs |
| `src/services/scoring.test.ts` (24 tests)               | Technology sub-dimension scoring                |
| `src/services/capabilities.test.ts` (39 tests)          | Technical domain areas                          |
| `src/hooks/useScores.test.ts` (if exists)               | Dimension score calculations                    |
| `src/hooks/useCapabilityAssessments.test.ts` (27 tests) | Assessment finalization                         |
| `src/hooks/useOrbitRatings.test.ts` (if exists)         | Rating dimension IDs                            |
| `src/services/export/csvExport.test.ts` (30 tests)      | CSV dimension headers                           |
| `src/services/export/exportService.test.ts` (26 tests)  | Export data structure                           |
| `src/services/export/importService.test.ts` (29 tests)  | Import validation                               |
| `src/services/db.test.ts` (16 tests)                    | Database schema                                 |
| `src/services/history.test.ts` (16 tests)               | Dimension score calculation                     |
| `src/components/results/*.test.tsx`                     | Dimension display                               |

**Validation:** `npm test` — all 490+ tests pass.

---

### Phase 9: Documentation & Release

**5.9.1 Update `CHANGELOG.md`**

Add `## [3.0.0]` entry documenting all changes.

**5.9.2 Update `PROJECT_FOUNDATION_v2.md`**

- Update ORBIT Model Structure table (4 dimensions + 2 sub-dimensions)
- Update aspect counts
- Update Enterprise Domain Assessment Model table
- Update Technology Sub-Dimensions list
- Document the database version bump

**5.9.3 Update `package.json`**

- Version: `"2.1.0"` → `"3.0.0"`

**5.9.4 Update `docs/` reference documents**

- Consider whether the extracted markdown files should replace or supplement the existing reference docs in `docs/`

---

## 6. File Impact Summary

### Files Modified (estimated ~35 files)

| File                                                        | Change Type                                              | Complexity                   |
| ----------------------------------------------------------- | -------------------------------------------------------- | ---------------------------- |
| `src/data/orbit-model.json`                                 | Major rewrite                                            | High — largest single change |
| `src/data/capabilities.json`                                | Partial rewrite (Technical domain only)                  | Medium                       |
| `src/data/templates/maturity-profile-template.csv`          | Update dimension rows                                    | Low                          |
| `src/types/index.ts`                                        | Type additions/changes + JSDoc updates                   | Low                          |
| `src/constants/index.ts`                                    | Minor updates (review only)                              | Low                          |
| `src/services/orbit.ts`                                     | Multiple function updates + hardcoded arrays             | Medium                       |
| `src/services/scoring.ts`                                   | Review only (generic logic)                              | Low                          |
| `src/services/history.ts`                                   | Review only (generic logic)                              | Low                          |
| `src/services/db.ts`                                        | Version bump + migration                                 | Low                          |
| `src/hooks/useScores.ts`                                    | Display name + dimension iteration                       | Medium                       |
| `src/hooks/useOrbitRatings.ts`                              | Review only                                              | Low                          |
| `src/hooks/useCapabilityAssessments.ts`                     | Review only (uses dynamic iteration)                     | Low                          |
| `src/pages/Assessment.tsx`                                  | Nav item generation — hardcoded dimension array          | Medium                       |
| `src/pages/HistoryView.tsx`                                 | Nav item generation — **same pattern as Assessment.tsx** | Medium                       |
| `src/pages/AreaResults.tsx`                                 | Radar chart labels + comments                            | Low                          |
| `src/pages/Landing.tsx`                                     | Prose text — dimension count references                  | Low                          |
| `src/pages/About.tsx`                                       | Prose text — ORBIT dimension list rewrite                | Medium                       |
| `src/pages/Results.tsx`                                     | Review only                                              | Low                          |
| `src/pages/DomainResults.tsx`                               | Review only                                              | Low                          |
| `src/components/assessment/AssessmentSidebar.tsx`           | Comment update                                           | Low                          |
| `src/components/results/ResultsMasterDetail.tsx`            | SHORT_DIMENSION_LABELS + comments                        | Low                          |
| `src/components/results/DimensionScoresTable.tsx`           | Review only                                              | Low                          |
| `src/components/results/DimensionScoresTableWithTarget.tsx` | Review only                                              | Low                          |
| `src/services/export/csvExport.ts`                          | Dimension list update                                    | Low                          |
| `src/services/export/pdfExport.ts`                          | Text + dimension score init + version                    | Medium                       |
| `src/services/export/pdfStyles.ts`                          | Dimension names record                                   | Low                          |
| `src/services/export/importService.ts`                      | Simplification + version + dimension IDs                 | Medium                       |
| `src/services/export/exportService.ts`                      | Dimension map + comments + version                       | Medium                       |
| `src/services/export/types.ts`                              | Review only                                              | Low                          |
| `CHANGELOG.md`                                              | New entry                                                | Low                          |
| `PROJECT_FOUNDATION_v2.md`                                  | Multiple section updates                                 | Medium                       |
| `package.json`                                              | Version bump                                             | Low                          |
| ~12 test files                                              | Fixture updates, count changes                           | Medium-High                  |

### Files NOT Modified

- All non-Technical capability domain data in `capabilities.json` (13 domains unchanged)
- `src/components/assessment/AspectCard.tsx` — renders aspects generically
- `src/components/assessment/MaturityLevelSelector.tsx` — level selection is generic
- `src/components/assessment/QuestionChecklist.tsx` — renders questions generically
- `src/components/assessment/AttachmentUpload.tsx` — generic
- `src/components/assessment/AssessmentContextBar.tsx` — generic
- `src/components/dashboard/` — all components read data dynamically via hooks
- `src/components/export/` — dialogs are generic
- `src/theme/` — no changes
- `src/utils/` — no changes (colors.ts, errors.ts are generic)
- `src/services/tags.ts` — no changes
- `src/services/capabilities.ts` — reads from JSON dynamically, no hardcoded dimension refs
- `src/hooks/useHistory.ts` — no changes
- `src/hooks/useTags.ts` — no changes
- `src/hooks/useAttachments.ts` — no changes
- `src/hooks/useDebounce.ts` — no changes
- `src/main.tsx` — no changes
- `src/App.tsx` — routes are unchanged

---

## 7. Codebase-Wide Comment & String Sweep

The audit found **60+ references** to "B-I-T" across comments, JSDoc, aria-labels, and string literals. These need a systematic sweep during implementation:

| Pattern                                            | Occurrences                                   | Action                                    |
| -------------------------------------------------- | --------------------------------------------- | ----------------------------------------- |
| `B-I-T` in comments/JSDoc                          | ~40                                           | Replace with `B-EA-I-T`                   |
| `"three"` or `"3 dimensions"`                      | ~5                                            | Replace with `"four"` or `"4 dimensions"` |
| `"five ORBIT dimensions"`                          | ~3 (Landing, About, PDF)                      | Rewrite to describe new structure         |
| `"7 sub-dimensions"`                               | ~2 (About page)                               | Replace with `"2 sub-dimensions"`         |
| `['businessArchitecture', 'information'] as const` | 4 (orbit.ts, Assessment.tsx, HistoryView.tsx) | Add `'enterpriseArchitecture'`            |
| Old sub-dimension IDs in test fixtures             | ~15                                           | Replace with new IDs                      |

---

## 8. Risk Assessment

| Risk                                  | Likelihood | Impact | Mitigation                                                              |
| ------------------------------------- | ---------- | ------ | ----------------------------------------------------------------------- |
| orbit-model.json transcription errors | Medium     | High   | Automated extraction scripts with validation; cross-check aspect counts |
| Missed hardcoded dimension references | Low        | Medium | TypeScript strict mode catches most; grep for old dimension/aspect IDs  |
| Scoring algorithm changes unintended  | Low        | High   | Scoring logic is generic (averages); only structural inputs change      |
| Enterprise domain aggregate breaks    | Medium     | Medium | Explicit testing of aggregate calculations with new 4-dimension model   |
| Test fixture updates missed           | Medium     | Low    | Run full test suite; TypeScript catches type mismatches                 |
| Browser cached data causes errors     | Low        | Medium | Database version bump clears all data on first load                     |

---

## 9. Execution Order Summary

```
Phase 1: Data Files          ← Foundation, do first
  ├── orbit-model.json
  ├── capabilities.json
  └── maturity-profile-template.csv
Phase 2: Type System          ← TypeScript flags all downstream issues
  └── types/index.ts
Phase 3: Service Layer        ← Fix core logic
  ├── constants/index.ts (review)
  ├── orbit.ts
  ├── scoring.ts (review)
  └── history.ts (review)
Phase 4: Hooks                ← Fix business logic
  ├── useScores.ts
  ├── useOrbitRatings.ts (review)
  └── useCapabilityAssessments.ts (comments)
Phase 5: UI                   ← Fix presentation
  ├── Assessment.tsx
  ├── HistoryView.tsx          ← ADDED (same nav pattern as Assessment)
  ├── AreaResults.tsx
  ├── Landing.tsx              ← ADDED (prose text)
  ├── About.tsx                ← ADDED (ORBIT dimension list)
  ├── AssessmentSidebar.tsx (comments)
  ├── ResultsMasterDetail.tsx (labels)
  └── Other components (review)
Phase 6: Export/Import        ← Fix data exchange
  ├── csvExport.ts
  ├── pdfExport.ts
  ├── pdfStyles.ts
  ├── importService.ts
  └── exportService.ts
Phase 7: Database             ← Clean break
  └── db.ts
Phase 8: Tests                ← Verify everything
  └── All test files
Phase 9: Documentation        ← Wrap up
  ├── CHANGELOG.md
  ├── PROJECT_FOUNDATION_v2.md
  └── package.json
```

---

## 10. Verification Checklist

After implementation, verify:

- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm test` — all tests pass
- [ ] `npm run lint` — zero errors
- [ ] `npm run build` — production build succeeds
- [ ] Dashboard shows 11 Technical capability areas (was 22) across 2 categories
- [ ] Total capability area count: 64 (was 75 — reduced by 11 from Technical domain consolidation)
- [ ] Assessment sidebar shows B, EA, I, T dimensions (was B, I, T)
- [ ] Technology assessment shows 2 sub-dimensions in sidebar (was 7)
- [ ] Enterprise Data Management: B, EA, T manual + I aggregate
- [ ] Enterprise Technology: B, EA, I manual + T aggregate
- [ ] Organizational assessments (Outcomes, Roles) unchanged
- [ ] Results radar chart has 4 axes (B, EA, I, T)
- [ ] CSV export has 4 ORBIT dimension rows per area
- [ ] PDF export reflects new dimension structure
- [ ] Scoring: Technology score = average of 2 sub-dimension averages
- [ ] Scoring: Capability score = average of 4 dimension scores (B, EA, I, T)
- [ ] All maturity criteria have descriptions populated
- [ ] Technology aspects have questions and evidence populated
- [ ] BA aspects have questions and evidence populated
- [ ] EA aspects have questions and evidence populated
- [ ] Browser with cached v1 data loads cleanly (data cleared by migration)
