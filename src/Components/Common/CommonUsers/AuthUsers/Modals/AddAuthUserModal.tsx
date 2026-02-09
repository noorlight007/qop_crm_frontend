import { useAddAuthUserMutation } from "@/Redux/Reducers/Common/CommonUsers/AuthUsersApi";
import { AddAuthUserModalProps } from "@/Types/Common/CommonUsers/AuthUsersTypes";
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

const AddAuthUserModal: React.FC<AddAuthUserModalProps> = ({
  isOpen,
  toggle,
}) => {
  const pathname = window.location.pathname;
  const [addAuthUser, { isLoading }] = useAddAuthUserMutation();
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    gender: "",
    designation: "",
    joining_date: "",
    company_name: "",
    company_address: "",
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
      password: formData.password,
      gender: formData.gender ? formData.gender : null,
      designation: formData.designation,
      joining_date: formData.joining_date ? formData.joining_date : null,
      role:
        pathname === "/network/director/advisers"
          ? "NETWORK_ADVISER"
          : pathname === "/network/director/compliances"
            ? "NETWORK_COMPLIANCE"
            : pathname === "/organisation/director/advisers"
              ? "ORGANISATION_ADVISER"
              : pathname === "/organisation/director/admins"
                ? "ORGANISATION_ADMIN"
                : pathname === "/organisation/director/introducers"
                  ? "INTRODUCER"
                  : "",
      company_name: formData.company_name,
      company_address: formData.company_address,
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
          password: "",
          gender: "",
          designation: "",
          joining_date: "",
          company_name: "",
          company_address: "",
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

              {pathname === "/network/director/compliances" && (
                <Col md={6}>
                  <FormGroup>
                    <Label for="designation">
                      Designation<span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="designation"
                      name="designation"
                      type="text"
                      value={formData.designation || ""}
                      onChange={handleInputChange}
                      required
                    />
                    {getFieldError("designation") && (
                      <div className="text-danger small mt-1">
                        {getFieldError("designation")}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              )}

              {pathname !== "/organisation/director/introducers" &&
                pathname !== "/network/director/compliances" && (
                  <Col md={6}>
                    <FormGroup>
                      <Label for="gender">
                        Gender<span className="text-danger">*</span>
                      </Label>
                      <Input
                        id="gender"
                        name="gender"
                        type="select"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select...</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </Input>
                      {getFieldError("gender") && (
                        <div className="text-danger small mt-1">
                          {getFieldError("gender")}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                )}
              {pathname === "/organisation/director/introducers" && (
                <>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="company_name">
                        Company Name<span className="text-danger">*</span>
                      </Label>
                      <Input
                        id="company_name"
                        name="company_name"
                        type="text"
                        value={formData.company_name}
                        onChange={handleInputChange}
                        required
                      />
                      {getFieldError("company_name") && (
                        <div className="text-danger small mt-1">
                          {getFieldError("company_name")}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="company_address">
                        Company Address<span className="text-danger">*</span>
                      </Label>
                      <Input
                        id="company_address"
                        name="company_address"
                        type="text"
                        value={formData.company_address}
                        onChange={handleInputChange}
                        required
                      />
                      {getFieldError("company_address") && (
                        <div className="text-danger small mt-1">
                          {getFieldError("company_address")}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                </>
              )}
              <Col md={6}>
                <FormGroup>
                  <Label for="joining_date">Joining Date</Label>
                  <Input
                    id="joining_date"
                    name="joining_date"
                    type="date"
                    value={formData.joining_date}
                    onChange={handleInputChange}
                  />
                  {getFieldError("joining_date") && (
                    <div className="text-danger small mt-1">
                      {getFieldError("joining_date")}
                    </div>
                  )}
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggle}>
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

export default AddAuthUserModal;
