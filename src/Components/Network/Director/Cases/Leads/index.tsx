import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import Leads from "@/Components/Common/CommonUsers/Leads/Leads";
import { Container } from "reactstrap";

const NetworkDirectorLeadsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Lead Overview"
        subTitle="Welcome to the Lead Overview"
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
