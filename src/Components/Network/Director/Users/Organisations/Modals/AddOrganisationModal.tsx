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
    organization: {
      name: "",
      primary_mobile: "",
      email: "",
      other_contact: "",
      contact_person: "",
      contact_person_designation: "",
      website: "",
      license_no: "",
    },
    user: {
      email: "",
      phone: "",
      title: null,
      first_name: "",
      middle_name: "",
      last_name: "",
    },
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
      organization: {
        ...(prevState.organization as any),
        [name]: value,
      },
    }));
  };

  // Handle user text input changes
  const handleUserChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    const fieldValue: any = type === "checkbox" ? checked : value;
    setFormData((prevState) => ({
      ...prevState,
      user: {
        ...(prevState.user as UserDataProps),
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
    const name = ((formData as any).organization?.name || "").toString().trim();
    const primary = ((formData as any).organization?.primary_mobile || "")
      .toString()
      .trim();
    const email = ((formData as any).organization?.email || "")
      .toString()
      .trim();
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
    toggleTab("user");
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

    // ensure entire form validity (includes user fields)
    if (formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }

    try {
      // Build JSON payload. Convert File -> base64 string when present.
      const userData = formData.user as any;

      // Build payload directly from formData (no file -> base64 conversion)
      const payload: Record<string, any> = { ...(formData as any) };

      if (userData) payload.user = userData;
      const response = await addOrganisation(payload).unwrap();

      if (response) {
        toast.success("Organisation added successfully!");
        // Clear the form data after submission
        setFormData({
          organization: {
            name: "",
            primary_mobile: "",
            email: "",
            other_contact: "",
            contact_person: "",
            contact_person_designation: "",
            website: "",
            license_no: "",
          },
          user: {
            email: "",
            phone: "",
            title: null,
            first_name: "",
            middle_name: "",
            last_name: "",
          },
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
          toast.error(`${body}`);
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
                active={activeTab === "user"}
                onClick={onNext}
                style={{ cursor: "pointer" }}
                className={`${activeTab === "user" ? "bg-primary" : "text-primary border-primary"}`}
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
                      value={formData.organization.name}
                      onChange={handleChange}
                      placeholder="Enter organisation name"
                      required
                    />
                    {apiErrors["organization.name"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["organization.name"].join(", ")}
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
                      value={formData.organization.primary_mobile}
                      onChange={handleChange}
                      placeholder="Enter primary mobile number"
                      required
                    />
                    {apiErrors["organization.primary_mobile"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["organization.primary_mobile"].join(", ")}
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
                      value={formData.organization.other_contact}
                      onChange={handleChange}
                      placeholder="Enter other contact person's phone"
                    />
                    {apiErrors["organization.other_contact"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["organization.other_contact"].join(", ")}
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
                      value={formData.organization.license_no}
                      onChange={handleChange}
                      placeholder="Enter license number"
                    />
                    {apiErrors["organization.license_no"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["organization.license_no"].join(", ")}
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
                      value={formData.organization.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      required
                    />
                    {apiErrors["organization.email"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["organization.email"].join(", ")}
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
                      value={formData.organization.website}
                      onChange={handleChange}
                      placeholder="Enter website URL"
                    />
                    {apiErrors["organization.website"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["organization.website"].join(", ")}
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
                      value={formData.organization.contact_person}
                      onChange={handleChange}
                      placeholder="Enter contact person's name"
                    />
                    {apiErrors["organization.contact_person"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["organization.contact_person"].join(", ")}
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
                      value={formData.organization.contact_person_designation}
                      onChange={handleChange}
                      placeholder="Enter contact person's designation"
                    />
                    {apiErrors["organization.contact_person_designation"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors[
                          "organization.contact_person_designation"
                        ].join(", ")}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
              </Row>
            </TabPane>

            <TabPane tabId="user">
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
                      value={formData.user.title ?? ""}
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
                    {apiErrors["user.title"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["user.title"].join(", ")}
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
                      value={formData.user?.first_name}
                      onChange={handleUserChange}
                      placeholder="Enter first name"
                      required
                    />
                    {apiErrors["user.first_name"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["user.first_name"].join(", ")}
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
                      value={formData.user?.middle_name}
                      onChange={handleUserChange}
                      placeholder="Enter middle name"
                    />
                    {apiErrors["user.middle_name"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["user.middle_name"].join(", ")}
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
                      value={formData.user?.last_name}
                      onChange={handleUserChange}
                      placeholder="Enter last name"
                      required
                    />
                    {apiErrors["user.last_name"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["user.last_name"].join(", ")}
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
                      value={formData.user?.email}
                      onChange={handleUserChange}
                      placeholder="Enter user email"
                      required
                    />
                    {apiErrors["user.email"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["user.email"].join(", ")}
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
                      value={formData.user?.phone}
                      onChange={handleUserChange}
                      placeholder="Enter user phone"
                    />
                    {apiErrors["user.phone"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["user.phone"].join(", ")}
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
            {activeTab === "user" ? (
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
