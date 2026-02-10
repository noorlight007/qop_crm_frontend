import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import AuthUsers from "@/Components/Common/CommonUsers/AuthUsers/AuthUsers";
import { Container } from "reactstrap";

const NetworkCompliancesContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Compliance Overview"
        subTitle="Welcome to the Compliance Overview"
        parent="Users"
        child="Compliances"
      />
      <Container fluid>
        <AuthUsers
          userRole="NETWORK_COMPLIANCE"
          title="Compliances"
        />
      </Container>
    </>
  );
};

export default NetworkCompliancesContainer;
