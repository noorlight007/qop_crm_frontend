import { Col, Row } from "reactstrap";
import ActiveCampaigns from "./ActiveCampaigns/ActiveCampaigns";
import LeadAdCampaigns from "./LeadAdCampaigns/LeadAdCampaigns";
import LeadIntegrationAutoAssignment from "./LeadIntegrationAutoAssignment/LeadIntegrationAutoAssignment";

const CampaignsTab: React.FC = () => {
  return (
    <>
      <Row>
        <Col md="12">
          <LeadAdCampaigns />
        </Col>
      </Row>
      <Row>
        <Col md="12">
          <ActiveCampaigns />
        </Col>
      </Row>
      <Row>
        <Col md="12">
          <LeadIntegrationAutoAssignment />
        </Col>
      </Row>
    </>
  );
};

export default CampaignsTab;
