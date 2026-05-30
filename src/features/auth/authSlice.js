import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginUser, registerUser } from '../../api/authApi'

// ── Async Thunks ─────────────────────────────────────────────────────────────
// createAsyncThunk handles 3 states automatically:
// pending   → request started
// fulfilled → request succeeded, action.payload = returned data
// rejected  → request failed, action.payload = error message

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const data = await loginUser(email, password)
      // data = { token, email, name, message }
      return data
    } catch (err) {
      // rejected action gets this as payload
      const message = err.response?.data?.message || 'Login failed. Try again.'
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const registerThunk = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, thunkAPI) => {
    try {
      const data = await registerUser(name, email, password)
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.'
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// ── Initial State ─────────────────────────────────────────────────────────────
// Read from localStorage so user stays logged in after page refresh
const initialState = {
  token:     localStorage.getItem('token') || null,
  email:     localStorage.getItem('email') || null,
  name:      localStorage.getItem('name')  || null,
  isLoading: false,
  error:     null,
}

// ── Slice ─────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Called directly — no async needed
    logout: (state) => {
      state.token = null
      state.email = null
      state.name  = null
      state.error = null
      localStorage.removeItem('token')
      localStorage.removeItem('email')
      localStorage.removeItem('name')
    },
    clearError: (state) => {
      state.error = null
    },
  },

  // extraReducers handles the 3 states of each async thunk
  extraReducers: (builder) => {
    builder
      // ── LOGIN ──
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true
        state.error     = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        // action.payload = { token, email, name, message }
        state.isLoading = false
        state.token     = action.payload.token
        state.email     = action.payload.email
        state.name      = action.payload.name
        // persist to localStorage
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('email', action.payload.email)
        localStorage.setItem('name',  action.payload.name)
      })
      .addCase(loginThunk.rejected, (state, action) => {
        // action.payload = error message from rejectWithValue
        state.isLoading = false
        state.error     = action.payload
      })

      // ── REGISTER ──
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true
        state.error     = null
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.isLoading = false
        // don't save token here — user must login after register
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error     = action.payload
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer