import Breadcrumbs from "@/Components/General/Dashboard/CommonComponents/Breadcrumbs/Breadcrumbs";
import Cases from "@/Components/General/Dashboard/CommonComponents/Cases/Cases";
import { Container } from "reactstrap";

const NetworkAdviserActiveCasesContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Active Cases"
        subTitle="View and manage active cases"
        parent="Cases"
        child="Active Cases"
      />
      <Container fluid>
        <Cases initialIsRemoved="false" />
      </Container>
    </>
  );
};

export default NetworkAdviserActiveCasesContainer;
