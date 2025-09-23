import { Col, Row } from "reactstrap";
import SocialMediaIntegrations from "./SocialMediaIntegrations/SocialMediaIntegrations";
import TeamPermissions from "./TeamPermissions/TeamPermissions";

const IntegrationsTab: React.FC = () => {
  return (
    <Row>
      <Col md="12">
        <SocialMediaIntegrations />
      </Col>
      <Col md="12">
        <TeamPermissions />
      </Col>
    </Row>
  );
};

export default IntegrationsTab;
