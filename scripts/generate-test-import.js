#!/usr/bin/env node
/**
 * Generate Test Import ZIP
 *
 * Creates synthetic ZIP files for testing import functionality.
 * Uses the actual data files (capabilities.json, orbit-model.json) to ensure
 * generated data matches the exact structure expected by the import service.
 *
 * Usage:
 *   node scripts/generate-test-import.js          # Generate both files
 *   node scripts/generate-test-import.js small    # Generate small file only
 *   node scripts/generate-test-import.js large    # Generate large file only
 */

import JSZip from 'jszip';
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { randomUUID } from 'crypto';

// ============================================================================
// Load actual data files
// ============================================================================

const capabilitiesData = JSON.parse(readFileSync('src/data/capabilities.json', 'utf-8'));
const orbitModel = JSON.parse(readFileSync('src/data/orbit-model.json', 'utf-8'));

// ============================================================================
// Constants (matching exportService.ts)
// ============================================================================

const EXPORT_VERSION = '1.0';
const APP_VERSION = '0.1.0';

// ============================================================================
// Sample content for realistic data
// ============================================================================

const SAMPLE_NOTES = [
  'Current processes are documented but not consistently followed across all teams. We have identified several areas where staff are using informal workarounds rather than following established procedures. A process improvement initiative is planned for Q3 to address these gaps and ensure consistent application of documented workflows.',
  'Staff training has been completed for core functions, with over 85% of team members now certified on the new system. Additional training is planned for Q2 to cover advanced features and edge case handling. We are also developing a mentorship program to pair experienced staff with newer team members.',
  'Integration with the state Health Information Exchange (HIE) is in progress and approximately 60% complete. Expected completion is by end of fiscal year. Current focus is on data mapping and validation rules. Initial testing has shown promising results with a 95% match rate on member demographics.',
  'Legacy system limitations require manual workarounds for some edge cases, particularly around complex eligibility scenarios. The team has documented 23 specific scenarios that require manual intervention. We are working with the vendor to prioritize these for resolution in the next system update scheduled for Q4.',
  'Recent internal audit identified several areas for improvement in documentation practices. Key findings included inconsistent version control, missing approval signatures, and outdated procedure manuals. A remediation plan has been developed with target completion dates for each finding.',
  'Stakeholder feedback has been overwhelmingly positive regarding recent process improvements. Survey results show a 40% increase in satisfaction scores compared to last year. Key areas of improvement cited include faster turnaround times, clearer communication, and more intuitive system interfaces.',
  'A cross-functional team has been established to address identified gaps in our current capabilities. The team includes representatives from IT, operations, policy, and compliance. Weekly meetings are held to track progress and remove blockers. Initial focus areas include data quality and system integration.',
  'Vendor support contract has been renewed with enhanced SLA requirements including 99.9% uptime guarantee and 4-hour response time for critical issues. New contract also includes quarterly business reviews and dedicated account management. Cost increase of 12% was approved given the improved service levels.',
  'Process automation initiative is underway to reduce manual effort and improve accuracy. Phase 1 focused on eligibility verification has reduced processing time by 35%. Phase 2 will target claims adjudication workflows. Full implementation expected by end of calendar year with projected annual savings of $2.1M.',
  'Data quality improvements implemented over the past 6 months have resulted in a 45% reduction in processing errors. Key improvements include automated validation rules, duplicate detection algorithms, and enhanced data entry forms. Ongoing monitoring dashboards have been established to track quality metrics.',
];

