import { getMenuByRole } from "@/Data/Layout/SidebarData";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { MenuItem } from "@/Types/LayoutTypes";
import { useSession } from "next-auth/react";
import { Fragment, useState } from "react";
import Menulist from "./Menulist";

const SidebarMenuList = () => {
  const [activeMenu, setActiveMenu] = useState<string[]>(["", "", ""]);
  const { pinedMenu } = useAppSelector((state) => state.layout);
  const { sideBarToggle } = useAppSelector((state) => state.themeCustomizer);
  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  // Get role-specific menu based on new role + network flag
  const roleBasedMenu = session?.user?.role
    ? getMenuByRole(session.user.role, session.user.is_network)
    : [];

  const shouldHideMenu = (mainMenu: MenuItem) => {
    return mainMenu?.Items?.map((data) => data.title).every((titles) =>
      pinedMenu.includes(titles || ""),
    );
  };

  if (!session?.user?.role) {
    return null;
  }

  return (
    <>
      {roleBasedMenu && roleBasedMenu.length > 0 ? (
        roleBasedMenu.map((mainMenu: MenuItem, index: number) => (
          <Fragment key={index}>
            {/* <li
              className={`sidebar-main-title ${
                shouldHideMenu(mainMenu) ? "d-none" : ""
              }`}
            >
              <div>
                <h5
                  className={`f-w-700 sidebar-title  ${
                    mainMenu.lanClass || ""
                  }`}
                >
                  <span className="bg-light-secondary px-2 py-1 rounded-5">
                    {formatChoiceFieldValue(session?.user?.role)}
                  </span>
                </h5>
              </div>
            </li> */}
            <Menulist
              menu={mainMenu.Items}
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
              level={0}
            />
          </Fragment>
        ))
      ) : (
        <div>No menu items available for your role</div>
      )}
    </>
  );
};

export default SidebarMenuList;
