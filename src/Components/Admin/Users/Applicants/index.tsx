import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container, Row } from "reactstrap";
import AuthUsers from "../../CommonUsers/AuthUsers/AuthUsers";

const ClientsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Applicant Overview"
        subTitle="Welcome back! Check all the Applicants"
        items={[{ label: "Users" }, { label: "Applicants", active: true }]}
      />
      <Container fluid>
        <Row>
          <AuthUsers title="Client" roles="CLIENT" />
        </Row>
      </Container>
    </>
  );
};

export default ClientsContainer;
