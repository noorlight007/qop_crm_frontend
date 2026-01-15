import Breadcrumbs from "@/Components/General/Dashboard/CommonComponents/Breadcrumbs/Breadcrumbs";
import Leads from "@/Components/General/Dashboard/CommonComponents/CommonUsers/Leads/Leads";
import { Container } from "reactstrap";

const OrganisationAdminLeadsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Lead Status"
        subTitle="Manage all leads"
        parent="Cases"
        child="Leads"
      />
      <Container fluid>
        <Leads />
      </Container>
    </>
  );
};

export default OrganisationAdminLeadsContainer;
