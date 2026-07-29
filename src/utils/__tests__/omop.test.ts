import { categoryHasSelectors } from '@/utils/omop';

describe('categoryHasSelectors', () => {
  it('returns false for "Gender" (proper-case from API)', () => {
    expect(categoryHasSelectors('Gender')).toBe(false);
  });

  it('returns false for "Race" (proper-case from API)', () => {
    expect(categoryHasSelectors('Race')).toBe(false);
  });

  it('returns false for "gender" (lowercase)', () => {
    expect(categoryHasSelectors('gender')).toBe(false);
  });

  it('returns false for "GENDER" (uppercase)', () => {
    expect(categoryHasSelectors('GENDER')).toBe(false);
  });

  it('returns true for "Condition"', () => {
    expect(categoryHasSelectors('Condition')).toBe(true);
  });

  it('returns true for "Measurement"', () => {
    expect(categoryHasSelectors('Measurement')).toBe(true);
  });

  it('returns true for "" (empty string — mixed-domain / no-concept path)', () => {
    expect(categoryHasSelectors('')).toBe(true);
  });

  it('returns true for an unknown string like "Unknown"', () => {
    expect(categoryHasSelectors('Unknown')).toBe(true);
  });
});
