import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import LeadsOrClients from "@/Components/Common/CommonUsers/LeadsOrClients/LeadsOrClients";
import { Container } from "reactstrap";

const NetworkAdviserLeadsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Lead Overview"
        subTitle="Manage all leads"
        parent="Cases"
        child="Leads"
      />
      <Container fluid>
        <LeadsOrClients userRole="LEAD" title="Leads" />
      </Container>
    </>
  );
};

export default NetworkAdviserLeadsContainer;
