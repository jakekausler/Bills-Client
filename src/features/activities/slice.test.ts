import { describe, it, expect, beforeEach } from 'vitest';
import reducer, {
  setActivities,
  setActivitiesError,
  setActivitiesLoaded,
  setSelectedActivity,
  setSelectedActivityBillId,
  setSelectedActivityInterestId,
  setSelectedActivityLoaded,
  setSelectedBill,
  setSelectedBillLoaded,
  setStartDate,
  setEndDate,
  newActivity,
  newBill,
  duplicateActivity,
  updateActivity,
  updateBill,
  updateInterests,
  setInterestsLoaded,
  updateNames,
  setNamesLoaded,
} from './slice';
import { Activity, BaseActivity, Bill, Interest, NameEntry } from '../../types/types';

const makeActivity = (overrides: Partial<Activity> = {}): Activity => ({
  id: 'act-1',
  date: '2024-06-15',
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
  ...overrides,
});

const makeBaseActivity = (overrides: Partial<BaseActivity> = {}): BaseActivity => ({
  id: 'act-1',
  date: '2024-06-15',
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
  ...overrides,
});

const makeBill = (overrides: Partial<Bill> = {}): Bill => ({
  id: 'bill-1',
  name: 'Rent',
  category: 'Housing',
  amount: 1500,
  flag: false,
  flagColor: null,
  amountIsVariable: false,
  amountVariable: null,
  isTransfer: false,
  from: null,
  to: null,
  startDate: '2024-01-01',
  startDateIsVariable: false,
  startDateVariable: null,
  endDate: null,
  endDateIsVariable: false,
  endDateVariable: null,
  everyN: 1,
  periods: 'month',
  isAutomatic: false,
  annualStartDate: null,
  annualEndDate: null,
  annualStartDateIsVariable: false,
  annualEndDateIsVariable: false,
  annualStartDateVariable: null,
  annualEndDateVariable: null,
  increaseBy: 0.03,
  increaseByIsVariable: true,
  increaseByVariable: 'INFLATION',
  increaseByDate: '01/01',
  ...overrides,
});

const makeInterest = (overrides: Partial<Interest> = {}): Interest => ({
  id: 'int-1',
  apr: 0.05,
  aprIsVariable: false,
  aprVariable: null,
  compounded: 'month',
  applicableDate: '2024-01-01',
  applicableDateIsVariable: false,
  applicableDateVariable: null,
  ...overrides,
});

