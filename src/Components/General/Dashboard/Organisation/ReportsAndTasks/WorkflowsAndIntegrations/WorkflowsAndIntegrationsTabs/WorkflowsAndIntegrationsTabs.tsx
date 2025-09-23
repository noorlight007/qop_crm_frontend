import classNames from "classnames";
import { useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import IntegrationsTab from "./IntegrationsTab/IntegrationsTab";
import WorkflowsTab from "./WorkflowsTab/WorkflowsTab";

const WorkflowsAndIntegrationsTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"workflows" | "integrations">(
    "workflows"
  );
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classNames({
                active: activeTab === "workflows",
                "text-primary": activeTab === "workflows",
              })}
              onClick={() => setActiveTab("workflows")}
              style={{ cursor: "pointer" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-workflow-icon lucide-workflow me-1"
              >
                <rect width="8" height="8" x="3" y="3" rx="2" />
                <path d="M7 11v4a2 2 0 0 0 2 2h4" />
                <rect width="8" height="8" x="13" y="13" rx="2" />
              </svg>
              Workflows
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classNames({
                active: activeTab === "integrations",
                "text-primary": activeTab === "integrations",
              })}
              onClick={() => setActiveTab("integrations")}
              style={{ cursor: "pointer" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-zap-icon lucide-zap me-1"
              >
                <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
              </svg>
              Integrations
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
            <i className="fa-solid fa-plus"></i> Create Workflow
          </button>
        </div>
      </div>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="workflows">
          {activeTab === "workflows" && <WorkflowsTab />}
        </TabPane>
        <TabPane tabId="integrations">
          {activeTab === "integrations" && <IntegrationsTab />}
        </TabPane>
      </TabContent>
    </div>
  );
};

export default WorkflowsAndIntegrationsTabs;
