import { useGetMyTasksQuery } from "@/Redux/Reducers/CommonComponents/MyTask/MyTasksApi";
import { TaskProps } from "@/Types/CommonComponents/MyTask/MyTaskTypes";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
} from "reactstrap";

const MyTask: React.FC = () => {
  const {
    data: myTasksData,
    isLoading,
    isError,
  } = useGetMyTasksQuery(undefined);
  const [filteredTasks, setFilteredTasks] = useState<TaskProps[]>([]);
  const [allTasks, setAllTasks] = useState<TaskProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(10);

  // Map API response to TaskProps shape when data arrives
  useEffect(() => {
    if (myTasksData && Array.isArray((myTasksData as any).results)) {
      const mapped: TaskProps[] = (myTasksData as any).results.map(
        (item: any) => {
          // Normalize task_priority into a human friendly label
          const rawPriority = (item.task_priority || "").toString();
          let mappedPriority = "Normal";
          switch (rawPriority.toUpperCase()) {
            case "LOW":
              mappedPriority = "Low";
              break;
            case "NORMAL":
            case "MEDIUM":
              mappedPriority = "Normal";
              break;
            case "HIGH":
              mappedPriority = "High";
              break;
            case "URGENT":
              mappedPriority = "Urgent";
              break;
            default:
              if (rawPriority) mappedPriority = rawPriority;
              break;
          }

          // Use created_at as dueDate (format DD/MM/YYYY)
          const created = item.created_at
            ? new Date(item.created_at)
            : new Date();
          const dueDate = `${String(created.getDate()).padStart(
            2,
            "0"
          )}/${String(created.getMonth() + 1).padStart(
            2,
            "0"
          )}/${created.getFullYear()}`;

          return {
            id: item.alias,
            date: created.toLocaleString(),
            caseName: item.case_name || "",
            clientName: item.client_name || "",
            company: item.lender || "",
            taskName: item.name || "",
            caseStage: item.case_stage || "",
            assignedTo: item.assigned_to || "",
            task_priority: mappedPriority as TaskProps["task_priority"],
            status: (item.status as TaskProps["status"]) || "Unknown",
            dueDate,
          } as TaskProps;
        }
      );

      setAllTasks(mapped);
      setFilteredTasks(mapped);
    } else {
      setAllTasks([]);
      setFilteredTasks([]);
    }
    setCurrentPage(1);
  }, [myTasksData]);

  // No client-side filtering: show all tasks returned by the API (filteredTasks is set from API mapping)

  // Pagination
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  // No client-side filter change handler: filtering was removed

  const getPriorityBadgeColor = (task_priority: string) => {
    switch (task_priority) {
      case "Urgent":
        return "danger";
      case "High":
        return "warning";
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
      case "In Progress":
        return "info";
      case "Cancelled":
        return "secondary";
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
            <Col md="6" xs="12">
              <InputGroup>
                <Input
                  type="text"
                  placeholder="Search tasks, clients, or case names..."
                  style={{ padding: "10px 10px" }}
                  // search is currently not connected to client-side filtering
                />
                <InputGroupText className="bg-success rounded-start-0 border-start-0">
                  <FaSearch />
                </InputGroupText>
              </InputGroup>
            </Col>
            {/* filter button removed */}
          </Row>
        </CardHeader>

        <CardBody className="p-2 m-0">
          {/* Conditional Filters Section */}
          {/* Client-side filtering removed */}

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
                  <th>Case Stage</th>
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
                        <Badge color="light-primary" className="px-2">
                          {task.caseStage}
                        </Badge>
                      </td>
                      <td>
                        <p className="m-0">{task.assignedTo}</p>
                      </td>
                      <td>
                        <Badge
                          color={getPriorityBadgeColor(task.task_priority)}
                          className="px-2"
                        >
                          {task.task_priority}
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
