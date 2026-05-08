import { useAddOrganisationMutation } from "@/Redux/Reducers/Common/Organisations/OrganisationListApi";
import {
  AddOrganisationModalProps,
  AddOrganisationProps,
} from "@/Types/Common/Organisations/OrganisationsTypes";
import { countries } from "@/utils/Countries";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
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
      subdomain: "",
      primary_mobile: "",
      email: "",
      other_contact: "",
      contact_person: "",
      contact_person_designation: "",
      website: "",
      license_no: "",
    },
    address: {
      postcode: "",
      house_name_or_number: "",
      address_line_1: "",
      city: "",
      country: "",
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
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // Special handling for subdomain: allow lowercase letters, numbers and hyphen; show specific validation messages
    if (name === "subdomain") {
      const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
      // Show a small message when user typed disallowed characters or broke other rules
      let error: string | null = null;
      if (value && sanitized !== value) {
        error = "Only lowercase letters, numbers and hyphen (-) are allowed";
      } else if (value && (value.startsWith("-") || value.endsWith("-"))) {
        error = "Subdomain cannot start or end with a hyphen.";
      } else if (value && value.length > 63) {
        error = "Subdomain must be at most 63 characters long.";
      } else {
        error = null;
      }
      setSubdomainError(error);

      setFormData((prevState) => ({
        ...prevState,
        organization: {
          ...(prevState.organization as any),
          [name]: sanitized,
        },
      }));

      return;
    }

    const addressFields = new Set([
      "postcode",
      "house_name_or_number",
      "address_line_1",
      "city",
      "country",
    ]);

    if (addressFields.has(name)) {
      setFormData((prevState) => ({
        ...prevState,
        address: {
          ...(prevState.address as any),
          [name]: value,
        },
      }));
      return;
    }

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
        ...(prevState.user as any),
        [name]: fieldValue,
      },
    }));
  };

  // Tab state
  const [activeTab, setActiveTab] = useState<string>("organisation");
  const [orgValidated, setOrgValidated] = useState(false);
  const [addressValidated, setAddressValidated] = useState(false);
  // Local validation message for subdomain (client-side only)
  const [subdomainError, setSubdomainError] = useState<string | null>(null);
  // form ref for native validity/reporting
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setActiveTab("organisation");
    setApiErrors({});
    setOrgValidated(false);
    setAddressValidated(false);
    setSubdomainError(null);
  }, [isOpen]);
  const toggleTab = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  // Validate required organisation fields
  const validateOrganisation = () => {
    // Return true if required organisation fields are non-empty and valid.
    const name = ((formData as any).organization?.name || "").toString().trim();
    const subdomain = ((formData as any).organization?.subdomain || "")
      .toString()
      .trim();
    const primary = ((formData as any).organization?.primary_mobile || "")
      .toString()
      .trim();
    const email = ((formData as any).organization?.email || "")
      .toString()
      .trim();

    // Subdomain must be lowercase letters, numbers and hyphen only, cannot start/end with hyphen, and max 63 chars
    const subdomainRegex = /^[a-z0-9-]+$/;
    let subdomainValid = subdomainRegex.test(subdomain);
    if (!subdomain) {
      subdomainValid = false;
      setSubdomainError("Subdomain is required");
    } else if (!subdomainRegex.test(subdomain)) {
      subdomainValid = false;
      setSubdomainError(
        "Only lowercase letters, numbers and hyphen (-) are allowed",
      );
    } else if (subdomain.startsWith("-") || subdomain.endsWith("-")) {
      subdomainValid = false;
      setSubdomainError("Subdomain cannot start or end with a hyphen.");
    } else if (subdomain.length > 63) {
      subdomainValid = false;
      setSubdomainError("Subdomain must be at most 63 characters long.");
    } else {
      subdomainValid = true;
      setSubdomainError(null);
    }

    return !!(name && subdomain && primary && email && subdomainValid);
  };

  const validateAddress = () => {
    const postcode = ((formData as any).address?.postcode || "")
      .toString()
      .trim();
    const house = ((formData as any).address?.house_name_or_number || "")
      .toString()
      .trim();
    const addressLine1 = ((formData as any).address?.address_line_1 || "")
      .toString()
      .trim();
    const city = ((formData as any).address?.city || "").toString().trim();

    return !!(postcode && house && addressLine1 && city);
  };

  const onNext = async () => {
    if (activeTab === "organisation") {
      if (!validateOrganisation()) {
        if (formRef.current) {
          const ids = ["name", "subdomain", "primary_mobile", "email"];
          for (const id of ids) {
            const el = formRef.current.querySelector<HTMLInputElement>(
              `#${id}`,
            );
            if (el && !el.checkValidity()) {
              el.reportValidity();
              el.focus();
              break;
            }
          }
        }
        return;
      }

      // Only client-side validation is required to move to the next step.
      // Server-side validation (e.g. subdomain uniqueness) happens on final submit.
      setApiErrors({});
      setOrgValidated(true);
      toggleTab("address");
      return;
    }

    if (activeTab === "address") {
      if (!validateAddress()) {
        if (formRef.current) {
          const ids = [
            "postcode",
            "house_name_or_number",
            "address_line_1",
            "city",
          ];
          for (const id of ids) {
            const el = formRef.current.querySelector<HTMLInputElement>(
              `#${id}`,
            );
            if (el && !el.checkValidity()) {
              el.reportValidity();
              el.focus();
              break;
            }
          }
        }
        return;
      }

      setAddressValidated(true);
      toggleTab("user");
      return;
    }
  };

  const onBack = () => {
    if (activeTab === "user") {
      toggleTab("address");
      return;
    }
    toggleTab("organisation");
  };

  // Helper to flatten nested validation error payloads into [{ field, messages[] }]
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
        Object.entries(msgs).forEach(([k, v]) => {
          const next = fieldPath ? `${fieldPath}.${k}` : k;
          out.push(...flattenErrors(v, next));
        });
      } else out.push({ field: fieldPath, messages: [String(msgs)] });
    };

    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.entries(value).forEach(([k, v]) => {
        const next = prefix ? `${prefix}.${k}` : k;
        out.push(...flattenErrors(v, next));
      });
      return out;
    }

    if (prefix) pushMessages(prefix, value);
    else if (Array.isArray(value) || typeof value === "string")
      pushMessages("error", value);

    return out;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // final validation: ensure organisation required fields
    if (!validateOrganisation()) {
      if (formRef.current) {
        const ids = ["name", "subdomain", "primary_mobile", "email"];
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
            subdomain: "",
            primary_mobile: "",
            email: "",
            other_contact: "",
            contact_person: "",
            contact_person_designation: "",
            website: "",
            license_no: "",
          },
          address: {
            postcode: "",
            house_name_or_number: "",
            address_line_1: "",
            city: "",
            country: "",
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

      // Try to extract field errors and show toasts
      const source =
        error?.data && typeof error.data === "object" ? error.data : error;
      const flattened = flattenErrors(source);
      if (flattened.length) {
        // Build a map for rendering under inputs and show a toast for each field
        const map: Record<string, string[]> = {};
        flattened.forEach((entry) => {
          const field = entry.field || "error";
          map[field] = map[field]
            ? [...map[field], ...entry.messages]
            : [...entry.messages];
          const body = entry.messages.join(", ");
          // toast.error(body);
        });
        setApiErrors(map);

        // Switch to the relevant tab based on error field paths
        const firstField = flattened[0]?.field || Object.keys(map)[0];
        if (firstField && firstField.startsWith("user")) {
          toggleTab("user");
        } else {
          // default to organisation tab for organization / generic errors
          toggleTab("organisation");
        }
        return;
      }

      // Fallback: show aggregated message
      const msg =
        getErrorMessage(error) ||
        "Failed to add organisation. Please try again.";
      toast.error(msg);
    }
  };

  const handlePostcodeLookup = () => {
    toast.info("Postcode lookup is not available yet.");
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
                Information
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === "address"}
                onClick={() => {
                  if (orgValidated) {
                    toggleTab("address");
                  } else {
                    onNext();
                  }
                }}
                style={{ cursor: "pointer" }}
                className={`${activeTab === "address" ? "bg-primary" : "text-primary border-primary"}`}
              >
                Address
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === "user"}
                onClick={() => {
                  if (activeTab === "address") {
                    onNext();
                  } else if (orgValidated && addressValidated) {
                    toggleTab("user");
                  } else {
                    onNext();
                  }
                }}
                style={{ cursor: "pointer" }}
                className={`${activeTab === "user" ? "bg-primary" : "text-primary border-primary"}`}
              >
                Director
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
                      Organisation Name
                      <span className="text-danger">*</span>
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
                    <Label for="subdomain">
                      Sub Domain
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="subdomain"
                      name="subdomain"
                      value={formData.organization.subdomain}
                      onChange={handleChange}
                      placeholder="Enter organisation sub domain"
                      required
                      pattern="[a-z0-9-]+"
                      maxLength={63}
                      title="Only lowercase letters, numbers and hyphen (-) are allowed. Cannot start/end with hyphen. Max 63 chars."
                    />
                    {apiErrors["organization.subdomain"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["organization.subdomain"].join(", ")}
                      </div>
                    ) : subdomainError ? (
                      <div className="text-danger small mt-1">
                        {subdomainError}
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
                {/* <Col md={6} xs={12}>
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
                </Col> */}
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
            {/* Address Tab */}
            <TabPane tabId="address">
              <Row>
                <Col md={12} xs={12}>
                  <FormGroup>
                    <Label for="postcode">
                      Postcode<span className="text-danger">*</span>
                    </Label>
                    <InputGroup>
                      <Input
                        type="text"
                        id="postcode"
                        name="postcode"
                        value={formData.address.postcode}
                        onChange={handleChange}
                        placeholder="Enter postcode"
                        className="rounded-end-0"
                        required
                      />
                      <Button
                        color="info"
                        type="button"
                        className="text-nowrap rounded-start-0"
                        onClick={handlePostcodeLookup}
                      >
                        Lookup
                      </Button>
                    </InputGroup>
                    {apiErrors["address.postcode"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["address.postcode"].join(", ")}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="house_name_or_number">
                      House Name/Number<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="house_name_or_number"
                      name="house_name_or_number"
                      value={formData.address.house_name_or_number}
                      onChange={handleChange}
                      placeholder="Enter house name or number"
                      required
                    />
                    {apiErrors["address.house_name_or_number"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["address.house_name_or_number"].join(", ")}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="address_line_1">
                      Address Line 1<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="address_line_1"
                      name="address_line_1"
                      value={formData.address.address_line_1}
                      onChange={handleChange}
                      placeholder="Enter address line 1"
                      required
                    />
                    {apiErrors["address.address_line_1"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["address.address_line_1"].join(", ")}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="city">
                      City<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.address.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                      required
                    />
                    {apiErrors["address.city"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["address.city"].join(", ")}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>

                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="country">Country</Label>
                    <Input
                      type="select"
                      id="country"
                      name="country"
                      value={formData.address.country}
                      onChange={handleChange}
                      placeholder="Enter country"
                    >
                      <option value="">Select...</option>
                      {countries.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </Input>
                    {apiErrors["address.country"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["address.country"].join(", ")}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
              </Row>
            </TabPane>

            {/* User Tab */}
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
            {activeTab === "organisation" || activeTab === "address" ? (
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
