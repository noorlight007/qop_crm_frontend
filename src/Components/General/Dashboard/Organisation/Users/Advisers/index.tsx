import { Container } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";
import Advisers from "../../../CommonComponents/Directors/Advisers/Advisers";

const OrganisationAdvisersContainer: React.FC = () => {
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

export default OrganisationAdvisersContainer;
