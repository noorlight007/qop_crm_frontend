import LoadingSpinner from "@/app/loading";
import { useGetUsersQuery } from "@/Redux/Reducers/Common/CommonUsers/UsersApi";
import { useGetMyTasksQuery } from "@/Redux/Reducers/Common/MyTasks/MyTasksApi";
import { MyTaskProps } from "@/Types/Common/MyTask/MyTaskTypes";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import { useEffect, useState } from "react";
import { FaInfoCircle, FaSearch } from "react-icons/fa";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  InputGroup,
  Label,
  Pagination,
  PaginationItem,
  PaginationLink,
  PopoverBody,
  Row,
  Table,
  UncontrolledPopover,
} from "reactstrap";

const MyTasks: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(12);

  // Filters state (all server-side)
  const [filters, setFilters] = useState({
    task_assigned_to: "",
    current_case_stage: "",
    task_priority: "",
    searchTerm: "",
    dueDateFrom: "",
    dueDateTo: "",
    status: "",
  });

  // Local search debouncing to avoid firing API on each keystroke
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Build params for API call, omitting empty strings
  const buildApiParams = () => {
    const p: any = {
      page: currentPage,
    };

    if (filters.task_assigned_to) p.task_assigned_to = filters.task_assigned_to;
    if (filters.current_case_stage)
      p.current_case_stage = filters.current_case_stage;
    if (filters.task_priority) p.task_priority = filters.task_priority;
    if (filters.status) p.status = filters.status;
    if (debouncedSearch) p.search = debouncedSearch;
    if (filters.dueDateFrom) p.due_date__gte = filters.dueDateFrom;
    if (filters.dueDateTo) p.due_date__lte = filters.dueDateTo;

    return p;
  };

  const apiParams = buildApiParams();

  // RTK Hooks
  const { data: myTasksData, isLoading } = useGetMyTasksQuery(apiParams);
  const { data: usersData, isLoading: isUsersLoading } =
    useGetUsersQuery(undefined);

  const [filteredTasks, setFilteredTasks] = useState<MyTaskProps[]>([]);
  const [allTasks, setAllTasks] = useState<MyTaskProps[]>([]);
  const [filterIcon, setFilterIcon] = useState(false);
  const [dateError, setDateError] = useState<string>("");

  const toggleFilterIcon = () => setFilterIcon(!filterIcon);

  // Map API response to MyTaskProps shape when data arrives
  useEffect(() => {
    if (myTasksData && Array.isArray((myTasksData as any).results)) {
      const mapped: MyTaskProps[] = (myTasksData as any).results.map(
        (item: any) => {
          // Normalize task_priority into a human friendly label
          const rawPriority = (item.task_priority || "").toString();
          let mappedPriority = "Normal";
          switch (rawPriority.toUpperCase()) {
            case "Low":
              mappedPriority = "Low";
              break;
            case "Normal":
              mappedPriority = "Normal";
              break;
            case "Medium":
              mappedPriority = "Medium";
              break;
            case "High":
              mappedPriority = "High";
              break;
            case "Urgent":
              mappedPriority = "Urgent";
              break;
            default:
              if (rawPriority) mappedPriority = rawPriority;
              break;
          }

          return {
            alias: item.alias,
            created_at: item.created_at,
            current_case_name: item.current_case_name || "",
            customer_name: item.customer_name || "",
            current_case_lender: item.current_case_lender || "",
            current_case_workflow: item.current_case_workflow || "",
            name: item.name || "",
            current_case_stage: item.current_case_stage || "",
            case_assigned_to: item.case_assigned_to || "",
            task_assigned_to: item.task_assigned_to || "",
            task_priority: mappedPriority as MyTaskProps["task_priority"],
            status: (item.status as MyTaskProps["status"]) || "Unknown",
            created_by: item.created_by || "",
          } as MyTaskProps;
        },
      );
      // For server-side pagination, the API already returns only the current page results
      setAllTasks(mapped);
      setFilteredTasks(mapped);
    } else {
      setAllTasks([]);
      setFilteredTasks([]);
    }
  }, [myTasksData]);

  // Debounce searchTerm -> debouncedSearch
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.searchTerm), 500);
    return () => clearTimeout(t);
  }, [filters.searchTerm]);

  // When filter params (excluding page) change, reset to page 1 so we request from start
  useEffect(() => {
    // If currentPage is already 1, no change; otherwise set to 1 to fetch the first page
    if (currentPage !== 1) setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.task_assigned_to,
    filters.current_case_stage,
    filters.task_priority,
    filters.dueDateFrom,
    filters.dueDateTo,
    filters.status,
    debouncedSearch,
  ]);

  // Pagination
  const totalCount =
    (myTasksData && (myTasksData as any).count) || filteredTasks.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / tasksPerPage));
  const currentTasks = filteredTasks; // API returns only current page results
  const indexOfFirstTask =
    totalCount === 0 ? 0 : (currentPage - 1) * tasksPerPage + 1;
  const indexOfLastTask = Math.min(currentPage * tasksPerPage, totalCount);

  // If the backend reports fewer pages than the current page (e.g. after deletions), clamp it
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Handlers
  const onFilterChange = (key: string, value: string) => {
    // If changing date fields, ensure Due Date From is not after Due Date To
    if (key === "dueDateFrom") {
      setFilters((prev) => {
        const newFrom = value;
        const existingTo = prev.dueDateTo;

        if (existingTo && new Date(newFrom) > new Date(existingTo)) {
          // Auto-clamp: set both to newFrom so from <= to
          setDateError(
            "Due Date From was after Due Date To — adjusted to match.",
          );
          return { ...prev, dueDateFrom: newFrom, dueDateTo: newFrom };
        }

        // No conflict
        return { ...prev, dueDateFrom: newFrom };
      });
      return;
    }

    if (key === "dueDateTo") {
      setFilters((prev) => {
        const newTo = value;
        const existingFrom = prev.dueDateFrom;

        if (existingFrom && new Date(newTo) < new Date(existingFrom)) {
          // Auto-clamp: set both to newTo so from <= to
          setDateError(
            "Due Date To was before Due Date From — adjusted to match.",
          );
          return { ...prev, dueDateFrom: newTo, dueDateTo: newTo };
        }

        // No conflict
        return { ...prev, dueDateTo: newTo };
      });
      return;
    }

    // Other filters
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

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
            <Col md="3" xs="12">
              <InputGroup className="position-relative">
                <FaSearch
                  className="position-absolute top-50 start-0 translate-middle-y ms-2 text-primary"
                  style={{ zIndex: 10, pointerEvents: "none" }}
                />
                <Input
                  type="text"
                  placeholder="Search by tasks names..."
                  style={{ padding: "10px 10px 10px 25px" }}
                  value={filters.searchTerm}
                  onChange={(e) => onFilterChange("searchTerm", e.target.value)}
                  className="rounded-end-1"
                />
                <FaInfoCircle
                  id="MyTaskSearchSuggestion"
                  className="position-absolute top-50 end-0 translate-middle-y me-2 text-primary fs-6"
                  style={{ cursor: "pointer", zIndex: 10 }}
                />

                <UncontrolledPopover
                  placement="right"
                  target="MyTaskSearchSuggestion"
                  trigger="hover"
                >
                  <PopoverBody className="bg-white rounded text-dark p-3 small">
                    🔍 You can search using Client Name, Task Name, Case ID.
                  </PopoverBody>
                </UncontrolledPopover>
              </InputGroup>
            </Col>
            <Col md="2" xs="12" className="d-flex justify-content-end">
              <Button
                color="secondary"
                onClick={toggleFilterIcon}
                className="me-2"
              >
                {filterIcon ? (
                  <i className="fa-solid fa-filter-circle-xmark"></i>
                ) : (
                  <i className="fa-solid fa-filter"></i>
                )}
              </Button>
            </Col>
          </Row>
        </CardHeader>

        <CardBody className="p-2 m-0">
          {/* Conditional Filters Section */}
          {filterIcon && (
            <Card className="shadow-lg bg-light-secondary rounded-3 p-3 mt-3 mb-3">
              <Row className="justify-content-start g-3">
                <Col xs="12" sm="6" md="3">
                  <Label>Task Assigned To</Label>
                  <Input
                    type="select"
                    id="task_assigned_to"
                    className="py-1"
                    value={filters.task_assigned_to}
                    onChange={(e) =>
                      onFilterChange("task_assigned_to", e.target.value)
                    }
                  >
                    <option value="">All Employees</option>
                    {isUsersLoading
                      ? "Loading..."
                      : usersData?.map((user: any) => (
                          <option key={user.id} value={user.id}>
                            {user.name}
                          </option>
                        ))}
                  </Input>
                </Col>
                <Col xs="12" sm="6" md="3">
                  <Label>Case Stage</Label>
                  <Input
                    type="select"
                    id="current_case_stage"
                    className="py-1"
                    value={filters.current_case_stage}
                    onChange={(e) =>
                      onFilterChange("current_case_stage", e.target.value)
                    }
                  >
                    <option value="">All Stages</option>
                    <option value="ENQUIRY">Enquiry</option>
                    <option value="FACT_FIND">Fact Find</option>
                    <option value="RESEARCH_COMPLIANCE_CHECK">
                      Research and Compliance Check
                    </option>
                    <option value="DECISION_IN_PRINCIPLE">
                      Decision in Principle
                    </option>
                    <option value="FULL_MORTGAGE_APPLICATION">
                      Full Mortgage Application
                    </option>
                    <option value="OFFER_FROM_BANK">Offer From Bank</option>
                    <option value="LEGAL">Legal</option>
                    <option value="COMPLETION">Completion</option>
                    <option value="FUTURE_OPPORTUNITY">
                      Future Opportunity
                    </option>
                    <option value="NOT_PROCEED">Not Proceed</option>
                  </Input>
                </Col>
                <Col xs="12" sm="6" md="3">
                  <Label>Priority</Label>
                  <Input
                    type="select"
                    id="task_priority"
                    className="py-1"
                    value={filters.task_priority}
                    onChange={(e) =>
                      onFilterChange("task_priority", e.target.value)
                    }
                  >
                    <option value="">All Priorities</option>
                    <option value="LOW">Low</option>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </Input>
                </Col>
                <Col xs="12" sm="6" md="3">
                  <Label>Due Date From</Label>
                  <Input
                    type="date"
                    id="dueDateFrom"
                    className="py-2"
                    value={filters.dueDateFrom}
                    onChange={(e) =>
                      onFilterChange("dueDateFrom", e.target.value)
                    }
                    max={filters.dueDateTo || undefined}
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
                      onFilterChange("dueDateTo", e.target.value)
                    }
                    min={filters.dueDateFrom || undefined}
                  />
                  {dateError && (
                    <small className="text-danger d-block mt-1">
                      {dateError}
                    </small>
                  )}
                </Col>
                <Col xs="12" sm="6" md="3">
                  <Label>Status</Label>
                  <Input
                    type="select"
                    id="status"
                    className="py-1"
                    value={filters.status}
                    onChange={(e) => onFilterChange("status", e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="OVERDUE">Overdue</option>
                    <option value="CANCELLED">Cancelled</option>
                  </Input>
                </Col>
                <Col xs="12" sm="6" md="3">
                  <Label>Clear All Filters</Label>
                  <Button
                    outline
                    color="danger"
                    className="w-100 d-flex justify-content-center align-items-center gap-1"
                    onClick={() => {
                      setFilters({
                        task_assigned_to: "",
                        current_case_stage: "",
                        task_priority: "",
                        searchTerm: "",
                        dueDateFrom: "",
                        dueDateTo: "",
                        status: "",
                      });
                      setDebouncedSearch("");
                      setCurrentPage(1);
                      setDateError("");
                    }}
                  >
                    <i className="fa-solid fa-xmark"></i>Clear
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
                  <th>Priority</th>
                  <th className="text-truncate">Created By</th>
                  <th>Status</th>
                  <th className="text-truncate">Date & Time</th>
                  <th>Case ID</th>
                  <th>Applicant Name</th>
                  <th>Lender</th>
                  <th>Workflow</th>
                  <th>Task Name</th>
                  <th>Case Stage</th>
                  <th>Case Assigned</th>
                  <th>Task Assigned</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {isLoading ? (
                  <tr>
                    <td colSpan={12} className="text-center p-4">
                      <LoadingSpinner />
                    </td>
                  </tr>
                ) : currentTasks.length > 0 ? (
                  currentTasks.map((task) => (
                    <tr key={task.alias}>
                      <td>
                        <Badge
                          color={getPriorityBadgeColor(task.task_priority)}
                          className="px-2"
                        >
                          {task.task_priority || "-"}
                        </Badge>
                      </td>
                      <td>{task.created_by || "-"}</td>
                      <td>
                        <Badge
                          color={getStatusBadgeColor(task.status)}
                          className="px-2"
                        >
                          {task.status || "-"}
                        </Badge>
                      </td>
                      <td>{formatDateAndTime(task.created_at)}</td>
                      <td>
                        <span className="text-truncate">
                          {task.current_case_name || "-"}
                        </span>
                      </td>
                      <td>
                        <span className="text-truncate">
                          {task.customer_name || "-"}
                        </span>
                      </td>
                      <td>
                        <span>{task.current_case_lender || "-"}</span>
                      </td>
                      <td>
                        <span>{task.current_case_workflow || "-"}</span>
                      </td>
                      <td>
                        <span className="text-start">{task.name || "-"}</span>
                      </td>
                      <td>
                        <Badge color="light-primary" className="px-2">
                          {task.current_case_stage || "-"}
                        </Badge>
                      </td>
                      <td className="text-truncate">
                        <p className="m-0">{task.case_assigned_to || "-"}</p>
                      </td>
                      <td className="text-truncate">
                        <p className="m-0">{task.task_assigned_to || "-"}</p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={12} className="text-center p-4">
                      No tasks found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Row>

          {/* Pagination */}
          <Row>
            <div className="d-flex justify-content-between px-4 py-3">
              <div>
                <p className="text-primary">
                  Showing {indexOfFirstTask} to {indexOfLastTask} of{" "}
                  {totalCount} tasks
                </p>
              </div>
              <Pagination>
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink first onClick={() => setCurrentPage(1)} />
                </PaginationItem>
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink
                    previous
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                      </PaginationItem>,
                    );
                  }

                  // Add ellipsis if needed before middle pages
                  if (start > 2) {
                    pages.push(
                      <PaginationItem key="ellipsis-start" disabled>
                        <PaginationLink>...</PaginationLink>
                      </PaginationItem>,
                    );
                  }

                  // Show middle pages
                  for (let i = start; i <= end; i++) {
                    pages.push(
                      <PaginationItem key={i} active={currentPageNumber === i}>
                        <PaginationLink onClick={() => setCurrentPage(i)}>
                          {i}
                        </PaginationLink>
                      </PaginationItem>,
                    );
                  }

                  // Add ellipsis if needed after middle pages
                  if (end < total - 1) {
                    pages.push(
                      <PaginationItem key="ellipsis-end" disabled>
                        <PaginationLink>...</PaginationLink>
                      </PaginationItem>,
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
                      </PaginationItem>,
                    );
                  }

                  return pages;
                })()}

                <PaginationItem disabled={currentPage === totalPages}>
                  <PaginationLink
                    next
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
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

export default MyTasks;
