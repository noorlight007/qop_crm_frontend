import Breadcrumbs from "@/Components/General/Dashboard/CommonComponents/Breadcrumbs/Breadcrumbs";
import Admins from "@/Components/General/Dashboard/CommonComponents/CommonUsers/Admins/Admins";
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
        <Admins />
      </Container>
    </div>
  );
};

export default OrganisationAdminsContainer;
