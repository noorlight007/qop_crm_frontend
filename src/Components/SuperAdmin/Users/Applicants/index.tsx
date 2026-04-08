import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container } from "reactstrap";
import LeadsOrApplicants from "../../CommonUsers/LeadsOrApplicants/LeadsOrApplicants";

const SuperAdminClientsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Applicant Overview"
        subTitle="Welcome back! Check all the Applicants"
        items={[{ label: "Users" }, { label: "Applicants", active: true }]}
      />
      <Container fluid>
        <LeadsOrApplicants title="Client" roles="CLIENT" />
      </Container>
    </>
  );
};

export default SuperAdminClientsContainer;
