import { api, fetchWithAuth } from '../../utils/api';
// Healthcare Configs CRUD
export async function getHealthcareConfigs() {
    return await api.get('/api/healthcare/configs');
}
export async function postHealthcareConfig(config) {
    return await api.post('/api/healthcare/configs', config);
}
export async function putHealthcareConfig(id, config) {
    return await api.put(`/api/healthcare/configs/${id}`, config);
}
export async function deleteHealthcareConfigApi(id) {
    return await api.delete(`/api/healthcare/configs/${id}`);
}
// Progress tracking (backend-driven, no Redux caching)
export async function getDeductibleProgress(simulation, date) {
    const params = new URLSearchParams({ simulation });
    if (date)
        params.append('date', date);
    return await fetchWithAuth(`/api/healthcare/progress?${params}`);
}
// Healthcare expenses (backend-driven, no Redux caching)
export async function getHealthcareExpenses(simulation, startDate, endDate) {
    const params = new URLSearchParams({ simulation });
    if (startDate)
        params.append('startDate', startDate);
    if (endDate)
        params.append('endDate', endDate);
    return await fetchWithAuth(`/api/healthcare/expenses?${params}`);
}
