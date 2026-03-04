import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import LeadsOrClients from "@/Components/Common/CommonUsers/LeadsOrClients/LeadsOrClients";
import { Container } from "reactstrap";

const NetworkAdviserClientsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Client Overview"
        subTitle="Here you can see all the clients of the network"
        items={[{ label: "Cases" }, { label: "Clients", active: true }]}
      />
      <Container fluid>
        <LeadsOrClients userRole="CLIENT" title="Clients" />
      </Container>
    </>
  );
};

export default NetworkAdviserClientsContainer;
