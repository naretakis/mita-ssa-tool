/**
 * History Service
 *
 * Provides utilities for creating and managing assessment history snapshots.
 * Centralizes history-related logic to avoid duplication across hooks and services.
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  CapabilityAssessment,
  OrbitRating,
  AssessmentHistory,
  HistoricalRating,
  AggregateSnapshotData,
} from '../types';

/**
 * Calculate dimension scores from ratings.
 * Groups ratings by dimension (and sub-dimension for Technology) and averages them.
 *
 * @param ratings - Array of OrbitRating records
 * @returns Record mapping dimension keys to average scores
 *
 * @example
 * // For standard dimensions, key is just dimensionId: "outcomes", "roles", etc.
 * // For Technology sub-dimensions, key is "technology:infrastructure", etc.
 */
export function calculateDimensionScores(ratings: OrbitRating[]): Record<string, number> {
  const dimensionRatings = new Map<string, number[]>();

  for (const rating of ratings) {
    if (rating.currentLevel > 0) {
      const key = rating.subDimensionId
        ? `${rating.dimensionId}:${rating.subDimensionId}`
        : rating.dimensionId;
      const levels = dimensionRatings.get(key) ?? [];
      levels.push(rating.currentLevel);
      dimensionRatings.set(key, levels);
    }
  }

  const scores: Record<string, number> = {};
  for (const [key, levels] of dimensionRatings) {
    scores[key] = levels.reduce((a, b) => a + b, 0) / levels.length;
  }
  return scores;
}

/**
 * Convert OrbitRating records to HistoricalRating format.
 * Strips out runtime-only fields (id, capabilityAssessmentId, attachmentIds, etc.)
 *
 * @param ratings - Array of OrbitRating records
 * @returns Array of HistoricalRating records suitable for storage
 */
export function toHistoricalRatings(ratings: OrbitRating[]): HistoricalRating[] {
  return ratings.map((r) => ({
    dimensionId: r.dimensionId,
    subDimensionId: r.subDimensionId,
    aspectId: r.aspectId,
    currentLevel: r.currentLevel,
    targetLevel: r.targetLevel,
    questionResponses: r.questionResponses,
    evidenceResponses: r.evidenceResponses,
    notes: r.notes,
    barriers: r.barriers,
    plans: r.plans,
  }));
}

/**
 * Create a history snapshot from an assessment and its ratings.
 * Used when editing a finalized assessment or importing older data.
 *
 * @param assessment - The capability assessment to snapshot
 * @param ratings - All ratings associated with the assessment
 * @param overallScore - The overall maturity score for the assessment
 * @param aggregateData - Optional aggregate dimension data for enterprise domains
 * @returns AssessmentHistory record ready for database insertion
 */
export function createHistorySnapshot(
  assessment: CapabilityAssessment,
  ratings: OrbitRating[],
  overallScore: number,
  aggregateData?: AggregateSnapshotData
): AssessmentHistory {
  const snapshot: AssessmentHistory = {
    id: uuidv4(),
    capabilityAssessmentId: assessment.id,
    capabilityAreaId: assessment.capabilityAreaId,
    snapshotDate: assessment.finalizedAt ?? assessment.updatedAt,
    tags: [...assessment.tags],
    overallScore,
    dimensionScores: calculateDimensionScores(ratings),
    ratings: toHistoricalRatings(ratings),
  };

  // Include aggregate data for enterprise domains
  if (aggregateData) {
    snapshot.aggregateData = aggregateData;
  }

  return snapshot;
}
