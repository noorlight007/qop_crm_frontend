import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import AuthUsers from "@/Components/Common/CommonUsers/AuthUsers/AuthUsers";
import { Container } from "reactstrap";

const OrganisationDirectorAdvisersContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Adviser Overview"
        subTitle="Manage organisation advisers"
        items={[{ label: "Users" }, { label: "Advisers", active: true }]}
      />
      <Container fluid>
        <AuthUsers userRole="ORGANISATION_ADVISER" title="Advisers" />
      </Container>
    </>
  );
};

export default OrganisationDirectorAdvisersContainer;
