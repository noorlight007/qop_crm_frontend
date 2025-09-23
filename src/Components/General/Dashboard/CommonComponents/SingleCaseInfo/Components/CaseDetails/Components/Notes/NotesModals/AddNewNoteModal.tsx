import { useAddNotesMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Notes/NotesApi";
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import { X } from "react-feather";
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

interface CreateTaskNoteModalProps {
  isOpen: boolean;
  toggle: () => void;
}

const CreateTaskNoteModal: FC<CreateTaskNoteModalProps> = ({
  isOpen,
  toggle,
}) => {
  const { casealias } = useParams();
  const [isNote, setIsNote] = useState(true);
  const [brokerVisible, setBrokerVisible] = useState(false);
  const [clientVisible, setClientVisible] = useState(false);
  const [priority, setPriority] = useState("LOW");
  const [dueDate, setDueDate] = useState(
    new Date().toLocaleDateString("en-GB")
  );
  const [dueTime, setDueTime] = useState("");
  const [assignedTo, setAssignedTo] = useState("1");
  const [category, setCategory] = useState("");
  const [comments, setComments] = useState("");
  const [addNotes, { isLoading }] = useAddNotesMutation();

  const categories = [
    "Uncategorised",
    "Email Correspondence",
    "Telephone conversation",
    "Lender Correspondence",
    "Solicitor Correspondence",
    "Compliance Correspondence",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert date and time to ISO string format if both exist
    const combinedDateTime =
      dueTime && dueDate
        ? new Date(
            `${dueDate.split("/").reverse().join("-")}T${dueTime}:00Z`
          ).toISOString()
        : null;

    // Create API payload with null checks
    const apiPayload = {
      note_task: isNote ? "NOTE" : "TASK",
      note_visible_to_introducer: !isNote ? brokerVisible : false,
      note_visible_to_client: !isNote ? clientVisible : false,
      category: category ? category.toUpperCase().replace(/ /g, "_") : null,
      task_priority: isNote && priority ? priority : null,
      due_date: isNote ? combinedDateTime : null,
      assigned_to: isNote && assignedTo ? parseInt(assignedTo) : null,
      note: comments || "",
    };

    const response = await addNotes({
      case_alias: casealias,
      note: apiPayload,
    });
    if (response.data) {
      toast.success("Note added successfully");
      toggle();
    } else if (response.error) {
      const errorMessage =
        (response.error as any)?.data?.detail || "Failed to add note";
      toast.error(errorMessage);
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader
        toggle={toggle}
        className="d-flex justify-content-between align-items-center"
        close={
          <Button color="primary" onClick={toggle} className="ms-auto">
            <X />
          </Button>
        }
      >
        Create Note/Task
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <Row>
            <Col md={6} className=" mb-4">
              <FormGroup switch className="d-flex align-items-center">
                <Input
                  type="switch"
                  id="taskToggle"
                  checked={isNote}
                  onChange={(e) => setIsNote(e.target.checked)}
                />
                <Label check for="taskToggle" className="ms-2">
                  {isNote ? "Note" : "Task"}
                </Label>
              </FormGroup>
            </Col>
            {isNote && (
              <Col md={5}>
                <Row>
                  <Col md={12}>
                    <FormGroup
                      switch
                      className="d-flex justify-content-between align-items-center mb-2"
                    >
                      <Label check>Note visible to introducer?</Label>
                      <Input
                        type="switch"
                        checked={brokerVisible}
                        onChange={(e) => setBrokerVisible(e.target.checked)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={12}>
                    <FormGroup
                      switch
                      className="d-flex justify-content-between align-items-center"
                    >
                      <Label check>Note visible to client?</Label>
                      <Input
                        type="switch"
                        checked={clientVisible}
                        onChange={(e) => setClientVisible(e.target.checked)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Col>
            )}
          </Row>

          <Row>
            {!isNote && (
              <Col md={6} className="mb-4">
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
            )}

            {!isNote && (
              <Col md={6} className=" mb-4">
                <FormGroup>
                  <Label for="dueDate">
                    Due Date <span className="text-danger">*</span>
                  </Label>
                  <Row>
                    <Col xs={6}>
                      <Input
                        type="date"
                        id="dueDate"
                        value={dueDate.split("/").reverse().join("-")}
                        onChange={(e) =>
                          setDueDate(
                            e.target.value.split("-").reverse().join("/")
                          )
                        }
                        required
                      />
                    </Col>
                    <Col xs={6}>
                      <Input
                        type="time"
                        id="dueTime"
                        value={dueTime}
                        onChange={(e) => setDueTime(e.target.value)}
                      />
                    </Col>
                  </Row>
                </FormGroup>
              </Col>
            )}

            {!isNote && (
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
                    <option value="1">mostafiz@benecofinance.co.uk</option>
                    {/* Add more options as needed */}
                  </Input>
                </FormGroup>
              </Col>
            )}

            {isNote && (
              <Col md={6} className=" mt-4">
                <FormGroup>
                  <Label for="category">
                    Category <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="select"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            )}
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

export default CreateTaskNoteModal;
