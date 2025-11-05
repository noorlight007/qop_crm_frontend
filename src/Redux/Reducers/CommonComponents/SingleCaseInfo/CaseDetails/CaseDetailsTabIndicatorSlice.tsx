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
      // Persist to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("caseDetailsActiveTab", action.payload);
      }
    },
    resetBasicTab: (state) => {
      state.basicTabId = null;
      // Clear from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("caseDetailsActiveTab");
      }
    },
    restoreBasicTab: (state, action) => {
      state.basicTabId = action.payload;
    },
  },
});

export const { basicTabIndicator, resetBasicTab, restoreBasicTab } =
  CaseDetailsTabIndicatorSlice.actions;

export default CaseDetailsTabIndicatorSlice.reducer;
