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
import Admins from "./Tabs/Admins/Admins";
import Advisers from "./Tabs/Advisers/Advisers";
import Applicants from "./Tabs/Applicants/Applicants";
import Dashboard from "./Tabs/Dashboard/Dashboard";
import Directors from "./Tabs/Directors/Directors";
import Introducers from "./Tabs/Introducers/Introducers";
import Leads from "./Tabs/Leads/Leads";

const OrganisationDetailsContainer: React.FC = () => {
  const params = useParams();
  const { organisationslug } = params as { organisationslug: string };
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const currentTheme = useAppSelector(
    (state) => state.themeCustomizer.mix_background_layout,
  );

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "directors", label: "Directors" },
    { id: "leads", label: "Leads" },
    { id: "applicants", label: "Applicants" },
    { id: "advisers", label: "Advisers" },
    { id: "admins", label: "Admins" },
    { id: "Introducers", label: "Introducers" },
  ];
  useEffect(() => {
    if (typeof window === "undefined" || !organisationslug) return;
    const savedTab = localStorage.getItem(
      `organisationDetailsActiveTab:${organisationslug}`,
    );
    setActiveTab(savedTab || "dashboard");
  }, [organisationslug]);

  const handleSetTab = (tabId: string) => {
    setActiveTab(tabId);
    if (typeof window === "undefined" || !organisationslug) return;
    localStorage.setItem(
      `organisationDetailsActiveTab:${organisationslug}`,
      tabId,
    );
  };

  return (
    <div>
      <Breadcrumbs
        title="Organisation Status"
        subTitle="Welcome! Continue your journey."
        items={[
          { label: "Organisations" },
          { label: "Organisation Details", active: true },
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
              <TabPane tabId="directors">
                {activeTab === "directors" && <Directors />}
              </TabPane>
              <TabPane tabId="leads">
                {activeTab === "leads" && <Leads />}
              </TabPane>
              <TabPane tabId="applicants">
                {activeTab === "applicants" && <Applicants />}
              </TabPane>
              <TabPane tabId="advisers">
                {activeTab === "advisers" && <Advisers />}
              </TabPane>
              <TabPane tabId="admins">
                {activeTab === "admins" && <Admins />}
              </TabPane>
              <TabPane tabId="Introducers">
                {activeTab === "Introducers" && <Introducers />}
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OrganisationDetailsContainer;
