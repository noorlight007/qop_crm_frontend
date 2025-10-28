import { useGetTasksQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Notes/TasksApi";
import { TaskProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/NotesTypes";
import { formatDateToDMYAndTime } from "@/utils/dateAndTimeFormatter";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button, Col, Container, Row, Table } from "reactstrap";
import AddTaskModal from "./Modals/AddTaskModal";

const Tasks: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: session } = useSession();
  const { casealias } = useParams();

  //   rtk hook
  const { data: tasksData, isLoading } = useGetTasksQuery({
    case_alias: casealias,
  });

  return (
    <Container fluid className="py-4">
      <Row className="mb-3">
        <Col className="text-end">
          <Button
            color="primary"
            onClick={() => setModalOpen(true)}
            disabled={
              session?.user?.user_type === "CLIENT" && tasksData?.length > 0
            }
          >
            Add New Note/Task
            <i className="fa-solid fa-circle-plus ms-1"></i>
          </Button>
        </Col>
      </Row>

      <div className="table-responsive">
        <Table striped hover responsive>
          <thead>
            <tr>
              <th style={{ minWidth: "100px" }}>Type</th>
              <th style={{ minWidth: "150px" }}>Activity Date</th>
              <th style={{ minWidth: "150px" }}>Stage</th>
              <th style={{ minWidth: "200px" }}>User</th>
              <th style={{ minWidth: "400px" }}>Information</th>
              <th style={{ minWidth: "150px" }}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center">
                    Loading...
                </td>
              </tr>
            ) : tasksData && tasksData.length > 0 ? (
              tasksData.map((task: TaskProps) => (
                <tr key={task?.alias}>
                  <td>{formatDateToDMYAndTime(task.created_at)}</td>
                  <td>
                    {task.case.case_stage
                      ? task.case.case_stage
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase()
                          )
                          .join(" ")
                      : "N/A"}
                  </td>
                  <td>{`${task.created_by.first_name} ${task.created_by.last_name}`}</td>{" "}
                  {/* User name */}
                  <td>
                    <div
                      dangerouslySetInnerHTML={{ __html: task.note || "" }}
                      style={{ wordBreak: "break-word", maxWidth: "400px" }}
                    />
                  </td>
                  <td>{task.task_priority || "N/A"}</td> {/* Task priority */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Row className="mt-3 align-items-center">
        <Col sm={5}>
          <div className="text-muted">
            Showing 1 to {tasksData?.length} of {tasksData?.length} entries
          </div>
        </Col>
      </Row>

      <AddTaskModal
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
      />
    </Container>
  );
};

export default Tasks;
