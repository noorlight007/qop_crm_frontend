import AuthUsers from "@/Components/Admin/CommonUsers/AuthUsers/AuthUsers";
import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container } from "reactstrap";

const AdminsContainer: React.FC = () => {
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

export default AdminsContainer;
