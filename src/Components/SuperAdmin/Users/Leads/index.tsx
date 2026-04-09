import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container } from "reactstrap";
import LeadsOrApplicants from "../../CommonUsers/LeadsOrApplicants/LeadsOrApplicants";

const SuperAdminLeadsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Leads Overview"
        subTitle="Welcome back! Check all the Leads"
        items={[{ label: "Users" }, { label: "Leads", active: true }]}
      />
      <Container fluid>
        <LeadsOrApplicants title="Lead" roles="LEAD" />
      </Container>
    </>
  );
};

export default SuperAdminLeadsContainer;
