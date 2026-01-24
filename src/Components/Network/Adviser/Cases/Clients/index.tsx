import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import Clients from "@/Components/Common/CommonUsers/Clients/Clients";
import { Container } from "reactstrap";

const NetworkAdviserClientsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Client Status"
        subTitle="Here you can see all the clients of the network"
        parent="Cases"
        child="Clients"
      />
      <Container fluid>
        <Clients />
      </Container>
    </>
  );
};

export default NetworkAdviserClientsContainer;