const SAMPLE_BARRIERS = [
  'Limited staff capacity continues to be a significant challenge for implementing new processes. Current team is operating at 120% capacity due to ongoing modernization efforts combined with day-to-day operations. Hiring freeze has prevented backfilling two vacant positions. We are exploring contractor support as a short-term solution while advocating for permanent staffing increases.',
  'Budget constraints are affecting the technology modernization timeline significantly. Originally planned for completion in FY2026, the project has been extended to FY2027 due to a 15% reduction in capital funding. We are prioritizing critical functionality and exploring phased implementation approaches to deliver value incrementally within available resources.',
  'Legacy system integration challenges require custom development work that was not originally scoped. The 20-year-old mainframe system uses proprietary data formats that are not compatible with modern APIs. Estimated additional development effort is 6 months and $500K. We are evaluating whether to invest in integration or accelerate replacement.',
  'Competing priorities with other state initiatives have diverted key resources from this project. The statewide ERP implementation and cybersecurity remediation efforts have taken precedence. We have escalated to leadership for prioritization guidance and are working to identify dedicated resources that can be protected from reassignment.',
  'Vendor dependency for critical system modifications creates timeline and cost uncertainties. Current contract requires 90-day notice for change requests, and vendor capacity is limited. Recent change requests have taken 4-6 months to implement. We are exploring options to bring more development capability in-house or negotiate improved contract terms.',
  'Staff turnover is impacting institutional knowledge retention and project continuity. Three senior team members have departed in the past year, taking critical system knowledge with them. Exit interviews indicate compensation and remote work flexibility as primary factors. Knowledge transfer protocols have been implemented but gaps remain.',
  'Complex regulatory requirements require careful interpretation and often result in implementation delays. Recent CMS guidance on interoperability has required significant rework of planned approaches. We have engaged external consultants to assist with compliance interpretation and are participating in industry working groups to stay ahead of regulatory changes.',
  'Data quality issues in source systems are affecting downstream processes and reporting accuracy. Analysis shows approximately 8% of member records have incomplete or inconsistent data. Root causes include manual data entry errors, system migration issues, and lack of validation rules. A comprehensive data cleansing initiative is needed but not currently funded.',
  'Interoperability challenges with external partners continue to slow progress on data exchange initiatives. Each partner uses different data standards and formats, requiring custom mapping for each connection. Industry standards adoption is inconsistent. We are advocating for statewide data standards through the governance council.',
  'Resource constraints are limiting training opportunities for staff, creating skill gaps in emerging technologies. Training budget was reduced by 30% this year. We are leveraging free online resources and peer learning sessions to supplement formal training. Key skill gaps exist in cloud technologies, API development, and data analytics.',
];

const SAMPLE_PLANS = [
  'Implement automated monitoring and alerting by Q3 2026. This will include real-time dashboards for key performance indicators, automated threshold alerts, and integration with the enterprise incident management system. Vendor has been selected and contract negotiations are in progress. Expected cost is $150K with ongoing annual maintenance of $30K.',
  'Complete comprehensive staff training program by end of fiscal year. Program includes role-based curriculum for 150 staff members, hands-on lab exercises, and certification assessments. Training will be delivered in cohorts of 25 over 6 months. Success metrics include 90% certification rate and demonstrated proficiency in core workflows.',
  'Migrate to cloud-based infrastructure within 18 months as part of the enterprise cloud-first initiative. Migration will follow a lift-and-shift approach for initial phase, followed by cloud-native optimization. Benefits include improved scalability, disaster recovery, and reduced data center costs. Estimated savings of $400K annually after migration.',
  'Establish formal governance committee by Q2 2026 to provide oversight and strategic direction. Committee will include representatives from business, IT, compliance, and executive leadership. Monthly meetings will review project status, approve major decisions, and resolve escalated issues. Charter and operating procedures are being drafted.',
  'Deploy enhanced reporting and analytics dashboard by Q4 2026. New platform will provide self-service reporting capabilities, interactive visualizations, and predictive analytics. Current manual reporting processes consume 200 staff hours monthly. New system expected to reduce this by 75% while improving data accuracy and timeliness.',
  'Complete vendor evaluation for system replacement by end of Q2. RFP has been issued to 8 qualified vendors with responses due in 6 weeks. Evaluation criteria include functionality fit, total cost of ownership, implementation timeline, and vendor stability. Selection committee includes representatives from all stakeholder groups.',
  'Develop comprehensive documentation library including process maps, system guides, and training materials. Project will inventory existing documentation, identify gaps, and create standardized templates. Target is to have complete documentation for all critical processes by end of fiscal year. Documentation will be maintained in SharePoint with version control.',
  'Implement continuous improvement feedback loop with quarterly retrospectives and monthly metrics reviews. Process will include structured feedback collection from staff and stakeholders, root cause analysis for issues, and action item tracking. Goal is to achieve measurable improvement in at least 3 key metrics each quarter.',
  'Establish data quality metrics and monitoring program with automated data profiling and exception reporting. Program will define quality dimensions, set thresholds, and create remediation workflows. Initial focus on member and provider data. Target is to achieve 98% data quality score within 12 months.',
  'Create cross-training program for key staff roles to improve resilience and reduce single points of failure. Program will identify critical roles, develop training curricula, and establish rotation schedules. Each critical function will have at least 2 trained backups. Implementation over 9 months with ongoing maintenance.',
];

