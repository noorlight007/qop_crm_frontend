import { Container } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";
import ActiveCases from "../../../CommonComponents/Cases/ActiveCases/ActiveCases";

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
        <ActiveCases />
      </Container>
    </>
  );
};

export default OrganisationActiveCasesContainer;
