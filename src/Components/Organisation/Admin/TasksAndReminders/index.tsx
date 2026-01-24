import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container } from "reactstrap";
import TasksAndCalendarTabs from "./TasksAndCalendarTabs/TasksAndCalendarTabs";
import TasksAndRemindersOverview from "./TasksAndRemindersOverview/TasksAndRemindersOverview";

const OrganisationAdminTasksAndRemindersContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Tasks & Reminders"
        subTitle="Manage Tasks and Reminders"
        child="Tasks & Reminders"
      />
      <Container fluid>
        <TasksAndRemindersOverview />
        <TasksAndCalendarTabs />
      </Container>
    </>
  );
};

export default OrganisationAdminTasksAndRemindersContainer;
