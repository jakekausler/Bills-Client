export const selectAllActivities = (state) => state.activities.activities;
export const selectActivitiesLoaded = (state) => state.activities.activitiesLoaded;
export const selectActivitiesError = (state) => state.activities.activitiesError;
export const selectSelectedActivity = (state) => state.activities.selectedActivity;
export const selectSelectedActivityLoaded = (state) => state.activities.selectedActivityLoaded;
export const selectSelectedActivityBillId = (state) => state.activities.selectedActivityBillId;
export const selectSelectedBill = (state) => state.activities.selectedBill;
export const selectSelectedBillLoaded = (state) => state.activities.selectedBillLoaded;
export const selectInterests = (state) => state.activities.interests;
export const selectInterestsLoaded = (state) => state.activities.interestsLoaded;
export const selectSelectedActivityInterestId = (state) => state.activities.selectedActivityInterestId;
export const selectStartDate = (state) => {
    return state.activities.startDate;
};
export const selectEndDate = (state) => {
    return state.activities.endDate;
};
export const selectShowGraph = (state) => state.graph.show;
export const selectNames = (state) => state.activities.names;
export const selectNamesLoaded = (state) => state.activities.namesLoaded;
