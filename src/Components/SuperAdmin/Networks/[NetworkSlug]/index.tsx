"use client";
import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { useAppSelector } from "@/Redux/Hooks";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import AdvisersTab from "./Tabs/Advisers/AdvisersTab";
import ApplicantsTab from "./Tabs/Applicants/ApplicantsTab";
import CasesTab from "./Tabs/Cases/CasesTab";
import CompliancesTab from "./Tabs/Compliances/CompliancesTab";
import Dashboard from "./Tabs/Dashboard/Dashboard";
import LeadsTab from "./Tabs/Leads/LeadsTab";

const NetworkDetailsContainer: React.FC = () => {
  const params = useParams();
  const networkslugParam = (params as Record<string, string | string[]>)
    ?.networkslug;
  const networkSlug = Array.isArray(networkslugParam)
    ? networkslugParam[0]
    : networkslugParam;

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const currentTheme = useAppSelector(
    (state) => state.themeCustomizer.mix_background_layout,
  );

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "cases", label: "Cases" },
    { id: "leads", label: "Leads" },
    { id: "applicants", label: "Applicants" },
    { id: "compliances", label: "Compliances" },
    { id: "advisers", label: "Advisers" },
  ];

  useEffect(() => {
    if (typeof window === "undefined" || !networkSlug) return;
    const savedTab = localStorage.getItem(`customTabActive:${networkSlug}`);
    setActiveTab(savedTab || "dashboard");
  }, [networkSlug]);

  const handleSetTab = (tabId: string) => {
    setActiveTab(tabId);
    if (typeof window === "undefined" || !networkSlug) return;
    localStorage.setItem(`customTabActive:${networkSlug}`, tabId);
  };

  return (
    <div>
      <Breadcrumbs
        title="Network Status"
        subTitle="Welcome! Continue your journey."
        items={[
          { label: "Networks" },
          { label: "Network Details", active: true },
        ]}
      />
      <Container fluid>
        <Row>
          <Col md="12" className="position-relative">
            <Nav
              pills
              className={`custom-tabs d-flex justify-content-center flex-wrap gap-2 mb-3 position-sticky ${currentTheme === "light" ? "bg-white" : "bg-dark"} rounded-3 p-4 shadow shadow-md`}
              style={{ top: "4rem", zIndex: 20 }}
            >
              {navItems.map((item) => (
                <NavItem key={item.id}>
                  <NavLink
                    active={activeTab === item.id}
                    onClick={() => handleSetTab(item.id)}
                    className={`${activeTab === item.id ? "bg-primary text-white" : "text-primary border border-primary"} px-3 py-2 fs-6`}
                  >
                    {item.label}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>

            <TabContent activeTab={activeTab}>
              <TabPane tabId="dashboard">
                {activeTab === "dashboard" && <Dashboard />}
              </TabPane>
              <TabPane tabId="cases">
                {activeTab === "cases" && <CasesTab />}
              </TabPane>
              <TabPane tabId="leads">
                {activeTab === "leads" && <LeadsTab />}
              </TabPane>
              <TabPane tabId="applicants">
                {activeTab === "applicants" && <ApplicantsTab />}
              </TabPane>
              <TabPane tabId="compliances">
                {activeTab === "compliances" && <CompliancesTab />}
              </TabPane>
              <TabPane tabId="advisers">
                {activeTab === "advisers" && <AdvisersTab />}
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NetworkDetailsContainer;
