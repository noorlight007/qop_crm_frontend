import { useGetUsersQuery } from "@/Redux/Reducers/CommonComponents/CommonUsers/UsersDetailsApi";
import { useAddTasksMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Notes/TasksApi";
import { AddTaskModalProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/NotesAndTaskTypes";
import { useParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
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

const AddTaskModal: FC<AddTaskModalProps> = ({ isOpen, toggle }) => {
  const { casealias } = useParams();
  const caseAlias = Array.isArray(casealias) ? casealias[0] : casealias ?? "";
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [comments, setComments] = useState("");

  // rtk hooks
  const [addTask, { isLoading }] = useAddTasksMutation();
  const { data: usersData, isLoading: isUsersLoading } =
    useGetUsersQuery(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiPayload = {
      name: name || null,
      task_priority: priority || null,
      due_date: dueDate || null,
      task_assigned_to: assignedTo || null,
      note: comments || null,
    };
    const response = await addTask({
      case_alias: caseAlias,
      task: apiPayload,
    });
    if (response.data) {
      toast.success("Task added successfully");
      // reset form and close
      resetForm();
      toggle();
    } else if (response.error) {
      const errorMessage =
        (response.error as any)?.data?.detail || "Failed to add task";
      toast.error(errorMessage);
    } else {
      toast.error("Something went wrong");
    }
  };

  const resetForm = () => {
    setName("");
    setPriority("LOW");
    setDueDate("");
    setAssignedTo("");
    setComments("");
  };

  // Reset form when modal is closed so next open starts fresh
  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader
        toggle={toggle}
        className="d-flex justify-content-between align-items-center"
      >
        Create Task
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="name">
                  Task name <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter task name"
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="priority">
                  Task Priority <span className="text-danger">*</span>
                </Label>
                <Input
                  type="select"
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  required
                >
                  <option value="LOW">Low</option>
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="dueDate">
                  Due Date <span className="text-danger">*</span>
                </Label>
                <Input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="assignedTo">
                  Assigned To <span className="text-danger">*</span>
                </Label>
                <Input
                  type="select"
                  id="assignedTo"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  required
                >
                  <option value="">Select a user</option>
                  {usersData &&
                    usersData.map((user: any) => (
                      <option key={user?.id} value={user?.id}>
                        {user?.name}
                      </option>
                    ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>

          <FormGroup>
            <Label for="comments">
              Comments <span className="text-danger">*</span>
            </Label>
            <Input
              type="textarea"
              id="comments"
              rows={5}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter your comments here..."
              required
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Create"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddTaskModal;
