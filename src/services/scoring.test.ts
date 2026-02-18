/**
 * Scoring Service Tests
 *
 * Tests for maturity score calculation functions.
 * These are critical functions used across finalization, aggregation, and export.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateAverage,
  roundScore,
  calculateAverageScore,
  calculateDimensionScore,
} from './scoring';

describe('scoring', () => {
  describe('calculateAverage', () => {
    it('should calculate average of valid numbers', () => {
      expect(calculateAverage([1, 2, 3, 4, 5])).toBe(3);
      expect(calculateAverage([2, 4])).toBe(3);
      expect(calculateAverage([5])).toBe(5);
    });

    it('should exclude null values', () => {
      expect(calculateAverage([1, null, 3])).toBe(2);
      expect(calculateAverage([null, 4, null])).toBe(4);
    });

    it('should exclude undefined values', () => {
      expect(calculateAverage([1, undefined, 3])).toBe(2);
      expect(calculateAverage([undefined, 5, undefined])).toBe(5);
    });

    it('should return null for empty array', () => {
      expect(calculateAverage([])).toBeNull();
    });

    it('should return null when all values are null/undefined', () => {
      expect(calculateAverage([null, null])).toBeNull();
      expect(calculateAverage([undefined, undefined])).toBeNull();
      expect(calculateAverage([null, undefined])).toBeNull();
    });
  });

  describe('roundScore', () => {
    it('should round to one decimal place', () => {
      expect(roundScore(3.14159)).toBe(3.1);
      expect(roundScore(3.15)).toBe(3.2);
      expect(roundScore(3.149)).toBe(3.1);
      expect(roundScore(4.95)).toBe(5.0);
    });

    it('should return null for null input', () => {
      expect(roundScore(null)).toBeNull();
    });

    it('should handle whole numbers', () => {
      expect(roundScore(3)).toBe(3);
      expect(roundScore(5)).toBe(5);
    });
  });

  describe('calculateAverageScore', () => {
    it('should calculate average and round to 1 decimal', () => {
      expect(calculateAverageScore([3, 4, 5])).toBe(4);
      expect(calculateAverageScore([2, 3])).toBe(2.5);
      expect(calculateAverageScore([1, 2, 3, 4])).toBe(2.5);
    });

    it('should return null for empty array', () => {
      expect(calculateAverageScore([])).toBeNull();
    });

    it('should handle single value', () => {
      expect(calculateAverageScore([4])).toBe(4);
      expect(calculateAverageScore([3.7])).toBe(3.7);
    });

    it('should round correctly', () => {
      // 3.33... should round to 3.3
      expect(calculateAverageScore([3, 3, 4])).toBe(3.3);
      // 3.66... should round to 3.7
      expect(calculateAverageScore([3, 4, 4])).toBe(3.7);
    });
  });

  describe('calculateDimensionScore', () => {
    describe('non-Technology dimensions', () => {
      it('should calculate simple average for businessArchitecture', () => {
        const ratings = [
          { currentLevel: 3, subDimensionId: undefined },
          { currentLevel: 4, subDimensionId: undefined },
          { currentLevel: 5, subDimensionId: undefined },
        ];
        expect(calculateDimensionScore('businessArchitecture', ratings)).toBe(4);
      });

      it('should calculate simple average for information', () => {
        const ratings = [
          { currentLevel: 2, subDimensionId: undefined },
          { currentLevel: 3, subDimensionId: undefined },
        ];
        expect(calculateDimensionScore('information', ratings)).toBe(2.5);
      });

      it('should exclude unassessed ratings (currentLevel = 0)', () => {
        const ratings = [
          { currentLevel: 3, subDimensionId: undefined },
          { currentLevel: 0, subDimensionId: undefined }, // Not assessed
          { currentLevel: 5, subDimensionId: undefined },
        ];
        expect(calculateDimensionScore('businessArchitecture', ratings)).toBe(4);
      });

      it('should exclude N/A ratings (currentLevel = -1)', () => {
        const ratings = [
          { currentLevel: 3, subDimensionId: undefined },
          { currentLevel: -1, subDimensionId: undefined }, // N/A
          { currentLevel: 5, subDimensionId: undefined },
        ];
        // Only 3 and 5 count, average = 4
        expect(calculateDimensionScore('information', ratings)).toBe(4);
      });

      it('should return null when no assessed ratings', () => {
        const ratings = [
          { currentLevel: 0, subDimensionId: undefined },
          { currentLevel: -1, subDimensionId: undefined },
        ];
        expect(calculateDimensionScore('businessArchitecture', ratings)).toBeNull();
      });

      it('should return null for empty array', () => {
        expect(calculateDimensionScore('information', [])).toBeNull();
      });
    });

    describe('Technology dimension', () => {
      it('should average sub-dimension scores, then average those', () => {
        const ratings = [
          // Infrastructure: avg = 3.5
          { currentLevel: 3, subDimensionId: 'infrastructure' },
          { currentLevel: 4, subDimensionId: 'infrastructure' },
          // Integration: avg = 5
          { currentLevel: 5, subDimensionId: 'integration' },
        ];
        // Sub-dim averages: 3.5, 5 -> overall = 4.25 -> rounds to 4.3
        expect(calculateDimensionScore('technology', ratings)).toBe(4.3);
      });

      it('should handle single sub-dimension', () => {
        const ratings = [
          { currentLevel: 4, subDimensionId: 'infrastructure' },
          { currentLevel: 4, subDimensionId: 'infrastructure' },
        ];
        expect(calculateDimensionScore('technology', ratings)).toBe(4);
      });

      it('should exclude unassessed ratings within sub-dimensions', () => {
        const ratings = [
          { currentLevel: 3, subDimensionId: 'infrastructure' },
          { currentLevel: 0, subDimensionId: 'infrastructure' }, // Not assessed
          { currentLevel: 5, subDimensionId: 'integration' },
        ];
        // Infrastructure: only 3 counts -> 3
        // Integration: 5
        // Average: (3 + 5) / 2 = 4
        expect(calculateDimensionScore('technology', ratings)).toBe(4);
      });

      it('should skip sub-dimensions with no assessed ratings', () => {
        const ratings = [
          { currentLevel: 4, subDimensionId: 'infrastructure' },
          { currentLevel: 0, subDimensionId: 'integration' }, // Not assessed
          { currentLevel: -1, subDimensionId: 'integration' }, // N/A
        ];
        // Only infrastructure has assessed ratings -> 4
        expect(calculateDimensionScore('technology', ratings)).toBe(4);
      });

      it('should return null when no sub-dimensions have assessed ratings', () => {
        const ratings = [
          { currentLevel: 0, subDimensionId: 'infrastructure' },
          { currentLevel: 0, subDimensionId: 'integration' },
        ];
        expect(calculateDimensionScore('technology', ratings)).toBeNull();
      });

      it('should handle all seven sub-dimensions', () => {
        const ratings = [
          { currentLevel: 3, subDimensionId: 'infrastructure' },
          { currentLevel: 4, subDimensionId: 'integration' },
          { currentLevel: 3, subDimensionId: 'platform-services' },
          { currentLevel: 4, subDimensionId: 'application-architecture' },
          { currentLevel: 3, subDimensionId: 'security-identity' },
          { currentLevel: 4, subDimensionId: 'operations-maintenance' },
          { currentLevel: 3, subDimensionId: 'development-release' },
        ];
        // All sub-dims have one rating each: 3,4,3,4,3,4,3 -> avg = 24/7 = 3.428... -> 3.4
        expect(calculateDimensionScore('technology', ratings)).toBe(3.4);
      });
    });
  });
});
