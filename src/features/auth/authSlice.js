import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginUser, registerUser } from '../../api/authApi'

// Async Thunks

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const data = await loginUser(email, password)
      return data
    } catch (err) {
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

// Initial State
const initialState = {
  token:     localStorage.getItem('token') || null,
  email:     localStorage.getItem('email') || null,
  name:      localStorage.getItem('name')  || null,
  isLoading: false,
  error:     null,
}

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

    // Guest login calls API directly and dispatches this manually
    setCredentials: (state, action) => {
      const { token, email, name } = action.payload
      state.token = token
      state.email = email
      state.name  = name
      localStorage.setItem('token', token)
      localStorage.setItem('email', email)
      localStorage.setItem('name',  name)
    },

    // Called on logout button click
    logout: (state) => {
      state.token = null
      state.email = null
      state.name  = null
      state.error = null
      localStorage.removeItem('token')
      localStorage.removeItem('email')
      localStorage.removeItem('name')
    },

    // Clears error state — used when user navigates away
    clearError: (state) => {
      state.error = null
    },

  },

  // Handles the 3 states of each async thunk automatically
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
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('email', action.payload.email)
        localStorage.setItem('name',  action.payload.name)
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error     = action.payload
      })

      // REGISTER
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true
        state.error     = null
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error     = action.payload
      })
  },
})

// Export actions — setCredentials is used by guest login
export const { setCredentials, logout, clearError } = authSlice.actions
export default authSlice.reducer