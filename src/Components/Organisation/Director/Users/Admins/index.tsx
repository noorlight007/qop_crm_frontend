import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import AuthUsers from "@/Components/Common/CommonUsers/AuthUsers/AuthUsers";
import { Container } from "reactstrap";

const OrganisationAdminsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        title="Admin Overview"
        subTitle="Manage organisation admins"
        items={[{ label: "Users" }, { label: "Admins", active: true }]}
      />
      <Container fluid>
        <AuthUsers title="Admins" userRole="ADMIN" />
      </Container>
    </div>
  );
};

export default OrganisationAdminsContainer;
