import { Container } from "reactstrap";
import Breadcrumbs from "../../../../../Common/Breadcrumbs/Breadcrumbs";
import Cases from "../../../CommonComponents/Cases/Cases";

const OrganisationAdminCaseupdatesContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Case Status"
        subTitle="View and manage all client cases"
        child="Cases"
      />
      <Container fluid>
        <Cases />
      </Container>
    </>
  );
};

export default OrganisationAdminCaseupdatesContainer;
