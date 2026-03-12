import { describe, it, expect } from 'vitest';
import {
  selectAllActivities,
  selectActivitiesLoaded,
  selectSelectedActivity,
  selectSelectedActivityLoaded,
  selectSelectedActivityBillId,
  selectSelectedBill,
  selectSelectedBillLoaded,
  selectInterests,
  selectInterestsLoaded,
  selectSelectedActivityInterestId,
  selectStartDate,
  selectEndDate,
  selectNames,
  selectNamesLoaded,
  selectActivitiesError,
} from './select';
import { makeActivity, makeBill, makeInterest } from '../../test/factories';

// Minimal RootState shape needed for activities selectors
const makeRootState = (activitiesOverrides = {}) =>
  ({
    activities: {
      activities: [],
      activitiesLoaded: false,
      activitiesError: '',
      selectedActivity: null,
      selectedActivityBillId: null,
      selectedActivityInterestId: null,
      selectedActivityLoaded: false,
      selectedBill: null,
      selectedBillLoaded: false,
      interests: null,
      interestsLoaded: false,
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      lastDate: '2026-03-12',
      names: {},
      namesLoaded: false,
      ...activitiesOverrides,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;

describe('activities selectors', () => {
  describe('selectAllActivities', () => {
    it('returns the activities array from state', () => {
      const activities = [makeActivity({ id: 'act-1' }), makeActivity({ id: 'act-2' })];
      const state = makeRootState({ activities });
      expect(selectAllActivities(state)).toEqual(activities);
    });

    it('returns empty array when no activities', () => {
      const state = makeRootState({ activities: [] });
      expect(selectAllActivities(state)).toEqual([]);
    });
  });

  describe('selectActivitiesLoaded', () => {
    it('returns false when activities are not loaded', () => {
      const state = makeRootState({ activitiesLoaded: false });
      expect(selectActivitiesLoaded(state)).toBe(false);
    });

    it('returns true when activities are loaded', () => {
      const state = makeRootState({ activitiesLoaded: true });
      expect(selectActivitiesLoaded(state)).toBe(true);
    });
  });

  describe('selectSelectedActivity', () => {
    it('returns null when no activity is selected', () => {
      const state = makeRootState({ selectedActivity: null });
      expect(selectSelectedActivity(state)).toBeNull();
    });

    it('returns the selected activity', () => {
      const activity = makeActivity({ id: 'act-1', name: 'Selected Activity' });
      const state = makeRootState({ selectedActivity: activity });
      expect(selectSelectedActivity(state)).toEqual(activity);
    });
  });

  describe('selectSelectedActivityLoaded', () => {
    it('returns false when selected activity is not loaded', () => {
      const state = makeRootState({ selectedActivityLoaded: false });
      expect(selectSelectedActivityLoaded(state)).toBe(false);
    });

    it('returns true when selected activity is loaded', () => {
      const state = makeRootState({ selectedActivityLoaded: true });
      expect(selectSelectedActivityLoaded(state)).toBe(true);
    });
  });

  describe('selectSelectedActivityBillId', () => {
    it('returns null when no bill ID is associated', () => {
      const state = makeRootState({ selectedActivityBillId: null });
      expect(selectSelectedActivityBillId(state)).toBeNull();
    });

    it('returns the bill ID when associated with activity', () => {
      const state = makeRootState({ selectedActivityBillId: 'bill-1' });
      expect(selectSelectedActivityBillId(state)).toBe('bill-1');
    });
  });

  describe('selectSelectedBill', () => {
    it('returns null when no bill is selected', () => {
      const state = makeRootState({ selectedBill: null });
      expect(selectSelectedBill(state)).toBeNull();
    });

    it('returns the selected bill', () => {
      const bill = makeBill({ id: 'bill-1', name: 'Rent' });
      const state = makeRootState({ selectedBill: bill });
      expect(selectSelectedBill(state)).toEqual(bill);
    });
  });

  describe('selectSelectedBillLoaded', () => {
    it('returns false when selected bill is not loaded', () => {
      const state = makeRootState({ selectedBillLoaded: false });
      expect(selectSelectedBillLoaded(state)).toBe(false);
    });

    it('returns true when selected bill is loaded', () => {
      const state = makeRootState({ selectedBillLoaded: true });
      expect(selectSelectedBillLoaded(state)).toBe(true);
    });
  });

  describe('selectInterests', () => {
    it('returns null when interests are not loaded', () => {
      const state = makeRootState({ interests: null });
      expect(selectInterests(state)).toBeNull();
    });

    it('returns the interests array', () => {
      const interests = [makeInterest({ id: 'int-1' }), makeInterest({ id: 'int-2' })];
      const state = makeRootState({ interests });
      expect(selectInterests(state)).toEqual(interests);
    });

    it('returns empty array when interests exist but empty', () => {
      const state = makeRootState({ interests: [] });
      expect(selectInterests(state)).toEqual([]);
    });
  });

  describe('selectInterestsLoaded', () => {
    it('returns false when interests are not loaded', () => {
      const state = makeRootState({ interestsLoaded: false });
      expect(selectInterestsLoaded(state)).toBe(false);
    });

    it('returns true when interests are loaded', () => {
      const state = makeRootState({ interestsLoaded: true });
      expect(selectInterestsLoaded(state)).toBe(true);
    });
  });

  describe('selectSelectedActivityInterestId', () => {
    it('returns null when no interest ID is associated', () => {
      const state = makeRootState({ selectedActivityInterestId: null });
      expect(selectSelectedActivityInterestId(state)).toBeNull();
    });

    it('returns the interest ID when associated with activity', () => {
      const state = makeRootState({ selectedActivityInterestId: 'int-1' });
      expect(selectSelectedActivityInterestId(state)).toBe('int-1');
    });
  });

  describe('selectStartDate', () => {
    it('returns the start date from state', () => {
      const state = makeRootState({ startDate: '2026-03-01' });
      expect(selectStartDate(state)).toBe('2026-03-01');
    });

    it('returns custom start date', () => {
      const state = makeRootState({ startDate: '2026-01-01' });
      expect(selectStartDate(state)).toBe('2026-01-01');
    });
  });

  describe('selectEndDate', () => {
    it('returns the end date from state', () => {
      const state = makeRootState({ endDate: '2026-03-31' });
      expect(selectEndDate(state)).toBe('2026-03-31');
    });

    it('returns custom end date', () => {
      const state = makeRootState({ endDate: '2026-12-31' });
      expect(selectEndDate(state)).toBe('2026-12-31');
    });
  });

  describe('selectNames', () => {
    it('returns empty object when no names', () => {
      const state = makeRootState({ names: {} });
      expect(selectNames(state)).toEqual({});
    });

    it('returns the names dictionary', () => {
      const names = { 'Grocery Store': 'Groceries', 'Gas Station': 'Transportation' };
      const state = makeRootState({ names });
      expect(selectNames(state)).toEqual(names);
    });
  });

  describe('selectNamesLoaded', () => {
    it('returns false when names are not loaded', () => {
      const state = makeRootState({ namesLoaded: false });
      expect(selectNamesLoaded(state)).toBe(false);
    });

    it('returns true when names are loaded', () => {
      const state = makeRootState({ namesLoaded: true });
      expect(selectNamesLoaded(state)).toBe(true);
    });
  });

  describe('selectActivitiesError', () => {
    it('returns empty string when no error', () => {
      const state = makeRootState({ activitiesError: '' });
      expect(selectActivitiesError(state)).toBe('');
    });

    it('returns the error message', () => {
      const state = makeRootState({ activitiesError: 'Failed to load activities' });
      expect(selectActivitiesError(state)).toBe('Failed to load activities');
    });

    it('returns specific error message', () => {
      const state = makeRootState({ activitiesError: 'Network error: 500' });
      expect(selectActivitiesError(state)).toBe('Network error: 500');
    });
  });
});
