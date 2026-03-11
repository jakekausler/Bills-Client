import { describe, it, expect } from 'vitest';
import {
  selectCategories,
  selectCategoriesLoaded,
  selectCategoriesError,
  selectCategoryBreakdown,
  selectSelectedCategoryBreakdown,
  selectBreakdownStart,
  selectBreakdownEnd,
  selectSelectedCategory,
  selectSelectedAccounts,
  selectCategoryBreakdownLoaded,
  selectSelectedCategoryBreakdownLoaded,
  selectSelectedCategoryActivity,
  selectSortedSelectedCategoryActivity,
} from './select';
import { CategoryActivity } from '../../types/types';

const makeCategoryActivity = (overrides: Partial<CategoryActivity> = {}): CategoryActivity => ({
  id: 'act-1',
  date: '2024-01-15',
  dateIsVariable: false,
  dateVariable: null,
  name: 'Grocery Store',
  category: 'Groceries',
  amount: -85.50,
  flag: false,
  flagColor: null,
  amountIsVariable: false,
  amountVariable: null,
  isTransfer: false,
  from: null,
  to: null,
  billId: null,
  firstBill: false,
  interestId: null,
  firstInterest: false,
  spendingTrackerId: null,
  firstSpendingTracker: false,
  balance: 5000,
  cashBalance: 5000,
  investmentValue: 0,
  investmentActivityType: 'buy',
  investmentActions: [],
  account: 'Checking',
  ...overrides,
});

