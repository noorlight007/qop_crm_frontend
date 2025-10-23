import { Container } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";
import Cases from "../../../CommonComponents/Cases/Cases";

const OrganisationActiveCasesContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Active Cases"
        subTitle="Welcome to the Active Cases List"
        parent="Cases"
        child="Active Cases"
      />
      <Container fluid>
        <Cases initialIsRemoved="false" />
      </Container>
    </>
  );
};

export default OrganisationActiveCasesContainer;
