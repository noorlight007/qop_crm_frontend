import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppearanceState {
  siteTitle: string | null;
  favIcon: string | null;
}

// Helper function to get initial state from localStorage
const getInitialState = (): AppearanceState => {
  if (typeof window !== "undefined") {
    const cachedTitle = localStorage.getItem("site_title");
    const cachedFavIcon = localStorage.getItem("fav_icon");
    return {
      siteTitle: cachedTitle || null,
      favIcon: cachedFavIcon || null,
    };
  }
  return {
    siteTitle: null,
    favIcon: null,
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
    setFavIcon: (state, action: PayloadAction<string>) => {
      state.favIcon = action.payload;
      // Cache in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("fav_icon", action.payload);
      }
    },
    clearSiteTitle: (state) => {
      state.siteTitle = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("site_title");
      }
    },
    clearFavIcon: (state) => {
      state.favIcon = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("fav_icon");
      }
    },
  },
});

export const { setSiteTitle, setFavIcon, clearSiteTitle, clearFavIcon } =
  appearanceSlice.actions;
export default appearanceSlice.reducer;
