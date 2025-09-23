import Leads from "@/Components/General/Dashboard/CommonComponents/Directors/Leads/Leads";
import { Container } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";

const NetworkAdviserLeadsContainer: React.FC = () => {
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

export default NetworkAdviserLeadsContainer;
