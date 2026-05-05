import { createSlice } from "@reduxjs/toolkit";

type TabPayload = {
  tabId: string;
  organisationslug?: string | null;
};

const getStorageKey = (organisationslug?: string | null) =>
  organisationslug ? `customTabActive:${organisationslug}` : "customTabActive";

const initialState = {
  activeTab: "dashboard" as string,
};

const CustomTabSlice = createSlice({
  name: "customTabs",
  initialState,
  reducers: {
    setCustomTab: (state, action: { payload: TabPayload }) => {
      state.activeTab = action.payload.tabId;
      if (typeof window !== "undefined") {
        localStorage.setItem(
          getStorageKey(action.payload.organisationslug),
          action.payload.tabId,
        );
      }
    },
    restoreCustomTab: (state, action: { payload: string }) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setCustomTab, restoreCustomTab } = CustomTabSlice.actions;

export default CustomTabSlice.reducer;
