import Breadcrumbs from "@/Components/General/Dashboard/CommonComponents/Breadcrumbs/Breadcrumbs";
import Leads from "@/Components/General/Dashboard/CommonComponents/Directors/Leads/Leads";
import { Container } from "reactstrap";

const NetworkDirectorLeadsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Lead Status"
        subTitle="Welcome to the Lead Status"
        parent="Cases"
        child="Leads"
      />
      <Container fluid>
        <Leads />
      </Container>
    </>
  );
};

export default NetworkDirectorLeadsContainer;
