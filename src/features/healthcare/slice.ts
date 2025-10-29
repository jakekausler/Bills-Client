import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HealthcareConfig } from '../../types/types';

type HealthcareState = {
  configs: HealthcareConfig[];
  loading: boolean;
  error: string | null;
};

const initialState: HealthcareState = {
  configs: [],
  loading: false,
  error: null,
};

const healthcareSlice = createSlice({
  name: 'healthcare',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setConfigs: (state, action: PayloadAction<HealthcareConfig[]>) => {
      state.configs = action.payload;
      state.loading = false;
      state.error = null;
    },
    addConfig: (state, action: PayloadAction<HealthcareConfig>) => {
      state.configs.push(action.payload);
    },
    updateConfig: (state, action: PayloadAction<HealthcareConfig>) => {
      const index = state.configs.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.configs[index] = action.payload;
      }
    },
    removeConfig: (state, action: PayloadAction<string>) => {
      state.configs = state.configs.filter(c => c.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setConfigs,
  addConfig,
  updateConfig,
  removeConfig,
  clearError,
} = healthcareSlice.actions;

export default healthcareSlice.reducer;
