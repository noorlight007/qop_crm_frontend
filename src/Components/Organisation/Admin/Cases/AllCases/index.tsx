import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import Cases from "@/Components/Common/Cases/Cases";
import { Container } from "reactstrap";

const OrganisationAdminCaseupdatesContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Case Overview"
        subTitle="View and manage all cases"
        items={[{ label: "Cases" }, { label: "All Cases", active: true }]}
      />
      <Container fluid>
        <Cases />
      </Container>
    </>
  );
};

export default OrganisationAdminCaseupdatesContainer;
