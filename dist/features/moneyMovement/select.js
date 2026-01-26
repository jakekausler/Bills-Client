export const selectMoneyMovementData = (state) => state.moneyMovement.data;
export const selectMoneyMovementLoading = (state) => state.moneyMovement.loading;
export const selectMoneyMovementError = (state) => state.moneyMovement.error;
export const selectMoneyMovementLabels = (state) => state.moneyMovement.data?.labels;
export const selectMoneyMovementDatasets = (state) => state.moneyMovement.data?.datasets;
export const selectMoneyMovementStartDate = (state) => state.moneyMovement.startDate;
export const selectMoneyMovementEndDate = (state) => state.moneyMovement.endDate;
