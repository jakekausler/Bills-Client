import { api } from '../../utils/api';
export const createSimulation = async (data) => {
    return await api.post(`/api/monte_carlo/simulations?startDate=${data.startDate}&endDate=${data.endDate}`, data);
};
export const getAllSimulations = async () => {
    return await api.get('/api/monte_carlo/simulations');
};
export const getSimulationStatus = async (id) => {
    return await api.get(`/api/monte_carlo/simulations/${id}/status`);
};
export const getSimulationGraph = async (id) => {
    return await api.get(`/api/monte_carlo/simulations/${id}/graph`);
};
