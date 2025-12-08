import { useGetUsersQuery } from "@/Redux/Reducers/CommonComponents/CommonUsers/UsersDetailsApi";
import { useEditTaskMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Notes/TasksApi";
import { TaskProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/NotesAndTaskTypes";
import { useParams } from "next/navigation";
import React, { useState } from "react";
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
  ModalHeader,
  Row,
} from "reactstrap";

export interface EditTaskModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedTask: TaskProps;
  onSave?: (task: TaskProps) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  toggle,
  selectedTask,
  onSave,
}) => {
  const { casealias } = useParams();
  // rtk hooks
  const [editTask, { isLoading }] = useEditTaskMutation();
  const { data: usersData, isLoading: isUsersLoading } =
    useGetUsersQuery(undefined);

  const [form, setForm] = useState<{
    task_priority: string | null;
    due_date: string | null;
    task_assigned_to: string | number | null;
    note: string | null;
  }>({
    task_priority: selectedTask?.task_priority || null,
    due_date: selectedTask?.due_date
      ? new Date(selectedTask.due_date).toISOString().split("T")[0]
      : null,
    // selectedTask.task_assigned_to can be an object {id, name} or an id
    task_assigned_to:
      selectedTask?.task_assigned_to &&
      typeof selectedTask.task_assigned_to === "object"
        ? (selectedTask.task_assigned_to as any).id
        : (selectedTask?.task_assigned_to as any) || null,
    note: selectedTask?.note || null,
  });

  React.useEffect(() => {
    if (isOpen && selectedTask) {
      setForm({
        task_priority: selectedTask?.task_priority || null,
        due_date: selectedTask?.due_date
          ? new Date(selectedTask.due_date).toISOString().split("T")[0]
          : null,
        task_assigned_to:
          selectedTask?.task_assigned_to &&
          typeof selectedTask.task_assigned_to === "object"
            ? (selectedTask.task_assigned_to as any).id
            : (selectedTask?.task_assigned_to as any) || null,
        note: selectedTask?.note || null,
      });
    }
  }, [isOpen, selectedTask]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedTask) return;

    const taskPayload = {
      task_priority: form.task_priority,
      due_date: form.due_date,
      task_assigned_to:
        form.task_assigned_to === null || form.task_assigned_to === ""
          ? null
          : Number(form.task_assigned_to),
      note: form.note,
    };
    try {
      const res = await editTask({
        case_alias: casealias,
        task_alias: selectedTask.alias,
        taskPayload: taskPayload,
      });
      if (res.data) {
        toast.success("Task updated successfully");
        toggle();
      } else {
        toast.error("Failed to update task");
      }
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        <h4 className="text-primary">Edit Task</h4>
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6} className="mb-3">
              <FormGroup>
                <Label for="task_priority">Priority</Label>
                <Input
                  type="select"
                  name="task_priority"
                  id="task_priority"
                  value={form.task_priority ?? ""}
                  onChange={handleChange}
                >
                  <option value="">Select priority</option>
                  <option value="LOW">Low</option>
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </Input>
              </FormGroup>
            </Col>

            <Col md={6} className="mb-3">
              <FormGroup>
                <Label for="due_date">Due Date</Label>
                <Input
                  type="date"
                  name="due_date"
                  id="due_date"
                  value={form.due_date ?? ""}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>

            <Col md={12} className="mb-3">
              <FormGroup>
                <Label for="task_assigned_to">Assigned To</Label>
                <Input
                  type="select"
                  name="task_assigned_to"
                  id="task_assigned_to"
                  value={form.task_assigned_to ?? ""}
                  onChange={handleChange}
                >
                  <option value="">Select User</option>
                  {!isUsersLoading && usersData
                    ? usersData.map((user: any) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))
                    : null}
                </Input>
              </FormGroup>
            </Col>

            <Col md={12} className="mb-3">
              <FormGroup>
                <Label for="note">Note</Label>
                <Input
                  type="textarea"
                  name="note"
                  id="note"
                  value={form.note ?? ""}
                  onChange={handleChange}
                  rows={4}
                />
              </FormGroup>
            </Col>

            <Col md={12} className="d-flex justify-content-end gap-2">
              <Button color="secondary" onClick={toggle} outline>
                Cancel
              </Button>
              <Button color="primary" type="submit">
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default EditTaskModal;
