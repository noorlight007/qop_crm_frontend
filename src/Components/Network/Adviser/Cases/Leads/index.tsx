import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import Leads from "@/Components/Common/CommonUsers/Leads/Leads";
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
        <Leads />
      </Container>
    </>
  );
};

export default NetworkAdviserLeadsContainer;
