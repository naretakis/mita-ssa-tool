# MITA 4.0 Maturity Model Update — Implementation Plan

**Created:** April 27, 2026
**Status:** Implemented
**Previous App Version:** 2.1.0
**Target App Version:** 3.0.0
**Branch:** `feature/maturity-model-v3`

> This document describes the maturity model changes driven by the MITA workgroups'
> PRA pilot update, the decisions made, and how they were implemented. It serves as
> both a record of what changed and a guide for reviewers.

---

## 1. Executive Summary

The MITA workgroups reworked the maturity model ahead of the PRA official release. Four updated source documents drove changes to the application:

1. **Business and Enterprise Architecture Maturity Criteria** (XLSX) — Splits the old Business Architecture dimension into two: a reworked Business Architecture (5 aspects) and a new Enterprise Architecture dimension (4 aspects)
2. **Information Architecture Maturity Criteria** (XLSX) — Completely reworks the Information dimension from 11 data-management-focused aspects to 12 information-focused aspects with full criteria, checklists, and evidence
3. **MITA 4 Maturity Model Guide** (DOCX) — Consolidates Technology from 22 aspects across 7 sub-dimensions down to 11 aspects across 2 sub-dimensions, with full questions and evidence
4. **MITA 4.0 Capability Reference Model** (DOCX) — Restructures the Technical capability domain from 7 categories / 22 areas to 2 categories / 11 areas

No backwards compatibility is required. This is a clean break (major version bump to 3.0.0). The database is reset via a version increment.

### Source Documents

All source documents are preserved in the repository:

| Document                                          | Location                                                |
| ------------------------------------------------- | ------------------------------------------------------- |
| BA & EA Maturity Criteria (XLSX)                  | `docs/updated-documents/` and `docs/double-check-docs/` |
| Information Architecture Maturity Criteria (XLSX) | `docs/double-check-docs/`                               |
| Technology Maturity Model Guide (DOCX)            | `docs/updated-documents/` and `docs/double-check-docs/` |
| Capability Reference Model (DOCX)                 | `docs/updated-documents/`                               |
| Extracted markdown content                        | `docs/updated-documents/extracted/`                     |

### Extraction & Generation Scripts

Content was extracted from DOCX/XLSX using Python scripts with automated validation:

| Script                                 | Purpose                                                                 |
| -------------------------------------- | ----------------------------------------------------------------------- |
| `scripts/extract-xlsx.py`              | Extracts BA/EA criteria from XLSX to markdown                           |
| `scripts/extract-docx-maturity.py`     | Extracts Technology criteria from DOCX to markdown                      |
| `scripts/extract-docx-capabilities.py` | Extracts Technical capability areas from DOCX to markdown               |
| `scripts/generate-orbit-model.py`      | Generates `orbit-model.json` from source documents (BA, EA, Technology) |
| `scripts/update-capabilities.py`       | Updates `capabilities.json` Technical domain from source document       |

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

| #   | Aspect Name                    | ID                               | Source             |
| --- | ------------------------------ | -------------------------------- | ------------------ |
| 1   | Business Process Performance   | `business-process-performance`   | XLSX → BA Criteria |
| 2   | Business Process Documentation | `business-process-documentation` | XLSX → BA Criteria |
| 3   | Business Process Governance    | `business-process-governance`    | XLSX → BA Criteria |
| 4   | Business Process Automation    | `business-process-automation`    | XLSX → BA Criteria |
| 5   | Business Process Reporting     | `business-process-reporting`     | XLSX → BA Criteria |

All 5 aspects have descriptions, questions, and evidence for all 5 maturity levels.

### 2.2 New Enterprise Architecture Dimension (4 aspects)

A new ORBIT dimension. Four aspects that were previously inside Business Architecture are extracted into their own dimension with updated content.

| #   | Aspect Name             | ID                        | Origin                         |
| --- | ----------------------- | ------------------------- | ------------------------------ |
| 1   | Business Capability     | `business-capability`     | Was BA aspect, content updated |
| 2   | Enterprise Architecture | `enterprise-architecture` | Was BA aspect, content updated |
| 3   | Policy Management       | `policy-management`       | Was BA aspect, content updated |
| 4   | Strategic Planning      | `strategic-planning`      | Was BA aspect, content updated |

All 4 aspects have descriptions, questions, and evidence for all 5 maturity levels. Enterprise Architecture is a **required** dimension.

### 2.3 Information Dimension: Reworked (11 → 12 aspects)

The old Information dimension used data-management-focused aspect names. The new model reframes everything around "information" as the core concept, adds one new aspect, and provides full criteria with checklists and evidence.

