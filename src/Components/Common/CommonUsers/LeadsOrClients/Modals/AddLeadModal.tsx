import { useAddAuthUserMutation } from "@/Redux/Reducers/Common/CommonUsers/AuthUsersApi";
import { AddLeadsModalProps } from "@/Types/Common/CommonUsers/LeadsOrClientsTypes";
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

const AddLeadModal: React.FC<AddLeadsModalProps> = ({ isOpen, toggle }) => {
  const pathname = window.location.pathname;
  const [addAuthUser, { isLoading }] = useAddAuthUserMutation();
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    source: "",
    other_source: "",
    enquiry_type: "",
    other_enquiry_type: "",
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getErrorMessage = (err: any) => {
    if (!err) return "Unknown error";
    if (typeof err === "string") return err;
    if (typeof err?.data === "string") return err.data;

    const collect = (value: any): string[] => {
      if (value == null) return [];
      if (typeof value === "string") return [value];
      if (Array.isArray(value))
        return value.map((v) =>
          typeof v === "string" ? v : JSON.stringify(v),
        );
      if (typeof value === "object") {
        try {
          return Object.values(value).flatMap((v) => collect(v));
        } catch {
          return [String(value)];
        }
      }
      return [String(value)];
    };

    // If the error itself is an object mapping fields to messages/arrays,
    // collect and return those messages directly (e.g. { email: ["..."] }).
    if (err && typeof err === "object") {
      const msgs = collect(err);
      if (msgs.length) return msgs.join(", ");
    }

    if (err?.data?.message) return String(err.data.message);

    if (err?.data && typeof err.data === "object") {
      const msgs = collect(err.data);
      if (msgs.length) return msgs.join(", ");
    }

    if (err?.error) return String(err.error);
    if (err?.message) {
      if (/status code/i.test(err.message)) return "Server returned an error";
      return String(err.message);
    }

    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  };

  const camelToSnake = (s: string) =>
    s.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

  const getFieldError = (name: string) => {
    if (!errors) return undefined;
    if (errors[name]) return errors[name];
    const snake = camelToSnake(name);
    if (errors[snake]) return errors[snake];
    return undefined;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      delete copy[camelToSnake(name)];
      return copy;
    });
  };
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      first_name: formData.firstName,
      middle_name: formData.middleName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone || null,
      source: formData.source,
      other_source: formData.other_source || null,
      enquiry_type: formData.enquiry_type,
      other_enquiry_type: formData.other_enquiry_type || null,
      role: "LEAD",
      note: formData.note || null,
    };

    try {
      const result = await addAuthUser({ payload });
      if (result.data) {
        toast.success("User added successfully.");
        // Reset form and close modal
        setFormData({
          title: "",
          firstName: "",
          middleName: "",
          lastName: "",
          email: "",
          phone: "",
          source: "",
          other_source: "",
          enquiry_type: "",
          other_enquiry_type: "",
          note: "",
        });
        setErrors({});
        toggle();
      } else if ("error" in result) {
        const errData = (result.error as any)?.data;
        if (errData && typeof errData === "object") {
          const collect = (value: any): string[] => {
            if (value == null) return [];
            if (typeof value === "string") return [value];
            if (Array.isArray(value))
              return value.map((v) =>
                typeof v === "string" ? v : JSON.stringify(v),
              );
            if (typeof value === "object") {
              try {
                return Object.values(value).flatMap((v) => collect(v));
              } catch {
                return [String(value)];
              }
            }
            return [String(value)];
          };
          const fieldErrors: Record<string, string> = {};
          Object.entries(errData).forEach(([k, v]) => {
            const msgs = collect(v);
            if (msgs.length) fieldErrors[k] = msgs.join(", ");
          });
          if (Object.keys(fieldErrors).length) {
            setErrors(fieldErrors);
            const firstMsg = Object.values(fieldErrors)[0];
            toast.error(firstMsg);
          } else {
            const errorMessage = getErrorMessage(errData);
            toast.error(errorMessage);
          }
        } else {
          const errorMessage = getErrorMessage(result.error as any);
          toast.error(errorMessage);
        }
      } else {
        toast.error("Invalid request. Please try again.");
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      console.error("Error adding advisor:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <h2 className="text-primary text-capitalize">
          Add {pathname.split("/").pop()?.replace(/-/g, " ").slice(0, -1)}
        </h2>
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSaveUser} encType="multipart/form-data">
          <ModalBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="title">
                    Title<span className="text-danger">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    type="select"
                    value={formData.title || ""}
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
                  {getFieldError("title") && (
                    <div className="text-danger small mt-1">
                      {getFieldError("title")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="firstName">
                    First Name<span className="text-danger">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  {getFieldError("firstName") && (
                    <div className="text-danger small mt-1">
                      {getFieldError("firstName")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="middleName">Middle Name(s)</Label>
                  <Input
                    id="middleName"
                    name="middleName"
                    type="text"
                    value={formData.middleName || ""}
                    onChange={handleInputChange}
                  />
                  {getFieldError("middleName") && (
                    <div className="text-danger small mt-1">
                      {getFieldError("middleName")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="lastName">
                    Last Name<span className="text-danger">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                  {getFieldError("lastName") && (
                    <div className="text-danger small mt-1">
                      {getFieldError("lastName")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="email">
                    Email<span className="text-danger">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  {getFieldError("email") && (
                    <div className="text-danger small mt-1">
                      {getFieldError("email")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="number"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  {getFieldError("phone") && (
                    <div className="text-danger small mt-1">
                      {getFieldError("phone")}
                    </div>
                  )}
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="source">Source</Label>
                  <Input
                    id="source"
                    name="source"
                    type="select"
                    value={formData.source || ""}
                    onChange={handleInputChange}
                  >
                    <option value="">Select...</option>
                    <option value="GOOGLE">Google</option>
                    <option value="SOCIAL_MEDIA">Social Media</option>
                    <option value="REFERRAL">Referral</option>
                    <option value="WEBSITE">Website</option>
                    <option value="OTHER">Other</option>
                  </Input>
                  {getFieldError("source") && (
                    <div className="text-danger small mt-1">
                      {getFieldError("source")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              {formData.source === "OTHER" && (
                <Col md={6}>
                  <FormGroup>
                    <Label for="other_source">Other Source</Label>
                    <Input
                      id="other_source"
                      name="other_source"
                      type="text"
                      value={formData.other_source || ""}
                      onChange={handleInputChange}
                    />
                    {getFieldError("other_source") && (
                      <div className="text-danger small mt-1">
                        {getFieldError("other_source")}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              )}
              <Col md={6}>
                <FormGroup>
                  <Label for="enquiry_type">Enquiry Type</Label>
                  <Input
                    id="enquiry_type"
                    name="enquiry_type"
                    type="select"
                    value={formData.enquiry_type || ""}
                    onChange={handleInputChange}
                  >
                    <option value="">Select...</option>
                    <option value="PURCHASE">Purchase</option>
                    <option value="REMORTGAGE">Remortgage</option>
                    <option value="BUY_TO_LET">Buy to Let</option>
                    <option value="FIRST_TIME_BUYER">First Time Buyer</option>
                    <option value="COMMERCIAL_MORTGAGE">
                      Commercial Mortgage
                    </option>
                    <option value="PROTECTION">Protection</option>
                    <option value="GENERAL_INSURANCE">General Insurance</option>
                    <option value="OTHER">Other</option>
                  </Input>
                  {getFieldError("enquiry_type") && (
                    <div className="text-danger small mt-1">
                      {getFieldError("enquiry_type")}
                    </div>
                  )}
                </FormGroup>
              </Col>
              {formData.enquiry_type === "OTHER" && (
                <Col md={6}>
                  <FormGroup>
                    <Label for="other_enquiry_type">Other Enquiry Type</Label>
                    <Input
                      id="other_enquiry_type"
                      name="other_enquiry_type"
                      type="text"
                      value={formData.other_enquiry_type || ""}
                      onChange={handleInputChange}
                    />
                    {getFieldError("other_enquiry_type") && (
                      <div className="text-danger small mt-1">
                        {getFieldError("other_enquiry_type")}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              )}
              <Col md={12}>
                <FormGroup>
                  <Label for="note">Note</Label>
                  <Input
                    id="note"
                    name="note"
                    type="textarea"
                    value={formData.note || ""}
                    onChange={handleInputChange}
                  />
                  {getFieldError("note") && (
                    <div className="text-danger small mt-1">
                      {getFieldError("note")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={toggle}>
              Cancel
            </Button>
            <Button color="primary">
              {isLoading ? "Saving..." : "Save User"}
            </Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default AddLeadModal;
