import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container, Row } from "reactstrap";
import DashboardOverview from "./DashboardOverview/DashboardOverview";
import ManageRole from "./ManageRole/ManageRole";
import ManageUser from "./ManageUser/MangageUser";
import QuickActions from "./QuickActions/QuickActions";
import RecentSystemActivity from "./RecentSystemActivity/RecentSystemActivity";
import SystemAlerts from "./SystemAlerts/SystemAlerts";
import WeeklyActivity from "./WeeklyActivity/WeeklyActivity";

const NetworkDirectorUserManagementContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="User Management"
        subTitle="Welcome to the User Management List"
        parent="Reports & Tasks"
        child="User Management"
      />
      <Container fluid>
        <DashboardOverview />
        <QuickActions />
        <Row>
          <WeeklyActivity />
          <SystemAlerts />
        </Row>
        <RecentSystemActivity />
        <ManageUser />
        <ManageRole />
      </Container>
    </>
  );
};

export default NetworkDirectorUserManagementContainer;
