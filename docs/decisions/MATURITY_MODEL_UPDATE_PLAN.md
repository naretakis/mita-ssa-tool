# MITA 4.0 Maturity Model Update — Implementation Plan

> **Historical record (April 26 working draft, superseded by v3.0.0):** This document describes the April 26 PRA pilot working draft that was prepared but never released. It was superseded by the May 3, 2026 PRA Submission which is now reflected in v3.0.0. See [`CHANGELOG.md`](../../CHANGELOG.md) for the current release notes.

**Created:** April 27, 2026
**Status:** Superseded by v3.0.0 (May 3, 2026 PRA Submission)
**Previous App Version:** 2.1.0
**Target App Version:** 3.0.0
**Branch:** `feature/maturity-model-v3`

> This document describes the maturity model changes driven by the MITA workgroups'
> PRA pilot update, the decisions made, and how they were implemented. It serves as
> both a record of what changed and a guide for reviewers.

---

## 1. Executive Summary

The MITA workgroups reworked the maturity model ahead of the PRA official release. Four updated source documents drove changes to the application:

1. **Business and Enterprise Architecture Maturity Criteria** (XLSX) — Reworks Business Architecture into 5 process-focused aspects and extracts 4 enterprise-level aspects into a new Enterprise Architecture organizational assessment
2. **Information Architecture Maturity Criteria** (XLSX) — Completely reworks the Information dimension from 11 data-management-focused aspects to 10 information-focused aspects with full criteria, checklists, and evidence
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

| Old BA Aspect           | Disposition                                               |
| ----------------------- | --------------------------------------------------------- |
| Business Capability     | Moved → Enterprise Architecture organizational assessment |
| Business Process        | Replaced → Business Process Performance                   |
| Business Process Model  | Replaced → Business Process Documentation                 |
| Role Management         | Replaced → Business Process Governance                    |
| Strategic Planning      | Moved → Enterprise Architecture organizational assessment |
| Enterprise Architecture | Moved → Enterprise Architecture organizational assessment |
| Policy Management       | Moved → Enterprise Architecture organizational assessment |

**New Business Architecture aspects (5):**

| #   | Aspect Name                    | ID                               | Source             |
| --- | ------------------------------ | -------------------------------- | ------------------ |
| 1   | Business Process Performance   | `business-process-performance`   | XLSX → BA Criteria |
| 2   | Business Process Documentation | `business-process-documentation` | XLSX → BA Criteria |
| 3   | Business Process Governance    | `business-process-governance`    | XLSX → BA Criteria |
| 4   | Business Process Automation    | `business-process-automation`    | XLSX → BA Criteria |
| 5   | Business Process Reporting     | `business-process-reporting`     | XLSX → BA Criteria |

All 5 aspects have descriptions, questions, and evidence for all 5 maturity levels.

### 2.2 Enterprise Architecture: New Organizational Assessment (4 aspects)

Four aspects that were previously inside Business Architecture are extracted into a new **organizational-level assessment** — assessed once at the enterprise level, not per capability area. This follows the same pattern as Outcomes and Roles.

The EA aspects ask enterprise-wide questions (e.g., "To what extent is enterprise architecture integrated into MITA enterprise planning?") that have the same answer regardless of which capability area is being assessed. Per workgroup direction, they belong in the Support Layer as an organizational assessment.

| #   | Aspect Name             | ID                        | Origin                         |
| --- | ----------------------- | ------------------------- | ------------------------------ |
| 1   | Business Capability     | `business-capability`     | Was BA aspect, content updated |
| 2   | Enterprise Architecture | `enterprise-architecture` | Was BA aspect, content updated |
| 3   | Policy Management       | `policy-management`       | Was BA aspect, content updated |
| 4   | Strategic Planning      | `strategic-planning`      | Was BA aspect, content updated |

**Implementation:**

- New Support Layer domain: "Enterprise Architecture" (`enterprise-architecture-domain`)
- Single capability area: "Organizational Enterprise Architecture" (`organizational-enterprise-architecture`)
- Single organizational assessment with 4 aspects, assessed directly in the sidebar (same UX as Outcomes with 6 aspects or Roles with 6 aspects)
- `OrganizationalAssessmentId` type includes `'enterprise-architecture'`

### 2.3 Information Dimension: Reworked (11 → 10 aspects)

The old Information dimension used data-management-focused aspect names. The new model reframes everything around "information" as the core concept and provides full criteria with checklists and evidence. Two aspects (Information Reporting and Information Metadata) were struck through in the source XLSX and confirmed as eliminated by the workgroup author.

