import { describe, it, expect, beforeEach } from 'vitest';
import reducer, {
  setCategories,
  setCategoriesError,
  setCategoriesLoaded,
  updateCategoryBreakdown,
  setCategoryBreakdownLoaded,
  updateSelectedCategoryBreakdown,
  setSelectedCategoryBreakdownLoaded,
  updateSelectedCategoryActivity,
  setSelectedCategoryActivityLoaded,
  updateBreakdownStart,
  updateBreakdownEnd,
  updateSelectedCategory,
  updateSelectedAccounts,
} from './slice';
import { CategoryActivity, CategoryBreakdown } from '../../types/types';

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

describe('categoriesSlice reducer', () => {
  let state: ReturnType<typeof reducer>;

  beforeEach(() => {
    state = reducer(undefined, { type: '@@INIT' });
  });

  describe('initial state', () => {
    it('initializes categories as empty object', () => {
      expect(state.categories).toEqual({});
    });

    it('initializes categoriesLoaded as false', () => {
      expect(state.categoriesLoaded).toBe(false);
    });

    it('initializes categoriesError as empty string', () => {
      expect(state.categoriesError).toBe('');
    });

    it('initializes categoryBreakdown as empty object', () => {
      expect(state.categoryBreakdown).toEqual({});
    });

    it('initializes categoryBreakdownLoaded as false', () => {
      expect(state.categoryBreakdownLoaded).toBe(false);
    });

    it('initializes selectedCategory as empty string', () => {
      expect(state.selectedCategory).toBe('');
    });

    it('initializes selectedCategoryBreakdown as empty object', () => {
      expect(state.selectedCategoryBreakdown).toEqual({});
    });

    it('initializes selectedCategoryBreakdownLoaded as false', () => {
      expect(state.selectedCategoryBreakdownLoaded).toBe(false);
    });

    it('initializes selectedCategoryActivity as empty array', () => {
      expect(state.selectedCategoryActivity).toEqual([]);
    });

    it('initializes selectedCategoryActivityLoaded as false', () => {
      expect(state.selectedCategoryActivityLoaded).toBe(false);
    });

    it('initializes selectedAccounts as empty array', () => {
      expect(state.selectedAccounts).toEqual([]);
    });

    it('initializes breakdownStart and breakdownEnd as date strings', () => {
      expect(state.breakdownStart).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(state.breakdownEnd).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('setCategories', () => {
    it('sets categories and marks them as loaded', () => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const categories = { Food: ['Groceries', 'Restaurants'], Transport: ['Gas', 'Parking'] };
      const newState = reducer(state, setCategories(categories));
      expect(newState.categories).toEqual(categories);
      expect(newState.categoriesLoaded).toBe(true);
    });

    it('replaces existing categories', () => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const initial = reducer(state, setCategories({ OldCat: ['old'] }));
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const updated = reducer(initial, setCategories({ NewCat: ['new'] }));
      // eslint-disable-next-line @typescript-eslint/naming-convention
      expect(updated.categories).toEqual({ NewCat: ['new'] });
      expect(updated.categories).not.toHaveProperty('OldCat');
    });

    it('sets empty object and marks as loaded', () => {
      const newState = reducer(state, setCategories({}));
      expect(newState.categories).toEqual({});
      expect(newState.categoriesLoaded).toBe(true);
    });
  });

  describe('setCategoriesError', () => {
    it('sets the error message', () => {
      const newState = reducer(state, setCategoriesError('Failed to fetch categories'));
      expect(newState.categoriesError).toBe('Failed to fetch categories');
    });

    it('clears error when set to empty string', () => {
      const withError = reducer(state, setCategoriesError('Some error'));
      const cleared = reducer(withError, setCategoriesError(''));
      expect(cleared.categoriesError).toBe('');
    });
  });

  describe('setCategoriesLoaded', () => {
    it('sets categoriesLoaded to true', () => {
      const newState = reducer(state, setCategoriesLoaded(true));
      expect(newState.categoriesLoaded).toBe(true);
    });

    it('sets categoriesLoaded to false', () => {
      const loaded = reducer(state, setCategoriesLoaded(true));
      const notLoaded = reducer(loaded, setCategoriesLoaded(false));
      expect(notLoaded.categoriesLoaded).toBe(false);
    });
  });

  describe('updateCategoryBreakdown', () => {
    it('sets the category breakdown and marks it as loaded', () => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const breakdown: CategoryBreakdown = { Groceries: 250, Restaurants: 120 };
      const newState = reducer(state, updateCategoryBreakdown(breakdown));
      expect(newState.categoryBreakdown).toEqual(breakdown);
      expect(newState.categoryBreakdownLoaded).toBe(true);
    });

    it('replaces existing breakdown', () => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const first = reducer(state, updateCategoryBreakdown({ OldCat: 100 }));
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const second = reducer(first, updateCategoryBreakdown({ NewCat: 200 }));
      // eslint-disable-next-line @typescript-eslint/naming-convention
      expect(second.categoryBreakdown).toEqual({ NewCat: 200 });
    });
  });

  describe('setCategoryBreakdownLoaded', () => {
    it('sets categoryBreakdownLoaded to true', () => {
      const newState = reducer(state, setCategoryBreakdownLoaded(true));
      expect(newState.categoryBreakdownLoaded).toBe(true);
    });

    it('sets categoryBreakdownLoaded to false', () => {
      const loaded = reducer(state, setCategoryBreakdownLoaded(true));
      const notLoaded = reducer(loaded, setCategoryBreakdownLoaded(false));
      expect(notLoaded.categoryBreakdownLoaded).toBe(false);
    });
  });

  describe('updateSelectedCategoryBreakdown', () => {
    it('sets selected category breakdown and marks it as loaded', () => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const breakdown: CategoryBreakdown = { 'Whole Foods': 180, 'Trader Joes': 70 };
      const newState = reducer(state, updateSelectedCategoryBreakdown(breakdown));
      expect(newState.selectedCategoryBreakdown).toEqual(breakdown);
      expect(newState.selectedCategoryBreakdownLoaded).toBe(true);
    });
  });

  describe('setSelectedCategoryBreakdownLoaded', () => {
    it('sets selectedCategoryBreakdownLoaded to true', () => {
      const newState = reducer(state, setSelectedCategoryBreakdownLoaded(true));
      expect(newState.selectedCategoryBreakdownLoaded).toBe(true);
    });

    it('sets selectedCategoryBreakdownLoaded to false', () => {
      const loaded = reducer(state, setSelectedCategoryBreakdownLoaded(true));
      const notLoaded = reducer(loaded, setSelectedCategoryBreakdownLoaded(false));
      expect(notLoaded.selectedCategoryBreakdownLoaded).toBe(false);
    });
  });

  describe('updateSelectedCategoryActivity', () => {
    it('sets selected category activity and marks it as loaded', () => {
      const activities = [
        makeCategoryActivity({ id: 'act-1', name: 'Whole Foods', amount: -85 }),
        makeCategoryActivity({ id: 'act-2', name: 'Trader Joes', amount: -45 }),
      ];
      const newState = reducer(state, updateSelectedCategoryActivity(activities));
      expect(newState.selectedCategoryActivity).toEqual(activities);
      expect(newState.selectedCategoryActivityLoaded).toBe(true);
    });

    it('sets empty array and marks as loaded', () => {
      const withActivities = reducer(state, updateSelectedCategoryActivity([makeCategoryActivity()]));
      const cleared = reducer(withActivities, updateSelectedCategoryActivity([]));
      expect(cleared.selectedCategoryActivity).toEqual([]);
      expect(cleared.selectedCategoryActivityLoaded).toBe(true);
    });
  });

  describe('setSelectedCategoryActivityLoaded', () => {
    it('sets selectedCategoryActivityLoaded to true', () => {
      const newState = reducer(state, setSelectedCategoryActivityLoaded(true));
      expect(newState.selectedCategoryActivityLoaded).toBe(true);
    });

    it('sets selectedCategoryActivityLoaded to false', () => {
      const loaded = reducer(state, setSelectedCategoryActivityLoaded(true));
      const notLoaded = reducer(loaded, setSelectedCategoryActivityLoaded(false));
      expect(notLoaded.selectedCategoryActivityLoaded).toBe(false);
    });
  });

  describe('updateBreakdownStart', () => {
    it('updates the breakdown start date', () => {
      const newState = reducer(state, updateBreakdownStart('2024-01-01'));
      expect(newState.breakdownStart).toBe('2024-01-01');
    });

    it('does not affect breakdownEnd', () => {
      const originalEnd = state.breakdownEnd;
      const newState = reducer(state, updateBreakdownStart('2024-01-01'));
      expect(newState.breakdownEnd).toBe(originalEnd);
    });
  });

  describe('updateBreakdownEnd', () => {
    it('updates the breakdown end date', () => {
      const newState = reducer(state, updateBreakdownEnd('2024-12-31'));
      expect(newState.breakdownEnd).toBe('2024-12-31');
    });

    it('does not affect breakdownStart', () => {
      const originalStart = state.breakdownStart;
      const newState = reducer(state, updateBreakdownEnd('2024-12-31'));
      expect(newState.breakdownStart).toBe(originalStart);
    });
  });

  describe('updateSelectedCategory', () => {
    it('sets the selected category', () => {
      const newState = reducer(state, updateSelectedCategory('Groceries'));
      expect(newState.selectedCategory).toBe('Groceries');
    });

    it('replaces the previously selected category', () => {
      const withGroceries = reducer(state, updateSelectedCategory('Groceries'));
      const withRestaurants = reducer(withGroceries, updateSelectedCategory('Restaurants'));
      expect(withRestaurants.selectedCategory).toBe('Restaurants');
    });

    it('clears selected category when set to empty string', () => {
      const withCategory = reducer(state, updateSelectedCategory('Groceries'));
      const cleared = reducer(withCategory, updateSelectedCategory(''));
      expect(cleared.selectedCategory).toBe('');
    });
  });

  describe('updateSelectedAccounts', () => {
    it('sets the selected accounts array', () => {
      const accounts = ['Checking', 'Savings'];
      const newState = reducer(state, updateSelectedAccounts(accounts));
      expect(newState.selectedAccounts).toEqual(accounts);
    });

    it('replaces the existing selected accounts', () => {
      const first = reducer(state, updateSelectedAccounts(['Checking']));
      const second = reducer(first, updateSelectedAccounts(['Savings', 'Investment']));
      expect(second.selectedAccounts).toEqual(['Savings', 'Investment']);
    });

    it('sets to empty array to deselect all accounts', () => {
      const withAccounts = reducer(state, updateSelectedAccounts(['Checking', 'Savings']));
      const cleared = reducer(withAccounts, updateSelectedAccounts([]));
      expect(cleared.selectedAccounts).toEqual([]);
    });
  });
});
