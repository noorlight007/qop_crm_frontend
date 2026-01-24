import classnames from "classnames";
import React, { useState } from "react";
import { TbActivity, TbFileText } from "react-icons/tb";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import AuditLogsTab from "./AuditLogsTab/AuditLogsTab";
import ReportsTab from "./ReportsTab/ReportsTab";

const SystemReportsAndLogsTabs: React.FC = () => {
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
              <TbFileText className="me-1 fs-6" />
              Reports
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
              <TbActivity className="me-1 fs-6" />
              Audit Logs
            </NavLink>
          </NavItem>
        </Nav>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary">
            <i className="fa-solid fa-download me-1"></i> Export Data
          </button>
          <button className="btn btn-outline-success border">
            <i className="fa-solid fa-chart-line me-1"></i> Analytics
          </button>
          <button className="btn btn-primary">
            <i className="fa-solid fa-file-lines me-1"></i> Generate Report
          </button>
        </div>
      </div>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="users">
          {activeTab === "users" && <ReportsTab />}
        </TabPane>
        <TabPane tabId="roles">
          {activeTab === "roles" && <AuditLogsTab />}
        </TabPane>
      </TabContent>
    </div>
  );
};

export default SystemReportsAndLogsTabs;
