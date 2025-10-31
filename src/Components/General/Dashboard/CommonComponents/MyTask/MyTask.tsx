import { TaskProps } from "@/Types/CommonComponents/MyTask/MyTaskTypes";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
} from "reactstrap";

const MyTask: React.FC = () => {
  const [tasks, setTasks] = useState<TaskProps[]>([
    {
      id: "1",
      date: "28/07/2019 00:00",
      caseName: "APP0004972",
      clientName: "Sundararajan Sunassee",
      company: "The Mortgage Works",
      taskName: "Confirm Solicitors have Received Offer",
      priority: "Low",
      status: "Overdue",
      assignedTo: "Mostafizur Rahman",
      taskType: "Legal",
      dueDate: "30/07/2019",
    },
    {
      id: "2",
      date: "31/07/2019 00:00",
      caseName: "APP0004312",
      clientName: "Ismail Matin",
      company: "Barclays",
      taskName: "Application Completed",
      priority: "Normal",
      status: "Overdue",
      assignedTo: "Mostafizur Rahman",
      taskType: "Application",
      dueDate: "02/08/2019",
    },
    // Add more sample data as needed
  ]);

  const [filteredTasks, setFilteredTasks] = useState<TaskProps[]>(tasks);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(10);
  const [filters, setFilters] = useState({
    assignedTo: "All",
    taskType: "All",
    priority: "All",
    searchTerm: "",
    dueDateFrom: "",
    dueDateTo: "",
    status: "All",
  });
  const [filterIcon, setFilterIcon] = useState(false);

  const toggleFilterIcon = () => setFilterIcon(!filterIcon);

  // Filter tasks based on current filters
  React.useEffect(() => {
    let filtered = tasks.filter((task) => {
      const matchesAssignedTo =
        filters.assignedTo === "All" || task.assignedTo === filters.assignedTo;
      const matchesTaskType =
        filters.taskType === "All" || task.taskType === filters.taskType;
      const matchesPriority =
        filters.priority === "All" || task.priority === filters.priority;
      const matchesStatus =
        filters.status === "All" || task.status === filters.status;
      const matchesSearch =
        task.taskName
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        task.clientName
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        task.caseName.toLowerCase().includes(filters.searchTerm.toLowerCase());

      // Date range filtering
      let matchesDateRange = true;
      if (filters.dueDateFrom || filters.dueDateTo) {
        const taskDueDate = new Date(
          task.dueDate.split("/").reverse().join("-")
        ); // Convert DD/MM/YYYY to YYYY-MM-DD

        if (filters.dueDateFrom) {
          const fromDate = new Date(filters.dueDateFrom);
          matchesDateRange = matchesDateRange && taskDueDate >= fromDate;
        }

        if (filters.dueDateTo) {
          const toDate = new Date(filters.dueDateTo);
          matchesDateRange = matchesDateRange && taskDueDate <= toDate;
        }
      }

      return (
        matchesAssignedTo &&
        matchesTaskType &&
        matchesPriority &&
        matchesStatus &&
        matchesSearch &&
        matchesDateRange
      );
    });

    setFilteredTasks(filtered);
    setCurrentPage(1);
  }, [tasks, filters]);

  // Pagination
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "danger";
      case "Normal":
        return "info";
      case "Low":
        return "primary";
      default:
        return "secondary";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Pending":
        return "warning";
      case "Overdue":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <>
      <Card className="mt-4">
        <CardHeader>
          <Row className="d-flex justify-content-between py-1">
            <Col md="3" xs="12">
              <div className="d-flex align-items-center">
                <i className="fa fa-tasks me-2"></i>
                <h5 className="mb-0">My Tasks</h5>
              </div>
            </Col>
            <Col md={6} xs="12">
              <InputGroup>
                <Input
                  type="text"
                  placeholder="Search tasks, clients, or case names..."
                  style={{ padding: "10px 10px" }}
                  value={filters.searchTerm}
                  onChange={(e) =>
                    handleFilterChange("searchTerm", e.target.value)
                  }
                />
                <InputGroupText className="bg-success rounded-start-0 border-start-0">
                  <FaSearch />
                </InputGroupText>
              </InputGroup>
            </Col>
          </Row>
        </CardHeader>

        <CardBody className="p-2 m-0">
          {/* Conditional Filters Section */}
          {filterIcon && (
            <Card className="shadow-lg bg-light-success rounded-3 p-3 mt-3 mb-3">
              <Row className="justify-content-center g-3">
                <Col xs="12" sm="6" md="3">
                  <Label>Assigned To</Label>
                  <Input
                    type="select"
                    id="assignedTo"
                    className="py-1"
                    value={filters.assignedTo}
                    onChange={(e) =>
                      handleFilterChange("assignedTo", e.target.value)
                    }
                  >
                    <option value="All">All Employees</option>
                    <option value="Mostafizur Rahman">Mostafizur Rahman</option>
                    <option value="John Doe">John Doe</option>
                  </Input>
                </Col>
                <Col xs="12" sm="6" md="3">
                  <Label>Task Type</Label>
                  <Input
                    type="select"
                    id="taskType"
                    className="py-1"
                    value={filters.taskType}
                    onChange={(e) =>
                      handleFilterChange("taskType", e.target.value)
                    }
                  >
                    <option value="All">All Types</option>
                    <option value="Legal">Legal</option>
                    <option value="Application">Application</option>
                    <option value="Follow-up">Follow-up</option>
                  </Input>
                </Col>
                <Col xs="12" sm="6" md="3">
                  <Label>Priority</Label>
                  <Input
                    type="select"
                    id="priority"
                    className="py-1"
                    value={filters.priority}
                    onChange={(e) =>
                      handleFilterChange("priority", e.target.value)
                    }
                  >
                    <option value="All">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                  </Input>
                </Col>
                <Col xs="12" sm="6" md="3">
                  <Label>Task Name</Label>
                  <Input
                    type="text"
                    id="taskNameFilter"
                    className="py-2"
                    placeholder="Search task name..."
                    value={filters.searchTerm}
                    onChange={(e) =>
                      handleFilterChange("searchTerm", e.target.value)
                    }
                  />
                </Col>
              </Row>
              <Row className="justify-content-center g-3 mt-2">
                <Col xs="12" sm="6" md="3">
                  <Label>Due Date From</Label>
                  <Input
                    type="date"
                    id="dueDateFrom"
                    className="py-2"
                    value={filters.dueDateFrom}
                    onChange={(e) =>
                      handleFilterChange("dueDateFrom", e.target.value)
                    }
                  />
                </Col>
                <Col xs="12" sm="6" md="3">
                  <Label>Due Date To</Label>
                  <Input
                    type="date"
                    id="dueDateTo"
                    className="py-2"
                    value={filters.dueDateTo}
                    onChange={(e) =>
                      handleFilterChange("dueDateTo", e.target.value)
                    }
                  />
                </Col>
                <Col xs="12" sm="6" md="3">
                  <Label>Status</Label>
                  <Input
                    type="select"
                    id="status"
                    className="py-1"
                    value={filters.status || "All"}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Overdue">Overdue</option>
                  </Input>
                </Col>
                <Col xs="12" sm="6" md="3">
                  <Label>Clear All Filters</Label>
                  <Button
                    outline
                    className="btn btn-outline-danger w-100 d-flex justify-content-center align-items-center gap-1"
                    onClick={() => {
                      setFilters({
                        assignedTo: "All",
                        taskType: "All",
                        priority: "All",
                        searchTerm: "",
                        dueDateFrom: "",
                        dueDateTo: "",
                        status: "All",
                      });
                      setCurrentPage(1);
                    }}
                  >
                    Clear<i className="fa-solid fa-xmark"></i>
                  </Button>
                </Col>
              </Row>
            </Card>
          )}

          {/* Tasks List */}
          <Row>
            <Table hover responsive className="mt-3">
              <thead className="thead-light text-center">
                <tr>
                  <th>Date & Time</th>
                  <th>Case Name</th>
                  <th>Client Name</th>
                  <th>Lender</th>
                  <th>Task Name</th>
                  <th>Task Type</th>
                  <th>Assigned To</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {currentTasks.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center p-4">
                      <p className="text-muted mb-0">
                        No tasks found matching your criteria.
                      </p>
                    </td>
                  </tr>
                ) : (
                  currentTasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.date}</td>
                      <td>
                        <span className="text-primary fw-bold">
                          {task.caseName}
                        </span>
                      </td>
                      <td>
                        <span className="text-dark">{task.clientName}</span>
                      </td>
                      <td>
                        <span className="text-muted">{task.company}</span>
                      </td>
                      <td>
                        <span className="fw-bold text-start">
                          {task.taskName}
                        </span>
                      </td>
                      <td>
                        <Badge color="info" className="px-2">
                          {task.taskType}
                        </Badge>
                      </td>
                      <td>
                        <p className="m-0">{task.assignedTo}</p>
                      </td>
                      <td>
                        <Badge
                          color={getPriorityBadgeColor(task.priority)}
                          className="px-2"
                        >
                          {task.priority}
                        </Badge>
                      </td>
                      <td>
                        <Badge
                          color={getStatusBadgeColor(task.status)}
                          className="px-2"
                        >
                          {task.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Row>

          {/* Pagination */}
          <Row>
            <div className="d-flex justify-content-between px-4 py-3">
              <div>
                <p className="text-success">
                  Showing {indexOfFirstTask + 1} to{" "}
                  {Math.min(indexOfLastTask, filteredTasks.length)} of{" "}
                  {filteredTasks.length} tasks
                </p>
              </div>
              <Pagination>
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink first onClick={() => setCurrentPage(1)} />
                </PaginationItem>
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink
                    previous
                    onClick={() => setCurrentPage(currentPage - 1)}
                  />
                </PaginationItem>

                {/* Generate visible page numbers */}
                {(() => {
                  const pages = [];
                  const total = totalPages;
                  const currentPageNumber = currentPage;

                  let start = Math.max(2, currentPageNumber - 2);
                  let end = Math.min(total - 1, currentPageNumber + 2);

                  // Always show page 1
                  if (total >= 1) {
                    pages.push(
                      <PaginationItem key={1} active={currentPageNumber === 1}>
                        <PaginationLink onClick={() => setCurrentPage(1)}>
                          1
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  // Add ellipsis if needed before middle pages
                  if (start > 2) {
                    pages.push(
                      <PaginationItem key="ellipsis-start" disabled>
                        <PaginationLink>...</PaginationLink>
                      </PaginationItem>
                    );
                  }

                  // Show middle pages
                  for (let i = start; i <= end; i++) {
                    pages.push(
                      <PaginationItem key={i} active={currentPageNumber === i}>
                        <PaginationLink onClick={() => setCurrentPage(i)}>
                          {i}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  // Add ellipsis if needed after middle pages
                  if (end < total - 1) {
                    pages.push(
                      <PaginationItem key="ellipsis-end" disabled>
                        <PaginationLink>...</PaginationLink>
                      </PaginationItem>
                    );
                  }

                  // Always show last page
                  if (total > 1) {
                    pages.push(
                      <PaginationItem
                        key={total}
                        active={currentPageNumber === total}
                      >
                        <PaginationLink onClick={() => setCurrentPage(total)}>
                          {total}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  return pages;
                })()}

                <PaginationItem disabled={currentPage === totalPages}>
                  <PaginationLink
                    next
                    onClick={() => setCurrentPage(currentPage + 1)}
                  />
                </PaginationItem>
                <PaginationItem disabled={currentPage === totalPages}>
                  <PaginationLink
                    last
                    onClick={() => setCurrentPage(totalPages)}
                  />
                </PaginationItem>
              </Pagination>
            </div>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

export default MyTask;
