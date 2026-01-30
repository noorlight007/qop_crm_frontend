import { Container } from "reactstrap";
import AuthUsers from "../../CommonUsers/AuthUsers/AuthUsers";

const AdviserList: React.FC = () => {
  return (
    <div>
      <>
      <Container fluid>
        <AuthUsers title="Advisers" roles={["NETWORK_ADVISER", "ORGANISATION_ADVISER"]}/>
      </Container>
    </>
    </div>
  );
};

export default AdviserList;