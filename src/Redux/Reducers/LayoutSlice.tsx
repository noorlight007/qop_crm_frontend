import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  responsiveSearch: false,
  pinedMenu: [""],
  flip: false,
};

const LayoutSlice = createSlice({
  name: "LayoutSlice",
  initialState,
  reducers: {
    setResponsiveSearch: (state) => {
      state.responsiveSearch = !state.responsiveSearch;
    },
    setFlip: (state) => {
      state.flip = !state.flip;
    },
  },
});

export const { setResponsiveSearch, setFlip } = LayoutSlice.actions;

export default LayoutSlice.reducer;
