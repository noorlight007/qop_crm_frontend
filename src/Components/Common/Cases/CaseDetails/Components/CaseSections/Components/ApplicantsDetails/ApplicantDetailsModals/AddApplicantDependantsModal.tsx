import { useAddDependantsMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/ApplicantsDetails/ApplicantsDetailsApi";
import { AddDependantFormModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/ApplicantsDetailsTypes";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";

const AddDependantFormModal: React.FC<AddDependantFormModalProps> = ({
  isOpen,
  toggle,
  case_alias,
  applicantDetails_alias,
}) => {
  const [addDependants, { isLoading: isDependantsLoading }] =
    useAddDependantsMutation();
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    other_relationship: "",
    date_of_birth: "",
  });
  const [age, setAge] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "date_of_birth") {
      const calc = (dob: string) => {
        if (!dob) return "";
        const birth = new Date(dob);
        if (isNaN(birth.getTime())) return "";
        const today = new Date();
        let years = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
          years--;
        }
        return years >= 0 ? String(years) : "";
      };

      setAge(calc(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const response = await addDependants({
      case_alias,
      applicantDetails_alias,
      dependantsInfo: formData,
    });
    if (response.data) {
      toast.success("Dependant added successfully");
      setFormData({
        name: "",
        relationship: "",
        other_relationship: "",
        date_of_birth: "",
      });
      setAge("");
      toggle();
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        <p className=" fs-4 text-primary fw-bold">Add Dependants</p>
      </ModalHeader>
      <ModalBody>
        <Container className="p-4 border rounded shadow-sm">
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name" className="small">
                Name*
              </Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="relationship" className="small">
                Relationship
              </Label>
              <Input
                type="select"
                name="relationship"
                id="relationship"
                value={formData.relationship}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                <option value="SPOUSE">Spouse</option>
                <option value="SIBLING">Sibling</option>
                <option value="OTHER">Other</option>
              </Input>
            </FormGroup>

            {formData.relationship === "OTHER" && (
              <FormGroup>
                <Label for="other_relationship" className="small">
                  Other Relationship
                </Label>
                <Input
                  type="text"
                  name="other_relationship"
                  id="other_relationship"
                  value={formData.other_relationship}
                  onChange={handleChange}
                  placeholder="Specify other relationship"
                />
              </FormGroup>
            )}

            <FormGroup>
              <Label for="date_of_birth" className="small">
                Date of Birth*
              </Label>
              <Row className="g-2 align-items-center">
                <Col>
                  <Input
                    type="date"
                    name="date_of_birth"
                    id="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col
                  xs="auto"
                  className="text-muted small d-flex align-items-center border rounded-1 p-2"
                >
                  {formData.date_of_birth ? (
                    age !== "" ? (
                      <span>
                        Age: {age} yr{age !== "1" ? "s" : ""}
                      </span>
                    ) : (
                      <span>Age: 0 yrs</span>
                    )
                  ) : (
                    <span>Age: 0 yrs</span>
                  )}
                </Col>
              </Row>
            </FormGroup>

            <div className="d-flex gap-2 justify-content-end mt-4">
              <Button color="secondary" onClick={toggle}>
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                disabled={isDependantsLoading}
              >
                {isDependantsLoading ? "Loading..." : "Submit"}
              </Button>
            </div>
          </Form>
        </Container>
      </ModalBody>
    </Modal>
  );
};

export default AddDependantFormModal;
