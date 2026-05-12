import ConfigDB from "@/Config/ThemeConfig";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import {
  scrollToLeft,
  scrollToRight,
} from "@/Redux/Reducers/ThemeCustomizerReducer";
import { ArrowLeft, ArrowRight } from "react-feather";
import SidebarMenuList from "./SidebarMenuList";

const Sidebar = () => {
  const { sideBarToggle, margin } = useAppSelector(
    (state) => state.themeCustomizer,
  );
  const sidebarIconType = useAppSelector(
    (state) => state.themeCustomizer.sideBarIconType,
  );
  const sideBarIcon = sidebarIconType || ConfigDB.settings.sidebar.iconType;
  const { pinedMenu } = useAppSelector((state) => state.layout);
  const dispatch = useAppDispatch();

  return (
    <aside
      className={`page-sidebar ${
        sideBarIcon === "iconcolor-sidebar" ? "iconcolor-sidebar" : ""
      } ${sideBarToggle ? "close_icon" : ""}`}
    >
      <div
        className={`left-arrow ${margin === 0 ? "disabled" : ""}`}
        onClick={() => dispatch(scrollToLeft())}
        id="left-arrow"
      >
        <ArrowLeft />
      </div>
      <div className="main-sidebar" id="main-sidebar">
        <ul
          className="sidebar-menu"
          id="simple-bar"
          style={{ marginLeft: margin + "px" }}
        >
          <div className="sidebar-menu-content">
            <li
              className={`pin-title sidebar-main-title ${
                pinedMenu.length > 1 ? "show" : ""
              } `}
            >
              <div>
                <h5 className="sidebar-title f-w-700">Pinned</h5>
              </div>
            </li>
            <SidebarMenuList />
          </div>
        </ul>
        <div className="sidebar-logo-fixed">
          <small>Powered by</small>
          <img
            width={120}
            height={40}
            className="light-logo img-fluid"
            src="/assets/images/logo/logo-dark.png"
            alt="logo"
            style={{ width: "120px", height: "40px" }}
          />
          <img
            width={120}
            height={40}
            className="dark-logo img-fluid"
            src="/assets/images/logo/logo1.png"
            alt="logo"
            style={{ width: "120px", height: "40px" }}
          />
        </div>
      </div>
      <div
        className={`right-arrow ${margin === -3500 ? "disabled" : ""}`}
        onClick={() => dispatch(scrollToRight())}
        id="right-arrow"
      >
        <ArrowRight />
      </div>
    </aside>
  );
};

export default Sidebar;
