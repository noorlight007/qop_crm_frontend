import React from "react";
import {
  FaBriefcase,
  FaCalendar,
  FaExclamationTriangle,
  FaFilter,
  FaRegClock,
  FaUser,
  FaUserTimes,
} from "react-icons/fa";
import { TbBriefcaseOff } from "react-icons/tb";
import {
  Badge,
  Button,
  Card,
  Col,
  Input,
  Nav,
  NavItem,
  NavLink,
  Row,
} from "reactstrap";

const TasksTab: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("All");
  const [categoryFilter, setCategoryFilter] = React.useState("All Categories");
  const [statusFilter, setStatusFilter] = React.useState("All Status");

  // Sample tasks based on the uploaded image
  const tasks = [
    {
      title: "Call new lead within 24 hrs",
      status: "Auto",
      description:
        "Initial contact with Sarah Johnson regarding mortgage application",
      dueDate: "12 Jan, 10:00",
      assignee: "Sarah Johnson",
      category: "First-Time Buyer Mortgage",
      priority: "High",
      type: "To Do",
    },
    {
      title: "Follow up after DIP submission",
      status: "Auto",
      description: "Check status of Decision in Principle for Michael Chen",
      dueDate: "13 Jan, 14:00",
      assignee: "Michael Chen",
      category: "Remortgage Application",
      priority: "Medium",
      type: "In Progress",
    },
    {
      title: "Send mortgage offer to client",
      status: "Auto",
      description: "Forward mortgage offer documents to Emma Thompson",
      dueDate: "12 Jan, 16:00",
      assignee: "Emma Thompson",
      category: "Buy-to-Let Mortgage",
      priority: "High",
      type: "To Do",
    },
    {
      title: "Annual mortgage review",
      status: "Auto",
      description: "Conduct annual review for David Brown's mortgage",
      dueDate: "15 Jan, 10:00",
      assignee: "David Brown",
      category: "Annual Review",
      priority: "Medium",
      type: "To Do",
    },
    {
      title: "Protection-upsell discussion",
      status: "",
      description: "Discuss life insurance and income protection options",
      dueDate: "10 Jan, 11:00",
      assignee: "Sarah Johnson",
      category: "",
      priority: "Low",
      type: "Done",
    },
    {
      title: "Compliance documentation review",
      status: "",
      description: "Review and validate compliance documents for Q4",
      dueDate: "9 Jan, 17:00",
      assignee: "",
      category: "",
      priority: "High",
      type: "To Do",
    },
  ];

  // Filter tasks based on active tab
  const filteredByTab = tasks.filter((task) => {
    if (activeTab === "All") return true;
    if (activeTab === "Due Today") {
      // This would need actual date comparison in a real app
      return task.dueDate.includes("12 Jan");
    }
    if (activeTab === "Upcoming") {
      // This would need actual date comparison in a real app
      return task.dueDate.includes("13 Jan") || task.dueDate.includes("15 Jan");
    }
    if (activeTab === "Overdue") {
      // This would need actual date comparison in a real app
      return task.dueDate.includes("9 Jan") || task.dueDate.includes("10 Jan");
    }
    return true;
  });

  // Further filter by category and status
  const filteredTasks = filteredByTab.filter((task) => {
    const categoryMatch =
      categoryFilter === "All Categories" ||
      task.category === categoryFilter ||
      (categoryFilter === "No Category" && !task.category);

    const statusMatch =
      statusFilter === "All Status" || task.type === statusFilter;

    return categoryMatch && statusMatch;
  });

  return (
    <Row>
      <Col>
        <Card className="px-3 pt-3">
          {/* New Filter Header */}
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <Nav tabs className="nav-primary border-0" pills>
              <NavItem>
                <NavLink
                  active={activeTab === "All"}
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveTab("All")}
                  className="py-2 px-3"
                >
                  <FaFilter size={14} className="me-1" />
                  All Tasks
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === "Due Today"}
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveTab("Due Today")}
                  className="py-2 px-3"
                >
                  <FaCalendar size={14} className="me-1" />
                  Due Today
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === "Upcoming"}
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveTab("Upcoming")}
                  className="py-2 px-3"
                >
                  <FaRegClock size={14} className="me-1" />
                  Upcoming
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === "Overdue"}
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveTab("Overdue")}
                  className="py-2 px-3"
                >
                  <FaExclamationTriangle size={14} className="me-1" />
                  Overdue
                </NavLink>
              </NavItem>
            </Nav>

            <div className="d-flex gap-2">
              <Input
                type="select"
                className="form-select-sm"
                style={{ width: "200px", cursor: "pointer" }}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option>All Categories</option>
                <option>First-Time Buyer Mortgage</option>
                <option>Remortgage Application</option>
                <option>Buy-to-Let Mortgage</option>
                <option>Annual Review</option>
                <option>No Category</option>
              </Input>

              <Input
                type="select"
                className="form-select-sm"
                style={{ width: "150px", cursor: "pointer" }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Status</option>
                <option>Done</option>
                <option>To Do</option>
                <option>In Progress</option>
              </Input>
            </div>
          </div>

          {/* Task Cards */}
          <Row>
            {filteredTasks.map((task, index) => (
              <Col md="12" key={index}>
                <Card className="p-3 shadow rounded-3">
                  <Row>
                    <Col md="10">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          className="form-check-input border-primary rounded-circle"
                          aria-label="Task Checkbox"
                        />
                        <h5 className="mb-0">{task.title}</h5>{" "}
                        <Badge className="bg-light-dark">{task.status}</Badge>
                      </div>
                      <p className="text-muted small mb-2">
                        {task.description}
                      </p>
                      <div className="d-flex flex-wrap gap-3 text-muted small">
                        <div>
                          <FaCalendar className="me-1" />
                          <strong>{task.dueDate}</strong>
                        </div>
                        <div>
                          {task.assignee ? (
                            <>
                              <FaUser className="me-1" />
                              <strong>{task.assignee}</strong>
                            </>
                          ) : (
                            <span className="text-secondary">
                              <FaUserTimes className="me-1" />
                              Unassigned
                            </span>
                          )}
                        </div>
                        <div>
                          {task.category ? (
                            <>
                              <FaBriefcase className="me-1" />
                              <strong>{task.category}</strong>
                            </>
                          ) : (
                            <span className="text-secondary">
                              <TbBriefcaseOff className="me-1" />
                              No Category
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        <div>
                          <Badge
                            className={
                              task.priority === "High"
                                ? "bg-light-danger"
                                : task.priority === "Medium"
                                ? "bg-light-warning"
                                : "bg-light-secondary"
                            }
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <div>
                          <Badge
                            className={
                              task.type === "To Do"
                                ? "bg-light-primary"
                                : task.type === "In Progress"
                                ? "bg-light-info"
                                : "bg-light-success"
                            }
                          >
                            {task.type}
                          </Badge>
                        </div>
                      </div>
                    </Col>
                    <Col
                      md="2"
                      className="d-flex align-items-start justify-content-end"
                    >
                      <Button outline className="border-0" color="danger">
                        <i className="fa-solid fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default TasksTab;
