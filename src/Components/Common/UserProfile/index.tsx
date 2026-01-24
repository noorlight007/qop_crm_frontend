import { Col, Row } from "reactstrap";
import Breadcrumbs from "../../../../Common/Breadcrumbs/Breadcrumbs";
import ProfileInfo from "./ProfileInfo/ProfileInfo";

const UserProfileContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="User Profile"
        subTitle="User profile management"
        parent="User"
        child="Profile"
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
