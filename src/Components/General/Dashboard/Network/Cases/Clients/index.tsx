import { Container } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";
import Clients from "../../../CommonComponents/Directors/Clients/Clients";

const ClientsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Client Status"
        subTitle="Welcome to the Client Status"
        parent="Cases"
        child="Clients"
      />
      <Container fluid>
        <Clients />
      </Container>
    </>
  );
};

export default ClientsContainer;