describe('activitiesSlice reducer', () => {
  let state: ReturnType<typeof reducer>;

  beforeEach(() => {
    state = reducer(undefined, { type: '@@INIT' });
  });

  describe('initial state', () => {
    it('initializes activities as empty array', () => {
      expect(state.activities).toEqual([]);
    });

    it('initializes activitiesLoaded as false', () => {
      expect(state.activitiesLoaded).toBe(false);
    });

    it('initializes activitiesError as empty string', () => {
      expect(state.activitiesError).toBe('');
    });

    it('initializes selectedActivity as null', () => {
      expect(state.selectedActivity).toBeNull();
    });

    it('initializes selectedActivityBillId as null', () => {
      expect(state.selectedActivityBillId).toBeNull();
    });

    it('initializes selectedActivityInterestId as null', () => {
      expect(state.selectedActivityInterestId).toBeNull();
    });

    it('initializes selectedActivityLoaded as false', () => {
      expect(state.selectedActivityLoaded).toBe(false);
    });

    it('initializes selectedBill as null', () => {
      expect(state.selectedBill).toBeNull();
    });

    it('initializes selectedBillLoaded as false', () => {
      expect(state.selectedBillLoaded).toBe(false);
    });

    it('initializes interests as null', () => {
      expect(state.interests).toBeNull();
    });

    it('initializes interestsLoaded as false', () => {
      expect(state.interestsLoaded).toBe(false);
    });

    it('initializes names as empty array', () => {
      expect(state.names).toEqual([]);
    });

    it('initializes namesLoaded as false', () => {
      expect(state.namesLoaded).toBe(false);
    });

    it('initializes startDate and endDate as date strings', () => {
      expect(state.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(state.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('setActivities', () => {
    it('sets activities and marks as loaded', () => {
      const activities = [makeActivity({ id: 'act-1' }), makeActivity({ id: 'act-2' })];
      const newState = reducer(state, setActivities(activities));
      expect(newState.activities).toEqual(activities);
      expect(newState.activitiesLoaded).toBe(true);
    });

    it('replaces existing activities', () => {
      const first = reducer(state, setActivities([makeActivity({ id: 'act-old' })]));
      const newActivities = [makeActivity({ id: 'act-new' })];
      const second = reducer(first, setActivities(newActivities));
      expect(second.activities).toHaveLength(1);
      expect(second.activities[0].id).toBe('act-new');
    });

    it('sets to empty array and marks as loaded', () => {
      const withActivities = reducer(state, setActivities([makeActivity()]));
      const cleared = reducer(withActivities, setActivities([]));
      expect(cleared.activities).toEqual([]);
      expect(cleared.activitiesLoaded).toBe(true);
    });
  });

  describe('setActivitiesError', () => {
    it('sets the error message', () => {
      const newState = reducer(state, setActivitiesError('Network error'));
      expect(newState.activitiesError).toBe('Network error');
    });

    it('clears error when set to empty string', () => {
      const withError = reducer(state, setActivitiesError('Error'));
      const cleared = reducer(withError, setActivitiesError(''));
      expect(cleared.activitiesError).toBe('');
    });
  });

  describe('setActivitiesLoaded', () => {
    it('sets activitiesLoaded to true', () => {
      const newState = reducer(state, setActivitiesLoaded(true));
      expect(newState.activitiesLoaded).toBe(true);
    });

    it('sets activitiesLoaded to false', () => {
      const loaded = reducer(state, setActivitiesLoaded(true));
      const notLoaded = reducer(loaded, setActivitiesLoaded(false));
      expect(notLoaded.activitiesLoaded).toBe(false);
    });
  });

  describe('setSelectedActivity', () => {
    it('sets the selected activity and marks as loaded', () => {
      const activity = makeActivity({ id: 'act-1', name: 'Grocery' });
      const newState = reducer(state, setSelectedActivity(activity));
      expect(newState.selectedActivity).toEqual(activity);
      expect(newState.selectedActivityLoaded).toBe(true);
    });

    it('clears selectedActivityBillId when activity is set to null', () => {
      const withBillId = reducer(state, setSelectedActivityBillId('bill-123'));
      const cleared = reducer(withBillId, setSelectedActivity(null));
      expect(cleared.selectedActivity).toBeNull();
      expect(cleared.selectedActivityBillId).toBeNull();
    });

    it('clears selectedActivityInterestId when activity is set to null', () => {
      const withInterestId = reducer(state, setSelectedActivityInterestId('int-456'));
      const cleared = reducer(withInterestId, setSelectedActivity(null));
      expect(cleared.selectedActivity).toBeNull();
      expect(cleared.selectedActivityInterestId).toBeNull();
    });

    it('marks selectedActivityLoaded as true when activity is set to null', () => {
      const newState = reducer(state, setSelectedActivity(null));
      expect(newState.selectedActivityLoaded).toBe(true);
    });

    it('does not clear billId when setting a non-null activity', () => {
      const withBillId = reducer(state, setSelectedActivityBillId('bill-123'));
      const activity = makeActivity({ id: 'act-1' });
      const newState = reducer(withBillId, setSelectedActivity(activity));
      expect(newState.selectedActivityBillId).toBe('bill-123');
    });
  });

  describe('setSelectedActivityBillId', () => {
    it('sets the selectedActivityBillId', () => {
      const newState = reducer(state, setSelectedActivityBillId('bill-123'));
      expect(newState.selectedActivityBillId).toBe('bill-123');
    });

    it('clears the selectedActivityBillId when set to null', () => {
      const withBillId = reducer(state, setSelectedActivityBillId('bill-123'));
      const cleared = reducer(withBillId, setSelectedActivityBillId(null));
      expect(cleared.selectedActivityBillId).toBeNull();
    });
  });

  describe('setSelectedActivityInterestId', () => {
    it('sets the selectedActivityInterestId', () => {
      const newState = reducer(state, setSelectedActivityInterestId('int-789'));
      expect(newState.selectedActivityInterestId).toBe('int-789');
    });

    it('clears the selectedActivityInterestId when set to null', () => {
      const withInterestId = reducer(state, setSelectedActivityInterestId('int-789'));
      const cleared = reducer(withInterestId, setSelectedActivityInterestId(null));
      expect(cleared.selectedActivityInterestId).toBeNull();
    });
  });

  describe('setSelectedActivityLoaded', () => {
    it('sets selectedActivityLoaded to true', () => {
      const newState = reducer(state, setSelectedActivityLoaded(true));
      expect(newState.selectedActivityLoaded).toBe(true);
    });

    it('sets selectedActivityLoaded to false', () => {
      const loaded = reducer(state, setSelectedActivityLoaded(true));
      const notLoaded = reducer(loaded, setSelectedActivityLoaded(false));
      expect(notLoaded.selectedActivityLoaded).toBe(false);
    });
  });

  describe('setSelectedBill', () => {
    it('sets the selected bill and marks as loaded', () => {
      const bill = makeBill({ id: 'bill-1', name: 'Rent' });
      const newState = reducer(state, setSelectedBill(bill));
      expect(newState.selectedBill).toEqual(bill);
      expect(newState.selectedBillLoaded).toBe(true);
    });

    it('clears the selected bill when set to null', () => {
      const withBill = reducer(state, setSelectedBill(makeBill()));
      const cleared = reducer(withBill, setSelectedBill(null));
      expect(cleared.selectedBill).toBeNull();
      expect(cleared.selectedBillLoaded).toBe(true);
    });
  });

  describe('setSelectedBillLoaded', () => {
    it('sets selectedBillLoaded to true', () => {
      const newState = reducer(state, setSelectedBillLoaded(true));
      expect(newState.selectedBillLoaded).toBe(true);
    });

    it('sets selectedBillLoaded to false', () => {
      const loaded = reducer(state, setSelectedBillLoaded(true));
      const notLoaded = reducer(loaded, setSelectedBillLoaded(false));
      expect(notLoaded.selectedBillLoaded).toBe(false);
    });
  });

  describe('setStartDate', () => {
    it('sets the start date', () => {
      const newState = reducer(state, setStartDate('2024-01-01'));
      expect(newState.startDate).toBe('2024-01-01');
    });

    it('does not affect endDate', () => {
      const originalEnd = state.endDate;
      const newState = reducer(state, setStartDate('2024-01-01'));
      expect(newState.endDate).toBe(originalEnd);
    });
  });

  describe('setEndDate', () => {
    it('sets the end date', () => {
      const newState = reducer(state, setEndDate('2024-12-31'));
      expect(newState.endDate).toBe('2024-12-31');
    });

    it('does not affect startDate', () => {
      const originalStart = state.startDate;
      const newState = reducer(state, setEndDate('2024-12-31'));
      expect(newState.startDate).toBe(originalStart);
    });
  });

  describe('newActivity', () => {
    it('creates a new blank activity with default fields', () => {
      const newState = reducer(state, newActivity());
      expect(newState.selectedActivity).not.toBeNull();
      expect(newState.selectedActivity?.name).toBe('');
      expect(newState.selectedActivity?.category).toBe('');
      expect(newState.selectedActivity?.amount).toBe(0);
      expect(newState.selectedActivity?.flag).toBe(false);
      expect(newState.selectedActivity?.isTransfer).toBe(false);
    });

    it('sets selectedActivityLoaded to true', () => {
      const newState = reducer(state, newActivity());
      expect(newState.selectedActivityLoaded).toBe(true);
    });

    it('uses lastDate as the activity date', () => {
      const withLastDate = reducer(state, setStartDate('2024-06-01'));
      // Set lastDate by updating an activity
      const stateWithLastDate = {
        ...withLastDate,
        lastDate: '2024-03-15',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;
      // newActivity uses state.lastDate for the date field
      const newState = reducer(stateWithLastDate, newActivity());
      expect(newState.selectedActivity?.date).toBe('2024-03-15');
    });

    it('sets dateIsVariable to false', () => {
      const newState = reducer(state, newActivity());
      expect(newState.selectedActivity?.dateIsVariable).toBe(false);
    });

    it('sets amountIsVariable to false', () => {
      const newState = reducer(state, newActivity());
      expect(newState.selectedActivity?.amountIsVariable).toBe(false);
    });
  });

  describe('duplicateActivity', () => {
    it('creates a copy of the activity with "Copy of" prefix on the name', () => {
      const original = makeActivity({ id: 'act-original', name: 'Grocery Store', category: 'Food', amount: -50 });
      const newState = reducer(state, duplicateActivity(original));
      expect(newState.selectedActivity?.name).toBe('Copy of Grocery Store');
    });

    it('copies category from the original activity', () => {
      const original = makeActivity({ category: 'Restaurants' });
      const newState = reducer(state, duplicateActivity(original));
      expect(newState.selectedActivity?.category).toBe('Restaurants');
    });

    it('copies amount from the original activity', () => {
      const original = makeActivity({ amount: -125.75 });
      const newState = reducer(state, duplicateActivity(original));
      expect(newState.selectedActivity?.amount).toBe(-125.75);
    });

    it('copies flag from the original activity', () => {
      const original = makeActivity({ flag: true, flagColor: 'red' });
      const newState = reducer(state, duplicateActivity(original));
      expect(newState.selectedActivity?.flag).toBe(true);
      expect(newState.selectedActivity?.flagColor).toBe('red');
    });

    it('copies isTransfer and from/to from the original', () => {
      const original = makeActivity({ isTransfer: true, from: 'Checking', to: 'Savings' });
      const newState = reducer(state, duplicateActivity(original));
      expect(newState.selectedActivity?.isTransfer).toBe(true);
      expect(newState.selectedActivity?.from).toBe('Checking');
      expect(newState.selectedActivity?.to).toBe('Savings');
    });

    it('sets selectedActivityLoaded to true', () => {
      const original = makeActivity();
      const newState = reducer(state, duplicateActivity(original));
      expect(newState.selectedActivityLoaded).toBe(true);
    });

    it('sets dateIsVariable to false on the duplicate', () => {
      const original = makeActivity({ dateIsVariable: true });
      const newState = reducer(state, duplicateActivity(original));
      expect(newState.selectedActivity?.dateIsVariable).toBe(false);
    });
  });

  describe('newBill', () => {
    it('creates a new blank bill with default fields', () => {
      const newState = reducer(state, newBill());
      expect(newState.selectedBill).not.toBeNull();
      expect(newState.selectedBill?.name).toBe('');
      expect(newState.selectedBill?.category).toBe('');
      expect(newState.selectedBill?.amount).toBe(0);
      expect(newState.selectedBill?.flag).toBe(false);
      expect(newState.selectedBill?.isTransfer).toBe(false);
      expect(newState.selectedBill?.everyN).toBe(1);
      expect(newState.selectedBill?.periods).toBe('month');
    });

    it('sets selectedBillLoaded to true', () => {
      const newState = reducer(state, newBill());
      expect(newState.selectedBillLoaded).toBe(true);
    });

    it('sets default increaseBy fields', () => {
      const newState = reducer(state, newBill());
      expect(newState.selectedBill?.increaseBy).toBe(0.03);
      expect(newState.selectedBill?.increaseByIsVariable).toBe(true);
      expect(newState.selectedBill?.increaseByVariable).toBe('INFLATION');
      expect(newState.selectedBill?.increaseByDate).toBe('01/01');
    });

    it('sets endDate to null', () => {
      const newState = reducer(state, newBill());
      expect(newState.selectedBill?.endDate).toBeNull();
    });
  });

  describe('updateActivity', () => {
    it('updates selectedActivity with the provided BaseActivity', () => {
      const activity = makeBaseActivity({ id: 'act-updated', name: 'Updated Activity', date: '2024-07-20' });
      const newState = reducer(state, updateActivity(activity));
      expect(newState.selectedActivity).toEqual(activity);
      expect(newState.selectedActivityLoaded).toBe(true);
    });

    it('updates lastDate to the activity date', () => {
      const activity = makeBaseActivity({ date: '2024-09-15' });
      const newState = reducer(state, updateActivity(activity));
      expect(newState.lastDate).toBe('2024-09-15');
    });
  });

  describe('updateBill', () => {
    it('updates selectedBill with the provided Bill', () => {
      const bill = makeBill({ id: 'bill-updated', name: 'Updated Bill', startDate: '2024-08-01' });
      const newState = reducer(state, updateBill(bill));
      expect(newState.selectedBill).toEqual(bill);
      expect(newState.selectedBillLoaded).toBe(true);
    });

    it('updates lastDate to the bill startDate', () => {
      const bill = makeBill({ startDate: '2024-11-01' });
      const newState = reducer(state, updateBill(bill));
      expect(newState.lastDate).toBe('2024-11-01');
    });
  });

  describe('updateInterests', () => {
    it('sets interests and marks as loaded', () => {
      const interests = [makeInterest({ id: 'int-1' }), makeInterest({ id: 'int-2' })];
      const newState = reducer(state, updateInterests(interests));
      expect(newState.interests).toEqual(interests);
      expect(newState.interestsLoaded).toBe(true);
    });

    it('sets interests to null and marks as loaded', () => {
      const withInterests = reducer(state, updateInterests([makeInterest()]));
      const cleared = reducer(withInterests, updateInterests(null));
      expect(cleared.interests).toBeNull();
      expect(cleared.interestsLoaded).toBe(true);
    });

    it('sets interests to empty array and marks as loaded', () => {
      const newState = reducer(state, updateInterests([]));
      expect(newState.interests).toEqual([]);
      expect(newState.interestsLoaded).toBe(true);
    });
  });

  describe('setInterestsLoaded', () => {
    it('sets interestsLoaded to true', () => {
      const newState = reducer(state, setInterestsLoaded(true));
      expect(newState.interestsLoaded).toBe(true);
    });

    it('sets interestsLoaded to false', () => {
      const loaded = reducer(state, setInterestsLoaded(true));
      const notLoaded = reducer(loaded, setInterestsLoaded(false));
      expect(notLoaded.interestsLoaded).toBe(false);
    });
  });

  describe('updateNames', () => {
    it('sets names and marks as loaded', () => {
      const names: NameEntry[] = [
        {
          name: 'Electric Bill',
          category: 'Utilities',
          isHealthcare: false,
          healthcarePerson: null,
          coinsurancePercent: null,
          isTransfer: false,
          from: null,
          to: null,
          spendingCategory: null,
        },
        {
          name: 'Grocery Store',
          category: 'Groceries',
          isHealthcare: false,
          healthcarePerson: null,
          coinsurancePercent: null,
          isTransfer: false,
          from: null,
          to: null,
          spendingCategory: null,
        },
      ];
      const newState = reducer(state, updateNames(names));
      expect(newState.names).toEqual(names);
      expect(newState.namesLoaded).toBe(true);
    });

    it('replaces existing names', () => {
      const first = reducer(state, updateNames([
        {
          name: 'Old Name',
          category: 'Old Category',
          isHealthcare: false,
          healthcarePerson: null,
          coinsurancePercent: null,
          isTransfer: false,
          from: null,
          to: null,
          spendingCategory: null,
        },
      ]));

      const newNames: NameEntry[] = [
        {
          name: 'New Name',
          category: 'New Category',
          isHealthcare: false,
          healthcarePerson: null,
          coinsurancePercent: null,
          isTransfer: false,
          from: null,
          to: null,
          spendingCategory: null,
        },
      ];
      const second = reducer(first, updateNames(newNames));
      expect(second.names).toEqual(newNames);
      expect(second.names).toHaveLength(1);
      expect(second.names[0].name).toBe('New Name');
    });
  });

  describe('setNamesLoaded', () => {
    it('sets namesLoaded to true', () => {
      const newState = reducer(state, setNamesLoaded(true));
      expect(newState.namesLoaded).toBe(true);
    });

    it('sets namesLoaded to false', () => {
      const loaded = reducer(state, setNamesLoaded(true));
      const notLoaded = reducer(loaded, setNamesLoaded(false));
      expect(notLoaded.namesLoaded).toBe(false);
    });
  });
});
