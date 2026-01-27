import { Container } from "reactstrap";
import AuthUsers from "../../CommonUsers/AuthUsers/AuthUsers";

const DirectorList: React.FC = () => {
  return (
    <div>
      <>
      <Container fluid>
        <AuthUsers title="Directors" />
      </Container>
    </>
    </div>
  );
};

export default DirectorList;