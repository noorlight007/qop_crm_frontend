import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import Leads from "@/Components/Common/CommonUsers/Leads/Leads";
import { Container } from "reactstrap";

const OrganisationDirectorLeadsContainer: React.FC = () => {
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

export default OrganisationDirectorLeadsContainer;