| Old Aspect                          | New Aspect                 |
| ----------------------------------- | -------------------------- |
| Data Quality                        | Information Quality        |
| Data Privacy & Security             | Information Classification |
| Business Intelligence               | Information Analysis       |
| Data Integration & Interoperability | Information Exchange       |
| Document & Content Management       | Information Content        |
| Data Governance                     | Information Governance     |
| Data Architecture & Modeling        | Information Design         |
| Reference Data Management           | Reference Information      |
| Master Data Management              | Master Information         |
| Data Storage & Warehousing          | Information Storage        |
| Metadata Management                 | _(eliminated)_             |

All 10 aspects have descriptions and criteria for all 5 maturity levels. Most have checklists and evidence populated.

### 2.4 Technology Dimension: Consolidated (22 → 11 aspects, 7 → 2 sub-dimensions)

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

All 11 aspects have full descriptions, questions, and evidence for all 5 levels.

**Source Document Naming Discrepancies (resolved):**

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

- **Organizational Outcomes** (6 aspects) and **Organizational Roles** (6 aspects) — unchanged
- **All non-Technical capability domains** — 13 domains unchanged
- **Maturity level definitions** (1-5 + N/A) — unchanged
- **Enterprise Governance domain** — unchanged

### 2.7 Final Model Summary

**ORBIT Dimensions (standard, per-capability):**

| Dimension             | Aspects         | Change                             |
| --------------------- | --------------- | ---------------------------------- |
| Business Architecture | 5               | Reworked (was 7)                   |
| Information           | 10              | Reworked (was 11)                  |
| Technology            | 11 (2 sub-dims) | Consolidated (was 22 / 7 sub-dims) |

**Organizational Assessments (enterprise-level, assessed once):**

| Assessment                             | Aspects | Change                      |
| -------------------------------------- | ------- | --------------------------- |
| Organizational Outcomes                | 6       | Unchanged                   |
| Organizational Roles                   | 6       | Unchanged                   |
| Organizational Enterprise Architecture | 4       | New (extracted from old BA) |

**Totals:**

| Category                          | Previous | New    |
| --------------------------------- | -------- | ------ |
| Standard aspects (per-capability) | 40       | 26     |
| Organizational aspects            | 12       | 16     |
| **Total aspects**                 | **52**   | **42** |
| Capability domains                | 15       | 16     |
| Capability areas                  | 76       | 66     |

---

## 3. Decisions Made

| #   | Decision                          | Resolution                                                                                                                                                                           |
| --- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Technology sub-dimension scoring  | Keep sub-dimension scoring pattern. Average each of the 2 sub-dimensions, then average those for the Technology dimension score.                                                     |
| 2   | Enterprise Architecture placement | EA aspects are enterprise-level questions — assessed once as an organizational assessment in the Support Layer, not per capability area. Follows the same pattern as Outcomes/Roles. |
| 3   | EA domain structure               | Single domain ("Enterprise Architecture") with single capability area ("Organizational Enterprise Architecture") containing all 4 aspects.                                           |
| 4   | Information eliminated aspects    | Information Reporting and Information Metadata removed per workgroup author direction (struck through in source XLSX).                                                               |
| 5   | Backwards compatibility           | Clean break. No legacy import mapping needed.                                                                                                                                        |
| 6   | Existing assessment data          | Clean break. Increment Dexie database version to clear all existing data.                                                                                                            |
| 7   | Version bump                      | Major version: 2.1.0 → 3.0.0 (breaking changes to data model).                                                                                                                       |

---

## 4. Assessment Model Summary

| Domain Type                            | ORBIT Dimensions | Assessment Pattern                   |
| -------------------------------------- | ---------------- | ------------------------------------ |
| Standard capability areas              | B, I, T          | 3 dimensions assessed per capability |
| Enterprise Data Management             | B, T             | 2 manual + I aggregate               |
| Enterprise Technology                  | B, I             | 2 manual + T aggregate               |
| Organizational Outcomes                | —                | 6 aspects assessed directly          |
| Organizational Roles                   | —                | 6 aspects assessed directly          |
| Organizational Enterprise Architecture | —                | 4 aspects assessed directly          |

---

## 5. Implementation Details

### 5.1 Data Files

**`src/data/orbit-model.json`** — Major rewrite

- Replaced `businessArchitecture` dimension: 7 → 5 new process-focused aspects with questions and evidence
- Replaced `information` dimension: 11 → 10 new information-focused aspects with criteria, checklists, and evidence (2 struck-through aspects removed per workgroup direction)
- Replaced `technology` dimension: 7 sub-dimensions → 2 (`technologyInfrastructureManagement`, `applicationManagement`), 22 → 11 aspects with questions and evidence
- Added `enterprise-architecture` to `organizationalAssessments`: 4 aspects with questions and evidence, `capabilityAreaId: 'organizational-enterprise-architecture'`
- Preserved `outcomes` and `roles` organizational assessments unchanged

