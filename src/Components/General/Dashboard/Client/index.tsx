import { Container, Row } from "reactstrap";
import ClientBreadcrumbs from "./Breadcrumbs/Breadcrumbs";
import MyApplications from "./Components/MyApplications";
import WelcomeMessage from "./Components/WelcomeMessage";

const ClientContainer: React.FC = () => {
  return (
    <>
      <ClientBreadcrumbs
        mainTitle="Client Dashboard"
        title="Welcome back! Let’s start from where you left."
        parent="Dashboard"
        activePage="Client"
      />
      <Container fluid>
        <Row>
          <WelcomeMessage />
        </Row>
        <Row>
          <MyApplications />
        </Row>
      </Container>
    </>
  );
};

export default ClientContainer;
