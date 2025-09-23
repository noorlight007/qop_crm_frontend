import { ImagePath } from "@/Constant";
import Image from "next/image";
import { useState } from "react";
import {
  Collapse,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
} from "reactstrap";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      <Navbar color="primary" dark expand="md">
        <NavbarBrand className="fs-3" href="/">
          <Image
            width={91}
            height={27}
            className="img-fluid for-light"
            src={`${ImagePath}/logo/logo1.png`}
            alt="looginpage"
          />
          <Image
            width={91}
            height={27}
            className="img-fluid for-dark d-none"
            src={`${ImagePath}/logo/logo-dark.png`}
            alt="looginpage"
          />
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto gap-3" navbar sticky>
            <NavItem>
              <NavLink href="/">
                <span className="menu_hover">Home</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">
                <span className="menu_hover">About Us</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">
                <span className="menu_hover">Blog</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">
                <span className="menu_hover">Services</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">
                <span className="menu_hover">Contact Us</span>
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </>
  );
};

export default NavBar;
