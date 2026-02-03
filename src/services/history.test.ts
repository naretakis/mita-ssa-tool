/**
 * History Service Tests
 *
 * Tests for history snapshot creation and dimension score calculation.
 */

import { describe, it, expect } from 'vitest';
import { calculateDimensionScores, toHistoricalRatings, createHistorySnapshot } from './history';
import type { CapabilityAssessment, OrbitRating } from '../types';

describe('history', () => {
  describe('calculateDimensionScores', () => {
    it('should calculate average scores for standard dimensions', () => {
      const ratings: OrbitRating[] = [
        createMockRating({ dimensionId: 'outcomes', aspectId: 'a1', currentLevel: 3 }),
        createMockRating({ dimensionId: 'outcomes', aspectId: 'a2', currentLevel: 4 }),
        createMockRating({ dimensionId: 'roles', aspectId: 'a3', currentLevel: 5 }),
      ];

      const scores = calculateDimensionScores(ratings);

      expect(scores['outcomes']).toBe(3.5);
      expect(scores['roles']).toBe(5);
    });

    it('should use compound key for Technology sub-dimensions', () => {
      const ratings: OrbitRating[] = [
        createMockRating({
          dimensionId: 'technology',
          subDimensionId: 'infrastructure',
          aspectId: 'a1',
          currentLevel: 3,
        }),
        createMockRating({
          dimensionId: 'technology',
          subDimensionId: 'infrastructure',
          aspectId: 'a2',
          currentLevel: 5,
        }),
        createMockRating({
          dimensionId: 'technology',
          subDimensionId: 'integration',
          aspectId: 'a3',
          currentLevel: 4,
        }),
      ];

      const scores = calculateDimensionScores(ratings);

      expect(scores['technology:infrastructure']).toBe(4);
      expect(scores['technology:integration']).toBe(4);
    });

    it('should exclude ratings with currentLevel <= 0', () => {
      const ratings: OrbitRating[] = [
        createMockRating({ dimensionId: 'outcomes', aspectId: 'a1', currentLevel: 3 }),
        createMockRating({ dimensionId: 'outcomes', aspectId: 'a2', currentLevel: 0 }), // Not assessed
        createMockRating({ dimensionId: 'outcomes', aspectId: 'a3', currentLevel: -1 }), // N/A
      ];

      const scores = calculateDimensionScores(ratings);

      expect(scores['outcomes']).toBe(3);
    });

    it('should return empty object for empty ratings array', () => {
      const scores = calculateDimensionScores([]);
      expect(scores).toEqual({});
    });

    it('should return empty object when all ratings are unassessed', () => {
      const ratings: OrbitRating[] = [
        createMockRating({ dimensionId: 'outcomes', aspectId: 'a1', currentLevel: 0 }),
        createMockRating({ dimensionId: 'roles', aspectId: 'a2', currentLevel: -1 }),
      ];

      const scores = calculateDimensionScores(ratings);
      expect(scores).toEqual({});
    });

    it('should handle mixed standard and Technology dimensions', () => {
      const ratings: OrbitRating[] = [
        createMockRating({ dimensionId: 'outcomes', aspectId: 'a1', currentLevel: 3 }),
        createMockRating({ dimensionId: 'businessArchitecture', aspectId: 'a2', currentLevel: 4 }),
        createMockRating({
          dimensionId: 'technology',
          subDimensionId: 'infrastructure',
          aspectId: 'a3',
          currentLevel: 5,
        }),
      ];

      const scores = calculateDimensionScores(ratings);

      expect(scores['outcomes']).toBe(3);
      expect(scores['businessArchitecture']).toBe(4);
      expect(scores['technology:infrastructure']).toBe(5);
    });
  });

  describe('toHistoricalRatings', () => {
    it('should convert OrbitRating to HistoricalRating format', () => {
      const ratings: OrbitRating[] = [
        createMockRating({
          dimensionId: 'outcomes',
          aspectId: 'value-delivery',
          currentLevel: 3,
          targetLevel: 4,
          notes: 'Test notes',
          barriers: 'Test barriers',
          plans: 'Test plans',
        }),
      ];

      const historical = toHistoricalRatings(ratings);

      expect(historical).toHaveLength(1);
      expect(historical[0]).toEqual({
        dimensionId: 'outcomes',
        subDimensionId: undefined,
        aspectId: 'value-delivery',
        currentLevel: 3,
        targetLevel: 4,
        questionResponses: [],
        evidenceResponses: [],
        notes: 'Test notes',
        barriers: 'Test barriers',
        plans: 'Test plans',
      });
    });

    it('should strip runtime-only fields', () => {
      const ratings: OrbitRating[] = [
        createMockRating({
          id: 'should-be-stripped',
          capabilityAssessmentId: 'should-be-stripped',
          dimensionId: 'outcomes',
          aspectId: 'a1',
          currentLevel: 3,
          attachmentIds: ['att-1', 'att-2'],
          carriedForward: true,
        }),
      ];

      const historical = toHistoricalRatings(ratings);

      expect(historical[0]).not.toHaveProperty('id');
      expect(historical[0]).not.toHaveProperty('capabilityAssessmentId');
      expect(historical[0]).not.toHaveProperty('attachmentIds');
      expect(historical[0]).not.toHaveProperty('carriedForward');
      expect(historical[0]).not.toHaveProperty('updatedAt');
    });

    it('should preserve Technology sub-dimension info', () => {
      const ratings: OrbitRating[] = [
        createMockRating({
          dimensionId: 'technology',
          subDimensionId: 'infrastructure',
          aspectId: 'cloud-adoption',
          currentLevel: 4,
        }),
      ];

      const historical = toHistoricalRatings(ratings);

      expect(historical[0]?.subDimensionId).toBe('infrastructure');
    });

    it('should handle empty array', () => {
      const historical = toHistoricalRatings([]);
      expect(historical).toEqual([]);
    });

    it('should preserve question and evidence responses', () => {
      const ratings: OrbitRating[] = [
        createMockRating({
          dimensionId: 'outcomes',
          aspectId: 'a1',
          currentLevel: 3,
          questionResponses: [
            { questionIndex: 0, answer: true },
            { questionIndex: 1, answer: false },
            { questionIndex: 2, answer: true },
          ],
          evidenceResponses: [
            { evidenceIndex: 0, provided: false },
            { evidenceIndex: 1, provided: true },
          ],
        }),
      ];

      const historical = toHistoricalRatings(ratings);

      expect(historical[0]?.questionResponses).toHaveLength(3);
      expect(historical[0]?.questionResponses[0]).toEqual({ questionIndex: 0, answer: true });
      expect(historical[0]?.evidenceResponses).toHaveLength(2);
      expect(historical[0]?.evidenceResponses[1]).toEqual({ evidenceIndex: 1, provided: true });
    });
  });

  describe('createHistorySnapshot', () => {
    it('should create a complete history snapshot', () => {
      const assessment = createMockAssessment({
        id: 'assessment-1',
        capabilityAreaId: 'area-1',
        tags: ['phase1', 'priority'],
        finalizedAt: new Date('2025-01-15'),
      });

      const ratings: OrbitRating[] = [
        createMockRating({ dimensionId: 'outcomes', aspectId: 'a1', currentLevel: 3 }),
        createMockRating({ dimensionId: 'roles', aspectId: 'a2', currentLevel: 4 }),
      ];

      const snapshot = createHistorySnapshot(assessment, ratings, 3.5);

      expect(snapshot.id).toBeDefined();
      expect(snapshot.capabilityAssessmentId).toBe('assessment-1');
      expect(snapshot.capabilityAreaId).toBe('area-1');
      expect(snapshot.snapshotDate).toEqual(new Date('2025-01-15'));
      expect(snapshot.tags).toEqual(['phase1', 'priority']);
      expect(snapshot.overallScore).toBe(3.5);
      expect(snapshot.dimensionScores).toEqual({ outcomes: 3, roles: 4 });
      expect(snapshot.ratings).toHaveLength(2);
    });

    it('should use updatedAt when finalizedAt is not set', () => {
      const assessment = createMockAssessment({
        updatedAt: new Date('2025-01-20'),
        finalizedAt: undefined,
      });

      const snapshot = createHistorySnapshot(assessment, [], 3.0);

      expect(snapshot.snapshotDate).toEqual(new Date('2025-01-20'));
    });

    it('should create a copy of tags array', () => {
      const originalTags = ['tag1', 'tag2'];
      const assessment = createMockAssessment({ tags: originalTags });

      const snapshot = createHistorySnapshot(assessment, [], 3.0);

      // Modify original array
      originalTags.push('tag3');

      // Snapshot should not be affected
      expect(snapshot.tags).toEqual(['tag1', 'tag2']);
    });

    it('should generate unique IDs for each snapshot', () => {
      const assessment = createMockAssessment({});

      const snapshot1 = createHistorySnapshot(assessment, [], 3.0);
      const snapshot2 = createHistorySnapshot(assessment, [], 3.0);

      expect(snapshot1.id).not.toBe(snapshot2.id);
    });

    it('should handle empty ratings array', () => {
      const assessment = createMockAssessment({});

      const snapshot = createHistorySnapshot(assessment, [], 0);

      expect(snapshot.dimensionScores).toEqual({});
      expect(snapshot.ratings).toEqual([]);
    });
  });
});

// Helper functions to create mock data

function createMockRating(overrides: Partial<OrbitRating>): OrbitRating {
  return {
    id: 'rating-' + Math.random().toString(36).substring(7),
    capabilityAssessmentId: 'assessment-1',
    dimensionId: 'outcomes',
    aspectId: 'aspect-1',
    currentLevel: 3,
    questionResponses: [],
    evidenceResponses: [],
    notes: '',
    barriers: '',
    plans: '',
    carriedForward: false,
    attachmentIds: [],
    updatedAt: new Date(),
    ...overrides,
  };
}

function createMockAssessment(overrides: Partial<CapabilityAssessment>): CapabilityAssessment {
  return {
    id: 'assessment-1',
    capabilityDomainId: 'domain-1',
    capabilityDomainName: 'Test Domain',
    capabilityAreaId: 'area-1',
    capabilityAreaName: 'Test Area',
    status: 'finalized',
    tags: [],
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-15'),
    ...overrides,
  };
}
