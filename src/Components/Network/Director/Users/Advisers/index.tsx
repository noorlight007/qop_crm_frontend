import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import AuthUsers from "@/Components/Common/CommonUsers/AuthUsers/AuthUsers";
import { Container } from "reactstrap";

const NetworkDirectorAdvisersContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Adviser Overview"
        subTitle="Welcome to the Adviser Overview"
        items={[{ label: "Users" }, { label: "Advisers", active: true }]}
      />
      <Container fluid>
        <AuthUsers userRole="ADVISER" title="Advisers" />
      </Container>
    </>
  );
};

export default NetworkDirectorAdvisersContainer;
