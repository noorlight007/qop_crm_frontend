import AuthUsers from "@/Components/Admin/CommonUsers/AuthUsers/AuthUsers";
import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container } from "reactstrap";

const AdminDirectorsContainer: React.FC = () => {
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

export default AdminDirectorsContainer;
