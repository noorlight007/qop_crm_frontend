import classnames from "classnames";
import React, { useState } from "react";
import { TbLockOpen, TbUsers } from "react-icons/tb";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import RolesPermissionsTab from "./RolesPermissionsTab/RolesPermissionsTab";
import UsersTab from "./UsersTab/UsersTab";

const UsersAndRolesTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"users" | "roles">("users");

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({
                active: activeTab === "users",
                "text-primary": activeTab === "users",
              })}
              onClick={() => setActiveTab("users")}
              style={{ cursor: "pointer" }}
            >
              <TbUsers className="me-1 fs-6" />
              Users
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
                active: activeTab === "roles",
                "text-primary": activeTab === "roles",
              })}
              onClick={() => setActiveTab("roles")}
              style={{ cursor: "pointer" }}
            >
              <TbLockOpen className="me-1 fs-6" />
              Roles & Permissions
            </NavLink>
          </NavItem>
        </Nav>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary">
            <i className="fa-solid fa-download"></i> Export
          </button>
          <button className="btn btn-outline-success border">
            <i className="fa-solid fa-upload"></i> Import
          </button>
          <button className="btn btn-primary">
            <i className="fa-solid fa-user-plus me-"></i> Add User
          </button>
        </div>
      </div>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="users">{activeTab === "users" && <UsersTab />}</TabPane>
        <TabPane tabId="roles">
          {activeTab === "roles" && <RolesPermissionsTab />}
        </TabPane>
      </TabContent>
    </div>
  );
};

export default UsersAndRolesTabs;
