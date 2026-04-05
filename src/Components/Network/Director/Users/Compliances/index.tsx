import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import AuthUsers from "@/Components/Common/CommonUsers/AuthUsers/AuthUsers";
import { Container } from "reactstrap";

const NetworkCompliancesContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Compliance Overview"
        subTitle="Welcome to the Compliance Overview"
        items={[{ label: "Users" }, { label: "Compliances", active: true }]}
      />
      <Container fluid>
        <AuthUsers userRole="COMPLIANCE" title="Compliances" />
      </Container>
    </>
  );
};

export default NetworkCompliancesContainer;
