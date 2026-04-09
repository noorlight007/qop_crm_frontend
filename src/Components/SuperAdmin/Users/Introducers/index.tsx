import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import AuthUsers from "@/Components/SuperAdmin/CommonUsers/AuthUsers/AuthUsers";
import { Container } from "reactstrap";

const SuperAdminIntroducersContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Introducers Overview"
        subTitle="Welcome back! Check all the Introducerss"
        items={[{ label: "Users" }, { label: "Introducerss", active: true }]}
      />
      <Container fluid>
        <AuthUsers title="Introducer" roles="INTRODUCER" />
      </Container>
    </>
  );
};

export default SuperAdminIntroducersContainer;
