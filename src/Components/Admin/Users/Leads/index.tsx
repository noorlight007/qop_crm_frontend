import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container, Row } from "reactstrap";
import LeadList from "./LeadList/LeadList";

const LeadsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Leads Overview"
        subTitle="Welcome back! Check all the Leads"
        parent="Users"
        child="Leads"
      />
      <Container fluid>
        <Row>
          <LeadList />
        </Row>
      </Container>
    </>
  );
};

export default LeadsContainer;
