import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import LeadsOrClients from "@/Components/Common/CommonUsers/LeadsOrClients/LeadsOrClients";
import { Container } from "reactstrap";

const NetworkDirectorClientsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Client Overview"
        subTitle="Welcome to the Client Overview"
        items={[{ label: "Cases" }, { label: "Clients", active: true }]}
      />
      <Container fluid>
        <LeadsOrClients userRole="CLIENT" title="Clients" />
      </Container>
    </>
  );
};

export default NetworkDirectorClientsContainer;
