import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container } from "reactstrap";
import SystemReportsAndLogsOverview from "./SystemReportsAndLogsOverview/SystemReportsAndLogsOverview";
import SystemReportsAndLogsTabs from "./SystemReportsAndLogsTabs/SystemReportsAndLogsTabs";

const OrganisationDirectorReportsAndLogsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="System Reports & Logs"
        subTitle="Monitor activities and generate comprehensive reports"
        parent="Reports & Tasks"
        child="Reports & Logs"
      />
      <Container fluid>
        <SystemReportsAndLogsOverview />
        <SystemReportsAndLogsTabs />
      </Container>
    </>
  );
};

export default OrganisationDirectorReportsAndLogsContainer;
