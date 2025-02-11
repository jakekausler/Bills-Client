import { RootState } from '../../store';

export const selectMoneyMovementData = (state: RootState) => state.moneyMovement.data;
export const selectMoneyMovementLoading = (state: RootState) => state.moneyMovement.loading;
export const selectMoneyMovementError = (state: RootState) => state.moneyMovement.error;
export const selectMoneyMovementLabels = (state: RootState) => state.moneyMovement.data?.labels;
export const selectMoneyMovementDatasets = (state: RootState) => state.moneyMovement.data?.datasets;
export const selectMoneyMovementStartDate = (state: RootState) => state.moneyMovement.startDate;
export const selectMoneyMovementEndDate = (state: RootState) => state.moneyMovement.endDate;
