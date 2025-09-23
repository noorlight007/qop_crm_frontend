import { Container } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";
import ActiveCases from "../../../CommonComponents/Cases/ActiveCases/ActiveCases";

const OrganisationAdviserActiveCasesContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Active Cases"
        subTitle="View and manage active cases"
        parent="Cases"
        child="Active Cases"
      />
      <Container fluid>
        <ActiveCases />
      </Container>
    </>
  );
};

export default OrganisationAdviserActiveCasesContainer;
