import { Col, Row } from "reactstrap";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import ProfileInfo from "./ProfileInfo/ProfileInfo";

const UserProfileContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="User Profile"
        subTitle="User profile management"
        items={[{ label: "User" }, { label: "Profile", active: true }]}
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
