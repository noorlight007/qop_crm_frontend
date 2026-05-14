import { Col, Row } from "reactstrap";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import ProfileInfo from "./ProfileInfo/ProfileInfo";

const UserProfileContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Profile"
        subTitle="Manage your profile information and switch role."
        items={[{ label: "Profile", active: true }]}
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
