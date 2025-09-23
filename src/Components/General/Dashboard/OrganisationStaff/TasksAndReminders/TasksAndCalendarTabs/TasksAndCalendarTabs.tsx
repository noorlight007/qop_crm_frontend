import classNames from "classnames";
import { useState } from "react";
import { TbCalendar, TbCircleCheck, TbCirclePlus } from "react-icons/tb";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import CalendarViewTab from "./CalendarViewTab/CalendarViewTab";
import TasksTab from "./TasksTab/TasksTab";

const TasksAndCalendarTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"task" | "calendar">("task");
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classNames({
                active: activeTab === "task",
                "text-primary": activeTab === "task",
              })}
              onClick={() => setActiveTab("task")}
              style={{ cursor: "pointer" }}
            >
              <TbCircleCheck size={16} className="me-1" />
              Task List
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classNames({
                active: activeTab === "calendar",
                "text-primary": activeTab === "calendar",
              })}
              onClick={() => setActiveTab("calendar")}
              style={{ cursor: "pointer" }}
            >
              <TbCalendar size={16} className="me-1" />
              Calender View
            </NavLink>
          </NavItem>
        </Nav>
        <div>
          <button className="btn btn-primary">
            <TbCirclePlus size={18} className="me-1" />
            Create Task
          </button>
        </div>
      </div>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="task">{activeTab === "task" && <TasksTab />}</TabPane>
        <TabPane tabId="calendar">
          {activeTab === "calendar" && <CalendarViewTab />}
        </TabPane>
      </TabContent>
    </div>
  );
};

export default TasksAndCalendarTabs;
