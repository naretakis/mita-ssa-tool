/**
 * Tests for color utilities
 */

import { describe, it, expect } from 'vitest';
import { getScoreColor, formatScore, SCORE_COLORS } from './colors';

describe('getScoreColor', () => {
  it('returns grey for null score', () => {
    expect(getScoreColor(null)).toBe(SCORE_COLORS.none);
  });

  it('returns green for excellent scores (>= 4)', () => {
    expect(getScoreColor(4)).toBe(SCORE_COLORS.excellent);
    expect(getScoreColor(4.5)).toBe(SCORE_COLORS.excellent);
    expect(getScoreColor(5)).toBe(SCORE_COLORS.excellent);
  });

  it('returns orange for good scores (>= 3, < 4)', () => {
    expect(getScoreColor(3)).toBe(SCORE_COLORS.good);
    expect(getScoreColor(3.5)).toBe(SCORE_COLORS.good);
    expect(getScoreColor(3.9)).toBe(SCORE_COLORS.good);
  });

  it('returns blue for developing scores (>= 2, < 3)', () => {
    expect(getScoreColor(2)).toBe(SCORE_COLORS.developing);
    expect(getScoreColor(2.5)).toBe(SCORE_COLORS.developing);
    expect(getScoreColor(2.9)).toBe(SCORE_COLORS.developing);
  });

  it('returns red for initial scores (< 2)', () => {
    expect(getScoreColor(1)).toBe(SCORE_COLORS.initial);
    expect(getScoreColor(1.5)).toBe(SCORE_COLORS.initial);
    expect(getScoreColor(1.9)).toBe(SCORE_COLORS.initial);
    expect(getScoreColor(0)).toBe(SCORE_COLORS.initial);
  });
});

describe('SCORE_COLORS', () => {
  it('has all expected color keys', () => {
    expect(SCORE_COLORS).toHaveProperty('excellent');
    expect(SCORE_COLORS).toHaveProperty('good');
    expect(SCORE_COLORS).toHaveProperty('developing');
    expect(SCORE_COLORS).toHaveProperty('initial');
    expect(SCORE_COLORS).toHaveProperty('none');
  });

  it('has valid hex color values', () => {
    const hexColorRegex = /^#[0-9a-fA-F]{6}$/;
    expect(SCORE_COLORS.excellent).toMatch(hexColorRegex);
    expect(SCORE_COLORS.good).toMatch(hexColorRegex);
    expect(SCORE_COLORS.developing).toMatch(hexColorRegex);
    expect(SCORE_COLORS.initial).toMatch(hexColorRegex);
    expect(SCORE_COLORS.none).toMatch(hexColorRegex);
  });
});

describe('formatScore', () => {
  it('returns em dash for null', () => {
    expect(formatScore(null)).toBe('—');
  });

  it('returns em dash for undefined', () => {
    expect(formatScore(undefined)).toBe('—');
  });

  it('formats whole numbers with one decimal place', () => {
    expect(formatScore(3)).toBe('3.0');
    expect(formatScore(5)).toBe('5.0');
    expect(formatScore(1)).toBe('1.0');
  });

  it('formats decimal numbers to one decimal place', () => {
    expect(formatScore(3.5)).toBe('3.5');
    expect(formatScore(4.2)).toBe('4.2');
    expect(formatScore(2.7)).toBe('2.7');
  });

  it('rounds to one decimal place', () => {
    expect(formatScore(3.14)).toBe('3.1');
    expect(formatScore(3.16)).toBe('3.2');
    expect(formatScore(3.149)).toBe('3.1');
    expect(formatScore(4.96)).toBe('5.0');
  });

  it('handles zero', () => {
    expect(formatScore(0)).toBe('0.0');
  });
});
