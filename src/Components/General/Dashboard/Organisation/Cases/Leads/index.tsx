import Leads from "@/Components/General/Dashboard/CommonComponents/Directors/Leads/Leads";
import { Container } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";

const OrganisationLeadsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Lead Status"
        subTitle="Here you can see all the leads of the organisation"
        parent="Cases"
        child="Leads"
      />
      <Container fluid>
        <Leads />
      </Container>
    </>
  );
};

export default OrganisationLeadsContainer;
