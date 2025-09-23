import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";

// Import tab components
import AlertsNotifications from "./TabComponents/AlertsNotifications";
import DataRetention from "./TabComponents/DataRetention";
import SecurityPoliciesTable from "./TabComponents/SecurityPoliciesTable";
import SystemSettings from "./TabComponents/SystemSettings";

const SecurityPoliciesManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("security-policies");

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <FaLock className="text-primary fs-4" />
              <h3 className="mb-0">Security Policies Management</h3>
            </div>
            <Button color="primary">
              Create Policy
              <i className="fa-solid fa-circle-plus ms-1"></i>
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <Nav
            tabs
            className="mb-3 d-flex justify-content-center border-0 gap-2"
          >
            <NavItem>
              <NavLink
                className={`rounded-3 px-4 py-2 ${
                  activeTab === "security-policies"
                    ? "active bg-primary text-white"
                    : "text-dark"
                }`}
                onClick={() => setActiveTab("security-policies")}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: "none",
                }}
              >
                Security Policies
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={`rounded-3 px-4 py-2 ${
                  activeTab === "system-settings"
                    ? "active bg-primary text-white"
                    : "text-dark"
                }`}
                onClick={() => setActiveTab("system-settings")}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: "none",
                }}
              >
                System Settings
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={`rounded-3 px-4 py-2 ${
                  activeTab === "data-retention"
                    ? "active bg-primary text-white"
                    : "text-dark"
                }`}
                onClick={() => setActiveTab("data-retention")}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: "none",
                }}
              >
                Data Retention
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={`rounded-3 px-4 py-2 ${
                  activeTab === "alerts-notifications"
                    ? "active bg-primary text-white"
                    : "text-dark"
                }`}
                onClick={() => setActiveTab("alerts-notifications")}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: "none",
                }}
              >
                Alerts & Notifications
              </NavLink>
            </NavItem>
          </Nav>

          {/* Render the appropriate component based on active tab */}
          {activeTab === "security-policies" && <SecurityPoliciesTable />}
          {activeTab === "system-settings" && <SystemSettings />}
          {activeTab === "data-retention" && <DataRetention />}
          {activeTab === "alerts-notifications" && <AlertsNotifications />}
        </CardBody>
      </Card>
    </>
  );
};

export default SecurityPoliciesManagement;
