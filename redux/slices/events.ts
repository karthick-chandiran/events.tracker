import { IEventModel } from "./../../models/IEventModel";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Define a type for the slice state
interface EventState {
  editEvent?: IEventModel;
}

// Define the initial state using that type
const initialState: EventState = {};

export const events = createSlice({
  name: "events",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setEditEvent: (state, action: PayloadAction<IEventModel>) => {
      state.editEvent = action.payload;
    },
    resetEditEvent: (state) => {
      delete state.editEvent;
      return state;
    },
  },
});

export const { setEditEvent, resetEditEvent } = events.actions;

export default events.reducer;
