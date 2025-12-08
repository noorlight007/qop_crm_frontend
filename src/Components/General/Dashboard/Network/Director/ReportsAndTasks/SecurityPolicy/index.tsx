import Breadcrumbs from "@/Components/General/Dashboard/CommonComponents/Breadcrumbs/Breadcrumbs";
import { Container } from "reactstrap";
import SecurityPoliciesManagement from "./SecurityPoliciesManagement/SecurityPoliciesManagement";

const SecurityPolicyContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Security Policy"
        subTitle="Welcome to the Security Policy List"
        parent="Reports & Tasks"
        child="Security Policy"
      />
      <Container fluid>
        <SecurityPoliciesManagement />
      </Container>
    </>
  );
};

export default SecurityPolicyContainer;