| Old Aspect                          | New Aspect                 |
| ----------------------------------- | -------------------------- |
| Data Quality                        | Information Quality        |
| Data Privacy & Security             | Information Classification |
| Business Intelligence               | Information Analysis       |
| Data Integration & Interoperability | Information Exchange       |
| _(none — new)_                      | **Information Reporting**  |
| Document & Content Management       | Information Content        |
| Metadata Management                 | Information Metadata       |
| Data Governance                     | Information Governance     |
| Data Architecture & Modeling        | Information Design         |
| Reference Data Management           | Reference Information      |
| Master Data Management              | Master Information         |
| Data Storage & Warehousing          | Information Storage        |

All 12 aspects have descriptions and criteria for all 5 maturity levels. Most have checklists and evidence populated (Information Metadata has descriptions only, matching the source document).

### 2.4 Technology Dimension: Consolidated (22 → 11 aspects, 7 → 2 sub-dimensions)

The old 7 sub-dimensions with 22 granular aspects are consolidated into 2 sub-dimensions with 11 broader aspects. The sub-dimension scoring pattern is preserved.

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

All 11 aspects have full descriptions, questions, and evidence for all 5 levels.

**Source Document Naming Discrepancies (resolved):**

Two aspects had minor naming differences between the Maturity Model Guide and Capability Reference Model. We used the Capability Reference Model names as canonical:

| Maturity Model Guide Name                             | Canonical Name (implemented)                           |
| ----------------------------------------------------- | ------------------------------------------------------ |
| Development, Testing, Release and Security Compliance | Development, Testing, Release, and Security Compliance |
| User Interfaces and Session Management                | User Interface and Session Management                  |

### 2.5 Technical Capability Domain: Restructured (22 → 11 areas)

The `capabilities.json` Technical domain mirrors the Technology maturity model:

| New Category                         | Areas   |
| ------------------------------------ | ------- |
| Technology Infrastructure Management | 6 areas |
| Application Management               | 5 areas |

Each area has updated definitions and topics from the Capability Reference Model document.

### 2.6 Unchanged

- **Organizational Assessments** — Outcomes (6 aspects) and Roles (6 aspects) unchanged
- **All non-Technical capability domains** — 13 domains unchanged
- **Maturity level definitions** (1-5 + N/A) — Unchanged
- **Enterprise Governance domain** — Unchanged

### 2.7 Aspect Count Summary

| Dimension                 | Previous        | New             | Change                         |
| ------------------------- | --------------- | --------------- | ------------------------------ |
| Business Architecture     | 7               | 5               | Reworked (all new aspects)     |
| Enterprise Architecture   | —               | 4               | New dimension                  |
| Information               | 11              | 12              | Reworked (all new aspects, +1) |
| Technology                | 22 (7 sub-dims) | 11 (2 sub-dims) | Consolidated                   |
| Outcomes (organizational) | 6               | 6               | Unchanged                      |
| Roles (organizational)    | 6               | 6               | Unchanged                      |
| **Total**                 | **52**          | **44**          | **-8 aspects**                 |

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

With the new EA dimension, the enterprise domain assessment models are:

| Domain                     | Manual Dimensions  | Aggregate Dimension | Rationale                                   |
| -------------------------- | ------------------ | ------------------- | ------------------------------------------- |
| Standard capability areas  | B, EA, I, T        | —                   | All 4 dimensions assessed manually          |
| Enterprise Data Management | B, EA, T           | I (aggregate)       | Information is enterprise-wide data concern |
| Enterprise Technology      | B, EA, I           | T (aggregate)       | Technology is enterprise-wide tech concern  |
| Organizational Outcomes    | 6 aspects directly | —                   | No dimension layer                          |
| Organizational Roles       | 6 aspects directly | —                   | No dimension layer                          |

---

## 5. Implementation Details

### 5.1 Data Files

**`src/data/orbit-model.json`** — Major rewrite via `scripts/generate-orbit-model.py` + manual Information update

- Replaced `businessArchitecture` dimension: 7 → 5 new aspects with questions and evidence
- Added `enterpriseArchitecture` dimension: 4 aspects with questions and evidence
- Replaced `information` dimension: 11 → 12 new aspects with criteria, checklists, and evidence
- Replaced `technology` dimension: 7 sub-dimensions → 2 (`technologyInfrastructureManagement`, `applicationManagement`), 22 → 11 aspects with questions and evidence
- Preserved `organizationalAssessments` (outcomes + roles) unchanged
- Updated `version` and `lastUpdated`

**`src/data/capabilities.json`** — Partial rewrite via `scripts/update-capabilities.py`

