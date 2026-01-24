import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import Cases from "@/Components/Common/Cases/Cases";
import { Container } from "reactstrap";

const OrganisationDirectorActiveCasesContainer: React.FC = () => {
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

export default OrganisationDirectorActiveCasesContainer;
