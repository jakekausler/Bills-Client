import { AppThunk } from "../../store";
import { Simulation } from "../../types/types";
import {
  fetchSaveSimulations,
  fetchSimulations,
  fetchUsedVariables,
} from "./api";
import { setSimulations, setSimulationsLoaded, setUsedVariables, setUsedVariablesLoaded } from "./slice";

export const loadSimulations = (): AppThunk => {
  return async (dispatch) => {
    try {
      dispatch(setSimulationsLoaded(false));
      const simulations = await fetchSimulations();
      dispatch(setSimulations(simulations));
      dispatch(loadUsedVariables());
    } catch (error) {
      console.error("Failed to load simulations", error);
    }
  };
};

export const loadUsedVariables = (): AppThunk => {
  return async (dispatch) => {
    dispatch(setUsedVariablesLoaded(false));
    const usedVariables = await fetchUsedVariables();
    dispatch(setUsedVariables(usedVariables));
  };
};

export const saveSimulations = (simulations: Simulation[]): AppThunk => {
  return async (dispatch) => {
    await fetchSaveSimulations(simulations);
    dispatch(loadSimulations());
    dispatch(loadUsedVariables());
  };
};
