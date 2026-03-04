import { Container, Row } from "reactstrap";
import Breadcrumbs from "../Common/Breadcrumbs/Breadcrumbs";
import MyApplications from "./Components/MyApplications";
import WelcomeMessage from "./Components/WelcomeMessage";

const ClientContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Client Dashboard"
        subTitle="Welcome back! Let’s start from where you left."
        items={[{ label: "Client" }, { label: "Dashboard", active: true }]}
      />
      <Container fluid>
        <Row>
          <WelcomeMessage />
        </Row>
        <Row className="mt-3">
          <MyApplications />
        </Row>
      </Container>
    </>
  );
};

export default ClientContainer;
