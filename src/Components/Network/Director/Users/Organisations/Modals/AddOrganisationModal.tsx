import { useAddOrganisationMutation } from "@/Redux/Reducers/Network/Director/Organisations/OrganisationListApi";
import {
  AddOrganisationModalProps,
  AddOrganisationProps,
  UserDataProps,
} from "@/Types/Network/Director/OrganisationsTypes";
import { useRef, useState } from "react";
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
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";

const getErrorMessage = (err: any) => {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (typeof err?.data === "string") return err.data;

  const collect = (value: any): string[] => {
    if (value == null) return [];
    if (typeof value === "string") return [value];
    if (Array.isArray(value))
      return value.map((v) => (typeof v === "string" ? v : JSON.stringify(v)));
    if (typeof value === "object") {
      try {
        return Object.values(value).flatMap((v) => collect(v));
      } catch {
        return [String(value)];
      }
    }
    return [String(value)];
  };

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

const AddOrganisationModal: React.FC<AddOrganisationModalProps> = ({
  isOpen,
  toggleModal,
}) => {
  const [formData, setFormData] = useState<AddOrganisationProps>({
    user_data: {
      email: "",
      phone: "",
      title: null,
      first_name: "",
      middle_name: "",
      last_name: "",
    },
    name: "",
    email: "",
    primary_mobile: "",
    other_contact: "",
    contact_person: "",
    contact_person_designation: "",
    website: "",
    license_no: "",
  });
  // API validation errors keyed by dot-notated field paths
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});
  // rtk hooks
  const [addOrganisation, { isLoading }] = useAddOrganisationMutation();

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle user_data text input changes
  const handleUserChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    const fieldValue: any = type === "checkbox" ? checked : value;
    setFormData((prevState) => ({
      ...prevState,
      user_data: {
        ...(prevState.user_data as UserDataProps),
        [name]: fieldValue,
      },
    }));
  };

  // Tab state
  const [activeTab, setActiveTab] = useState<string>("organisation");
  // form ref for native validity/reporting
  const formRef = useRef<HTMLFormElement | null>(null);
  const toggleTab = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  // Validate required organisation fields
  const validateOrganisation = () => {
    // Return true if required organisation fields are non-empty.
    const name = ((formData as any).name || "").toString().trim();
    const primary = ((formData as any).primary_mobile || "").toString().trim();
    const email = ((formData as any).email || "").toString().trim();
    return !!(name && primary && email);
  };

  const onNext = () => {
    if (!validateOrganisation()) {
      // show native browser validation on the first invalid organisation field
      if (formRef.current) {
        const ids = ["name", "primary_mobile", "email"];
        for (const id of ids) {
          const el = formRef.current.querySelector<HTMLInputElement>(`#${id}`);
          if (el && !el.checkValidity()) {
            el.reportValidity();
            el.focus();
            break;
          }
        }
      }
      return;
    }
    toggleTab("user_data");
  };

  const onBack = () => {
    toggleTab("organisation");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // final validation: ensure organisation required fields
    if (!validateOrganisation()) {
      if (formRef.current) {
        const ids = ["name", "primary_mobile", "email"];
        for (const id of ids) {
          const el = formRef.current.querySelector<HTMLInputElement>(`#${id}`);
          if (el && !el.checkValidity()) {
            el.reportValidity();
            el.focus();
            break;
          }
        }
      }
      return;
    }

    // ensure entire form validity (includes user_data fields)
    if (formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }

    try {
      // Build JSON payload. Convert File -> base64 string when present.
      const userData = formData.user_data as any;

      const fileToBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });

      const payload: Record<string, any> = {};

      for (const key in formData) {
        if (key === "user_data") continue;
        const val = (formData as any)[key];
        if (val === null || val === "") continue;
        if (val instanceof File) {
          try {
            payload[key] = await fileToBase64(val as File);
          } catch (err) {
            console.warn("Failed to convert file to base64", err);
          }
        } else {
          payload[key] = val;
        }
      }

      if (userData) payload.user_data = userData;

      console.log("Organisation JSON payload:", JSON.stringify(payload));

      const response = await addOrganisation({ payload }).unwrap();

      console.log("Response:", response);

      if (response) {
        toast.success("Organisation added successfully!");
        // Clear the form data after submission
        setFormData({
          user_data: {
            email: "",
            phone: "",
            title: null,
            first_name: "",
            middle_name: "",
            last_name: "",
          },
          name: "",
          email: "",
          primary_mobile: "",
          other_contact: "",
          contact_person: "",
          contact_person_designation: "",
          website: "",
          license_no: "",
        });
        toggleModal();
      }
    } catch (error: any) {
      console.error("Add organisation error:", error);

      // If API returned a field->messages object, flatten nested fields and show each specific field's messages.
      const flattenErrors = (
        value: any,
        prefix = "",
      ): Array<{ field: string; messages: string[] }> => {
        const out: Array<{ field: string; messages: string[] }> = [];

        const pushMessages = (fieldPath: string, msgs: any) => {
          if (msgs == null) return;
          if (typeof msgs === "string")
            out.push({ field: fieldPath, messages: [msgs] });
          else if (Array.isArray(msgs))
            out.push({
              field: fieldPath,
              messages: msgs.map((m) =>
                typeof m === "string" ? m : JSON.stringify(m),
              ),
            });
          else if (typeof msgs === "object") {
            // object with nested fields -> recurse
            Object.entries(msgs).forEach(([k, v]) => {
              const next = fieldPath ? `${fieldPath}.${k}` : k;
              out.push(...flattenErrors(v, next));
            });
          } else out.push({ field: fieldPath, messages: [String(msgs)] });
        };

        // If incoming value is an object representing multiple fields
        if (value && typeof value === "object" && !Array.isArray(value)) {
          Object.entries(value).forEach(([k, v]) => {
            const next = prefix ? `${prefix}.${k}` : k;
            out.push(...flattenErrors(v, next));
          });
          return out;
        }

        // Otherwise push messages for the prefix path
        if (prefix) pushMessages(prefix, value);
        else if (Array.isArray(value) || typeof value === "string")
          pushMessages("error", value);

        return out;
      };

      const source =
        error?.data && typeof error.data === "object" ? error.data : error;
      const flattened = flattenErrors(source);
      if (flattened.length) {
        // Build a map for rendering under inputs
        const map: Record<string, string[]> = {};
        flattened.forEach((entry) => {
          const field = entry.field || "error";
          map[field] = map[field]
            ? [...map[field], ...entry.messages]
            : [...entry.messages];
          const body = entry.messages.join(", ");
          toast.error(`${field}: ${body}`);
        });
        setApiErrors(map);
        return;
      }

      // Fallback: show aggregated message
      const msg =
        getErrorMessage(error) ||
        "Failed to add organisation. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggleModal} size="lg" centered>
      <ModalHeader toggle={toggleModal}>
        <h3 className="text-primary">Add New Organisation</h3>{" "}
      </ModalHeader>
      <Form innerRef={formRef} onSubmit={handleSubmit}>
        <ModalBody>
          <Nav pills className="d-flex justify-content-center gap-2">
            <NavItem>
              <NavLink
                active={activeTab === "organisation"}
                onClick={() => toggleTab("organisation")}
                style={{ cursor: "pointer" }}
                className={`${activeTab === "organisation" ? "bg-primary" : "text-primary border-primary"}`}
              >
                Organisation
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === "user_data"}
                onClick={onNext}
                style={{ cursor: "pointer" }}
                className={`${activeTab === "user_data" ? "bg-primary" : "text-primary border-primary"}`}
              >
                Organisation Director
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab} className="mt-3">
            <TabPane tabId="organisation">
              <Row>
                {/* 1st colunm  */}
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="name">
                      Organisation Name<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter organisation name"
                      required
                    />
                    {apiErrors.name ? (
                      <div className="text-danger small mt-1">
                        {apiErrors.name.join(", ")}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="primary_mobile">
                      Primary Mobile<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="primary_mobile"
                      name="primary_mobile"
                      value={formData.primary_mobile}
                      onChange={handleChange}
                      placeholder="Enter primary mobile number"
                      required
                    />
                    {apiErrors.primary_mobile ? (
                      <div className="text-danger small mt-1">
                        {apiErrors.primary_mobile.join(", ")}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="other_contact">Other Contact</Label>
                    <Input
                      type="text"
                      id="other_contact"
                      name="other_contact"
                      value={formData.other_contact}
                      onChange={handleChange}
                      placeholder="Enter other contact person's phone"
                    />
                    {apiErrors.other_contact ? (
                      <div className="text-danger small mt-1">
                        {apiErrors.other_contact.join(", ")}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>

                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="license_no">License Number</Label>
                    <Input
                      type="text"
                      id="license_no"
                      name="license_no"
                      value={formData.license_no}
                      onChange={handleChange}
                      placeholder="Enter license number"
                    />
                    {apiErrors.license_no ? (
                      <div className="text-danger small mt-1">
                        {apiErrors.license_no.join(", ")}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>

                {/* 2nd Column  */}
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="email">
                      Email<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      required
                    />
                    {apiErrors.email ? (
                      <div className="text-danger small mt-1">
                        {apiErrors.email.join(", ")}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="website">
                      Website{" "}
                      <span style={{ fontSize: "0.7rem", color: "#f39c12" }}>
                        (Example: https://yourdomain.com)
                      </span>
                    </Label>
                    <Input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="Enter website URL"
                    />
                    {apiErrors.website ? (
                      <div className="text-danger small mt-1">
                        {apiErrors.website.join(", ")}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="contact_person">Contact Person</Label>
                    <Input
                      type="text"
                      id="contact_person"
                      name="contact_person"
                      value={formData.contact_person}
                      onChange={handleChange}
                      placeholder="Enter contact person's name"
                    />
                    {apiErrors.contact_person ? (
                      <div className="text-danger small mt-1">
                        {apiErrors.contact_person.join(", ")}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="contact_person_designation">
                      Contact Person Designation
                    </Label>
                    <Input
                      type="text"
                      id="contact_person_designation"
                      name="contact_person_designation"
                      value={formData.contact_person_designation}
                      onChange={handleChange}
                      placeholder="Enter contact person's designation"
                    />
                    {apiErrors.contact_person_designation ? (
                      <div className="text-danger small mt-1">
                        {apiErrors.contact_person_designation.join(", ")}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
              </Row>
            </TabPane>

            <TabPane tabId="user_data">
              <Row>
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="user_title">
                      Title<span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="user_title"
                      name="title"
                      type="select"
                      value={formData.user_data.title ?? ""}
                      onChange={handleUserChange}
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
                    {apiErrors["user_data.title"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["user_data.title"].join(", ")}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="user_first_name">
                      First Name<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="user_first_name"
                      name="first_name"
                      value={formData.user_data?.first_name}
                      onChange={handleUserChange}
                      placeholder="Enter first name"
                      required
                    />
                    {apiErrors["user_data.first_name"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["user_data.first_name"].join(", ")}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="user_middle_name">Middle Name</Label>
                    <Input
                      type="text"
                      id="user_middle_name"
                      name="middle_name"
                      value={formData.user_data?.middle_name}
                      onChange={handleUserChange}
                      placeholder="Enter middle name"
                    />
                    {apiErrors["user_data.middle_name"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["user_data.middle_name"].join(", ")}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="user_last_name">
                      Last Name<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="user_last_name"
                      name="last_name"
                      value={formData.user_data?.last_name}
                      onChange={handleUserChange}
                      placeholder="Enter last name"
                      required
                    />
                    {apiErrors["user_data.last_name"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["user_data.last_name"].join(", ")}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="user_email">
                      Email<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="email"
                      id="user_email"
                      name="email"
                      value={formData.user_data?.email}
                      onChange={handleUserChange}
                      placeholder="Enter user email"
                      required
                    />
                    {apiErrors["user_data.email"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["user_data.email"].join(", ")}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="user_phone">Phone</Label>
                    <Input
                      type="text"
                      id="user_phone"
                      name="phone"
                      value={formData.user_data?.phone}
                      onChange={handleUserChange}
                      placeholder="Enter user phone"
                    />
                    {apiErrors["user_data.phone"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["user_data.phone"].join(", ")}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </ModalBody>
        <ModalFooter className="d-flex justify-content-between">
          <div>
            {activeTab === "user_data" ? (
              <Button color="secondary" type="button" onClick={onBack}>
                Back
              </Button>
            ) : null}
          </div>
          <div className="d-flex gap-1">
            <Button color="warning" onClick={toggleModal}>
              Cancel
            </Button>
            {activeTab === "organisation" ? (
              <Button color="primary" type="button" onClick={onNext}>
                Go Next
              </Button>
            ) : (
              <Button color="primary" type="submit">
                {isLoading ? "Saving..." : "Save Organisation"}
              </Button>
            )}
          </div>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddOrganisationModal;
