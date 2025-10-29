import { useAddNotesMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Notes/NotesApi";
import { AddNoteModalProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/NotesTypes";
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

const AddNoteModal: FC<AddNoteModalProps> = ({ isOpen, toggle }) => {
  const { casealias } = useParams();
  const caseAlias = Array.isArray(casealias) ? casealias[0] : casealias ?? "";
  const [brokerVisible, setBrokerVisible] = useState(false);
  const [clientVisible, setClientVisible] = useState(false);
  const [category, setCategory] = useState("");
  const [comments, setComments] = useState("");
  const [addNotes, { isLoading }] = useAddNotesMutation();

  const resetForm = () => {
    setBrokerVisible(false);
    setClientVisible(false);
    setCategory("");
    setComments("");
  };

  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen]);

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

    const apiPayload = {
      is_visible_to_introducer: !!brokerVisible,
      is_visible_to_client: !!clientVisible,
      category: category ? category.toUpperCase().replace(/ /g, "_") : null,
      note: comments || "",
    };

    const response = await addNotes({
      case_alias: caseAlias,
      note: apiPayload,
    });
    if (response.data) {
      toast.success("Note added successfully");
      // reset form then close modal
      resetForm();
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
      >
        Create Note
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <Row>
            <Col md={6}>
              <Row>
                <Col md={12}>
                  <FormGroup className="d-flex justify-content-between align-items-center mb-2">
                    <Label check>Note visible to introducer?</Label>
                    <Input
                      type="switch"
                      checked={brokerVisible}
                      onChange={(e) => setBrokerVisible(e.target.checked)}
                    />
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <FormGroup className="d-flex justify-content-between align-items-center">
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
            <Col md={6}>
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

export default AddNoteModal;
