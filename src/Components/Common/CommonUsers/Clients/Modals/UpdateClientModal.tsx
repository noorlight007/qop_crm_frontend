import { useUpdateClientDetailsMutation } from "@/Redux/Reducers/Common/CommonUsers/ClientsApi";
import {
  ClientInfoProps,
  UpdateClientModalProps,
} from "@/Types/Common/CommonUsers/ClientTypes";
import React, { useEffect, useState } from "react";
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

const UpdateClientModal: React.FC<UpdateClientModalProps> = ({
  isOpen,
  toggle,
  onSave,
  selectedClient,
}) => {
  const [clientData, setClientData] =
    useState<Partial<ClientInfoProps>>(selectedClient);
  const [isModified, setIsModified] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [updateClientDetails, { isLoading }] = useUpdateClientDetailsMutation();

  useEffect(() => {
    setClientData(selectedClient);
    setIsModified(false);
  }, [selectedClient]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    setClientData((prev) => {
      const updatedData = JSON.parse(JSON.stringify(prev));
      let current = updatedData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updatedData;
    });
    setIsModified(true);
  };

  const handleUpdateClient = async (clientData: Partial<ClientInfoProps>) => {
    try {
      if (!clientData.alias) return;

      const sanitizeMessage = (msg: any) => {
        if (msg == null) return "";
        let s = String(msg).trim();
        // Remove leading numeric codes like "400, ", "400 -", "400:"
        s = s.replace(/^\s*\d+\s*[,\-:]\s*/, "");
        s = s.replace(/^\s*\d+\s+/, "");
        // Remove any leading punctuation/spaces and isolated numeric codes
        s = s.replace(/^[^A-Za-z0-9]*\d+[^A-Za-z0-9]*/, "");
        s = s.replace(/^[^A-Za-z0-9]+/, "");
        // Remove bracketed codes or metadata
        s = s.replace(/\s*\(.*?\)/g, "");
        s = s.replace(/\s*\[.*?\]/g, "");
        // Collapse multiple spaces
        s = s.replace(/\s{2,}/g, " ").trim();
        return s;
      };

      const getErrorMessage = (err: any) => {
        if (!err) return sanitizeMessage("Unknown error");
        if (typeof err === "string") return sanitizeMessage(err);
        if (typeof err?.data === "string") return sanitizeMessage(err.data);

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

        if (err && typeof err === "object") {
          const msgs = collect(err).map((m) => sanitizeMessage(m));
          if (msgs.length) return msgs.join("");
        }

        if (err?.data?.message) return sanitizeMessage(err.data.message);

        if (err?.data && typeof err.data === "object") {
          const msgs = collect(err.data).map((m) => sanitizeMessage(m));
          if (msgs.length) return msgs.join("");
        }

        if (err?.error) return sanitizeMessage(err.error);
        if (err?.message) {
          if (/status code/i.test(err.message))
            return "Server returned an error";
          return sanitizeMessage(err.message);
        }

        try {
          return sanitizeMessage(JSON.stringify(err));
        } catch {
          return sanitizeMessage(String(err));
        }
      };

      const parseApiErrors = (err: any): Record<string, string> => {
        const out: Record<string, string> = {};
        const recurse = (value: any, path: string[] = []) => {
          if (value == null) return;
          if (typeof value === "string") {
            out[path.join(".")] = sanitizeMessage(value);
            return;
          }
          if (Array.isArray(value)) {
            const joined = value
              .map((v) =>
                sanitizeMessage(typeof v === "string" ? v : JSON.stringify(v)),
              )
              .join(", ");
            out[path.join(".")] = sanitizeMessage(joined);
            return;
          }
          if (typeof value === "object") {
            for (const k of Object.keys(value)) {
              recurse(value[k], path.concat(k));
            }
            return;
          }
          out[path.join(".")] = sanitizeMessage(String(value));
        };

        if (err?.data) recurse(err.data, []);
        else recurse(err, []);
        return out;
      };

      // Deep clone and sanitize payload
      let payload: Partial<ClientInfoProps> = JSON.parse(
        JSON.stringify(clientData),
      );

      // Remove invalid empty choice fields to satisfy backend validators
      if (payload.role === "" || payload.role == null) {
        delete (payload as any).role;
      }
      if (payload.source === "" || payload.source == null) {
        delete (payload as any).source;
      }
      if (
        (payload as any).enquiry_type === "" ||
        (payload as any).enquiry_type == null
      ) {
        delete (payload as any).enquiry_type;
      }

      // Only include email if it has changed
      const originalEmail = selectedClient?.user?.email || "";
      const updatedEmail = payload?.user?.email || "";
      if (originalEmail === updatedEmail && payload.user) {
        const { email, ...restUser } = payload.user;
        payload.user = restUser;
      }

      const result = await updateClientDetails({
        payload,
        clientAlias: clientData.alias,
      });

      if ((result as any)?.data) {
        setErrors({});
        toast.success("Client updated successfully.");
        return true;
      } else if ("error" in result) {
        const parsed = parseApiErrors(result.error);
        setErrors(parsed);

        const errorMessage =
          getErrorMessage(result.error) || "Invalid Request...";
        if (
          typeof errorMessage === "string" &&
          errorMessage.toLowerCase().includes("email") &&
          errorMessage.toLowerCase().includes("exist")
        ) {
          toast.error("User with this email already exists.");
        } else {
          toast.error(errorMessage);
        }
        return false;
      } else {
        toast.error("Failed to update client.");
        return false;
      }
    } catch (error) {
      setErrors({});
      toast.error("An error occurred while updating the client.");
      console.error("Error saving client:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await handleUpdateClient(clientData);
    if (success) {
      onSave(clientData);
      toggle();
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Update Client Info</span>
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <Row>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="title">Title*</Label>
                <Input
                  id="title"
                  name="user.title"
                  type="select"
                  value={clientData?.user?.title || ""}
                  onChange={handleChange}
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
                {errors["user.title"] && (
                  <div className="text-danger small mt-1">
                    {errors["user.title"]}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="firstName">First Name*</Label>
                <Input
                  type="text"
                  id="firstName"
                  name="user.first_name"
                  placeholder="First Name"
                  value={clientData.user?.first_name || ""}
                  onChange={handleChange}
                  className="mb-2"
                  required
                />
                {errors["user.first_name"] && (
                  <div className="text-danger small mt-1">
                    {errors["user.first_name"]}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="middleName">Middle Name</Label>
                <Input
                  type="text"
                  id="middleName"
                  name="user.middle_name"
                  placeholder="Middle Name"
                  value={clientData.user?.middle_name || ""}
                  onChange={handleChange}
                  className="mb-2"
                />
                {errors["user.middle_name"] && (
                  <div className="text-danger small mt-1">
                    {errors["user.middle_name"]}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="lastName">Last Name*</Label>
                <Input
                  type="text"
                  id="lastName"
                  name="user.last_name"
                  placeholder="Last Name"
                  value={clientData.user?.last_name || ""}
                  onChange={handleChange}
                  className="mb-2"
                  required
                />
                {errors["user.last_name"] && (
                  <div className="text-danger small mt-1">
                    {errors["user.last_name"]}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="email">Email*</Label>
                <Input
                  type="email"
                  id="email"
                  name="user.email"
                  placeholder="Email"
                  required
                  value={clientData?.user?.email || ""}
                  onChange={handleChange}
                  className="mb-2"
                />
                {errors["user.email"] && (
                  <div className="text-danger small mt-1">
                    {errors["user.email"]}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="phone">Phone</Label>
                <Input
                  type="number"
                  id="phone"
                  name="user.phone"
                  placeholder="Phone"
                  value={clientData?.user?.phone || ""}
                  onChange={handleChange}
                  className="mb-2"
                />
                {errors["user.phone"] && (
                  <div className="text-danger small mt-1">
                    {errors["user.phone"]}
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
                  value={clientData.source || ""}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  <option value="GOOGLE">Google</option>
                  <option value="SOCIAL_MEDIA">Social Media</option>
                  <option value="REFERRAL">Referral</option>
                  <option value="WEBSITE">Website</option>
                  <option value="OTHER">Other</option>
                </Input>
                {errors["source"] && (
                  <div className="text-danger small mt-1">
                    {errors["source"]}
                  </div>
                )}
              </FormGroup>
            </Col>
            {clientData.source === "OTHER" && (
              <Col md={6}>
                <FormGroup>
                  <Label for="other_source">Other Source</Label>
                  <Input
                    id="other_source"
                    name="other_source"
                    type="text"
                    value={clientData.other_source || ""}
                    onChange={handleChange}
                  />
                  {errors["other_source"] && (
                    <div className="text-danger small mt-1">
                      {errors["other_source"]}
                    </div>
                  )}
                </FormGroup>
              </Col>
            )}
            <Col md={6}>
              <Label for="reasonForEnquiry">Enquiry Type</Label>
              <FormGroup>
                <Input
                  id="reasonForEnquiry"
                  name="enquiry_type"
                  type="select"
                  value={clientData.enquiry_type || ""}
                  onChange={handleChange}
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
              </FormGroup>
              {errors["enquiry_type"] && (
                <div className="text-danger small mt-1">
                  {errors["enquiry_type"]}
                </div>
              )}
            </Col>
            {clientData.enquiry_type === "OTHER" && (
              <Col md={6}>
                <FormGroup>
                  <Label for="other_enquiry_type">Other Enquiry</Label>
                  <Input
                    id="other_enquiry_type"
                    name="other_enquiry_type"
                    type="text"
                    value={clientData.other_enquiry_type || ""}
                    onChange={handleChange}
                  />
                  {errors["other_enquiry_type"] && (
                    <div className="text-danger small mt-1">
                      {errors["other_enquiry_type"]}
                    </div>
                  )}
                </FormGroup>
              </Col>
            )}
            <Col md={6}>
              <FormGroup>
                <Label className="text-muted">Note</Label>
                <Input
                  type="textarea"
                  name="note"
                  id="note"
                  value={clientData.note || ""}
                  onChange={handleChange}
                  placeholder="Additional information about the lead..."
                />
                {errors["note"] && (
                  <div className="text-danger small mt-1">{errors["note"]}</div>
                )}
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button type="button" color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={!isModified || isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
export default UpdateClientModal;
