import { getMenuByRole } from "@/Data/Layout/SidebarData";
import { useAppSelector } from "@/Redux/Hooks";
import { MenuItem } from "@/Types/LayoutTypes";
import { useSession } from "next-auth/react";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import Menulist from "./Menulist";

const SidebarMenuList = () => {
  const [activeMenu, setActiveMenu] = useState<string[]>(["", "", ""]);
  const { pinedMenu } = useAppSelector((state) => state.layout);
  const { data: session } = useSession();
  const { t } = useTranslation("common");

  // Get role-specific menu
  const roleBasedMenu = session?.user?.user_type
    ? getMenuByRole(session.user.user_type)
    : [];

  const shouldHideMenu = (mainMenu: MenuItem) => {
    return mainMenu?.Items?.map((data) => data.title).every((titles) =>
      pinedMenu.includes(titles || "")
    );
  };

  if (!session?.user?.user_type) {
    return null;
  }

  return (
    <>
      {roleBasedMenu && roleBasedMenu.length > 0 ? (
        roleBasedMenu.map((mainMenu: MenuItem, index: number) => (
          <Fragment key={index}>
            <li
              className={`sidebar-main-title ${
                shouldHideMenu(mainMenu) ? "d-none" : ""
              }`}
            >
              <div>
                <h5
                  className={`f-w-700 sidebar-title ${mainMenu.lanClass || ""}`}

                >
                  {t(mainMenu.title)}
                </h5>
              </div>
            </li>
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
