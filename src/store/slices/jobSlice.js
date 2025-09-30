import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import * as jobAPI from '../../services/jobAPI';

export const fetchJobs = createAsyncThunk(
    'jobs/fetchJobs',
    async (filters, { rejectWithValue }) => {
        try {   
            const response =  await jobAPI.getJobs(filters);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }   
    }
);

export const createJob = createAsyncThunk(
    'jobs/createJob',
    async (jobData, { rejectWithValue }) => {
        try {   
            const response = await jobAPI.createJob(jobData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const jobSlice = createSlice({
    name: 'jobs',
    initialState: {
        jobs: [],
        currentJob: null,
        loading: false,
        error: null,
        totalPages: 1,
        currentPage: 1,
        totalJobs: 0
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCurrentJob: (state, action) => {
            state.currentJob = action.payload;
        }
        },
    extraReducers: (builder) => {
        builder
        .addCase(fetchJobs.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchJobs.fulfilled, (state, action) => {
            state.loading = false;
            state.jobs = action.payload.jobs || [];
            state.totalPages = action.payload.totalPages || 1;
            state.currentPage = action.payload.currentPage || 1;
            state.totalJobs = action.payload.total || 0;
        })
        .addCase(fetchJobs.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Failed to fetch jobs';
        })
        .addCase(createJob.pending, (state) => {
            state.loading = true;
        })
        .addCase(createJob.fulfilled, (state, action) => {
            state.loading = false;
            state.jobs.unshift(action.payload);
        })
        .addCase(createJob.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Failed to create job';
        });
    }
});

export const { clearError, setCurrentJob } = jobSlice.actions;
export default jobSlice.reducer;
