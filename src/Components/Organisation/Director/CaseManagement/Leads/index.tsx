import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import LeadsOrApplicants from "@/Components/Common/CommonUsers/LeadsOrApplicants/LeadsOrApplicants";
import { Container } from "reactstrap";

const OrganisationDirectorLeadsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Lead Overview"
        subTitle="Here you can see all the leads of the organisation"
        items={[{ label: "Cases" }, { label: "Leads", active: true }]}
      />
      <Container fluid>
        <LeadsOrApplicants userRole="LEAD" title="Leads" />
      </Container>
    </>
  );
};

export default OrganisationDirectorLeadsContainer;
