import { configureStore } from '@reduxjs/toolkit'
import authReducer   from '../features/auth/authSlice'
import resumeReducer from '../features/resume/resumeSlice'
import jobsReducer   from '../features/jobs/jobsSlice'

const store = configureStore({
  reducer: {
    auth:   authReducer,    // state.auth.token / .email / .name
    resume: resumeReducer,  // state.resume.data / .isLoading / .isUploading
    jobs:   jobsReducer,    // state.jobs.matchedJobs / .savedJobs
  },
})

export default store