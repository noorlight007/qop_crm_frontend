import { Container } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";
import ActiveCases from "../../../CommonComponents/Cases/ActiveCases/ActiveCases";

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
        <ActiveCases />
      </Container>
    </>
  );
};

export default NetworkActiveCasesContainer;
