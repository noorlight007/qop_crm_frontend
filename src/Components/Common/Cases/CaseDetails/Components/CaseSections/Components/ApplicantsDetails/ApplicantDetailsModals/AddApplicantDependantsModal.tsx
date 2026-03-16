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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const camelToSnake = (s: string) =>
    s.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`);

  const getFieldError = (name: string) => {
    if (!errors) return undefined;
    if (errors[name]) return errors[name];
    const snake = camelToSnake(name);
    if (errors[snake]) return errors[snake];
    return undefined;
  };

  const parseApiErrors = (err: any): Record<string, string> => {
    const out: Record<string, string> = {};
    const data = err?.data || (err?.error && err.error.data) || err;
    const sanitize = (m: string) => String(m).replace(/^\d+[,\s]*/, "");

    const recurse = (value: any, path: string[] = []) => {
      if (value == null) return;
      if (typeof value === "string") {
        out[path.join(".")] = sanitize(value);
        return;
      }
      if (Array.isArray(value)) {
        out[path.join(".")] = value
          .map((v) => (typeof v === "string" ? sanitize(v) : JSON.stringify(v)))
          .join(", ");
        return;
      }
      if (typeof value === "object") {
        for (const k of Object.keys(value)) recurse(value[k], path.concat(k));
        return;
      }
      out[path.join(".")] = String(value);
    };

    recurse(data, []);
    return out;
  };

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
    try {
      const response = await addDependants({
        case_alias,
        applicantDetails_alias,
        dependantsInfo: formData,
      });

      if ((response as any).data) {
        setErrors({});
        toast.success("Dependant added successfully");
        setFormData({
          name: "",
          relationship: "",
          other_relationship: "",
          date_of_birth: "",
        });
        setAge("");
        toggle();
      } else if ((response as any).error) {
        const parsed = parseApiErrors((response as any).error);
        setErrors(parsed);
        const first = Object.values(parsed)[0];
        toast.error(first || "Failed to add dependant");
      }
    } catch (err: any) {
      const parsed = parseApiErrors(err);
      setErrors(parsed);
      const first = Object.values(parsed)[0];
      toast.error(first || err?.message || "Failed to add dependant");
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
                Name<span className="text-danger">*</span>
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
              {getFieldError("name") && (
                <div className="text-danger small">{getFieldError("name")}</div>
              )}
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
                <option value="SON">Son</option>
                <option value="DAUGHTER">Daughter</option>
                <option value="OTHER">Other</option>
              </Input>
              {getFieldError("relationship") && (
                <div className="text-danger small">
                  {getFieldError("relationship")}
                </div>
              )}
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
                {getFieldError("other_relationship") && (
                  <div className="text-danger small">
                    {getFieldError("other_relationship")}
                  </div>
                )}
              </FormGroup>
            )}

            <FormGroup>
              <Label for="date_of_birth" className="small">
                Date of Birth<span className="text-danger">*</span>
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
                  {getFieldError("date_of_birth") && (
                    <div className="text-danger small">
                      {getFieldError("date_of_birth")}
                    </div>
                  )}
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
