import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import AuthUsers from "@/Components/Common/CommonUsers/AuthUsers/AuthUsers";
import { Container } from "reactstrap";

const NetworkDirectorAdvisersContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Adviser Overview"
        subTitle="Welcome to the Adviser Overview"
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
