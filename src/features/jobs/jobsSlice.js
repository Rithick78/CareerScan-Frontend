import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getMatchedJobsApi,
  saveJobApi,
  getSavedJobsApi,
  deleteSavedJobApi,
} from '../../api/jobApi'


export const fetchMatchedJobs = createAsyncThunk(
  'jobs/fetchMatched',
  async (_, thunkAPI) => {
    try {
      return await getMatchedJobsApi()
      // payload = { totalFound, matchSummary, jobs[] }
    } catch (err) {
      const message = err.response?.data?.message || 'Could not load jobs.'
      return thunkAPI.rejectWithValue({ message, status: err.response?.status })
    }
  }
)

export const fetchSavedJobs = createAsyncThunk(
  'jobs/fetchSaved',
  async (_, thunkAPI) => {
    try {
      const data = await getSavedJobsApi()
      return Array.isArray(data) ? data : data.jobs || []
    } catch (err) {
      return thunkAPI.rejectWithValue('Could not load saved jobs.')
    }
  }
)

export const saveJobThunk = createAsyncThunk(
  'jobs/save',
  async (job, thunkAPI) => {
    try {
      await saveJobApi(job)
      return job.jobId   // return jobId so we know which job was saved
    } catch (err) {
      return thunkAPI.rejectWithValue('Could not save job.')
    }
  }
)

export const deleteJobThunk = createAsyncThunk(
  'jobs/delete',
  async (jobId, thunkAPI) => {
    try {
      await deleteSavedJobApi(jobId)
      return jobId  
    } catch (err) {
      return thunkAPI.rejectWithValue('Could not delete job.')
    }
  }
)

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    matchedJobs:  [],
    savedJobs:    [],
    matchSummary: '',
    totalFound:   0,
    savedJobIds:  [],  
    isLoading:    false,
    isSaving:     false,
    error:        null,
  },
  reducers: {
    clearJobsError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      // ── FETCH MATCHED JOBS ──
      .addCase(fetchMatchedJobs.pending, (state) => {
        state.isLoading = true
        state.error     = null
      })
      .addCase(fetchMatchedJobs.fulfilled, (state, action) => {
        state.isLoading    = false
        state.matchedJobs  = action.payload.jobs || []
        state.matchSummary = action.payload.matchSummary || ''
        state.totalFound   = action.payload.totalFound || 0
      })
      .addCase(fetchMatchedJobs.rejected, (state, action) => {
        state.isLoading = false
        state.error     = action.payload
      })

      // ── FETCH SAVED JOBS ──
      .addCase(fetchSavedJobs.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchSavedJobs.fulfilled, (state, action) => {
        state.isLoading  = false
        state.savedJobs  = action.payload
        // track saved jobIds for button state on FindJobs page
        state.savedJobIds = action.payload.map(j => j.jobId)
      })
      .addCase(fetchSavedJobs.rejected, (state, action) => {
        state.isLoading = false
        state.error     = action.payload
      })

      // ── SAVE JOB ──
      .addCase(saveJobThunk.pending, (state) => {
        state.isSaving = true
      })
      .addCase(saveJobThunk.fulfilled, (state, action) => {
        state.isSaving = false
        // add jobId to savedJobIds so button changes to Saved instantly
        state.savedJobIds.push(action.payload)
      })
      .addCase(saveJobThunk.rejected, (state, action) => {
        state.isSaving = false
        state.error    = action.payload
      })

      // ── DELETE JOB ──
      .addCase(deleteJobThunk.fulfilled, (state, action) => {
        // remove from savedJobs array and savedJobIds
        state.savedJobs  = state.savedJobs.filter(j => j.jobId !== action.payload)
        state.savedJobIds = state.savedJobIds.filter(id => id !== action.payload)
      })
      .addCase(deleteJobThunk.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { clearJobsError } = jobsSlice.actions
export default jobsSlice.reducer