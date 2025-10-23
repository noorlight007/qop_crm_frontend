import { Container } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";
import Cases from "../../../CommonComponents/Cases/Cases";

const CasesContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Case Status"
        subTitle="Here you can see all the cases of the organisation"
        parent="Organisation"
        child="Cases"
      />
      <Container fluid>
        <Cases />
      </Container>
    </>
  );
};

export default CasesContainer;
