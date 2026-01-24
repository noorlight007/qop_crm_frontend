import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import Cases from "@/Components/General/Dashboard/CommonComponents/Cases/Cases";
import { Container } from "reactstrap";

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
