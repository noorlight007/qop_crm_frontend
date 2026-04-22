import { LoadingSpinner2 } from "@/app/loading";
import { useGetTasksQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Notes/TasksApi";
import { TaskProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/NotesAndTaskTypes";
import { formatDate, formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import formatChoiceFieldValue from "@/utils/formatters";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Col,
  Container,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
} from "reactstrap";
import AddTaskModal from "./Modals/AddTaskModal";
import EditTaskModal from "./Modals/EditTaskModal";

const Tasks: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: session } = useSession();
  const { casealias } = useParams();
  const caseAlias = Array.isArray(casealias) ? casealias[0] : (casealias ?? "");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number | undefined>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<TaskProps | null>(null);

  const handleOpenEditTask = (task: TaskProps) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  //   rtk hook
  const { data: tasksData, isLoading } = useGetTasksQuery({
    case_alias: caseAlias,
    page,
  });

  useEffect(() => {
    setPage(1);
  }, [caseAlias]);

  useEffect(() => {
    const resultsLength =
      (tasksData as any)?.results?.length ??
      (Array.isArray(tasksData) ? tasksData.length : undefined);
    if (resultsLength && !pageSize) setPageSize(resultsLength);
  }, [tasksData, pageSize]);

  const getBadgeColor = (priority: string | null | undefined) => {
    switch (priority) {
      case "LOW":
        return "dark";
      case "NORMAL":
        return "primary";
      case "HIGH":
        return "warning";
      case "URGENT":
        return "danger";
      default:
        return "info";
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-3">
        <Col className="text-end">
          {session?.user?.role !== "APPLICANT" && (
            <Button color="primary" onClick={() => setModalOpen(true)}>
              <i className="fa-solid fa-circle-plus"></i> Add New Task
            </Button>
          )}
        </Col>
      </Row>

      <div className="table-responsive">
        <Table hover responsive>
          <thead>
            <tr>
              <th>Action</th>
              <th>Priority</th>
              <th className="text-truncate">Created By</th>
              <th style={{ minWidth: "200px" }}>Task Name</th>
              <th>Activity Date</th>
              <th>Due Date</th>
              <th className="text-truncate">Current Case Stage</th>
              <th className="text-truncate">Case Assigned User</th>
              <th className="text-truncate">Task Assigned To</th>
              <th style={{ minWidth: "400px" }}>Information</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={10} className="text-center">
                  <LoadingSpinner2 />
                </td>
              </tr>
            ) : tasksData &&
              (tasksData.results?.length ?? (tasksData as any)?.length) > 0 ? (
              (tasksData.results ?? tasksData).map((task: TaskProps) => (
                <tr key={task?.alias}>
                  <td className="text-truncate">
                    <Button
                      size="sm"
                      color="outline-success"
                      onClick={() => handleOpenEditTask(task)}
                    >
                      <i className="fa-solid fa-pencil-alt me-1"></i>
                      <span>Edit</span>
                    </Button>
                  </td>
                  <td>
                    <Badge color={getBadgeColor(task?.task_priority)}>
                      {formatChoiceFieldValue(task?.task_priority || "-")}
                    </Badge>
                  </td>
                  <td>{task?.created_by ? task?.created_by : "Unknown"}</td>
                  <td>{task?.name || "-"}</td>
                  <td>{formatDateAndTime(task?.created_at || "-")}</td>
                  <td>{formatDate(task?.due_date || "-")}</td>
                  <td>
                    {formatChoiceFieldValue(task?.current_case_stage || "-")}
                  </td>
                  <td>
                    {task?.case_assigned_to
                      ? task?.case_assigned_to
                      : "Unknown"}
                  </td>
                  <td>
                    {task?.task_assigned_to
                      ? task?.task_assigned_to.name
                      : "Unknown"}
                  </td>
                  <td>
                    {task.note ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: task.note }}
                        style={{ wordBreak: "break-word", maxWidth: "400px" }}
                      />
                    ) : (
                      <span className="text-muted">
                        No Information Available. Because this task is created
                        by System.
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Row className="mt-3 align-items-center">
        <Col sm={6}>
          <div className="text-muted">
            Showing {(tasksData?.results ?? tasksData)?.length ?? 0} entries
            {tasksData && (tasksData as any).count
              ? ` of ${(tasksData as any).count}`
              : ""}
          </div>
        </Col>
        <Col sm={6} className="text-end">
          {tasksData && (tasksData as any).count ? (
            (() => {
              const count = (tasksData as any).count as number;
              const pageSizeInferred = pageSize ?? 1;
              const totalPages = Math.max(
                1,
                Math.ceil(count / pageSizeInferred),
              );
              const leadsPerPage = 5;
              return (
                <Pagination className="d-flex justify-content-end p-2">
                  <PaginationItem disabled={page === 1}>
                    <PaginationLink first onClick={() => setPage(1)} />
                  </PaginationItem>
                  <PaginationItem disabled={page === 1}>
                    <PaginationLink
                      previous
                      onClick={() => setPage(Math.max(1, page - 1))}
                    />
                  </PaginationItem>

                  {totalPages <= leadsPerPage ? (
                    Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNumber) => (
                        <PaginationItem
                          key={pageNumber}
                          active={pageNumber === page}
                        >
                          <PaginationLink onClick={() => setPage(pageNumber)}>
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )
                  ) : (
                    <>
                      <PaginationItem active={page === 1}>
                        <PaginationLink onClick={() => setPage(1)}>
                          1
                        </PaginationLink>
                      </PaginationItem>

                      {page > 3 && (
                        <PaginationItem disabled>
                          <PaginationLink>...</PaginationLink>
                        </PaginationItem>
                      )}

                      {Array.from({ length: 3 }, (_, i) => page - 1 + i)
                        .filter(
                          (pageNumber) =>
                            pageNumber > 1 && pageNumber < totalPages,
                        )
                        .map((pageNumber) => (
                          <PaginationItem
                            key={pageNumber}
                            active={pageNumber === page}
                          >
                            <PaginationLink onClick={() => setPage(pageNumber)}>
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                      {page < totalPages - 2 && (
                        <PaginationItem disabled>
                          <PaginationLink>...</PaginationLink>
                        </PaginationItem>
                      )}

                      <PaginationItem active={page === totalPages}>
                        <PaginationLink onClick={() => setPage(totalPages)}>
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem disabled={page === totalPages}>
                    <PaginationLink
                      next
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                    />
                  </PaginationItem>
                  <PaginationItem disabled={page === totalPages}>
                    <PaginationLink last onClick={() => setPage(totalPages)} />
                  </PaginationItem>
                </Pagination>
              );
            })()
          ) : (
            <div className="btn-group">
              <Button
                color="light"
                disabled={!tasksData || !(tasksData as any).previous}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button color="light" disabled>
                Page {page}
              </Button>
              <Button
                color="light"
                disabled={!tasksData || !(tasksData as any).next}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </Col>
      </Row>
      {/* modals  */}
      <AddTaskModal
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
      />
      <EditTaskModal
        isOpen={isEditModalOpen}
        toggle={() => setIsEditModalOpen(!isEditModalOpen)}
        selectedTask={selectedTask as TaskProps}
      />
    </Container>
  );
};

export default Tasks;
