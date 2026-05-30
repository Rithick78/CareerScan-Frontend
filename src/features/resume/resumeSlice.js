import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { uploadResumeApi, getParsedResumeApi } from '../../api/resumeApi'

// ── Async Thunks ──────────────────────────────────────────────────────────────

export const fetchParsedResume = createAsyncThunk(
  'resume/fetchParsed',
  async (_, thunkAPI) => {
    try {
      const data = await getParsedResumeApi()
      return data
      // payload = { id, detectedRole, skills[], experience, city, summary }
    } catch (err) {
      // 404 = no resume yet — not an error, just empty
      if (err.response?.status === 404) return null
      return thunkAPI.rejectWithValue('Could not load resume.')
    }
  }
)

export const uploadResume = createAsyncThunk(
  'resume/upload',
  async (file, thunkAPI) => {
    try {
      const data = await uploadResumeApi(file)
      return data.parsedData
      // payload = parsedData object
    } catch (err) {
      const message = err.response?.data?.message || 'Upload failed.'
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// ── Slice ─────────────────────────────────────────────────────────────────────
const resumeSlice = createSlice({
  name: 'resume',
  initialState: {
    data:       null,     // parsedResume object
    isLoading:  false,    // fetching existing resume on page load
    isUploading:false,    // uploading a new file
    error:      null,
  },
  reducers: {
    clearResumeError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      // ── FETCH PARSED RESUME ──
      .addCase(fetchParsedResume.pending, (state) => {
        state.isLoading = true
        state.error     = null
      })
      .addCase(fetchParsedResume.fulfilled, (state, action) => {
        state.isLoading = false
        state.data      = action.payload  // null if 404
      })
      .addCase(fetchParsedResume.rejected, (state, action) => {
        state.isLoading = false
        state.error     = action.payload
      })

      // ── UPLOAD RESUME ──
      .addCase(uploadResume.pending, (state) => {
        state.isUploading = true
        state.error       = null
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.isUploading = false
        state.data        = action.payload  // updated parsedData
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.isUploading = false
        state.error       = action.payload
      })
  },
})

export const { clearResumeError } = resumeSlice.actions
export default resumeSlice.reducer