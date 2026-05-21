import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import LeadsOrApplicants from "@/Components/Common/CommonUsers/LeadsOrApplicants/LeadsOrApplicants";
import { Container } from "reactstrap";

const NetworkAdviserApplicantsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Applicant Overview"
        subTitle="Here you can see all the applicants of the network"
        items={[{ label: "Cases" }, { label: "Applicants", active: true }]}
      />
      <Container fluid>
        <LeadsOrApplicants userRole="APPLICANT" title="Applicants" />
      </Container>
    </>
  );
};

export default NetworkAdviserApplicantsContainer;
