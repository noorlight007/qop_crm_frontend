import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  basicTabId: null,
};

const CaseDetailsTabIndicatorSlice = createSlice({
  name: "CaseDetailsTabIndicator",
  initialState,
  reducers: {
    basicTabIndicator: (state, action) => {
      state.basicTabId = action.payload;
    },
    resetBasicTab: (state) => {
      state.basicTabId = null;
    },
  },
});

export const { basicTabIndicator, resetBasicTab } =
  CaseDetailsTabIndicatorSlice.actions;

export default CaseDetailsTabIndicatorSlice.reducer;
