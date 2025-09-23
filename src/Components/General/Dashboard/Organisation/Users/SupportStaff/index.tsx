import { Container } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";

const OrganisationSupportStaffContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Support Staff Status"
        subTitle="Support Staff Management"
        parent="Users"
        child="Support Staff"
      />
      <Container fluid>
        <h1 className="text-danger text-center">Under Development</h1>
      </Container>
    </>
  );
};

export default OrganisationSupportStaffContainer;
