import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import LeadsOrClients from "@/Components/Common/CommonUsers/LeadsOrClients/LeadsOrClients";
import { Container } from "reactstrap";

const OrganisationAdminLeadsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Lead Overview"
        subTitle="Manage all leads"
        items={[{ label: "Cases" }, { label: "Leads", active: true }]}
      />
      <Container fluid>
        <LeadsOrClients userRole="LEAD" title="Leads" />
      </Container>
    </>
  );
};

export default OrganisationAdminLeadsContainer;
