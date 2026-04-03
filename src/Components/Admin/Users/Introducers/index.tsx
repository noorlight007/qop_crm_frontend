import AuthUsers from "@/Components/Admin/CommonUsers/AuthUsers/AuthUsers";
import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container } from "reactstrap";

const IntroducerContainer: React.FC = () => {
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

export default IntroducerContainer;
