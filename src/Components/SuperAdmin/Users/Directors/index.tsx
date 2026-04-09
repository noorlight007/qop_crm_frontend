import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import AuthUsers from "@/Components/SuperAdmin/CommonUsers/AuthUsers/AuthUsers";
import { Container } from "reactstrap";

const SuperAdminDirectorsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Directors Overview"
        subTitle="Welcome back! Check all the Network Directors"
        items={[{ label: "Users" }, { label: "Directors", active: true }]}
      />
      <Container fluid>
        <AuthUsers title="Director" roles="DIRECTOR" />
      </Container>
    </>
  );
};

export default SuperAdminDirectorsContainer;
