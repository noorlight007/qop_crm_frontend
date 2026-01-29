import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import SupportTicket from "@/Components/Common/SupportTicket/SupportTicket";
import { Container, Row } from "reactstrap";

const SupportTicketContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Support Ticket Overview"
        subTitle="Welcome back! Check all the Support Tickets"
        parent="Support Tickets"
      />
      <Container fluid>
        <Row>
          <SupportTicket />
        </Row>
      </Container>
    </>
  );
};

export default SupportTicketContainer;
