import React from "react";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

interface Task {
  id: string;
  date: string;
  caseNumber: string;
  clientName: string;
  company: string;
  taskName: string;
  priority: "Low" | "Normal" | "High";
  status: "Pending" | "Completed" | "Overdue";
  assignedTo: string;
  taskType: string;
  dueDate: string;
}

interface EditTaskModalProps {
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  selectedTask: Task | null;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  handleEditTask: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isEditModalOpen,
  setIsEditModalOpen,
  selectedTask,
  setSelectedTask,
  handleEditTask,
}) => {
  return (
    <Modal
      isOpen={isEditModalOpen}
      toggle={() => setIsEditModalOpen(false)}
      size="lg"
    >
      <ModalHeader toggle={() => setIsEditModalOpen(false)}>
        Edit Task
      </ModalHeader>
      <ModalBody>
        {selectedTask && (
          <Form>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="editClientName">Client Name</Label>
                  <Input
                    type="text"
                    id="editClientName"
                    value={selectedTask.clientName}
                    onChange={(e) =>
                      setSelectedTask((prev) =>
                        prev ? { ...prev, clientName: e.target.value } : null
                      )
                    }
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="editCompany">Company</Label>
                  <Input
                    type="text"
                    id="editCompany"
                    value={selectedTask.company}
                    onChange={(e) =>
                      setSelectedTask((prev) =>
                        prev ? { ...prev, company: e.target.value } : null
                      )
                    }
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="12">
                <FormGroup>
                  <Label for="editTaskName">Task Name</Label>
                  <Input
                    type="text"
                    id="editTaskName"
                    value={selectedTask.taskName}
                    onChange={(e) =>
                      setSelectedTask((prev) =>
                        prev ? { ...prev, taskName: e.target.value } : null
                      )
                    }
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for="editPriority">Priority</Label>
                  <Input
                    type="select"
                    id="editPriority"
                    value={selectedTask.priority}
                    onChange={(e) =>
                      setSelectedTask((prev) =>
                        prev
                          ? {
                              ...prev,
                              priority: e.target.value as
                                | "Low"
                                | "Normal"
                                | "High",
                            }
                          : null
                      )
                    }
                  >
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="editTaskType">Task Type</Label>
                  <Input
                    type="select"
                    id="editTaskType"
                    value={selectedTask.taskType}
                    onChange={(e) =>
                      setSelectedTask((prev) =>
                        prev ? { ...prev, taskType: e.target.value } : null
                      )
                    }
                  >
                    <option value="Legal">Legal</option>
                    <option value="Application">Application</option>
                    <option value="Follow-up">Follow-up</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="editStatus">Status</Label>
                  <Input
                    type="select"
                    id="editStatus"
                    value={selectedTask.status}
                    onChange={(e) =>
                      setSelectedTask((prev) =>
                        prev
                          ? {
                              ...prev,
                              status: e.target.value as
                                | "Pending"
                                | "Completed"
                                | "Overdue",
                            }
                          : null
                      )
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Overdue">Overdue</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="editAssignedTo">Assigned To</Label>
                  <Input
                    type="select"
                    id="editAssignedTo"
                    value={selectedTask.assignedTo}
                    onChange={(e) =>
                      setSelectedTask((prev) =>
                        prev ? { ...prev, assignedTo: e.target.value } : null
                      )
                    }
                  >
                    <option value="">Select assignee</option>
                    <option value="Mostafizur Rahman">Mostafizur Rahman</option>
                    <option value="John Doe">John Doe</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="editDueDate">Due Date</Label>
                  <Input
                    type="date"
                    id="editDueDate"
                    value={
                      selectedTask.dueDate
                        ? new Date(
                            selectedTask.dueDate.split("/").reverse().join("-")
                          )
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setSelectedTask((prev) =>
                        prev
                          ? {
                              ...prev,
                              dueDate: new Date(
                                e.target.value
                              ).toLocaleDateString("en-GB"),
                            }
                          : null
                      )
                    }
                  />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => setIsEditModalOpen(false)}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleEditTask}>
          Update Task
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditTaskModal;
