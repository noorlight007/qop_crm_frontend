import Breadcrumbs from "@/Components/General/Dashboard/CommonComponents/Breadcrumbs/Breadcrumbs";
import { Container } from "reactstrap";
import MarketingHubOverview from "./MarketingHubOverview/MarketingHubOverview";
import PlatformConnections from "./PlatformConnections/PlatformConnections";
import QuickGlanceTabs from "./QuickGlance/QuickGlanceTabs";

const NetworkAdviserMarketingHubContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Marketing Hub"
        subTitle="Manage your social media and WhatsApp campaigns"
        parent="Users"
        child="Marketing Hub"
      />
      <Container fluid>
        <MarketingHubOverview />
        <PlatformConnections />
        <QuickGlanceTabs />
      </Container>
    </>
  );
};

export default NetworkAdviserMarketingHubContainer;
