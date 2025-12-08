import Breadcrumbs from "@/Components/General/Dashboard/CommonComponents/Breadcrumbs/Breadcrumbs";
import Cases from "@/Components/General/Dashboard/CommonComponents/Cases/Cases";
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
