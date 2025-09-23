import { Container } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";
import Clients from "../../../CommonComponents/Directors/Clients/Clients";

const OrganisationClientsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Client Status"
        subTitle="Here you can see all the clients of the organisation"
        parent="Cases"
        child="Clients"
      />
      <Container fluid>
        <Clients />
      </Container>
    </>
  );
};

export default OrganisationClientsContainer;
