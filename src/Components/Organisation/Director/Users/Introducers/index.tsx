import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import AuthUsers from "@/Components/Common/CommonUsers/AuthUsers/AuthUsers";
import { Container } from "reactstrap";

const OrganisationDirectorIntroducersContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Introducer Status"
        subTitle="Manage organisation introducers"
        parent="Users"
        child="Introducers"
      />
      <Container fluid>
        <AuthUsers userRole="INTRODUCER" title="Introducers" />
      </Container>
    </>
  );
};

export default OrganisationDirectorIntroducersContainer;
