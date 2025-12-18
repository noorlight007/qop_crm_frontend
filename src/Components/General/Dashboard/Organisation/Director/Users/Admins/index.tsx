import Breadcrumbs from "@/Components/General/Dashboard/CommonComponents/Breadcrumbs/Breadcrumbs";
import AuthUsers from "@/Components/General/Dashboard/CommonComponents/CommonUsers/AuthUsers/AuthUsers";
import { Container } from "reactstrap";

const OrganisationAdminsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        title="Admin Status"
        subTitle="Manage organisation admins"
        parent="Users"
        child="Admins"
      />
      <Container fluid>
        <AuthUsers title="Admins" />
      </Container>
    </div>
  );
};

export default OrganisationAdminsContainer;
