import { Href } from "@/Constant";
import { DashBoardCommonDropdown } from "@/Types/DashboardType";
import React, { useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

export const CommonDropdown: React.FC<DashBoardCommonDropdown> = ({ days, dropdownTitle }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <Dropdown className="icon-dropdown" isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle color="transparent" caret={dropdownTitle ? true : false}>
        {dropdownTitle ? dropdownTitle : <i className="fa-solid fa-ellipsis" aria-hidden="true"></i>}
      </DropdownToggle>
      <DropdownMenu end >
        <DropdownItem tag="a" href={Href}>{`${days ? "Today" : "Weekly"}`}</DropdownItem>
        <DropdownItem tag="a" href={Href}>{`${days ? "Tomorrow" : "Monthly"}`}</DropdownItem>
        <DropdownItem tag="a" href={Href}>{`${days ? "Yesterday" : "Yearly"}`}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
