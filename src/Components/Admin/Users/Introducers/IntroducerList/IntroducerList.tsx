import AuthUsers from "@/Components/Admin/CommonUsers/AuthUsers/AuthUsers";
import { Container } from "reactstrap";

const IntroducerList: React.FC = () => {
  return (
    <div>
      <>
        <Container fluid>
          <AuthUsers title="Introducer" roles="INTRODUCER" />
        </Container>
      </>
    </div>
  );
};

export default IntroducerList;
