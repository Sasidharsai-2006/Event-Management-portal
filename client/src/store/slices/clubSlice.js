import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import clubService from '../../services/clubService'

const initialState = {
  clubs: [],
  currentClub: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
}

// Get all clubs
export const getClubs = createAsyncThunk(
  'clubs/getClubs',
  async (filters, thunkAPI) => {
    try {
      return await clubService.getClubs(filters)
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get single club
export const getClub = createAsyncThunk(
  'clubs/getClub',
  async (clubId, thunkAPI) => {
    try {
      return await clubService.getClub(clubId)
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Create club
export const createClub = createAsyncThunk(
  'clubs/createClub',
  async (clubData, thunkAPI) => {
    try {
      return await clubService.createClub(clubData)
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Join club
export const joinClub = createAsyncThunk(
  'clubs/joinClub',
  async (clubId, thunkAPI) => {
    try {
      return await clubService.joinClub(clubId)
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Leave club
export const leaveClub = createAsyncThunk(
  'clubs/leaveClub',
  async (clubId, thunkAPI) => {
    try {
      return await clubService.leaveClub(clubId)
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const clubSlice = createSlice({
  name: 'clubs',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
    clearCurrentClub: (state) => {
      state.currentClub = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getClubs.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getClubs.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.clubs = action.payload.data.clubs
      })
      .addCase(getClubs.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getClub.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getClub.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.currentClub = action.payload.data.club
      })
      .addCase(getClub.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createClub.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createClub.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.clubs.unshift(action.payload.data.club)
      })
      .addCase(createClub.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(joinClub.fulfilled, (state, action) => {
        state.isSuccess = true
        if (state.currentClub) {
          state.currentClub = action.payload.data.club
        }
        // Update club in clubs list
        const index = state.clubs.findIndex(club => club._id === action.payload.data.club._id)
        if (index !== -1) {
          state.clubs[index] = action.payload.data.club
        }
      })
      .addCase(leaveClub.fulfilled, (state, action) => {
        state.isSuccess = true
        if (state.currentClub) {
          state.currentClub = action.payload.data.club
        }
        // Update club in clubs list
        const index = state.clubs.findIndex(club => club._id === action.payload.data.club._id)
        if (index !== -1) {
          state.clubs[index] = action.payload.data.club
        }
      })
  },
})

export const { reset, clearCurrentClub } = clubSlice.actions
export default clubSlice.reducer