const SAMPLE_TAGS = ['FY2026', 'Priority', 'In Review', 'Modernization', 'Compliance'];

const SAMPLE_ATTACHMENTS = [
  { baseName: 'process-documentation', ext: 'pdf', fileType: 'application/pdf', description: 'Current state process documentation' },
  { baseName: 'audit-findings', ext: 'pdf', fileType: 'application/pdf', description: 'Internal audit findings' },
  { baseName: 'training-materials', ext: 'docx', fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', description: 'Staff training materials' },
  { baseName: 'system-architecture', ext: 'png', fileType: 'image/png', description: 'System architecture diagram' },
  { baseName: 'data-flow-diagram', ext: 'png', fileType: 'image/png', description: 'Data flow between systems' },
  { baseName: 'compliance-checklist', ext: 'xlsx', fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', description: 'Compliance requirements checklist' },
  { baseName: 'vendor-contract', ext: 'pdf', fileType: 'application/pdf', description: 'Vendor contract and SLA documentation' },
  { baseName: 'policy-manual', ext: 'pdf', fileType: 'application/pdf', description: 'Policy and procedure manual' },
  { baseName: 'security-assessment', ext: 'pdf', fileType: 'application/pdf', description: 'Security assessment report' },
  { baseName: 'performance-metrics', ext: 'xlsx', fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', description: 'Performance metrics dashboard' },
  { baseName: 'stakeholder-feedback', ext: 'docx', fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', description: 'Stakeholder feedback summary' },
  { baseName: 'implementation-plan', ext: 'pdf', fileType: 'application/pdf', description: 'Implementation roadmap and timeline' },
  { baseName: 'risk-assessment', ext: 'xlsx', fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', description: 'Risk assessment matrix' },
  { baseName: 'integration-specs', ext: 'pdf', fileType: 'application/pdf', description: 'Integration specifications document' },
  { baseName: 'user-guide', ext: 'docx', fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', description: 'End user guide and documentation' },
  { baseName: 'test-results', ext: 'pdf', fileType: 'application/pdf', description: 'Testing results and validation report' },
  { baseName: 'workflow-diagram', ext: 'png', fileType: 'image/png', description: 'Business workflow diagram' },
  { baseName: 'gap-analysis', ext: 'xlsx', fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', description: 'Gap analysis findings' },
  { baseName: 'meeting-notes', ext: 'docx', fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', description: 'Governance meeting notes' },
  { baseName: 'budget-justification', ext: 'pdf', fileType: 'application/pdf', description: 'Budget justification document' },
];

// Counter for unique filenames
let attachmentCounter = 0;

// ============================================================================
// Helper Functions
// ============================================================================

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomSubset(array, minCount = 1, maxCount = array.length) {
  const count = randomInt(minCount, Math.min(maxCount, array.length));
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateDate(daysAgo = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

// ============================================================================
// Data Structure Helpers (matching the app's structure)
// ============================================================================

/**
 * Get all areas from a domain (handles both standard and categorized domains)
 */
function getAreasFromDomain(domain) {
  if (domain.categories) {
    return domain.categories.flatMap((c) => c.areas);
  }
  return domain.areas || [];
}

/**
 * Get all aspects with their dimension/subdimension info from the ORBIT model
 */
function getAllAspects() {
  const aspects = [];

  // Standard dimensions: outcomes, roles, businessArchitecture, information
  for (const dimId of ['outcomes', 'roles', 'businessArchitecture', 'information']) {
    const dimension = orbitModel.dimensions[dimId];
    if (dimension && dimension.aspects) {
      for (const aspect of dimension.aspects) {
        aspects.push({
          dimensionId: dimId,
          subDimensionId: undefined,
          aspectId: aspect.id,
          aspectName: aspect.name,
        });
      }
    }
  }

  // Technology dimension has sub-dimensions
  const techDimension = orbitModel.dimensions.technology;
  if (techDimension && techDimension.subDimensions) {
    for (const subDim of techDimension.subDimensions) {
      for (const aspect of subDim.aspects) {
        aspects.push({
          dimensionId: 'technology',
          subDimensionId: subDim.id,
          aspectId: aspect.id,
          aspectName: aspect.name,
        });
      }
    }
  }

  return aspects;
}

// ============================================================================
// Data Generators
// ============================================================================

/**
 * Generate a capability assessment record
 */
function generateAssessment(domain, area) {
  const id = randomUUID();
  const createdDaysAgo = randomInt(30, 90);
  const updatedDaysAgo = randomInt(0, createdDaysAgo);
  const overallScore = parseFloat((randomInt(20, 45) / 10).toFixed(1));

  return {
    id,
    capabilityDomainId: domain.id,
    capabilityDomainName: domain.name,
    capabilityAreaId: area.id,
    capabilityAreaName: area.name,
    status: 'finalized',
    tags: randomSubset(SAMPLE_TAGS, 1, 3),
    createdAt: generateDate(createdDaysAgo),
    updatedAt: generateDate(updatedDaysAgo),
    finalizedAt: generateDate(updatedDaysAgo),
    overallScore,
  };
}

/**
 * Generate all ORBIT ratings for an assessment
 * Creates one rating per aspect in the ORBIT model
 */
function generateRatings(assessmentId) {
  const allAspects = getAllAspects();
  const ratings = [];

  for (const aspectInfo of allAspects) {
    const currentLevel = randomInt(1, 5);
    // Target level should be >= current level (users wouldn't set a lower target)
    const targetLevel = currentLevel === 5 ? 5 : randomInt(currentLevel, 5);

    const rating = {
      id: randomUUID(),
      capabilityAssessmentId: assessmentId,
      dimensionId: aspectInfo.dimensionId,
      aspectId: aspectInfo.aspectId,
      currentLevel,
      targetLevel,
      questionResponses: [],
      evidenceResponses: [],
      notes: Math.random() > 0.3 ? randomChoice(SAMPLE_NOTES) : '',
      barriers: Math.random() > 0.5 ? randomChoice(SAMPLE_BARRIERS) : '',
      plans: Math.random() > 0.4 ? randomChoice(SAMPLE_PLANS) : '',
      carriedForward: false,
      attachmentIds: [],
      updatedAt: generateDate(randomInt(0, 30)),
    };

    // Add subDimensionId for technology aspects
    if (aspectInfo.subDimensionId) {
      rating.subDimensionId = aspectInfo.subDimensionId;
    }

    ratings.push(rating);
  }

  return ratings;
}

/**
 * Generate a history snapshot for an assessment
 */
function generateHistory(assessment, ratings) {
  const snapshotDaysAgo = randomInt(60, 180);

  // Calculate dimension scores
  const dimensionScores = {};
  const ratingsByDim = {};

  for (const rating of ratings) {
    const key = rating.subDimensionId
      ? `${rating.dimensionId}:${rating.subDimensionId}`
      : rating.dimensionId;

    if (!ratingsByDim[key]) {
      ratingsByDim[key] = [];
    }
    if (rating.currentLevel > 0) {
      ratingsByDim[key].push(rating.currentLevel);
    }
  }

  for (const [key, levels] of Object.entries(ratingsByDim)) {
    if (levels.length > 0) {
      dimensionScores[key] = levels.reduce((a, b) => a + b, 0) / levels.length;
    }
  }

  // Create historical ratings (slightly lower scores to simulate progress)
  const historicalRatings = ratings.map((r) => {
    const historicalCurrentLevel = Math.max(1, r.currentLevel - randomInt(0, 1));
    return {
      dimensionId: r.dimensionId,
      subDimensionId: r.subDimensionId,
      aspectId: r.aspectId,
      currentLevel: historicalCurrentLevel,
      // Target level stays the same or is at least >= historical current level
      targetLevel: Math.max(historicalCurrentLevel, r.targetLevel),
      questionResponses: [],
      evidenceResponses: [],
      notes: r.notes,
      barriers: r.barriers,
      plans: r.plans,
    };
  });

  return {
    id: randomUUID(),
    capabilityAssessmentId: assessment.id,
    capabilityAreaId: assessment.capabilityAreaId,
    snapshotDate: generateDate(snapshotDaysAgo),
    tags: [...assessment.tags],
    overallScore: Math.max(1, (assessment.overallScore || 3) - 0.5),
    dimensionScores,
    ratings: historicalRatings,
  };
}

/**
 * Generate synthetic file content
 */
function generateSyntheticFileContent(fileType, fileName) {
  if (fileType === 'application/pdf') {
    // Minimal valid PDF
    return Buffer.from(
      '%PDF-1.4\n' +
      '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n' +
      '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n' +
      '3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\n' +
      'xref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000101 00000 n \n' +
      'trailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF'
    );
  } else if (fileType === 'image/png') {
    // Minimal valid 1x1 PNG
    return Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
      0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
      0xde, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41,
      0x54, 0x08, 0xd7, 0x63, 0xf8, 0xcf, 0xc0, 0x00,
      0x00, 0x00, 0x03, 0x00, 0x01, 0x00, 0x18, 0xdd,
      0x8d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45,
      0x4e, 0x44, 0xae, 0x42, 0x60, 0x82
    ]);
  } else {
    // Text placeholder for other types
    return Buffer.from(`Synthetic test file: ${fileName}\nGenerated: ${new Date().toISOString()}\n`);
  }
}

/**
 * Generate attachments for an assessment
 * @param {boolean} forceAttachment - If true, always generate at least one attachment
 * @param {boolean} isGuaranteedDomain - If true, place attachments in known dimensions
 */
function generateAttachments(assessment, ratings, forceAttachment = false, isGuaranteedDomain = false) {
  const attachments = [];
  const attachmentFiles = [];

  // For guaranteed domains, ALWAYS add attachments to specific dimensions
  if (isGuaranteedDomain) {
    // Get ratings for the guaranteed dimensions
    const guaranteedRatings = ratings.filter(r => 
      GUARANTEED_ATTACHMENT_DIMENSIONS.includes(r.dimensionId)
    );
    
    // Add 2-4 attachments per guaranteed dimension
    for (const dimId of GUARANTEED_ATTACHMENT_DIMENSIONS) {
      const dimRatings = guaranteedRatings.filter(r => r.dimensionId === dimId);
      const numForDim = randomInt(2, 4);
      const selectedRatings = randomSubset(dimRatings, numForDim, numForDim);
      
      for (const rating of selectedRatings) {
        const template = randomChoice(SAMPLE_ATTACHMENTS);
        const attachmentId = randomUUID();
        // Generate unique filename with counter
        const uniqueFileName = `${template.baseName}-${++attachmentCounter}.${template.ext}`;
        const fileContent = generateSyntheticFileContent(template.fileType, uniqueFileName);

        attachments.push({
          id: attachmentId,
          capabilityAssessmentId: assessment.id,
          orbitRatingId: rating.id,
          fileName: uniqueFileName,
          fileType: template.fileType,
          fileSize: fileContent.length,
          description: template.description,
          uploadedAt: generateDate(randomInt(0, 30)),
        });

        attachmentFiles.push({
          domainId: assessment.capabilityDomainId,
          areaId: assessment.capabilityAreaId,
          fileName: uniqueFileName,
          content: fileContent,
        });

        rating.attachmentIds.push(attachmentId);
      }
    }
    
    return { attachments, attachmentFiles };
  }

  // For non-guaranteed domains: 75% chance to have attachments (or 100% if forced)
  if (!forceAttachment && Math.random() > 0.75) {
    return { attachments, attachmentFiles };
  }

  // Generate attachments for 30-50% of ratings (15-26 out of 52 aspects)
  const numAttachments = randomInt(15, 26);
  const ratingsWithAttachments = randomSubset(ratings, numAttachments, numAttachments);

  for (let i = 0; i < ratingsWithAttachments.length; i++) {
    const rating = ratingsWithAttachments[i];
    // Pick a random template for each attachment
    const template = randomChoice(SAMPLE_ATTACHMENTS);
    const attachmentId = randomUUID();
    // Generate unique filename with counter
    const uniqueFileName = `${template.baseName}-${++attachmentCounter}.${template.ext}`;
    const fileContent = generateSyntheticFileContent(template.fileType, uniqueFileName);

    attachments.push({
      id: attachmentId,
      capabilityAssessmentId: assessment.id,
      orbitRatingId: rating.id,
      fileName: uniqueFileName,
      fileType: template.fileType,
      fileSize: fileContent.length,
      description: template.description,
      uploadedAt: generateDate(randomInt(0, 30)),
    });

    attachmentFiles.push({
      domainId: assessment.capabilityDomainId,
      areaId: assessment.capabilityAreaId,
      fileName: uniqueFileName,
      content: fileContent,
    });

    rating.attachmentIds.push(attachmentId);
  }

  return { attachments, attachmentFiles };
}

/**
 * Generate tags
 */
function generateTags() {
  return SAMPLE_TAGS.map((name) => ({
    id: randomUUID(),
    name,
    usageCount: randomInt(1, 10),
    lastUsed: generateDate(randomInt(0, 30)),
  }));
}

// ============================================================================
// CSV Generation (matching csvExport.ts format)
// ============================================================================

function escapeCSV(value) {
  if (!value) return '';
  if (value.includes(',') || value.includes('\n') || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function generateMaturityProfileCsv(profile) {
  const lines = [];

  lines.push(`MITA 4.0 Maturity Profile: ${profile.stateName},,,,,`);
  lines.push(',,,,,');

  for (const area of profile.areas) {
    lines.push(`Capability Domain: ${area.domainName},,,,,`);
    lines.push(`Capability Area: ${area.areaName},,,,,`);
    lines.push('ORBIT,As Is,To Be,Notes,Barriers & Challenges,Advancement Plans');

    for (const row of area.rows) {
      lines.push(`${row.dimension},${row.asIs},${row.toBe},${escapeCSV(row.notes)},${escapeCSV(row.barriers)},${escapeCSV(row.plans)}`);
    }

    lines.push(',,,,,');
  }

  return lines.join('\n');
}

/**
 * Build maturity profile from assessment data (matching exportService.ts logic)
 */
function buildMaturityProfile(assessments, allRatings, stateName) {
  const dimensionMap = {
    outcomes: 'Outcomes',
    roles: 'Roles',
    businessArchitecture: 'Business Architecture',
    information: 'Information',
    technology: 'Technology',
  };

  const areas = [];

  for (const assessment of assessments) {
    const ratings = allRatings.filter((r) => r.capabilityAssessmentId === assessment.id);

    // Group by dimension
    const dimensionData = {};
    for (const dimName of Object.values(dimensionMap)) {
      dimensionData[dimName] = { asIs: [], toBe: [], notes: [], barriers: [], plans: [] };
    }

    for (const rating of ratings) {
      const dimName = dimensionMap[rating.dimensionId];
      if (!dimName || !dimensionData[dimName]) continue;

      if (rating.currentLevel > 0) {
        dimensionData[dimName].asIs.push(rating.currentLevel);
      }
      if (rating.targetLevel && rating.targetLevel > 0) {
        dimensionData[dimName].toBe.push(rating.targetLevel);
      }
      if (rating.notes && rating.notes.trim()) {
        dimensionData[dimName].notes.push(rating.notes.trim());
      }
      if (rating.barriers && rating.barriers.trim()) {
        dimensionData[dimName].barriers.push(rating.barriers.trim());
      }
      if (rating.plans && rating.plans.trim()) {
        dimensionData[dimName].plans.push(rating.plans.trim());
      }
    }

    const rows = Object.entries(dimensionMap).map(([, dimName]) => {
      const d = dimensionData[dimName];
      return {
        dimension: dimName,
        asIs: d.asIs.length > 0 ? (d.asIs.reduce((a, b) => a + b, 0) / d.asIs.length).toFixed(1) : '',
        toBe: d.toBe.length > 0 ? (d.toBe.reduce((a, b) => a + b, 0) / d.toBe.length).toFixed(1) : '',
        notes: d.notes.join('; '),
        barriers: d.barriers.join('; '),
        plans: d.plans.join('; '),
      };
    });

    areas.push({
      domainName: assessment.capabilityDomainName,
      areaName: assessment.capabilityAreaName,
      rows,
    });
  }

  return { stateName, areas };
}

// ============================================================================
// Main Generation
// ============================================================================

// Domains that should ALWAYS be included with ALL their areas
const GUARANTEED_DOMAINS = [
  'claims-encounter-management',
  'financial-management',
];

// Dimensions that should ALWAYS have attachments in guaranteed domains
const GUARANTEED_ATTACHMENT_DIMENSIONS = [
  'outcomes',
  'businessArchitecture',
  'information',
  'technology',
];

/**
 * Select domains and areas for export
 * Ensures guaranteed domains are always fully included
 */
function selectDomainsAndAreas(targetPercent) {
  const result = [];

  for (const domain of capabilitiesData.domains) {
    const areas = getAreasFromDomain(domain);
    
    // Always include ALL areas for guaranteed domains
    if (GUARANTEED_DOMAINS.includes(domain.id)) {
      result.push({
        id: domain.id,
        name: domain.name,
        layer: domain.layer,
        areas: [...areas],
        isGuaranteed: true,
      });
      continue;
    }
    
    const numToInclude = Math.round(areas.length * targetPercent);

    if (numToInclude > 0) {
      const shuffled = [...areas].sort(() => Math.random() - 0.5);
      result.push({
        id: domain.id,
        name: domain.name,
        layer: domain.layer,
        areas: shuffled.slice(0, numToInclude),
        isGuaranteed: false,
      });
    }
  }

  return result;
}

async function generateTestImportZip(domains, stateName, outputPath, description) {
  // Reset attachment counter for each ZIP generation
  attachmentCounter = 0;
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Generating: ${description}`);
  console.log(`State: ${stateName}`);
  console.log(`Output: ${outputPath}`);
  console.log('='.repeat(60) + '\n');

  const zip = new JSZip();
  const allAssessments = [];
  const allRatings = [];
  const allHistory = [];
  const allAttachments = [];
  const allAttachmentFiles = [];

  // Generate data for each domain/area
  for (const domain of domains) {
    const isGuaranteed = domain.isGuaranteed || false;
    console.log(`Generating data for domain: ${domain.name}${isGuaranteed ? ' [GUARANTEED]' : ''}`);
    let domainHasAttachment = false;

    for (let i = 0; i < domain.areas.length; i++) {
      const area = domain.areas[i];
      const assessment = generateAssessment(domain, area);
      const ratings = generateRatings(assessment.id);
      const history = generateHistory(assessment, ratings);
      
      // Force attachment on first area if domain doesn't have one yet, or on last area if still none
      const isLastArea = i === domain.areas.length - 1;
      const forceAttachment = !domainHasAttachment && isLastArea;
      const { attachments, attachmentFiles } = generateAttachments(assessment, ratings, forceAttachment, isGuaranteed);

      if (attachments.length > 0) {
        domainHasAttachment = true;
      }

      allAssessments.push(assessment);
      allRatings.push(...ratings);
      allHistory.push(history);
      allAttachments.push(...attachments);
      allAttachmentFiles.push(...attachmentFiles);

      console.log(`  - ${area.name}: ${ratings.length} ratings, score: ${assessment.overallScore}${attachments.length > 0 ? `, ${attachments.length} attachments` : ''}`);
    }
  }

  // Generate tags
  const tags = generateTags();

  // Build export data structure (matching ExportData type)
  const exportData = {
    exportVersion: EXPORT_VERSION,
    exportDate: new Date().toISOString(),
    appVersion: APP_VERSION,
    scope: 'full',
    data: {
      assessments: allAssessments,
      ratings: allRatings,
      history: allHistory,
      tags,
      attachments: allAttachments,
    },
    metadata: {
      totalAssessments: allAssessments.length,
      totalRatings: allRatings.length,
      totalHistory: allHistory.length,
      totalAttachments: allAttachments.length,
      capabilities: allAssessments.map((a) => `${a.capabilityDomainId}/${a.capabilityAreaId}`),
    },
  };

  // Add data.json
  console.log('\nAdding data.json...');
  zip.file('data.json', JSON.stringify(exportData, null, 2));

  // Add maturity profiles
  console.log('Adding maturity profiles...');
  const csvFolder = zip.folder('maturity-profiles');

  // Group assessments by domain for CSV generation
  const assessmentsByDomain = new Map();
  for (const assessment of allAssessments) {
    const domainId = assessment.capabilityDomainId;
    if (!assessmentsByDomain.has(domainId)) {
      assessmentsByDomain.set(domainId, []);
    }
    assessmentsByDomain.get(domainId).push(assessment);
  }

  // Generate per-domain CSVs
  for (const [domainId, domainAssessments] of assessmentsByDomain) {
    const domainRatings = allRatings.filter((r) =>
      domainAssessments.some((a) => a.id === r.capabilityAssessmentId)
    );
    const profile = buildMaturityProfile(domainAssessments, domainRatings, stateName);
    const csv = generateMaturityProfileCsv(profile);
    const fileName = `${domainId}-maturity-profile.csv`;
    csvFolder.file(fileName, csv);
    console.log(`  - ${fileName}`);
  }

  // Generate combined CSV
  const combinedProfile = buildMaturityProfile(allAssessments, allRatings, stateName);
  csvFolder.file('all-domains-maturity-profile.csv', generateMaturityProfileCsv(combinedProfile));
  console.log('  - all-domains-maturity-profile.csv');

  // Add attachments
  if (allAttachmentFiles.length > 0) {
    console.log('Adding attachments...');
    const attachmentsFolder = zip.folder('attachments');

    for (const file of allAttachmentFiles) {
      const folderPath = `${file.domainId}/${file.areaId}`;
      const folder = attachmentsFolder.folder(folderPath);
      folder.file(file.fileName, file.content);
      console.log(`  - ${folderPath}/${file.fileName}`);
    }
  }

  // Add manifest
  console.log('Adding manifest.json...');
  const manifest = {
    exportVersion: EXPORT_VERSION,
    exportDate: exportData.exportDate,
    appVersion: APP_VERSION,
    scope: 'full',
    contents: {
      dataJson: true,
      maturityProfiles: true,
      attachments: allAttachmentFiles.length > 0,
    },
    stats: exportData.metadata,
  };
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));

  // Generate ZIP
  console.log('\nGenerating ZIP file...');
  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

  // Ensure output directory exists
  const outputDir = outputPath.substring(0, outputPath.lastIndexOf('/'));
  if (outputDir && !existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Write to file
  writeFileSync(outputPath, zipBuffer);

  // Calculate stats
  const totalPossibleAreas = capabilitiesData.domains.reduce(
    (sum, d) => sum + getAreasFromDomain(d).length,
    0
  );
  const completionPercent = ((allAssessments.length / totalPossibleAreas) * 100).toFixed(1);
  const totalAspects = getAllAspects().length;

  console.log(`\n✓ Generated: ${outputPath}`);
  console.log(`  - ${allAssessments.length} assessments (${completionPercent}% of ${totalPossibleAreas} total areas)`);
  console.log(`  - ${allRatings.length} ratings (${totalAspects} aspects per assessment)`);
  console.log(`  - ${allHistory.length} history records`);
  console.log(`  - ${allAttachments.length} attachments`);

  return {
    assessments: allAssessments.length,
    ratings: allRatings.length,
    attachments: allAttachments.length,
  };
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || 'both';

  const totalAreas = capabilitiesData.domains.reduce(
    (sum, d) => sum + getAreasFromDomain(d).length,
    0
  );
  const totalAspects = getAllAspects().length;

  console.log('MITA 4.0 Test Import Generator');
  console.log(`Total capability areas in model: ${totalAreas}`);
  console.log(`Total ORBIT aspects per assessment: ${totalAspects}`);

  if (mode === 'small' || mode === 'both') {
    // Small: ~20% coverage (about 15 areas)
    const smallDomains = selectDomainsAndAreas(0.2);
    await generateTestImportZip(
      smallDomains,
      'Sample State',
      'test-data/test-import-small.zip',
      'Small Test Import (~20% coverage)'
    );
  }

  if (mode === 'large' || mode === 'both') {
    // Large: ~70% coverage
    const largeDomains = selectDomainsAndAreas(0.7);
    await generateTestImportZip(
      largeDomains,
      'Comprehensive State',
      'test-data/test-import-comprehensive.zip',
      'Comprehensive Test Import (~70% coverage)'
    );
  }

  console.log('\n' + '='.repeat(60));
  console.log('Done! Test files generated in test-data/');
  console.log('='.repeat(60));
}

main().catch(console.error);
