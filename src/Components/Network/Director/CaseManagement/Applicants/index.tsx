import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import LeadsOrApplicants from "@/Components/Common/CommonUsers/LeadsOrApplicants/LeadsOrApplicants";
import { Container } from "reactstrap";

const NetworkDirectorApplicantsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Applicant Overview"
        subTitle="Welcome to the Applicant Overview"
        items={[{ label: "Cases" }, { label: "Applicants", active: true }]}
      />
      <Container fluid>
        <LeadsOrApplicants userRole="APPLICANT" title="Applicants" />
      </Container>
    </>
  );
};

export default NetworkDirectorApplicantsContainer;
