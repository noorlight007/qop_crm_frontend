import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container, Row } from "reactstrap";
import OrganisationList from "./OrganisationList/OrganisationList";

const AdminOrganisationsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Organisations Overview"
        subTitle="Welcome back! Check all the Organisations"
        parent="Organisations"
      />
      <Container fluid>
        <Row>
          <OrganisationList />
        </Row>
      </Container>
    </>
  );
};

export default AdminOrganisationsContainer;
