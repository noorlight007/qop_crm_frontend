import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import Cases from "@/Components/Common/Cases/Cases";
import { Container } from "reactstrap";

const NetworkAdviserCasesContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Case Overview"
        subTitle="Manage all cases"
        items={[{ label: "Cases" }, { label: "All Cases", active: true }]}
      />
      <Container fluid>
        <Cases />
      </Container>
    </>
  );
};

export default NetworkAdviserCasesContainer;
