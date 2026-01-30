import { useAddTasksMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Notes/TasksApi";
import { useGetUsersQuery } from "@/Redux/Reducers/Common/CommonUsers/UsersApi";
import { AddTaskModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/NotesAndTaskTypes";
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
  const caseAlias = Array.isArray(casealias) ? casealias[0] : (casealias ?? "");
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [comments, setComments] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    try {
      const response = await addTask({
        case_alias: caseAlias,
        task: apiPayload,
      });

      if ((response as any)?.data) {
        setErrors({});
        toast.success("Task added successfully");
        // reset form and close
        resetForm();
        toggle();
      } else if ((response as any)?.error) {
        const errData =
          (response as any).error?.data || (response as any).error || {};
        const parsed = parseApiErrors(errData);
        setErrors(parsed);
        const first = Object.values(parsed)[0] || "Failed to add task";
        toast.error(String(first));
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      const parsed = parseApiErrors(
        (error as any)?.data || (error as any) || error,
      );
      setErrors(parsed);
      const first = Object.values(parsed)[0] || "Failed to add task";
      toast.error(String(first));
    }
  };

  const resetForm = () => {
    setName("");
    setPriority("LOW");
    setDueDate("");
    setAssignedTo("");
    setComments("");
    setErrors({});
  };

  // Reset form when modal is closed so next open starts fresh
  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen]);

  const parseApiErrors = (err: any): Record<string, string> => {
    const out: Record<string, string> = {};
    if (!err) return out;

    const sanitize = (msg: any) => {
      if (msg == null) return "";
      let s = String(msg);
      s = s.replace(/^\s*\d+,\s*/g, "");
      return s;
    };

    if (typeof err === "string") {
      out["non_field_errors"] = sanitize(err);
      return out;
    }

    if (err && typeof err === "object") {
      if (err.detail) out["non_field_errors"] = sanitize(err.detail);
      for (const [k, v] of Object.entries(err)) {
        if (v == null) continue;
        if (typeof v === "string") out[k] = sanitize(v);
        else if (Array.isArray(v))
          out[k] = sanitize(
            v
              .map((x) => (typeof x === "string" ? x : JSON.stringify(x)))
              .join(", "),
          );
        else if (typeof v === "object") {
          const vals: string[] = [];
          for (const vv of Object.values(v)) {
            if (vv == null) continue;
            if (Array.isArray(vv)) vals.push(...vv.map((x) => String(x)));
            else vals.push(String(vv));
          }
          if (vals.length) out[k] = sanitize(vals.join(", "));
        } else out[k] = sanitize(String(v));
      }
      return out;
    }

    out["non_field_errors"] = sanitize(String(err));
    return out;
  };

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
                {errors.name && (
                  <div className="text-danger">{errors.name}</div>
                )}
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
                {errors.task_priority && (
                  <div className="text-danger">{errors.task_priority}</div>
                )}
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
                {errors.due_date && (
                  <div className="text-danger">{errors.due_date}</div>
                )}
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
                {errors.task_assigned_to && (
                  <div className="text-danger">{errors.task_assigned_to}</div>
                )}
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
            {errors.note && <div className="text-danger">{errors.note}</div>}
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
