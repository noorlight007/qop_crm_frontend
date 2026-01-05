import SVG from "@/CommonComponent/SVG";
import { getMenuByRole } from "@/Data/Layout/SidebarData";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { MenuListType } from "@/Types/LayoutTypes";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Menulist: React.FC<MenuListType> = ({
  menu,
  activeMenu,
  setActiveMenu,
  level = 0,
}) => {
  const { pinedMenu } = useAppSelector((state) => state.layout);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { t } = useTranslation("common");
  const [initialLoad, setInitialLoad] = useState(true);
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // Get role-specific menu
  const roleBasedMenu = session?.user?.user_type
    ? getMenuByRole(session.user.user_type)
    : [];

  // Use role-based menu instead of passed menu prop
  const menuToUse = level === 0 ? roleBasedMenu : menu;

  // Utility to check if current path matches the menu item
  const isActive = (item: any): boolean => {
    if (item.path && pathname === item.path) return true;
    if (item.children) {
      return item.children.some((child: any) => isActive(child));
    }
    return false;
  };

  const handleClick = (e: React.MouseEvent, item: any) => {
    e.preventDefault();

    // Update active menu state
    const newActive = [...activeMenu];
    newActive[level] = newActive[level] === item.title ? "" : item.title;
    setActiveMenu(newActive);

    // Navigate if it's a link
    if (item.path) {
      window.location.href = item.path;
    }
  };

  // Set active menu items recursively on mount and route change
  useEffect(() => {
    if (initialLoad || pathname) {
      const newActiveMenu = [...activeMenu];

      const findActiveTrail = (items: any[], depth: number): boolean => {
        for (const item of items) {
          if (isActive(item)) {
            newActiveMenu[depth] = item.title;
            return true;
          }

          if (item.children) {
            const foundInChildren = findActiveTrail(item.children, depth + 1);
            if (foundInChildren) {
              newActiveMenu[depth] = item.title;
              return true;
            }
          }
        }
        return false;
      };

      menuToUse && findActiveTrail(menuToUse, level);
      setActiveMenu(newActiveMenu);
      setInitialLoad(false);
    }
  }, [pathname, menuToUse, initialLoad]);

  // choose which list to render depending on level
  // Use the passed `menu` prop if available; otherwise fall back to role-based `menuToUse` for level 0.
  const items =
    Array.isArray(menu) && menu.length > 0
      ? menu
      : level === 0
      ? menuToUse
      : menu;
  if (!items || !Array.isArray(items)) {
    return null;
  }

  return (
    <>
      {items.map((item, index) => {
        const hasChildren = item.children && item.children.length > 0;
        const isCurrentActive =
          initialLoad || isActive(item) || activeMenu[level] === item.title;

        // unique key for collapsed state per item & level
        const itemKey = `${level}-${index}-${item.title}`;
        const isHidden = !!collapsed[itemKey];
        const isExpanded = !isHidden; // default: expanded (visible)

        return (
          <li
            key={index}
            className={`nav-item ${level === 0 ? "sidebar-list" : ""} ${
              pinedMenu.includes(item.title) ? "pined" : ""
            } ${isCurrentActive ? "active" : ""}`}
          >
            <a
              href={item.path || "#"}
              className={`nav-link d-flex align-items-center gap-1 my-1 w-full ${
                level === 0
                  ? `sidebar-link ${isCurrentActive ? "bg-light-primary" : ""}`
                  : ""
              } ${isCurrentActive ? "active" : ""}`}
              onClick={(e) => handleClick(e, item)}
              style={{ cursor: "pointer", width: "220px" }}
            >
              {item.icon && (
                <SVG className="stroke-icon me-2" iconId={item.icon} />
              )}
              {!item.icon ? (
                <span className="flex-grow-1">{t(item.title)}</span>
              ) : (
                <h6 className={`mb-0 position-relative ${item.lanClass || ""}`}>
                  {t(item.title)}
                  {/* Badge number  */}
                  {/* {item.badge && (
                    <span className="badge rounded-pill bg-primary position-absolute" 
                      style={{
                        top: '-8px',
                        right: '-15px',
                        fontSize: '10px',
                        padding: '4px 5px'
                      }}>
                      {item.badge}
                    </span>
                  )} */}
                </h6>
              )}

              {hasChildren && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCollapsed((prev) => ({
                      ...prev,
                      [itemKey]: !prev[itemKey],
                    }));
                  }}
                  aria-expanded={isExpanded}
                  title={isExpanded ? t("Collapse") : t("Expand")}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    transform: isExpanded ? "rotate(90deg)" : "rotate(0)",
                    transition: "transform 0.3s ease",
                    marginLeft: "auto",
                    padding: "4px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="ms-auto"
                >
                  <i
                    className="fa fa-chevron-right"
                    style={{ fontSize: "12px", color: "currentColor" }}
                  ></i>
                </button>
              )}
            </a>

            {hasChildren && (
              <ul
                className={`nav flex-column ${
                  level === 0 ? "sidebar-submenu" : "according-submenu"
                }`}
                style={{
                  display: isExpanded ? "block" : "none",
                  width: "100%",
                }}
              >
                <Menulist
                  menu={item.children}
                  activeMenu={activeMenu}
                  setActiveMenu={setActiveMenu}
                  level={level + 1}
                />
              </ul>
            )}
          </li>
        );
      })}
    </>
  );
};

export default Menulist;
