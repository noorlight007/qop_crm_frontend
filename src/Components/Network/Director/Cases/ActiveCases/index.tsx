import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import Cases from "@/Components/Common/Cases/Cases";
import { Container } from "reactstrap";

const NetworkDirectorActiveCasesContainer: React.FC = () => {
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

export default NetworkDirectorActiveCasesContainer;
