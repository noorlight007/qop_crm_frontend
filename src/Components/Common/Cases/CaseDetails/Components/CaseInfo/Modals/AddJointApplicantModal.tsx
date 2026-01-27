import { useAddJointApplicantInfoMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/JointApplicant/JointApplicantApi";
import { AddJointApplicantModalProps } from "@/Types/Common/Cases/CaseDetails/JointApplicant/JointApplicantTypes";
import { useParams } from "next/navigation";
import { useState } from "react";
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

const AddJointApplicantModal: React.FC<AddJointApplicantModalProps> = ({
  isOpen,
  toggle,
}) => {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const params = useParams();
  const { casealias } = params;
  const [addJointApplicantInfo, { isLoading: isAddingJointApplicant }] =
    useAddJointApplicantInfoMutation(undefined);

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    relationship: "",
    other_relationship: "",
    profileImage: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const sanitize = (s: string) => (s || "").replace(/^\s*\d+,\s*/g, "").trim();
  const toCamel = (key: string) =>
    key.replace(/_([a-z])/g, (_, c) => (c ? c.toUpperCase() : ""));

  const flattenErrors = (value: any, path = ""): Record<string, string> => {
    const out: Record<string, string> = {};
    if (value == null) return out;
    if (typeof value === "string") {
      out[path || ""] = sanitize(value);
      return out;
    }
    if (Array.isArray(value)) {
      out[path || ""] = sanitize(
        value
          .map((v) => (typeof v === "string" ? v : JSON.stringify(v)))
          .join(", "),
      );
      return out;
    }
    if (typeof value === "object") {
      for (const k of Object.keys(value)) {
        const v = value[k];
        const newPath = path ? `${path}.${k}` : k;
        if (typeof v === "string" || Array.isArray(v)) {
          out[newPath] = sanitize(
            (Array.isArray(v)
              ? v
                  .map((x) => (typeof x === "string" ? x : JSON.stringify(x)))
                  .join(", ")
              : v) as string,
          );
        } else {
          Object.assign(out, flattenErrors(v, newPath));
        }
      }
    }
    return out;
  };

  const clearFieldError = (field: string) =>
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      const snake = field.replace(/([A-Z])/g, (m) => `_${m.toLowerCase()}`);
      delete copy[snake];
      return copy;
    });

  const getErrorMessage = (err: any) => {
    if (!err) return "Unknown error";
    if (typeof err === "string") return err;
    if (typeof err?.data === "string") return err.data;
    try {
      if (err?.data?.message) return String(err.data.message);
      if (err?.message) return String(err.message);
    } catch {}
    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
    clearFieldError(name);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      joint_user: {
        title: formData.title,
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      },
      relationship: formData.relationship,
      other_relationship: formData.other_relationship,
      notes: formData.notes,
    };
    const res = await addJointApplicantInfo({
      case_alias: casealias,
      jointuserInfo: payload,
    });
    if (res.data) {
      // clear errors and notify
      setErrors({});
      toast.success("Joint user added successfully!");
      // Reset form data after successful submission
      setFormData({
        title: "",
        firstName: "",
        middleName: "",
        lastName: "",
        phone: "",
        email: "",
        relationship: "",
        other_relationship: "",
        profileImage: "",
        notes: "",
      });
      toggle();
    } else if ("error" in res) {
      const e: any = res.error;
      const dataErrors = e?.data?.errors ?? e?.data ?? e;
      try {
        const flat = flattenErrors(dataErrors);
        const normalized: Record<string, string> = {};
        Object.entries(flat).forEach(([k, v]) => {
          const parts = k.split(".").filter(Boolean);
          const last = parts[parts.length - 1];
          const camel = toCamel(last);
          normalized[camel] = v;
        });
        if (Object.keys(normalized).length) {
          setErrors(normalized);
          const first = Object.values(normalized)[0];
          toast.error(getErrorMessage(first));
          return; // keep modal open
        }
      } catch (e2) {
        console.error("Error parsing validation errors", e2);
      }

      toast.error(getErrorMessage(res.error) || "Failed to add joint user.");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Add Joint Applicant</span>
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <Row>
            <Col xs={12} md={6}>
              <FormGroup>
                <Label for="title" className="form-label">
                  Title<span className="text-danger">*</span>
                </Label>
                <Input
                  type="select"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select...</option>
                  <option value="MR">Mr</option>
                  <option value="MRS">Mrs</option>
                  <option value="MS">Ms</option>
                  <option value="DR">Dr</option>
                  <option value="MISS">Miss</option>
                  <option value="MADAM">Madam</option>
                  <option value="MAIDEN">Maiden</option>
                  <option value="PROFESSOR">Professor</option>
                  <option value="DOCTOR">Doctor</option>
                </Input>
                {errors["title"] && (
                  <div className="text-danger small mt-1">
                    {errors["title"]}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col xs={12} md={6}>
              <FormGroup>
                <Label for="first_name" className="form-label">
                  First Name<span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="first_name"
                  name="firstName"
                  required
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                {errors["firstName"] && (
                  <div className="text-danger small mt-1">
                    {errors["firstName"]}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col xs={12} md={6}>
              <FormGroup>
                <Label for="middle_name" className="form-label">
                  Middle Name
                </Label>
                <Input
                  type="text"
                  id="middle_name"
                  name="middleName"
                  placeholder="Enter middle name"
                  value={formData.middleName}
                  onChange={handleInputChange}
                />
                {errors["middleName"] && (
                  <div className="text-danger small mt-1">
                    {errors["middleName"]}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col xs={12} md={6}>
              <FormGroup>
                <Label for="last_name" className="form-label">
                  Last Name<span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="last_name"
                  name="lastName"
                  required
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
                {errors["lastName"] && (
                  <div className="text-danger small mt-1">
                    {errors["lastName"]}
                  </div>
                )}
              </FormGroup>
            </Col>{" "}
            <Col xs={12} md={6}>
              <FormGroup>
                <Label for="email" className="form-label">
                  Email<span className="text-danger">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors["email"] && (
                  <div className="text-danger small mt-1">
                    {errors["email"]}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col xs={12} md={6}>
              <FormGroup>
                <Label for="phone" className="form-label">
                  Phone<span className="text-danger">*</span>
                </Label>
                <Input
                  type="number"
                  id="phone"
                  name="phone"
                  required
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                {errors["phone"] && (
                  <div className="text-danger small mt-1">
                    {errors["phone"]}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col xs={12} md={6}>
              <FormGroup>
                <Label for="relationship" className="small">
                  Relationship
                </Label>
                <Input
                  type="select"
                  name="relationship"
                  id="relationship"
                  value={formData.relationship}
                  onChange={handleInputChange}
                >
                  <option value="">Select...</option>
                  <option value="SPOUSE">Spouse</option>
                  <option value="SIBLING">Sibling</option>
                  <option value="OTHER">Other</option>
                </Input>
                {errors["relationship"] && (
                  <div className="text-danger small mt-1">
                    {errors["relationship"]}
                  </div>
                )}
              </FormGroup>
            </Col>
            {formData.relationship === "OTHER" && (
              <Col xs={12} md={6}>
                <FormGroup>
                  <Label for="other_relationship" className="small">
                    Other Relationship
                  </Label>
                  <Input
                    type="text"
                    name="other_relationship"
                    id="other_relationship"
                    value={formData.other_relationship}
                    onChange={handleInputChange}
                    placeholder="Specify other relationship"
                  />
                  {errors["otherRelationship"] && (
                    <div className="text-danger small mt-1">
                      {errors["otherRelationship"]}
                    </div>
                  )}
                </FormGroup>
              </Col>
            )}
            <Col xs={12} md={6}>
              <FormGroup>
                <Label for="notes" className="form-label">
                  Notes
                </Label>
                <Input
                  type="textarea"
                  id="notes"
                  name="notes"
                  placeholder="Enter notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
                {errors["notes"] && (
                  <div className="text-danger small mt-1">
                    {errors["notes"]}
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle} block>
            Cancel
          </Button>
          <Button color="primary" block={isAddingJointApplicant}>
            {isAddingJointApplicant ? "Saving..." : "Save Joint Applicant"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddJointApplicantModal;
