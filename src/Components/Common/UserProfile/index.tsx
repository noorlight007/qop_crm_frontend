import { Col, Row } from "reactstrap";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import ProfileInfo from "./ProfileInfo/ProfileInfo";

const UserProfileContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="My Profile"
        subTitle="Profile management and settings"
        items={[{ label: "Profile & Settings", active: true }]}
      />
      <Row>
        <Col>
          <ProfileInfo />
        </Col>
      </Row>
    </>
  );
};

export default UserProfileContainer;
