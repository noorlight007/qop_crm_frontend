import { createSlice } from "@reduxjs/toolkit";

type TabPayload = {
  tabId: string;
  organisationslug?: string | null;
};

const getStorageKey = (organisationslug?: string | null) =>
  organisationslug
    ? `organisationDetailsActiveTab:${organisationslug}`
    : "organisationDetailsActiveTab";

const initialState = {
  activeTab: "dashboard" as string,
};

const CustomTabSlice = createSlice({
  name: "organisationDetailsTabs",
  initialState,
  reducers: {
    setOrganisationDetailsTab: (state, action: { payload: TabPayload }) => {
      state.activeTab = action.payload.tabId;
      if (typeof window !== "undefined") {
        localStorage.setItem(
          getStorageKey(action.payload.organisationslug),
          action.payload.tabId,
        );
      }
    },
    restoreOrganisationDetailsTab: (state, action: { payload: string }) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setOrganisationDetailsTab, restoreOrganisationDetailsTab } =
  CustomTabSlice.actions;

export default CustomTabSlice.reducer;