**`src/data/capabilities.json`** — Partial rewrite

- Replaced `technical` domain categories: 7 → 2, areas: 22 → 11 with new definitions and topics
- Added `enterprise-architecture-domain` (Support Layer): 1 capability area ("Organizational Enterprise Architecture")
- All other domains unchanged
- Total: 16 domains, 66 capability areas

**`src/data/templates/maturity-profile-template.csv`** — Updated to B-I-T dimension rows (removed Outcomes/Roles)

### 5.2 Type System (`src/types/index.ts`)

- `OrbitDimensionId`: `'businessArchitecture' | 'information' | 'technology'` (3 values, B-I-T)
- `OrganizationalAssessmentId`: `'outcomes' | 'roles' | 'enterprise-architecture'` (3 values)
- `TechnologySubDimensionId`: `'technologyInfrastructureManagement' | 'applicationManagement'` (2 values)
- `OrbitModel.organizationalAssessments`: includes `'enterprise-architecture'` entry

### 5.3 Service Layer

- **`src/services/orbit.ts`**: `getAllDimensionIds()` returns B-I-T (3). `getOrganizationalAssessmentTypes()` returns 3 types including `enterprise-architecture`. `getTotalOrganizationalAspectCount()` dynamically sums all organizational assessments.
- **`src/services/db.ts`**: Database version 2 with upgrade function that clears all tables.
- **`src/services/scoring.ts`**: No changes (generic logic).
- **`src/services/history.ts`**: No changes (generic logic).

### 5.4 Constants (`src/constants/index.ts`)

- `ORGANIZATIONAL_ASSESSMENT_AREAS`: added `'organizational-enterprise-architecture': 'enterprise-architecture'`

### 5.5 UI Components & Pages

- **`src/pages/About.tsx`**: Rewrote ORBIT Dimensions section (3 standard dimensions) with separate Organizational Assessments section listing Outcomes, Roles, and Enterprise Architecture.
- **`src/pages/Landing.tsx`**: Updated area count and dimension description.
- **`src/components/results/ResultsMasterDetail.tsx`**: Added short labels for EA organizational assessment aspects in radar chart.

Note: `Assessment.tsx`, `HistoryView.tsx`, `AreaResults.tsx`, `useScores.ts`, and `pdfStyles.ts` required no changes because EA is an organizational assessment (not a standard dimension), so the B-I-T nav builders, radar chart labels, and dimension display names remain unchanged.

### 5.6 Export/Import Services

- **`src/services/export/importService.ts`**: Removed legacy `informationData` mapping. Added `'enterprise-architecture'` to `ORGANIZATIONAL_DIMENSION_IDS` so EA ratings are accepted during import of organizational assessments. `STANDARD_DIMENSION_IDS` remains B-I-T.
- **`src/services/export/exportService.ts`**: Updated organizational rating filter to skip `enterprise-architecture` ratings in standard area profiles (same as `outcomes`/`roles`).
- **`src/services/export/pdfExport.ts`**: Updated organizational rating filter and executive summary text.
- **`src/services/export/csvExport.ts`**: Standard dimension list remains B-I-T. EA assessments export using the "Aspect" header (organizational pattern).
- **`src/services/export/types.ts`**: `organizationalType` field updated to `OrganizationalAssessmentId` type.

### 5.7 Tests Updated

11 test files updated:

- Replaced old sub-dimension IDs (`'infrastructure'`, `'integration'`, etc.) with new IDs
- Replaced old Information aspect IDs (`'data-governance'`, `'data-quality'`) with new IDs
- Updated aspect count expectations (26 standard, 16 organizational, 42 total)
- Updated capability area count expectations (66)
- Updated domain count expectations (16)
- Updated Technology sub-dimension count expectations (2)
- Updated organizational assessment type expectations (3 types)
- Removed legacy `informationData` mapping tests

---

## 6. Files Changed

### Production Code (15 files)

| File                                               | Change                                                             |
| -------------------------------------------------- | ------------------------------------------------------------------ |
| `src/data/orbit-model.json`                        | Major rewrite — 3 dimensions + 3 organizational assessments        |
| `src/data/capabilities.json`                       | Technical domain restructured + EA domain added                    |
| `src/data/templates/maturity-profile-template.csv` | Updated to B-I-T dimension rows                                    |
| `src/types/index.ts`                               | Updated dimension, sub-dimension, and organizational IDs           |
| `src/constants/index.ts`                           | Added EA to organizational assessment areas                        |
| `src/services/orbit.ts`                            | Updated dimension arrays, organizational types, aspect counts      |
| `src/services/db.ts`                               | Added v2 migration (clear all data)                                |
| `src/pages/About.tsx`                              | Rewrote ORBIT dimension and organizational assessment descriptions |
| `src/pages/Landing.tsx`                            | Updated area count and dimension description                       |
| `src/components/results/ResultsMasterDetail.tsx`   | Added EA organizational assessment labels                          |
| `src/services/export/csvExport.ts`                 | Standard dimensions remain B-I-T                                   |
| `src/services/export/exportService.ts`             | Added EA to organizational rating filter                           |
| `src/services/export/importService.ts`             | Removed legacy mapping, added EA to organizational IDs             |
| `src/services/export/pdfExport.ts`                 | Updated organizational rating filter and summary text              |
| `src/services/export/types.ts`                     | Updated organizationalType to OrganizationalAssessmentId           |

