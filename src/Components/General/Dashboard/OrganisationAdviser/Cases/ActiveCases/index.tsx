import { Container } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";
import Cases from "../../../CommonComponents/Cases/Cases";

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
        <Cases initialIsRemoved="false" />
      </Container>
    </>
  );
};

export default OrganisationAdviserActiveCasesContainer;
