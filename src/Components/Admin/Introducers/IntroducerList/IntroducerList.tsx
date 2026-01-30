import { Container } from "reactstrap";
import AuthUsers from "../../CommonUsers/AuthUsers/AuthUsers";

const IntroducerList: React.FC = () => {
  return (
    <div>
      <>
      <Container fluid>
        <AuthUsers title="Compliance Assistant" roles="INTRODUCER"/>
      </Container>
    </>
    </div>
  );
};

export default IntroducerList;