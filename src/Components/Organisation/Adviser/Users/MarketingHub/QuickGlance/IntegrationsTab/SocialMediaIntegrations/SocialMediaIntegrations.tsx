import { TbSettings } from "react-icons/tb";
import { Card, CardBody, Col, Row } from "reactstrap";
import FacebookCard from "./SocialMediaCards/FacebookCard";
import InstagramCard from "./SocialMediaCards/InstagramCard";
import LinkedInCard from "./SocialMediaCards/LinkedInCard";
import TwitterCard from "./SocialMediaCards/TwitterCard";

const SocialMediaIntegrations: React.FC = () => {
  return (
    <Card>
      <CardBody>
        <div>
          <h3>
            <TbSettings className="me-2" />
            Social Media Integrations
          </h3>
          <p>
            Connect and manage your social media platforms. All integrations are
            plug & play with automatic token refresh.
          </p>
        </div>
      </CardBody>
      <CardBody>
        <Row>
          <Col md={6}>
            <FacebookCard />
          </Col>
          <Col md={6}>
            <InstagramCard />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <LinkedInCard />
          </Col>
          <Col md={6}>
            <TwitterCard />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default SocialMediaIntegrations;
