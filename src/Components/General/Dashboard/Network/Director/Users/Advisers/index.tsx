import Breadcrumbs from "@/Components/General/Dashboard/CommonComponents/Breadcrumbs/Breadcrumbs";
import AuthUsers from "@/Components/General/Dashboard/CommonComponents/CommonUsers/AuthUsers/AuthUsers";
import { Container } from "reactstrap";

const NetworkDirectorAdvisersContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Adviser Status"
        subTitle="Welcome to the Adviser Status"
        parent="Users"
        child="Advisers"
      />
      <Container fluid>
        <AuthUsers userRole="NETWORK_ADVISER" title="Advisers" />
      </Container>
    </>
  );
};

export default NetworkDirectorAdvisersContainer;
