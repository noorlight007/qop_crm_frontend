import { Col, Row } from "reactstrap";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import ProfileInfo from "./ProfileInfo/ProfileInfo";

const UserProfileContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Profile & Settings"
        subTitle="Manage your profile information and account settings."
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
