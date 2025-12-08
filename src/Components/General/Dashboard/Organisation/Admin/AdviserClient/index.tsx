import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";
import AdviserClientFilterBar from "./AdviserClientFilterBar/AdviserClientFilterBar";
import ClientLists from "./ClientLists/ClientLists";

const OrganisationAdminAdviserClientContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Adviser Clients"
        subTitle="Manage and view all client files across advisers"
        child="Adviser Clients"
      />
      <Container fluid>
        <AdviserClientFilterBar />
        <Row>
          <ClientLists />
        </Row>
      </Container>
    </>
  );
};

export default OrganisationAdminAdviserClientContainer;
