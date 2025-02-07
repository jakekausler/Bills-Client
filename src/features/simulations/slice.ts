import { createSlice } from '@reduxjs/toolkit';

import { PayloadAction } from '@reduxjs/toolkit';
import { Simulation, UsedVariableMap } from '../../types/types';

interface SimulationsState {
  simulations: Simulation[];
  simulationsLoaded: boolean;

  usedVariables: UsedVariableMap;
  usedVariablesLoaded: boolean;
}

const initialState: SimulationsState = {
  simulations: [],
  simulationsLoaded: false,

  usedVariables: {},
  usedVariablesLoaded: false,
};

export const simulationsSlice = createSlice({
  name: 'simulations',
  initialState,
  reducers: {
    setSimulations: (state, action: PayloadAction<Simulation[]>) => {
      state.simulations = action.payload;
      state.simulationsLoaded = true;
    },
    setSimulationsLoaded: (state, action: PayloadAction<boolean>) => {
      state.simulationsLoaded = action.payload;
    },
    setUsedVariables: (state, action: PayloadAction<UsedVariableMap>) => {
      state.usedVariables = action.payload;
      state.usedVariablesLoaded = true;
    },
    setUsedVariablesLoaded: (state, action: PayloadAction<boolean>) => {
      state.usedVariablesLoaded = action.payload;
    },
  },
});

export const { setSimulations, setSimulationsLoaded, setUsedVariables, setUsedVariablesLoaded } =
  simulationsSlice.actions;

export default simulationsSlice.reducer;
