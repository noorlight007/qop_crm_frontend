import { Col, Row } from "reactstrap";
import SocialMediaInbox from "./SocialMediaInbox/SocialMediaInbox";

const InboxTab: React.FC = () => {
  return (
    <Row>
      <Col md="12">
        <SocialMediaInbox />
      </Col>
    </Row>
  );
};

export default InboxTab;