- Replaced `technical` domain categories: 7 → 2 (`technology-infrastructure-management`, `application-management`)
- Replaced `technical` domain areas: 22 → 11 with new definitions and topics
- All other domains unchanged
- Total capability areas: 76 → 65

**`src/data/templates/maturity-profile-template.csv`**

- Updated dimension rows: removed Outcomes/Roles, added Enterprise Architecture
- Now shows: Business Architecture, Enterprise Architecture, Information, Technology

### 5.2 Type System

**`src/types/index.ts`**

- `OrbitDimensionId`: added `'enterpriseArchitecture'` (now 4 values: B-EA-I-T)
- `TechnologySubDimensionId`: replaced 7 values with 2 (`'technologyInfrastructureManagement' | 'applicationManagement'`)
- `OrbitModel` interface: added `enterpriseArchitecture: OrbitDimension` to `dimensions`
- Updated JSDoc comments throughout

### 5.3 Service Layer

**`src/services/orbit.ts`**

- `getAllDimensionIds()`: returns 4 IDs (was 3)
- `getRequiredDimensionIds()`: returns all 4
- `getStandardDimensions()`: returns 3 non-Technology dimensions (BA, EA, I)
- `getTotalAspectCount()`: iterates BA, EA, I (was BA, I)
- `getAspectLocation()`: searches BA, EA, I (was BA, I)
- All other functions work automatically via `orbitModel.dimensions[dimensionId]`

**`src/services/scoring.ts`** — No code changes needed. Technology scoring automatically uses 2 sub-dimensions from JSON.

**`src/services/history.ts`** — No code changes needed. Groups by `dimensionId` dynamically.

**`src/services/db.ts`** — Added database version 2 with upgrade function that clears all tables for clean break.

### 5.4 Hooks

**`src/hooks/useScores.ts`**

- `getDimensionDisplayName()`: added `enterpriseArchitecture: 'Enterprise Architecture'`
- `isDimensionRequired()`: added `enterpriseArchitecture`
- All iteration functions use `getAllDimensionIds()` dynamically — no other changes needed

**`src/hooks/useOrbitRatings.ts`** — No changes needed (operates on `RatingDimensionId`).

**`src/hooks/useCapabilityAssessments.ts`** — No changes needed (uses `getAllDimensionIds()` dynamically).

### 5.5 UI Components & Pages

**`src/pages/Assessment.tsx`** — `buildStandardNavItems()` now iterates `['businessArchitecture', 'enterpriseArchitecture', 'information']` for standard dimensions.

**`src/pages/HistoryView.tsx`** — Same pattern update as Assessment.tsx.

**`src/pages/AreaResults.tsx`** — Added `'Enterprise Architecture': 'Ent. Arch.'` to `SHORT_DIMENSION_LABELS`. Radar chart now has 4 axes.

**`src/pages/Landing.tsx`** — Updated prose text: area count and dimension description.

**`src/pages/About.tsx`** — Rewrote ORBIT Dimensions section: 4 required dimensions (B, EA, I, T) with separate Organizational Assessments section for Outcomes/Roles.

**`src/components/results/ResultsMasterDetail.tsx`** — Added `'Enterprise Architecture': 'Ent. Arch.'` to `SHORT_DIMENSION_LABELS`.

### 5.6 Export/Import Services

**`src/services/export/csvExport.ts`** — `ORBIT_DIMENSIONS` array now has 4 entries (added Enterprise Architecture).

**`src/services/export/pdfExport.ts`** — Updated executive summary text, added `enterpriseArchitecture` to dimension score initialization.

**`src/services/export/pdfStyles.ts`** — Added `enterpriseArchitecture: 'Enterprise Architecture'` to `DIMENSION_NAMES`.

**`src/services/export/importService.ts`** — Removed legacy `informationData` mapping and `normalizeDimensionId()`. Added `'enterpriseArchitecture'` to `STANDARD_DIMENSION_IDS`. Supports export versions `'1.0'` and `'2.0'`.

**`src/services/export/exportService.ts`** — Added `enterpriseArchitecture: 'Enterprise Architecture'` to dimension map.

### 5.7 Tests Updated

29 files changed total (excluding this document). Test-specific changes across 11 test files:

- Replaced old sub-dimension IDs (`'infrastructure'`, `'integration'`, etc.) with new IDs (`'technologyInfrastructureManagement'`, `'applicationManagement'`)
- Replaced old Information aspect IDs (`'data-governance'`, `'data-quality'`) with new IDs (`'information-quality'`, `'information-governance'`)
- Updated dimension count expectations (3 → 4)
- Updated aspect count expectations (31 → 32 for standard, 43 → 44 total)
- Updated capability area count expectations (76 → 65)
- Updated Technology sub-dimension count expectations (7 → 2)
- Removed legacy `informationData` mapping tests

