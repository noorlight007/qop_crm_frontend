import AuthUsers from "@/Components/SuperAdmin/CommonUsers/AuthUsers/AuthUsers";
import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container } from "reactstrap";

const SuperAdminComplianceContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Compliances Overview"
        subTitle="Welcome back! Check all the Compliances"
        items={[{ label: "Users" }, { label: "Compliances", active: true }]}
      />
      <Container fluid>
        <AuthUsers title="Compliance" roles="COMPLIANCE" />
      </Container>
    </>
  );
};

export default SuperAdminComplianceContainer;
