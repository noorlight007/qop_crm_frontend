import { useAddNetworkMutation } from "@/Redux/Reducers/SuperAdmin/Networks/NetworksApi";
import {
  AddNetworkModalProps,
  NetworkFormData,
} from "@/Types/SuperAdmin/Networks/NetworkType";
import { countries } from "@/utils/Countries";
import { validateAndSanitizePhone } from "@/utils/inputHandlers";
import { useRef, useState } from "react";
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

const AddNetworkModal: React.FC<AddNetworkModalProps> = ({
  isOpen,
  toggle,
}) => {
  const [formData, setFormData] = useState<NetworkFormData>({
    network: {
      name: "",
      subdomain: "",
      primary_mobile: "",
      email: "",
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
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    },
  });

  // API validation errors keyed by dot-notated field paths
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});

  // Local phone validation errors
  const [phoneErrors, setPhoneErrors] = useState({
    primary_mobile: "",
    user_phone: "",
  });

  // RTK hooks
  const [addNetwork, { isLoading }] = useAddNetworkMutation();

  // Tab state
  const [activeTab, setActiveTab] = useState<string>("network");

  // API validation state (used when user clicks "Go Next")
  const [validating, setValidating] = useState(false);
  const [networkValidated, setNetworkValidated] = useState(false);

  // Form ref for native validity/reporting
  const formRef = useRef<HTMLFormElement | null>(null);

  const toggleTab = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  // Handle text input changes for network fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Special handling for primary_mobile: validate and sanitize using utility
    if (name === "primary_mobile") {
      const result = validateAndSanitizePhone(value);

      setPhoneErrors((prev) => ({
        ...prev,
        primary_mobile: result.errorMessage,
      }));

      setFormData((prevState) => ({
        ...prevState,
        network: {
          ...prevState.network,
          [name]: result.sanitized,
        },
      }));
      return;
    }

    setFormData((prevState) => ({
      ...prevState,
      network: {
        ...prevState.network,
        [name]: value,
      },
    }));
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      address: {
        ...prevState.address,
        [name]: value,
      },
    }));
  };

  // Handle user text input changes
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Special handling for phone: validate and sanitize using utility
    if (name === "phone") {
      const result = validateAndSanitizePhone(value);

      setPhoneErrors((prev) => ({
        ...prev,
        user_phone: result.errorMessage,
      }));

      setFormData((prevState) => ({
        ...prevState,
        user: {
          ...prevState.user,
          [name]: result.sanitized,
        },
      }));
      return;
    }

    setFormData((prevState) => ({
      ...prevState,
      user: {
        ...prevState.user,
        [name]: value,
      },
    }));
  };

  const handlePostcodeLookup = () => {
    toast.info("Postcode lookup is not available yet.");
  };

  // Validate required network header fields (before address step)
  const validateNetworkHeader = () => {
    const name = formData.network.name.trim();
    const subdomain = formData.network.subdomain.trim();
    const primary = formData.network.primary_mobile.trim();
    const email = formData.network.email.trim();

    return !!(name && subdomain && primary && email);
  };

  // Validate required address fields in the address step
  const validateAddress = () => {
    const postcode = formData.address.postcode.trim();
    const houseNameOrNumber = formData.address.house_name_or_number.trim();
    const address1 = formData.address.address_line_1.trim();
    const city = formData.address.city.trim();

    return !!(postcode && houseNameOrNumber && address1 && city);
  };

  // Validate full network fields for final submission
  const validateNetwork = () => {
    const name = formData.network.name.trim();
    const subdomain = formData.network.subdomain.trim();
    const primary = formData.network.primary_mobile.trim();
    const email = formData.network.email.trim();

    return !!(name && subdomain && primary && email);
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

  const onNext = async () => {
    if (activeTab === "network") {
      if (!validateNetworkHeader()) {
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

      setActiveTab("address");
      return;
    }

    if (activeTab === "address") {
      if (!validateAddress()) {
        if (formRef.current) {
          const ids = ["postcode", "house_name_or_number", "address_1", "city"];
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

      setValidating(true);
      try {
        const payload = { network: { ...formData.network } };
        await addNetwork({ payload }).unwrap();
        setApiErrors({});
        setNetworkValidated(true);
        toast.success("Network validated");
        toggleTab("user");
      } catch (error: any) {
        console.error("Network validation error:", error);
        const source =
          error?.data && typeof error.data === "object" ? error.data : error;
        const flattened = flattenErrors(source);
        if (flattened.length) {
          const map: Record<string, string[]> = {};
          flattened.forEach((entry) => {
            const field = entry.field || "error";
            map[field] = map[field]
              ? [...map[field], ...entry.messages]
              : [...entry.messages];
          });
          setApiErrors(map);

          const firstField = flattened[0]?.field || Object.keys(map)[0];
          if (firstField && firstField.startsWith("user")) {
            toggleTab("user");
          } else if (firstField && firstField.includes("address")) {
            toggleTab("address");
          } else {
            toggleTab("network");
          }
        } else {
          const msg = getErrorMessage(error) || "Validation failed";
          toast.error(msg);
        }
      } finally {
        setValidating(false);
      }
    }
  };

  const onBack = () => {
    if (activeTab === "user") {
      toggleTab("address");
      return;
    }

    if (activeTab === "address") {
      toggleTab("network");
      return;
    }

    toggleTab("network");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation: ensure network required fields
    if (!validateNetwork()) {
      if (formRef.current) {
        const ids = [
          "name",
          "subdomain",
          "postcode",
          "house_name_or_number",
          "address_line_1",
          "city",
          "primary_mobile",
          "email",
        ];
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

    // Ensure entire form validity (includes user fields)
    if (formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }

    try {
      // Build JSON payload
      const payload = {
        network: { ...formData.network },
        address: { ...formData.address },
        user: { ...formData.user },
      };

      const response = await addNetwork({ payload }).unwrap();

      if (response) {
        toast.success("Network added successfully!");
        // Clear the form data after submission
        setFormData({
          network: {
            name: "",
            subdomain: "",
            primary_mobile: "",
            email: "",
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
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
          },
        });
        setApiErrors({});
        setPhoneErrors({
          primary_mobile: "",
          user_phone: "",
        });
        setActiveTab("network");
        setNetworkValidated(false);
        toggle();
      }
    } catch (error: any) {
      console.error("Add network error:", error);

      // Try to extract field errors and show toasts
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
        });
        setApiErrors(map);

        // Switch to the relevant tab based on error field paths
        const firstField = flattened[0]?.field || Object.keys(map)[0];
        if (firstField && firstField.startsWith("user")) {
          toggleTab("user");
        } else {
          // Default to network tab for network / generic errors
          toggleTab("network");
        }
        return;
      }

      // Fallback: show aggregated message
      const msg =
        getErrorMessage(error) || "Failed to add network. Please try again.";
      toast.error(msg);
    }
  };

  const handleClose = () => {
    setFormData({
      network: {
        name: "",
        subdomain: "",
        primary_mobile: "",
        email: "",
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
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
      },
    });
    setApiErrors({});
    setPhoneErrors({
      primary_mobile: "",
      user_phone: "",
    });
    setActiveTab("network");
    setNetworkValidated(false);
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="lg" centered>
      <ModalHeader toggle={handleClose}>
        <h3 className="text-primary">Add New Network</h3>
      </ModalHeader>
      <Form innerRef={formRef} onSubmit={handleSubmit}>
        <ModalBody>
          <Nav pills className="d-flex justify-content-center gap-2">
            <NavItem>
              <NavLink
                active={activeTab === "network"}
                onClick={() => toggleTab("network")}
                style={{ cursor: "pointer" }}
                className={`${activeTab === "network" ? "bg-primary" : "text-primary border-primary"}`}
              >
                Information
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === "address"}
                onClick={() => activeTab !== "address" && onNext()}
                style={{ cursor: "pointer" }}
                className={`${activeTab === "address" ? "bg-primary" : "text-primary border-primary"}`}
              >
                Address
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === "user"}
                onClick={() => activeTab !== "user" && onNext()}
                style={{ cursor: "pointer" }}
                className={`${activeTab === "user" ? "bg-primary" : "text-primary border-primary"}`}
              >
                Director
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab} className="mt-3">
            <TabPane tabId="network">
              <Row>
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="name">
                      Network Name
                      <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.network.name}
                      onChange={handleChange}
                      placeholder="Enter network name"
                      required
                    />
                    {apiErrors["network.name"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["network.name"].join(", ")}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>

                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="subdomain">
                      Subdomain<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="subdomain"
                      name="subdomain"
                      value={formData.network.subdomain}
                      onChange={handleChange}
                      placeholder="Enter subdomain (e.g., acme)"
                      required
                      pattern="^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$"
                      title="Only lowercase letters, numbers and hyphens — cannot start or end with a hyphen"
                    />
                    {apiErrors["network.subdomain"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["network.subdomain"].join(", ")}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>

                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="email">
                      Email<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.network.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      required
                    />
                    {apiErrors["network.email"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["network.email"].join(", ")}
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
                      type="tel"
                      id="primary_mobile"
                      name="primary_mobile"
                      value={formData.network.primary_mobile}
                      onChange={handleChange}
                      placeholder="Enter primary mobile"
                      required
                      pattern="^\+?\d+$"
                      title="Phone number can only contain + and digits"
                    />
                    {apiErrors["network.primary_mobile"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["network.primary_mobile"].join(", ")}
                      </div>
                    ) : phoneErrors.primary_mobile ? (
                      <div className="text-danger small mt-1">
                        {phoneErrors.primary_mobile}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>

                <Col>
                  <FormGroup>
                    <Label for="license_no">License Number</Label>
                    <Input
                      type="text"
                      id="license_no"
                      name="license_no"
                      value={formData.network.license_no}
                      onChange={handleChange}
                      placeholder="Enter license number"
                    />
                    {apiErrors["network.license_no"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["network.license_no"].join(", ")}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
              </Row>
            </TabPane>

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
                        onChange={handleAddressChange}
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
                      House Name or Number<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="house_name_or_number"
                      name="house_name_or_number"
                      value={formData.address.house_name_or_number}
                      onChange={handleAddressChange}
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
                      Address L1<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="address_line_1"
                      name="address_line_1"
                      value={formData.address.address_line_1}
                      onChange={handleAddressChange}
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
                      onChange={handleAddressChange}
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
                      onChange={handleAddressChange}
                    >
                      <option value="">Please select a country</option>
                      {countries.map((c) => (
                        <option key={c.code} value={c.code}>
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

            <TabPane tabId="user">
              <Row>
                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="user_first_name">
                      First Name<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="user_first_name"
                      name="first_name"
                      value={formData.user.first_name}
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
                    <Label for="user_last_name">
                      Last Name<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="user_last_name"
                      name="last_name"
                      value={formData.user.last_name}
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
                      value={formData.user.email}
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
                    <Label for="user_phone">
                      Phone<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="tel"
                      id="user_phone"
                      name="phone"
                      value={formData.user.phone}
                      onChange={handleUserChange}
                      placeholder="Enter user phone"
                      required
                      pattern="^\+?\d+$"
                      title="Phone number can only contain + and digits"
                    />
                    {apiErrors["user.phone"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["user.phone"].join(", ")}
                      </div>
                    ) : phoneErrors.user_phone ? (
                      <div className="text-danger small mt-1">
                        {phoneErrors.user_phone}
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
            {activeTab !== "network" ? (
              <Button color="secondary" type="button" onClick={onBack}>
                Back
              </Button>
            ) : null}
          </div>
          <div className="d-flex gap-1">
            <Button
              color="warning"
              onClick={handleClose}
              disabled={isLoading || validating}
            >
              Cancel
            </Button>
            {activeTab === "user" ? (
              <Button color="primary" type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Network"}
              </Button>
            ) : (
              <Button
                color="primary"
                type="button"
                onClick={onNext}
                disabled={validating}
              >
                {validating ? "Validating..." : "Go Next"}
              </Button>
            )}
          </div>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddNetworkModal;
