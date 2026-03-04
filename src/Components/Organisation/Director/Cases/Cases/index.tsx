import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import Cases from "@/Components/Common/Cases/Cases";
import { Container } from "reactstrap";

const OrganisationDirectorCasesContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Case Status"
        subTitle="Here you can see all the cases of the organisation"
        items={[{ label: "Organisation" }, { label: "Cases", active: true }]}
      />
      <Container fluid>
        <Cases />
      </Container>
    </>
  );
};

export default OrganisationDirectorCasesContainer;
