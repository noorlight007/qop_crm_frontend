import Breadcrumbs from "@/Components/General/Dashboard/CommonComponents/Breadcrumbs/Breadcrumbs";
import AuthUsers from "@/Components/General/Dashboard/CommonComponents/CommonUsers/AuthUsers/AuthUsers";
import { Container } from "reactstrap";

const OrganisationDirectorAdvisersContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Adviser Status"
        subTitle="Manage organisation advisers"
        parent="Users"
        child="Advisers"
      />
      <Container fluid>
        <AuthUsers userRole="ORGANISATION_ADVISER" title="Advisers" />
      </Container>
    </>
  );
};

export default OrganisationDirectorAdvisersContainer;
