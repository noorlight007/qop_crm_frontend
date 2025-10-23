import { Container } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";
import Cases from "../../../CommonComponents/Cases/Cases";

const NetworkAdviserCasesContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Case Status"
        subTitle="Manage all cases"
        parent="Cases"
        child="All Cases"
      />
      <Container fluid>
        <Cases />
      </Container>
    </>
  );
};

export default NetworkAdviserCasesContainer;
