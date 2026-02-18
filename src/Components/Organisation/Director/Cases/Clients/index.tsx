import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import LeadsOrClients from "@/Components/Common/CommonUsers/LeadsOrClients/LeadsOrClients";
import { Container } from "reactstrap";

const OrganisationDirectorClientsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Client Overview"
        subTitle="Here you can see all the clients of the organisation"
        parent="Cases"
        child="Clients"
      />
      <Container fluid>
        <LeadsOrClients userRole="CLIENT" title="Clients" />
      </Container>
    </>
  );
};

export default OrganisationDirectorClientsContainer;
