/**
 * Application Constants
 *
 * Centralized constants to eliminate magic numbers and strings throughout the codebase.
 * Organized by category for easy discovery and maintenance.
 */

import type { OrbitDimensionId, OrganizationalAssessmentId } from '../types';

// =============================================================================
// External Links
// =============================================================================

/**
 * GitHub repository URL.
 * Automatically set via VITE_GITHUB_REPO_URL in the deploy workflow.
 * Falls back to empty string for local development (link won't appear if not set).
 */
export const GITHUB_REPO_URL = import.meta.env.VITE_GITHUB_REPO_URL || '';

// =============================================================================
// Enterprise Domain Configuration
// =============================================================================

/**
 * Domain IDs that have aggregate dimensions (enterprise domains).
 * These domains should not contribute to each other's aggregates.
 */
export const ENTERPRISE_DOMAIN_IDS = ['data-management', 'technical'] as const;

/**
 * Maps domain IDs to their aggregated dimension.
 * These domains show an aggregate score for the specified dimension
 * instead of allowing manual assessment.
 *
 * - Enterprise Data Management (data-management): Information is aggregated from other domains
 * - Enterprise Technology (technical): Technology is aggregated from other domains
 */
export const DOMAIN_AGGREGATE_DIMENSIONS: Partial<Record<string, OrbitDimensionId>> = {
  'data-management': 'information', // Enterprise Data Management: BT (aggregate I)
  technical: 'technology', // Enterprise Technology: BI (aggregate T)
};

// =============================================================================
// Organizational Assessment Configuration
// =============================================================================

/**
 * Capability area IDs that use organizational assessment mode.
 * These areas assess Outcomes/Roles aspects directly, not through ORBIT dimensions.
 */
export const ORGANIZATIONAL_ASSESSMENT_AREAS: Record<string, OrganizationalAssessmentId> = {
  'organizational-outcomes': 'outcomes',
  'organizational-roles': 'roles',
  'organizational-enterprise-architecture': 'enterprise-architecture',
};

/**
 * Check if a capability area uses organizational assessment mode.
 * @param areaId - The capability area ID to check
 * @returns True if this area uses organizational assessment mode
 */
export function isOrganizationalAssessmentArea(areaId: string): boolean {
  return areaId in ORGANIZATIONAL_ASSESSMENT_AREAS;
}

/**
 * Get the organizational assessment type for a capability area.
 * @param areaId - The capability area ID
 * @returns The organizational assessment type, or null if not an organizational assessment
 */
export function getOrganizationalAssessmentType(areaId: string): OrganizationalAssessmentId | null {
  return ORGANIZATIONAL_ASSESSMENT_AREAS[areaId] ?? null;
}

// =============================================================================
// Maturity Score Thresholds
// =============================================================================

/**
 * Thresholds for categorizing maturity scores into quality levels.
 * Used by getScoreColor and other score-related utilities.
 */
export const MATURITY_THRESHOLDS = {
  /** Score >= 4 is considered excellent */
  EXCELLENT: 4,
  /** Score >= 3 is considered good */
  GOOD: 3,
  /** Score >= 2 is considered developing */
  DEVELOPING: 2,
} as const;

// =============================================================================
// Import/Export Constants
// =============================================================================

/**
 * Tolerance in milliseconds for comparing timestamps during import.
 * Two timestamps within this tolerance are considered "the same time".
 * Used to detect duplicate imports and avoid creating redundant history entries.
 */
export const TIMESTAMP_TOLERANCE_MS = 1000;

// =============================================================================
// UI Constants
// =============================================================================

/**
 * User interface constants for consistent behavior across components.
 */
export const UI = {
  /** Maximum number of tags to display before showing "+N more" */
  TAGS_MAX_VISIBLE: 3,
  /** Debounce delay in milliseconds for text input auto-save */
  DEBOUNCE_MS: 300,
  /** Stripe pattern dimensions for progress bars */
  STRIPE_PATTERN: {
    ANGLE: -45,
    WIDTH: 4,
    TOTAL: 8,
  },
} as const;
