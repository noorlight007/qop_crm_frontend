import SVG from "@/CommonComponent/SVG";
import ConfigDB from "@/Config/ThemeConfig";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { addSideBarBackGround } from "@/Redux/Reducers/ThemeCustomizerReducer";
import { useEffect } from "react";
import { BiSolidSun } from "react-icons/bi";

const DarkMode = () => {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector(
    (state) => state.themeCustomizer.mix_background_layout,
  );

  // Load theme from localStorage on component mount and sync ConfigDB
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      ConfigDB.color.mix_background_layout = savedTheme;
      document.body.className = `${
        document.body.className.split(" ").find((cls) => cls.includes("__")) ||
        ""
      } ${savedTheme}`.trim();
      // Only dispatch if Redux state doesn't match localStorage
      if (currentTheme !== savedTheme) {
        dispatch(addSideBarBackGround(savedTheme));
      }
    } else {
      // Default to light theme if no preference is saved
      const defaultTheme = "light";
      ConfigDB.color.mix_background_layout = defaultTheme;
      document.body.className = `${
        document.body.className.split(" ").find((cls) => cls.includes("__")) ||
        ""
      } ${defaultTheme}`.trim();
      dispatch(addSideBarBackGround(defaultTheme));
      localStorage.setItem("theme", defaultTheme);
    }
  }, [dispatch, currentTheme]);

  const handleDarkMode = (data: string) => {
    // Update ConfigDB
    ConfigDB.color.mix_background_layout = data;

    // Update Redux state
    dispatch(addSideBarBackGround(data));

    // Update document body class while preserving font class
    const fontClass =
      document.body.className.split(" ").find((cls) => cls.includes("__")) ||
      "";
    document.body.className = `${fontClass} ${data}`.trim();

    // Save to localStorage for persistence
    localStorage.setItem("theme", data);
  };

  return (
    <li
      onClick={() =>
        handleDarkMode(currentTheme !== "light" ? "light" : "dark-only")
      }
    >
      <a
        className={`dark-mode ${currentTheme !== "light" ? "active" : ""}`}
        href="#javascript"
      >
        {currentTheme === "light" ? <SVG iconId="moondark" /> : <BiSolidSun />}
      </a>
    </li>
  );
};

export default DarkMode;
