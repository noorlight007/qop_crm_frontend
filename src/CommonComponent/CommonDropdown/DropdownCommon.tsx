import { Href } from "@/Constant";
import React, { useState } from "react";
import {
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

const DropdownCommon: React.FC = ({ item, toggleClass }: any) => {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
  };
  return (
    <ButtonGroup className={item.divClass}>
      <Dropdown
        isOpen={open}
        toggle={toggle}
        direction={item.position ? item.position : "down"}
      >
        <DropdownToggle caret className={toggleClass} color={item.class}>
          {item.text}
        </DropdownToggle>
        <DropdownMenu className={item.bodyClass}>
          {item.menulist &&
            item.menulist.map((item: any, index: any) => (
              <DropdownItem href={Href} key={index}>
                {item}
              </DropdownItem>
            ))}
        </DropdownMenu>
      </Dropdown>
    </ButtonGroup>
  );
};
export default DropdownCommon;
