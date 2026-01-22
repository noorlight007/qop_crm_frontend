import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppearanceState {
  siteTitle: string | null;
}

// Helper function to get initial state from localStorage
const getInitialState = (): AppearanceState => {
  if (typeof window !== "undefined") {
    const cachedTitle = localStorage.getItem("site_title");
    return {
      siteTitle: cachedTitle || null,
    };
  }
  return {
    siteTitle: null,
  };
};

const appearanceSlice = createSlice({
  name: "appearance",
  initialState: getInitialState(),
  reducers: {
    setSiteTitle: (state, action: PayloadAction<string>) => {
      state.siteTitle = action.payload;
      // Cache in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("site_title", action.payload);
      }
    },
    clearSiteTitle: (state) => {
      state.siteTitle = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("site_title");
      }
    },
  },
});

export const { setSiteTitle, clearSiteTitle } = appearanceSlice.actions;
export default appearanceSlice.reducer;
