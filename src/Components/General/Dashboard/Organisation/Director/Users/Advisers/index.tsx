import Breadcrumbs from "@/Components/General/Dashboard/CommonComponents/Breadcrumbs/Breadcrumbs";
import Advisers from "@/Components/General/Dashboard/CommonComponents/CommonUsers/Advisers/Advisers";
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
        <Advisers />
      </Container>
    </>
  );
};

export default OrganisationDirectorAdvisersContainer;
