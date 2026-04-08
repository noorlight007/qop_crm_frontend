import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import AuthUsers from "@/Components/SuperAdmin/CommonUsers/AuthUsers/AuthUsers";
import { Container } from "reactstrap";

const SuperAdminAdminsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Admins Overview"
        subTitle="Welcome back! Check all the Admins"
        items={[{ label: "Users" }, { label: "Admins", active: true }]}
      />
      <Container fluid>
        <AuthUsers title="Admin" roles="ADMIN" />
      </Container>
    </>
  );
};

export default SuperAdminAdminsContainer;
