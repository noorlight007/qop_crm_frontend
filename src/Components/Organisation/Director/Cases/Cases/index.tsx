import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import Cases from "@/Components/General/Dashboard/CommonComponents/Cases/Cases";
import { Container } from "reactstrap";

const OrganisationDirectorCasesContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Case Status"
        subTitle="Here you can see all the cases of the organisation"
        parent="Organisation"
        child="Cases"
      />
      <Container fluid>
        <Cases />
      </Container>
    </>
  );
};

export default OrganisationDirectorCasesContainer;
