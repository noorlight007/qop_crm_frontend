import { Container } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";
import Leads from "../../../CommonComponents/Directors/Leads/Leads";

const NetworkLeadsContainer: React.FC = () => {
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

export default NetworkLeadsContainer;
