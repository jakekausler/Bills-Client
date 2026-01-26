import { fetchSaveSimulations, fetchSimulations, fetchUsedVariables } from './api';
import { setSimulations, setSimulationsLoaded, setUsedVariables, setUsedVariablesLoaded } from './slice';
export const loadSimulations = () => {
    return async (dispatch) => {
        try {
            dispatch(setSimulationsLoaded(false));
            const simulations = await fetchSimulations();
            dispatch(setSimulations(simulations));
            dispatch(loadUsedVariables());
        }
        catch (error) {
            console.error('Failed to load simulations', error);
        }
    };
};
export const loadUsedVariables = () => {
    return async (dispatch) => {
        dispatch(setUsedVariablesLoaded(false));
        const usedVariables = await fetchUsedVariables();
        dispatch(setUsedVariables(usedVariables));
    };
};
export const saveSimulations = (simulations) => {
    return async (dispatch) => {
        await fetchSaveSimulations(simulations);
        dispatch(loadSimulations());
        dispatch(loadUsedVariables());
    };
};
