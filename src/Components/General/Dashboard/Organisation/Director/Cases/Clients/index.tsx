import Breadcrumbs from "@/Components/General/Dashboard/CommonComponents/Breadcrumbs/Breadcrumbs";
import Clients from "@/Components/General/Dashboard/CommonComponents/Directors/Clients/Clients";
import { Container } from "reactstrap";

const OrganisationDirectorClientsContainer: React.FC = () => {
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

export default OrganisationDirectorClientsContainer;
