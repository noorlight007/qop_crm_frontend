import { useState } from "react";
import { FaBullhorn, FaChartBar, FaEnvelope } from "react-icons/fa";
import {
  TbBooks,
  TbBrandWhatsapp,
  TbCalendarClock,
  TbGraph,
  TbSettings,
} from "react-icons/tb";
import { Card, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import AnalyticsTab from "./AnalyticsTab/AnalyticsTab";
import CampaignsTab from "./CampaignsTab/CampaignsTab";
import InboxTab from "./InboxTab/InboxTab";
import IntegrationsTab from "./IntegrationsTab/IntegrationsTab";
import OverviewTab from "./OverviewTab/OverviewTab";
import SchedulerTab from "./SchedulerTab/SchedulerTab";
import WhatsAppTab from "./WhatsAppTab/WhatsAppTab";

// Placeholder components for other tabs (replace with actual components as needed)
const LibraryTab = () => <div>Library Tab Content</div>;

const QuickGlanceTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "integrations"
    | "whatsapp"
    | "scheduler"
    | "campaigns"
    | "inbox"
    | "analytics"
    // | "library"
  >("overview");

  const PillsTabNav = [
    { id: "overview", nav: "Overview", icon: <FaChartBar className="me-1" /> },
    {
      id: "integrations",
      nav: "Integrations",
      icon: <TbSettings className="me-1" />,
    },
    {
      id: "whatsapp",
      nav: "WhatsApp",
      icon: <TbBrandWhatsapp className="me-1" />,
    },
    {
      id: "scheduler",
      nav: "Scheduler",
      icon: <TbCalendarClock className="me-1" />,
    },
    {
      id: "campaigns",
      nav: "Campaigns",
      icon: <FaBullhorn className="me-1" />,
    },
    {
      id: "inbox",
      nav: "Inbox",
      icon: <FaEnvelope className="me-1" />,
    },
    {
      id: "analytics",
      nav: "Analytics",
      icon: <TbGraph className="me-1" />,
    },
    // {
    //   id: "library",
    //   nav: "Library",
    //   icon: <TbBooks className="me-1" />,
    // },
  ];
  const Href = "#"; // Placeholder href, adjust as needed

  return (
    <div>
      <Card className="d-flex justify-content-between align-items-center shadow rounded-3 p-2 mb-3">
        <Nav tabs className="nav-primary border-0 gap-4" pills>
          {PillsTabNav.map((item) => (
            <NavItem key={item.id}>
              <NavLink
                href={Href}
                className={`px-3 py-1 ${activeTab === item.id ? "active" : ""}`}
                onClick={() =>
                  setActiveTab(
                    item.id as
                      | "overview"
                      | "integrations"
                      | "whatsapp"
                      | "scheduler"
                      | "campaigns"
                      | "inbox"
                      | "analytics"
                      // | "library"
                  )
                }
                style={{ cursor: "pointer" }}
              >
                {item.icon}
                {item.nav}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </Card>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="overview">
          {activeTab === "overview" && <OverviewTab />}
        </TabPane>
        <TabPane tabId="integrations">
          {activeTab === "integrations" && <IntegrationsTab />}
        </TabPane>
        <TabPane tabId="whatsapp">
          {activeTab === "whatsapp" && <WhatsAppTab />}
        </TabPane>
        <TabPane tabId="scheduler">
          {activeTab === "scheduler" && <SchedulerTab />}
        </TabPane>
        <TabPane tabId="campaigns">
          {activeTab === "campaigns" && <CampaignsTab />}
        </TabPane>
        <TabPane tabId="inbox">{activeTab === "inbox" && <InboxTab />}</TabPane>
        <TabPane tabId="analytics">
          {activeTab === "analytics" && <AnalyticsTab />}
        </TabPane>
        {/* <TabPane tabId="library">
          {activeTab === "library" && <LibraryTab />}
        </TabPane> */}
      </TabContent>
    </div>
  );
};

export default QuickGlanceTabs;
