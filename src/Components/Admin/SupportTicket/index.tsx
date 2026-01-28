import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container, Row } from "reactstrap";
import SupportTicketList from "./SupportTicketList/SupportTicketList";

const index: React.FC = () => {
  return (
   <>
      <Breadcrumbs
        title="Support Ticket Overview"
        subTitle="Welcome back! Check all the Support Tickets"
        parent="Client"
        child="Dashboard"
      />
      <Container fluid>
        <Row>
          <SupportTicketList />
        </Row>
      </Container>
    </>
  );
};

export default index;