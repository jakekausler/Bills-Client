import { AppDispatch } from '../../store';
import {
  setLoading,
  setError,
  setConfigs,
  addConfig,
  updateConfig,
  removeConfig,
} from './slice';
import {
  getHealthcareConfigs,
  postHealthcareConfig,
  putHealthcareConfig,
  deleteHealthcareConfigApi,
} from './api';
import { HealthcareConfig } from '../../types/types';

export const loadHealthcareConfigs = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const configs = await getHealthcareConfigs();
    dispatch(setConfigs(configs));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load configs';
    dispatch(setError(message));
  }
};

export const createHealthcareConfig =
  (config: Omit<HealthcareConfig, 'id'>) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const newConfig = await postHealthcareConfig(config);
      dispatch(addConfig(newConfig));
      dispatch(setLoading(false));
      return newConfig;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create config';
      dispatch(setError(message));
      throw error;
    }
  };

export const updateHealthcareConfig =
  (id: string, config: HealthcareConfig) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const updatedConfig = await putHealthcareConfig(id, config);
      dispatch(updateConfig(updatedConfig));
      dispatch(setLoading(false));
      return updatedConfig;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update config';
      dispatch(setError(message));
      throw error;
    }
  };

export const deleteHealthcareConfig = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    await deleteHealthcareConfigApi(id);
    dispatch(removeConfig(id));
    dispatch(setLoading(false));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete config';
    dispatch(setError(message));
    throw error;
  }
};
