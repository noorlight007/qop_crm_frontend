import { Container } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";
import AuditLogsAndActivityTracking from "./AuditLogsAndActivityTracking/AuditLogsAndActivityTracking";

const AuditLogContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Audit Log"
        subTitle="Welcome to the Audit Log List"
        parent="Reports & Tasks"
        child="Audit Log"
      />
      <Container fluid>
        <AuditLogsAndActivityTracking />
      </Container>
    </>
  );
};

export default AuditLogContainer;
