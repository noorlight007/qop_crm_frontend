import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import LeadsOrApplicants from "@/Components/Common/CommonUsers/LeadsOrApplicants/LeadsOrApplicants";
import { Container } from "reactstrap";

const NetworkDirectorLeadsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Lead Overview"
        subTitle="Welcome to the Lead Overview"
        items={[{ label: "Cases" }, { label: "Leads", active: true }]}
      />
      <Container fluid>
        <LeadsOrApplicants userRole="LEAD" title="Leads" />
      </Container>
    </>
  );
};

export default NetworkDirectorLeadsContainer;
