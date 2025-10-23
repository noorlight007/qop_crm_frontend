import { Container } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";
import Cases from "../../../CommonComponents/Cases/Cases";

const NetworkActiveCasesContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Network Active Cases"
        subTitle="View all active cases in the network"
        parent="Cases"
        child="Active Cases"
      />
      <Container fluid>
        <Cases initialIsRemoved="false" />
      </Container>
    </>
  );
};

export default NetworkActiveCasesContainer;
