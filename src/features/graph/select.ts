import { RootState } from '../../store';

export const selectGraphDatasets = (state: RootState) => state.graph.datasets;
export const selectGraphLabels = (state: RootState) => state.graph.labels;
export const selectGraphType = (state: RootState) => state.graph.type;
export const selectGraphLoaded = (state: RootState) => state.graph.loaded;
export const selectGraphError = (state: RootState) => state.graph.error;

export const selectGraphEndDate = (state: RootState) => state.graph.endDate;
