import ConfigDB from "@/Config/ThemeConfig";
import { createSlice } from "@reduxjs/toolkit";

const hexToRgba = (hex: string, alpha: number): string => {
  let sanitized = hex.trim();

  if (sanitized.startsWith("#")) {
    sanitized = sanitized.slice(1);
  }

  if (sanitized.length === 3) {
    sanitized = sanitized
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (sanitized.length !== 6) {
    // Fallback: return original value if it's not a standard hex code
    return hex;
  }

  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getSavedTheme = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("theme") || "light";
  }
  return "light";
};

const applyThemeColors = (primary: string, secondary: string) => {
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    root.style.setProperty("--theme-default", primary);
    root.style.setProperty("--theme-primary", primary);
    root.style.setProperty("--primary-color", primary);
    root.style.setProperty("--theme-secondary", secondary);
    root.style.setProperty("--secondary-color", secondary);

    // Update light background helpers used by bg-light-primary/bg-light-secondary
    const primaryLight = hexToRgba(primary, 0.1);
    const secondaryLight = hexToRgba(secondary, 0.1);
    root.style.setProperty("--bg-light-primary", primaryLight);
    root.style.setProperty("--bg-light-secondary", secondaryLight);

    // Create dynamic select arrow with primary color
    const primaryHex = primary.replace("#", "%23");
    const selectArrowSvg = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='${primaryHex}' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e")`;
    root.style.setProperty("--select-arrow-icon", selectArrowSvg);
  }
};

const getSavedColors = () => {
  const defaultPrimary = ConfigDB.color.primary_color;
  const defaultSecondary = ConfigDB.color.secondary_color;

  if (typeof window !== "undefined") {
    const savedPrimary = localStorage.getItem("primary_color");
    const savedSecondary = localStorage.getItem("secondary_color");

    const primary = savedPrimary || defaultPrimary;
    const secondary = savedSecondary || defaultSecondary;

    applyThemeColors(primary, secondary);

    return {
      primary_color: primary,
      secondary_color: secondary,
    };
  }

  return {
    primary_color: defaultPrimary,
    secondary_color: defaultSecondary,
  };
};

let initialState = {
  layout_type: "ltr",
  openCus: false,
  sidebar_types: "compact-wrapper",
  mix_background_layout: getSavedTheme(),
  sideBarIconType: "stroke-svg",
  colors: {
    ...getSavedColors(),
  },
  mixLayout: false,
  sideBarToggle: false,
  margin: 0,
};

const ThemeCustomizerSlice = createSlice({
  name: "themeCustomizer",
  initialState: initialState,
  reducers: {
    setLayoutType: (state, action) => {
      state.layout_type = action.payload;
      if (action.payload === "rtl") {
        document.body.classList.add("rtl");
        document.body.classList.remove("box-layout", "ltr");
        document.documentElement.dir = "rtl";
        state.sideBarToggle = false;
      } else if (action.payload === "ltr") {
        document.body.classList.add("ltr");
        document.body.classList.remove("box-layout", "rtl");
        document.documentElement.dir = "ltr";
        state.sideBarToggle = false;
      } else if (action.payload === "box-layout") {
        document.body.classList.add("box-layout");
        document.body.classList.remove("offcanvas", "ltr", "rtl");
        document.documentElement.dir = "ltr";
        state.sideBarToggle = true;
      }
    },
    setOpenCus: (state, action) => {
      state.openCus = action.payload;
    },
    addSidebarTypes: (state, action) => {
      ConfigDB.settings.sidebar.type = action.payload;
      state.sidebar_types = action.payload;
    },
    setSideBarToggle: (state, action) => {
      state.sideBarToggle = action.payload;
    },
    addSideBarBackGround: (state, action) => {
      ConfigDB.color.mix_background_layout = action.payload;
      state.mix_background_layout = action.payload;
      // Save to localStorage for persistence
      localStorage.setItem("theme", action.payload);
    },
    addSidebarIconType: (state, action) => {
      ConfigDB.settings.sidebar.iconType = action.payload;
      state.sideBarIconType = action.payload;
    },
    addColor: (state, action) => {
      const { primary, secondary } = action.payload as {
        primary: string;
        secondary: string;
      };

      ConfigDB.color.primary_color = primary;
      ConfigDB.color.secondary_color = secondary;

      state.colors.primary_color = primary;
      state.colors.secondary_color = secondary;

      applyThemeColors(primary, secondary);

      if (typeof window !== "undefined") {
        localStorage.setItem("primary_color", primary);
        localStorage.setItem("secondary_color", secondary);
      }
    },
    setMixLayout: (state, action) => {
      state.mixLayout = action.payload;
    },
    scrollToLeft: (state) => {
      state.margin += 500;
    },
    scrollToRight: (state) => {
      state.margin -= 500;
    },
  },
});

export const {
  setLayoutType,
  setSideBarToggle,
  addSidebarTypes,
  addSideBarBackGround,
  addSidebarIconType,
  addColor,
  setOpenCus,
  scrollToLeft,
  scrollToRight,
} = ThemeCustomizerSlice.actions;

export default ThemeCustomizerSlice.reducer;