const makeRootState = (categoriesOverrides = {}) =>
  ({
    categories: {
      categories: {},
      categoriesLoaded: false,
      categoriesError: '',
      categoryBreakdown: {},
      categoryBreakdownLoaded: false,
      selectedCategory: '',
      selectedCategoryBreakdown: {},
      selectedCategoryBreakdownLoaded: false,
      selectedCategoryActivity: [],
      selectedCategoryActivityLoaded: false,
      breakdownStart: '2024-01-01',
      breakdownEnd: '2024-01-31',
      selectedAccounts: [],
      ...categoriesOverrides,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;

describe('categories selectors', () => {
  describe('selectCategories', () => {
    it('returns all categories from state', () => {
       
      const categories = { Food: ['Groceries', 'Restaurants'], Transport: ['Gas'] };
      const state = makeRootState({ categories });
      expect(selectCategories(state)).toEqual(categories);
    });

    it('returns empty object when no categories', () => {
      const state = makeRootState({ categories: {} });
      expect(selectCategories(state)).toEqual({});
    });
  });

  describe('selectCategoriesLoaded', () => {
    it('returns false when categories are not loaded', () => {
      const state = makeRootState({ categoriesLoaded: false });
      expect(selectCategoriesLoaded(state)).toBe(false);
    });

    it('returns true when categories are loaded', () => {
      const state = makeRootState({ categoriesLoaded: true });
      expect(selectCategoriesLoaded(state)).toBe(true);
    });
  });

  describe('selectCategoriesError', () => {
    it('returns empty string when no error', () => {
      const state = makeRootState({ categoriesError: '' });
      expect(selectCategoriesError(state)).toBe('');
    });

    it('returns the error message', () => {
      const state = makeRootState({ categoriesError: 'Failed to load' });
      expect(selectCategoriesError(state)).toBe('Failed to load');
    });
  });

  describe('selectCategoryBreakdown', () => {
    it('returns the category breakdown from state', () => {
       
      const breakdown = { Groceries: 250, Restaurants: 120 };
      const state = makeRootState({ categoryBreakdown: breakdown });
      expect(selectCategoryBreakdown(state)).toEqual(breakdown);
    });

    it('returns empty object when no breakdown', () => {
      const state = makeRootState({ categoryBreakdown: {} });
      expect(selectCategoryBreakdown(state)).toEqual({});
    });
  });

  describe('selectCategoryBreakdownLoaded', () => {
    it('returns false when not loaded', () => {
      const state = makeRootState({ categoryBreakdownLoaded: false });
      expect(selectCategoryBreakdownLoaded(state)).toBe(false);
    });

    it('returns true when loaded', () => {
      const state = makeRootState({ categoryBreakdownLoaded: true });
      expect(selectCategoryBreakdownLoaded(state)).toBe(true);
    });
  });

  describe('selectSelectedCategoryBreakdown', () => {
    it('returns the selected category breakdown', () => {
       
      const breakdown = { 'Whole Foods': 180, 'Trader Joes': 70 };
      const state = makeRootState({ selectedCategoryBreakdown: breakdown });
      expect(selectSelectedCategoryBreakdown(state)).toEqual(breakdown);
    });
  });

  describe('selectSelectedCategoryBreakdownLoaded', () => {
    it('returns false when not loaded', () => {
      const state = makeRootState({ selectedCategoryBreakdownLoaded: false });
      expect(selectSelectedCategoryBreakdownLoaded(state)).toBe(false);
    });

    it('returns true when loaded', () => {
      const state = makeRootState({ selectedCategoryBreakdownLoaded: true });
      expect(selectSelectedCategoryBreakdownLoaded(state)).toBe(true);
    });
  });

  describe('selectBreakdownStart', () => {
    it('returns the breakdown start date', () => {
      const state = makeRootState({ breakdownStart: '2024-01-01' });
      expect(selectBreakdownStart(state)).toBe('2024-01-01');
    });
  });

  describe('selectBreakdownEnd', () => {
    it('returns the breakdown end date', () => {
      const state = makeRootState({ breakdownEnd: '2024-12-31' });
      expect(selectBreakdownEnd(state)).toBe('2024-12-31');
    });
  });

  describe('selectSelectedCategory', () => {
    it('returns empty string when no category selected', () => {
      const state = makeRootState({ selectedCategory: '' });
      expect(selectSelectedCategory(state)).toBe('');
    });

    it('returns the selected category name', () => {
      const state = makeRootState({ selectedCategory: 'Groceries' });
      expect(selectSelectedCategory(state)).toBe('Groceries');
    });
  });

  describe('selectSelectedAccounts', () => {
    it('returns empty array when no accounts selected', () => {
      const state = makeRootState({ selectedAccounts: [] });
      expect(selectSelectedAccounts(state)).toEqual([]);
    });

    it('returns the selected account names', () => {
      const state = makeRootState({ selectedAccounts: ['Checking', 'Savings'] });
      expect(selectSelectedAccounts(state)).toEqual(['Checking', 'Savings']);
    });
  });

  describe('selectSelectedCategoryActivity', () => {
    it('returns the selected category activity array', () => {
      const activities = [makeCategoryActivity({ id: 'act-1' }), makeCategoryActivity({ id: 'act-2' })];
      const state = makeRootState({ selectedCategoryActivity: activities });
      expect(selectSelectedCategoryActivity(state)).toEqual(activities);
    });

    it('returns empty array when no activity', () => {
      const state = makeRootState({ selectedCategoryActivity: [] });
      expect(selectSelectedCategoryActivity(state)).toEqual([]);
    });
  });

  describe('selectSortedSelectedCategoryActivity', () => {
    it('sorts activity by category then by amount ascending within category', () => {
      const activities = [
        makeCategoryActivity({ id: 'act-1', category: 'Groceries', amount: -100 }),
        makeCategoryActivity({ id: 'act-2', category: 'Restaurants', amount: -50 }),
        makeCategoryActivity({ id: 'act-3', category: 'Groceries', amount: -30 }),
      ];
      const state = makeRootState({ selectedCategoryActivity: activities });
      const sorted = selectSortedSelectedCategoryActivity(state);
      // Groceries should come before Restaurants alphabetically
      expect(sorted[0].category).toBe('Groceries');
      expect(sorted[1].category).toBe('Groceries');
      expect(sorted[2].category).toBe('Restaurants');
      // Within Groceries: -100 < -30 so -100 appears first
      expect(sorted[0].amount).toBe(-100);
      expect(sorted[1].amount).toBe(-30);
    });

    it('sorts activity alphabetically by category when amounts differ', () => {
      const activities = [
        makeCategoryActivity({ id: 'act-1', category: 'Transport', amount: -60 }),
        makeCategoryActivity({ id: 'act-2', category: 'Groceries', amount: -80 }),
      ];
      const state = makeRootState({ selectedCategoryActivity: activities });
      const sorted = selectSortedSelectedCategoryActivity(state);
      expect(sorted[0].category).toBe('Groceries');
      expect(sorted[1].category).toBe('Transport');
    });

    it('returns empty array when no activities', () => {
      const state = makeRootState({ selectedCategoryActivity: [] });
      expect(selectSortedSelectedCategoryActivity(state)).toEqual([]);
    });

    it('does not mutate the original activity array', () => {
      const activities = [
        makeCategoryActivity({ id: 'act-1', category: 'Transport', amount: -60 }),
        makeCategoryActivity({ id: 'act-2', category: 'Groceries', amount: -80 }),
      ];
      const state = makeRootState({ selectedCategoryActivity: activities });
      selectSortedSelectedCategoryActivity(state);
      // Original state array should remain in insertion order
      expect(state.categories.selectedCategoryActivity[0].category).toBe('Transport');
    });

    it('returns a memoized result for the same input', () => {
      const activities = [makeCategoryActivity({ id: 'act-1' })];
      const state = makeRootState({ selectedCategoryActivity: activities });
      const first = selectSortedSelectedCategoryActivity(state);
      const second = selectSortedSelectedCategoryActivity(state);
      expect(first).toBe(second);
    });
  });
});
