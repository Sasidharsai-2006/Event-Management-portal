import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import eventService from '../../services/eventService'

const initialState = {
  events: [],
  currentEvent: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
}

// Get all events
export const getEvents = createAsyncThunk(
  'events/getEvents',
  async (filters, thunkAPI) => {
    try {
      return await eventService.getEvents(filters)
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get single event
export const getEvent = createAsyncThunk(
  'events/getEvent',
  async (eventId, thunkAPI) => {
    try {
      return await eventService.getEvent(eventId)
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Create event
export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData, thunkAPI) => {
    try {
      return await eventService.createEvent(eventData)
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Register for event
export const registerForEvent = createAsyncThunk(
  'events/registerForEvent',
  async (eventId, thunkAPI) => {
    try {
      return await eventService.registerForEvent(eventId)
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Unregister from event
export const unregisterFromEvent = createAsyncThunk(
  'events/unregisterFromEvent',
  async (eventId, thunkAPI) => {
    try {
      return await eventService.unregisterFromEvent(eventId)
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEvents.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.events = action.payload.data.events
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getEvent.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getEvent.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.currentEvent = action.payload.data.event
      })
      .addCase(getEvent.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createEvent.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.events.unshift(action.payload.data.event)
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(registerForEvent.fulfilled, (state, action) => {
        state.isSuccess = true
        if (state.currentEvent) {
          state.currentEvent = action.payload.data.event
        }
        // Update event in events list
        const index = state.events.findIndex(event => event._id === action.payload.data.event._id)
        if (index !== -1) {
          state.events[index] = action.payload.data.event
        }
      })
      .addCase(unregisterFromEvent.fulfilled, (state, action) => {
        state.isSuccess = true
        if (state.currentEvent) {
          state.currentEvent = action.payload.data.event
        }
        // Update event in events list
        const index = state.events.findIndex(event => event._id === action.payload.data.event._id)
        if (index !== -1) {
          state.events[index] = action.payload.data.event
        }
      })
  },
})

export const { reset, clearCurrentEvent } = eventSlice.actions
export default eventSlice.reducer
