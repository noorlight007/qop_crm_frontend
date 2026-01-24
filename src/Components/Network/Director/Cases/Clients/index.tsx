import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import Clients from "@/Components/Common/CommonUsers/Clients/Clients";
import { Container } from "reactstrap";

const NetworkDirectorClientsContainer: React.FC = () => {
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

export default NetworkDirectorClientsContainer;
