import { Href } from "@/Constant";
import { useState } from "react";
import { Nav, NavItem, NavLink } from "reactstrap";

const TabListCommonHeader = () => {
  const [TabList, SetTabList] = useState("Weekly");
  const TabListClick = (value: string) => SetTabList(value);
  return (
    <Nav pills className="simple-wrapper" id="myTab" role="tablist">
      <NavItem>
        <NavLink className={`${TabList === "Yearly" && "active"}`} to={Href} onClick={() => TabListClick("Yearly")}>Yearly</NavLink>
      </NavItem>
      <NavItem className="nav-item">
        <NavLink className={`${TabList === "Monthly" && "active"}`} to={Href} onClick={() => TabListClick("Monthly")}>Monthly</NavLink>
      </NavItem>
      <NavItem className="nav-item">
        <NavLink className={`${TabList === "Weekly" && "active"}`} to={Href} onClick={() => TabListClick("Weekly")}>Weekly</NavLink>
      </NavItem>
    </Nav>
  );
};

export default TabListCommonHeader;
