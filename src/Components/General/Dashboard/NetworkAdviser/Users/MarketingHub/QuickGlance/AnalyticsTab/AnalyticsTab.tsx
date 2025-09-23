import { Col, Row } from "reactstrap";
import CampaignROIDistribution from "./CampaignROIDistribution/CampaignROIDistribution";
import LeadConversionFunnel from "./LeadConversionFunnel/LeadConversionFunnel";
import MarketingAnalyticsOverview from "./MarketingAnalyticsOverview/MarketingAnalyticsOverview";
import PlatformPerformanceSummary from "./PlatformPerformanceSummary/PlatformPerformanceSummary";
import SocialMediaPerformance from "./SocialMediaPerformance/SocialMediaPerformance";
import WhatsAppCampaignPerformance from "./WhatsAppCampaignPerformance/WhatsAppCampaignPerformance";

const AnalyticsTab: React.FC = () => {
  return (
    <>
      <Row>
        <Col md="12">
          <MarketingAnalyticsOverview />
        </Col>
      </Row>
      <Row>
        <Col md="6" sm="12">
          <SocialMediaPerformance />
        </Col>
        <Col md="6" sm="12">
          <WhatsAppCampaignPerformance />
        </Col>
      </Row>
      <Row>
        <Col md="6" sm="12">
          <LeadConversionFunnel />
        </Col>
        <Col md="6" sm="12">
          <CampaignROIDistribution />
        </Col>
      </Row>
      <Row>
        <Col md="12">
          <PlatformPerformanceSummary />
        </Col>
      </Row>
    </>
  );
};

export default AnalyticsTab;
