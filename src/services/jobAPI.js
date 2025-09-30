import api from './api';

export const getJobs = async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key,filters[key]); 
    });
    const response = await api.get(`/jobs?${params}`);
    return response.data;
};

export const getJob = async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
};
export const createJob = async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
};
export const applyToJob = async (jobId, applicationData) => {
    const response = await api.post(`/jobs/${jobId}/apply`, applicationData);
    return response.data;
};