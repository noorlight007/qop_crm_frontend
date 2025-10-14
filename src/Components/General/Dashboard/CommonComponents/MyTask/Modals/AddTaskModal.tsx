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

interface AddTaskModalProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  newTask: Partial<Task>;
  setNewTask: React.Dispatch<React.SetStateAction<Partial<Task>>>;
  handleAddTask: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isAddModalOpen,
  setIsAddModalOpen,
  newTask,
  setNewTask,
  handleAddTask,
}) => {
  return (
    <Modal
      isOpen={isAddModalOpen}
      toggle={() => setIsAddModalOpen(false)}
      size="lg"
    >
      <ModalHeader toggle={() => setIsAddModalOpen(false)}>
        Add New Task
      </ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="clientName">Client Name</Label>
                <Input
                  type="text"
                  id="clientName"
                  value={newTask.clientName || ""}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      clientName: e.target.value,
                    }))
                  }
                  placeholder="Enter client name"
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="company">Company</Label>
                <Input
                  type="text"
                  id="company"
                  value={newTask.company || ""}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                  placeholder="Enter company name"
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md="12">
              <FormGroup>
                <Label for="taskName">Task Name</Label>
                <Input
                  type="text"
                  id="taskName"
                  value={newTask.taskName || ""}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      taskName: e.target.value,
                    }))
                  }
                  placeholder="Enter task description"
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md="4">
              <FormGroup>
                <Label for="priority">Priority</Label>
                <Input
                  type="select"
                  id="priority"
                  value={newTask.priority || "Normal"}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      priority: e.target.value as "Low" | "Normal" | "High",
                    }))
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
                <Label for="taskType">Task Type</Label>
                <Input
                  type="select"
                  id="taskType"
                  value={newTask.taskType || ""}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      taskType: e.target.value,
                    }))
                  }
                >
                  <option value="">Select type</option>
                  <option value="Legal">Legal</option>
                  <option value="Application">Application</option>
                  <option value="Follow-up">Follow-up</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label for="dueDate">Due Date</Label>
                <Input
                  type="date"
                  id="dueDate"
                  value={
                    newTask.dueDate
                      ? new Date(newTask.dueDate.split("/").reverse().join("-"))
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      dueDate: new Date(e.target.value).toLocaleDateString(
                        "en-GB"
                      ),
                    }))
                  }
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="assignedTo">Assigned To</Label>
                <Input
                  type="select"
                  id="assignedTo"
                  value={newTask.assignedTo || ""}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      assignedTo: e.target.value,
                    }))
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
                <Label for="status">Status</Label>
                <Input
                  type="select"
                  id="status"
                  value={newTask.status || "Pending"}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      status: e.target.value as
                        | "Pending"
                        | "Completed"
                        | "Overdue",
                    }))
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Overdue">Overdue</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => setIsAddModalOpen(false)}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleAddTask}>
          Add Task
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddTaskModal;
