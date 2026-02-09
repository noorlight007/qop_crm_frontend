import { useAddNetworkMutation } from "@/Redux/Reducers/Admin/Networks/NetworksApi";
import { AddNetworkModalProps, NetworkFormData } from "@/Types/Admin/Networks/NetworkType";
import { validateAndSanitizePhone } from "@/utils/inputHandlers";
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

const AddNetworkModal: React.FC<AddNetworkModalProps> = ({
  isOpen,
  toggle,
}) => {
  const [formData, setFormData] = useState<NetworkFormData>({
    network: {
      name: "",
      address: "",
      primary_mobile: "",
      email: "",
      license_no: "",
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
      
      setPhoneErrors(prev => ({
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

  // Handle user text input changes
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Special handling for phone: validate and sanitize using utility
    if (name === "phone") {
      const result = validateAndSanitizePhone(value);
      
      setPhoneErrors(prev => ({
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

  // Validate required network fields
  const validateNetwork = () => {
    const name = formData.network.name.trim();
    const primary = formData.network.primary_mobile.trim();
    const email = formData.network.email.trim();
    const address = formData.network.address.trim();

    return !!(name && primary && email && address);
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
    if (!validateNetwork()) {
      // Show native browser validation on the first invalid network field
      if (formRef.current) {
        const ids = ["name", "address", "primary_mobile", "email"];
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

    // Call API to validate network fields before moving to user tab
    setValidating(true);
    try {
      const payload = { network: { ...formData.network } };
      const res = await addNetwork({payload}).unwrap();
      // Consider success as validation success (server did not return field errors)
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
  };

  const onBack = () => {
    toggleTab("network");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation: ensure network required fields
    if (!validateNetwork()) {
      if (formRef.current) {
        const ids = ["name", "address", "primary_mobile", "email"];
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
        user: { ...formData.user },
      };

      const response = await addNetwork({payload}).unwrap();

      if (response) {
        toast.success("Network added successfully!");
        // Clear the form data after submission
        setFormData({
          network: {
            name: "",
            address: "",
            primary_mobile: "",
            email: "",
            license_no: "",
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
        address: "",
        primary_mobile: "",
        email: "",
        license_no: "",
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
                Network
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === "user"}
                onClick={onNext}
                style={{ cursor: "pointer" }}
                className={`${activeTab === "user" ? "bg-primary" : "text-primary border-primary"}`}
              >
                Network Admin
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
                      placeholder="Enter primary mobile (e.g., +8801700000000)"
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

                <Col md={6} xs={12}>
                  <FormGroup>
                    <Label for="address">
                      Address<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.network.address}
                      onChange={handleChange}
                      placeholder="Enter address"
                      required
                    />
                    {apiErrors["network.address"] ? (
                      <div className="text-danger small mt-1">
                        {apiErrors["network.address"].join(", ")}
                      </div>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label for="license_no">
                      License Number<span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="license_no"
                      name="license_no"
                      value={formData.network.license_no}
                      onChange={handleChange}
                      placeholder="Enter license number"
                      required
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
                      placeholder="Enter user phone (e.g., +8801700000000)"
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
            {activeTab === "user" ? (
              <Button color="secondary" type="button" onClick={onBack}>
                Back
              </Button>
            ) : null}
          </div>
          <div className="d-flex gap-1">
            <Button color="warning" onClick={handleClose} disabled={isLoading || validating}>
              Cancel
            </Button>
            {activeTab === "network" ? (
              <Button
                color="primary"
                type="button"
                onClick={onNext}
                disabled={validating}
              >
                {validating ? "Validating..." : "Go Next"}
              </Button>
            ) : (
              <Button color="primary" type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Network"}
              </Button>
            )}
          </div>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddNetworkModal;