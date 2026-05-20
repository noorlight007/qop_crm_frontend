import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import LeadsOrApplicants from "@/Components/Common/CommonUsers/LeadsOrApplicants/LeadsOrApplicants";
import { Container } from "reactstrap";

const NetworkAdviserLeadsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Lead Overview"
        subTitle="Manage all leads"
        items={[{ label: "Cases" }, { label: "Leads", active: true }]}
      />
      <Container fluid>
        <LeadsOrApplicants userRole="LEAD" title="Leads" />
      </Container>
    </>
  );
};

export default NetworkAdviserLeadsContainer;
