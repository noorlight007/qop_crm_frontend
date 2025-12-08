import { Container } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";
import WorkflowsAndIntegrationsOverview from "./WorkflowsAndIntegrationsOverview/WorkflowsAndIntegrationsOverview";
import WorkflowsAndIntegrationsTabs from "./WorkflowsAndIntegrationsTabs/WorkflowsAndIntegrationsTabs";

const WorkflowsAndIntegrationContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Workflows & Integrations"
        subTitle="Manage workflows and integrations"
        parent="Reports & Tasks"
        child="Workflows & Integrations"
      />
      <Container fluid>
        <WorkflowsAndIntegrationsOverview />
        <WorkflowsAndIntegrationsTabs />
      </Container>
    </>
  );
};

export default WorkflowsAndIntegrationContainer;