### Test Files (11 files)

| File                                                   | Change                                                     |
| ------------------------------------------------------ | ---------------------------------------------------------- |
| `src/services/orbit.test.ts`                           | Dimension IDs, aspect counts, sub-dimension IDs, org types |
| `src/services/scoring.test.ts`                         | Sub-dimension IDs in fixtures                              |
| `src/services/capabilities.test.ts`                    | Domain and area counts                                     |
| `src/services/history.test.ts`                         | Sub-dimension IDs in fixtures                              |
| `src/services/db.test.ts`                              | Sub-dimension IDs in fixtures                              |
| `src/hooks/useScores.test.ts`                          | Dimension counts, aspect IDs, area counts                  |
| `src/hooks/useOrbitRatings.test.ts`                    | Sub-dimension IDs in fixtures                              |
| `src/components/results/DimensionScoresTable.test.tsx` | Sub-dimension IDs and names                                |
| `src/services/export/csvExport.test.ts`                | Dimension count expectations                               |
| `src/services/export/exportService.test.ts`            | Aspect IDs in fixtures                                     |
| `src/services/export/importService.test.ts`            | Aspect IDs, removed legacy tests                           |

### Files NOT Modified

- `src/pages/Assessment.tsx`, `src/pages/HistoryView.tsx`, `src/pages/AreaResults.tsx` — EA is organizational, so B-I-T nav builders and radar chart labels are unchanged
- `src/hooks/useScores.ts` — dimension display names remain B-I-T
- `src/services/export/pdfStyles.ts` — dimension names record remains B-I-T
- `src/components/assessment/*` — all render generically
- `src/components/dashboard/*` — all read data dynamically via hooks
- `src/services/scoring.ts`, `src/services/history.ts`, `src/services/capabilities.ts`, `src/services/tags.ts` — generic logic
- `src/hooks/useHistory.ts`, `src/hooks/useTags.ts`, `src/hooks/useAttachments.ts`, `src/hooks/useOrbitRatings.ts`, `src/hooks/useCapabilityAssessments.ts`
- `src/main.tsx`, `src/App.tsx`, `src/theme/*`, `src/utils/*`

---

## 7. Verification Results

All automated checks pass:

- [x] `npm run typecheck` — 0 errors
- [x] `npm test` — 488 tests passing (26 test files)
- [x] `npm run lint` — 0 errors
- [x] `npm run build` — production build succeeds

### Manual Testing Checklist

- [ ] Dashboard shows 11 Technical capability areas across 2 categories
- [ ] Dashboard shows Enterprise Architecture domain (Support Layer) with 1 area
- [ ] Total capability area count: 66
- [ ] Standard assessment sidebar shows B, I, T dimensions (3 dimensions)
- [ ] Technology assessment shows 2 sub-dimensions in sidebar
- [ ] Information assessment shows 10 aspects
- [ ] Enterprise Architecture assessment shows 4 aspects directly in sidebar
- [ ] Enterprise Data Management: B, T manual + I aggregate
- [ ] Enterprise Technology: B, I manual + T aggregate
- [ ] Organizational assessments (Outcomes, Roles) unchanged
- [ ] Results page shows all domains including Enterprise Architecture
- [ ] Area results for EA shows bar chart with 4 aspects (organizational pattern)
- [ ] CSV export: standard areas have 3 dimension rows (B-I-T), EA uses Aspect header
- [ ] PDF export reflects correct dimension structure
- [ ] Import accepts EA organizational ratings
- [ ] Scoring: Technology score = average of 2 sub-dimension averages
- [ ] Scoring: Standard capability score = average of 3 dimension scores (B, I, T)
- [ ] All maturity criteria have descriptions populated
- [ ] BA, Information, and Technology aspects have questions/evidence populated
- [ ] EA aspects have questions and evidence populated
- [ ] Browser with cached v1 data loads cleanly (data cleared by migration)

---

## 8. Remaining Work

The following should be completed before merge:

- [ ] Update `CHANGELOG.md` with `## [3.0.0]` entry
- [ ] Update `PROJECT_FOUNDATION_v2.md` with new model structure
- [ ] Update `package.json` version to `3.0.0`
