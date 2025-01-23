import { RootState } from "../../store";

export const selectFlow = (state: RootState) => state.flow.flow;
export const selectFlowLoaded = (state: RootState) => state.flow.flowLoaded;
export const selectFlowError = (state: RootState) => state.flow.flowError;
export const selectSelectedAccounts = (state: RootState) => state.flow.selectedAccounts;
export const selectFlowStartDate = (state: RootState) => state.flow.startDate;
export const selectFlowEndDate = (state: RootState) => state.flow.endDate;
