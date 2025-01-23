import { RootState } from "../../store";

export const selectGraphViewDatasets = (state: RootState) =>
  state.graphView.datasets;

export const selectGraphViewLabels = (state: RootState) =>
  state.graphView.labels;

export const selectGraphViewEndDate = (state: RootState) =>
  state.graphView.endDate;

export const selectGraphViewType = (state: RootState) => state.graphView.type;

export const selectGraphViewLoaded = (state: RootState) =>
  state.graphView.loaded;

export const selectGraphViewError = (state: RootState) => state.graphView.error;

export const selectSelectedAccounts = (state: RootState) =>
  state.graphView.selectedAccounts;
