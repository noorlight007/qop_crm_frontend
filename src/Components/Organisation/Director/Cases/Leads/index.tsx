import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import LeadsOrClients from "@/Components/Common/CommonUsers/LeadsOrClients/LeadsOrClients";
import { Container } from "reactstrap";

const OrganisationDirectorLeadsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Lead Overview"
        subTitle="Here you can see all the leads of the organisation"
        items={[{ label: "Cases" }, { label: "Leads", active: true }]}
      />
      <Container fluid>
        <LeadsOrClients userRole="LEAD" title="Leads" />
      </Container>
    </>
  );
};

export default OrganisationDirectorLeadsContainer;
