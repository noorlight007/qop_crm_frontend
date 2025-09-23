import { Container } from "reactstrap";
import Breadcrumbs from "../../CommonComponents/Breadcrumbs/Breadcrumbs";
import Cases from "../../CommonComponents/Cases/Cases/Cases";

const CaseupdatesContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Case Status"
        subTitle="View and manage all client cases"
        parent="Case Updates"
        child="Cases"
      />
      <Container fluid>
        <Cases />
      </Container>
    </>
  );
};

export default CaseupdatesContainer;
