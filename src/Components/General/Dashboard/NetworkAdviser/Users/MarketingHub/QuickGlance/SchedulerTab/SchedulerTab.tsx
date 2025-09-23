import { Col, Row } from "reactstrap";
import PostTemplates from "./PostTemplates/PostTemplates";
import ScheduleSocialPost from "./ScheduleSocialPost/ScheduleSocialPost";
import ScheduledPosts from "./ScheduledPosts/ScheduledPosts";

const SchedulerTab: React.FC = () => {
  return (
    <>
      <Row>
        <Col md="6">
          <ScheduleSocialPost />
        </Col>
        <Col md="6">
          <PostTemplates />
        </Col>
      </Row>
      <Row>
        <Col md="12">
          <ScheduledPosts />
        </Col>
      </Row>
    </>
  );
};

export default SchedulerTab;
