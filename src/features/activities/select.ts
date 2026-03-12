import { RootState } from '../../store';

export const selectAllActivities = (state: RootState) => state.activities.activities;

export const selectActivitiesLoaded = (state: RootState) => state.activities.activitiesLoaded;

export const selectSelectedActivity = (state: RootState) => state.activities.selectedActivity;

export const selectSelectedActivityLoaded = (state: RootState) => state.activities.selectedActivityLoaded;

export const selectSelectedActivityBillId = (state: RootState) => state.activities.selectedActivityBillId;

export const selectSelectedBill = (state: RootState) => state.activities.selectedBill;

export const selectSelectedBillLoaded = (state: RootState) => state.activities.selectedBillLoaded;

export const selectInterests = (state: RootState) => state.activities.interests;

export const selectInterestsLoaded = (state: RootState) => state.activities.interestsLoaded;

// Note: This file has no issues at line 21. The file structure changed from the original report.

export const selectSelectedActivityInterestId = (state: RootState) => state.activities.selectedActivityInterestId;

export const selectStartDate = (state: RootState) => {
  return state.activities.startDate;
};

export const selectEndDate = (state: RootState) => {
  return state.activities.endDate;
};

export const selectNames = (state: RootState) => state.activities.names;

export const selectNamesLoaded = (state: RootState) => state.activities.namesLoaded;

export const selectActivitiesError = (state: RootState) => state.activities.activitiesError;