---

## 6. Files Changed

### Production Code (18 files)

| File                                               | Change                                            |
| -------------------------------------------------- | ------------------------------------------------- |
| `src/data/orbit-model.json`                        | Major rewrite — all 4 dimensions updated          |
| `src/data/capabilities.json`                       | Technical domain: 7 categories → 2, 22 areas → 11 |
| `src/data/templates/maturity-profile-template.csv` | Updated dimension rows                            |
| `src/types/index.ts`                               | Added EA to types, updated sub-dimension IDs      |
| `src/services/orbit.ts`                            | Updated dimension arrays and iteration            |
| `src/services/db.ts`                               | Added v2 migration (clear all data)               |
| `src/hooks/useScores.ts`                           | Added EA display name and required status         |
| `src/pages/Assessment.tsx`                         | Added EA to nav item builder                      |
| `src/pages/HistoryView.tsx`                        | Added EA to nav item builder                      |
| `src/pages/AreaResults.tsx`                        | Added EA to radar chart labels                    |
| `src/pages/Landing.tsx`                            | Updated prose text                                |
| `src/pages/About.tsx`                              | Rewrote ORBIT dimension descriptions              |
| `src/components/results/ResultsMasterDetail.tsx`   | Added EA to chart labels                          |
| `src/services/export/csvExport.ts`                 | Added EA to dimension list                        |
| `src/services/export/pdfExport.ts`                 | Updated text and dimension init                   |
| `src/services/export/pdfStyles.ts`                 | Added EA to dimension names                       |
| `src/services/export/importService.ts`             | Removed legacy mapping, added EA                  |
| `src/services/export/exportService.ts`             | Added EA to dimension map                         |

### Test Files (11 files)

| File                                                   | Change                                          |
| ------------------------------------------------------ | ----------------------------------------------- |
| `src/services/orbit.test.ts`                           | Dimension IDs, aspect counts, sub-dimension IDs |
| `src/services/scoring.test.ts`                         | Sub-dimension IDs in fixtures                   |
| `src/services/capabilities.test.ts`                    | Technical domain area counts                    |
| `src/services/history.test.ts`                         | Sub-dimension IDs in fixtures                   |
| `src/services/db.test.ts`                              | Sub-dimension IDs in fixtures                   |
| `src/hooks/useScores.test.ts`                          | Dimension counts, aspect IDs                    |
| `src/hooks/useOrbitRatings.test.ts`                    | Sub-dimension IDs in fixtures                   |
| `src/components/results/DimensionScoresTable.test.tsx` | Sub-dimension IDs and names                     |
| `src/services/export/csvExport.test.ts`                | Dimension count expectations                    |
| `src/services/export/exportService.test.ts`            | Aspect IDs in fixtures                          |
| `src/services/export/importService.test.ts`            | Aspect IDs, removed legacy tests                |

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
- `src/services/tags.ts`, `src/services/capabilities.ts` — read from JSON dynamically
- `src/hooks/useHistory.ts`, `src/hooks/useTags.ts`, `src/hooks/useAttachments.ts`, `src/hooks/useDebounce.ts`
- `src/main.tsx`, `src/App.tsx` — no changes
- `src/constants/index.ts` — no changes needed (enterprise domain config unchanged)
- `src/services/scoring.ts`, `src/services/history.ts` — generic logic, no changes needed

---

## 7. Verification Results

All checks pass as of implementation:

- [x] `npm run typecheck` — 0 errors
- [x] `npm test` — 489 tests passing (26 test files)
- [x] `npm run lint` — 0 errors
- [x] `npm run build` — production build succeeds

### Manual Testing Checklist

- [ ] Dashboard shows 11 Technical capability areas (was 22) across 2 categories
- [ ] Total capability area count: 65
- [ ] Assessment sidebar shows B, EA, I, T dimensions (was B, I, T)
- [ ] Technology assessment shows 2 sub-dimensions in sidebar (was 7)
- [ ] Information assessment shows 12 aspects (was 11)
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
- [ ] Information aspects have criteria and checklists populated
- [ ] Browser with cached v1 data loads cleanly (data cleared by migration)

---

## 8. Remaining Work (Phase 9)

The following documentation updates should be completed before merge:

- [ ] Update `CHANGELOG.md` with `## [3.0.0]` entry
- [ ] Update `PROJECT_FOUNDATION_v2.md` with new model structure
- [ ] Update `package.json` version to `3.0.0`
