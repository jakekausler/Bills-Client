import { describe, it, expect } from 'vitest';
import { sort } from './array';

describe('sort', () => {
  describe('returns a sorted copy without mutating the original', () => {
    it('does not mutate the original array', () => {
      const original = [3, 1, 2];
      sort(original, (a, b) => a - b);
      expect(original).toEqual([3, 1, 2]);
    });

    it('returns a new array reference', () => {
      const original = [3, 1, 2];
      const result = sort(original, (a, b) => a - b);
      expect(result).not.toBe(original);
    });
  });

  describe('numeric sorting', () => {
    it('sorts numbers in ascending order', () => {
      const result = sort([3, 1, 4, 1, 5, 9, 2, 6], (a, b) => a - b);
      expect(result).toEqual([1, 1, 2, 3, 4, 5, 6, 9]);
    });

    it('sorts numbers in descending order', () => {
      const result = sort([3, 1, 4, 1, 5, 9, 2, 6], (a, b) => b - a);
      expect(result).toEqual([9, 6, 5, 4, 3, 2, 1, 1]);
    });

    it('handles an already-sorted array', () => {
      const result = sort([1, 2, 3], (a, b) => a - b);
      expect(result).toEqual([1, 2, 3]);
    });

    it('handles a reverse-sorted array', () => {
      const result = sort([3, 2, 1], (a, b) => a - b);
      expect(result).toEqual([1, 2, 3]);
    });

    it('handles negative numbers', () => {
      const result = sort([-3, 0, -1, 2], (a, b) => a - b);
      expect(result).toEqual([-3, -1, 0, 2]);
    });
  });

  describe('string sorting', () => {
    it('sorts strings alphabetically', () => {
      const result = sort(['banana', 'apple', 'cherry'], (a, b) => a.localeCompare(b));
      expect(result).toEqual(['apple', 'banana', 'cherry']);
    });

    it('sorts strings in reverse alphabetical order', () => {
      const result = sort(['banana', 'apple', 'cherry'], (a, b) => b.localeCompare(a));
      expect(result).toEqual(['cherry', 'banana', 'apple']);
    });
  });

  describe('object sorting', () => {
    it('sorts objects by a numeric property', () => {
      const items = [{ value: 3 }, { value: 1 }, { value: 2 }];
      const result = sort(items, (a, b) => a.value - b.value);
      expect(result).toEqual([{ value: 1 }, { value: 2 }, { value: 3 }]);
    });

    it('sorts objects by a string property', () => {
      const items = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];
      const result = sort(items, (a, b) => a.name.localeCompare(b.name));
      expect(result).toEqual([{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }]);
    });
  });

  describe('edge cases', () => {
    it('returns an empty array when given an empty array', () => {
      const result = sort([], (a: number, b: number) => a - b);
      expect(result).toEqual([]);
    });

    it('returns a single-element array unchanged', () => {
      const result = sort([42], (a, b) => a - b);
      expect(result).toEqual([42]);
    });

    it('handles duplicate values', () => {
      const result = sort([2, 2, 2], (a, b) => a - b);
      expect(result).toEqual([2, 2, 2]);
    });
  });
});
