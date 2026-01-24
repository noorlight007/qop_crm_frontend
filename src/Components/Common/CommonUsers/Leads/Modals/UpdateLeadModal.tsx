import { useUpdateLeadDetailsMutation } from "@/Redux/Reducers/CommonComponents/CommonUsers/LeadsApi";
import {
  LeadsInfo,
  UpdateLeadModalProps,
} from "@/Types/CommonComponents/CommonUsers/LeadTypes";
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

const UpdateLeadModal: React.FC<UpdateLeadModalProps> = ({
  isOpen,
  toggle,
  onSave,
  selectedLead,
}) => {
  const [leadData, setLeadData] = useState<Partial<LeadsInfo>>(selectedLead);
  const [isModified, setIsModified] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [updateLeadDetails, { isLoading }] = useUpdateLeadDetailsMutation();

  useEffect(() => {
    setLeadData(selectedLead);
    setIsModified(false);
  }, [selectedLead]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // Clear any existing error for this specific field when user edits it
    setErrors((prev) => {
      if (!prev) return prev;
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
    const keys = name.split(".");
    setLeadData((prev: any) => {
      const updatedData = JSON.parse(JSON.stringify(prev));
      let current: any = updatedData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updatedData as Partial<LeadsInfo>;
    });
    setIsModified(true); // Set the form as modified
  };

  const normalizeApiErrors = (err: any): Record<string, string[]> => {
    const newErrors: Record<string, string[]> = {};
    const data =
      (err?.error && (err.error as any).data) ||
      err?.response?.data ||
      err?.data ||
      err;

    if (data?.user && typeof data.user === "object") {
      const user = data.user as Record<string, any>;
      if (user.title)
        newErrors["user.title"] = Array.isArray(user.title)
          ? user.title
          : [String(user.title)];
      if (user.first_name)
        newErrors["user.first_name"] = Array.isArray(user.first_name)
          ? user.first_name
          : [String(user.first_name)];
      if (user.middle_name)
        newErrors["user.middle_name"] = Array.isArray(user.middle_name)
          ? user.middle_name
          : [String(user.middle_name)];
      if (user.last_name)
        newErrors["user.last_name"] = Array.isArray(user.last_name)
          ? user.last_name
          : [String(user.last_name)];
      if (user.email)
        newErrors["user.email"] = Array.isArray(user.email)
          ? user.email
          : [String(user.email)];
      if (user.phone)
        newErrors["user.phone"] = Array.isArray(user.phone)
          ? user.phone
          : [String(user.phone)];
      if (user.nid)
        newErrors["user.nid"] = Array.isArray(user.nid)
          ? user.nid
          : [String(user.nid)];
    }

    if (data?.reason_for_enquiry)
      newErrors["reason_for_enquiry"] = Array.isArray(data.reason_for_enquiry)
        ? data.reason_for_enquiry
        : [String(data.reason_for_enquiry)];
    if (data?.detail && typeof data.detail === "string")
      newErrors._general = [data.detail];

    return newErrors;
  };

  const handleUpdateLead = async (leadData: Partial<LeadsInfo>) => {
    try {
      if (leadData.alias) {
        // Only include email if it has changed
        let payload = { ...leadData };
        const originalEmail = selectedLead?.user?.email || "";
        const updatedEmail = leadData?.user?.email || "";
        if (originalEmail === updatedEmail) {
          // Remove email from payload if not changed
          if (payload.user) {
            const { email, ...restUser } = payload.user;
            payload.user = restUser;
          }
        }
        const result = await updateLeadDetails({
          payload,
          leadAlias: leadData.alias,
        });

        if (result.data) {
          toast.success("Lead update successfully.");
          // Clear errors on success
          setErrors({});
        } else if ("error" in result) {
          const normalized = normalizeApiErrors(result);
          setErrors(normalized);
          const firstMsg =
            Object.values(normalized).flat()[0] || "Invalid Request...";
          if (
            typeof firstMsg === "string" &&
            firstMsg.toLowerCase().includes("email") &&
            firstMsg.toLowerCase().includes("exist")
          ) {
            toast.error("User with this email already exists.");
          } else {
            toast.error(firstMsg as string);
          }
        } else {
          toast.error("Invalid Request...");
        }
      }
    } catch (error) {
      const normalized = normalizeApiErrors(error);
      setErrors(normalized);
      const firstMsg =
        Object.values(normalized).flat()[0] || "An error occurred";
      toast.error(firstMsg as string);
      console.error("Error saving lead:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleUpdateLead(leadData); // Pass the updated data to the server
    onSave(leadData); // Pass the updated data to the parent component
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Update Lead Info</span>
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
                  value={leadData?.user?.title || ""}
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
                    {errors["user.title"].join(" ")}
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
                  value={leadData?.user?.first_name || ""}
                  onChange={handleChange}
                  className="mb-2"
                  required
                />
                {errors["user.first_name"] && (
                  <div className="text-danger small mt-1">
                    {errors["user.first_name"].join(" ")}
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
                  value={leadData?.user?.middle_name || ""}
                  onChange={handleChange}
                  className="mb-2"
                />
                {errors["user.middle_name"] && (
                  <div className="text-danger small mt-1">
                    {errors["user.middle_name"].join(" ")}
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
                  value={leadData?.user?.last_name || ""}
                  onChange={handleChange}
                  className="mb-2"
                  required
                />
                {errors["user.last_name"] && (
                  <div className="text-danger small mt-1">
                    {errors["user.last_name"].join(" ")}
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
                  value={leadData?.user?.email || ""}
                  onChange={handleChange}
                  className="mb-2"
                />
                {errors["user.email"] && (
                  <div className="text-danger small mt-1">
                    {errors["user.email"].join(" ")}
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
                  value={leadData?.user?.phone || ""}
                  onChange={handleChange}
                  className="mb-2"
                />
                {errors["user.phone"] && (
                  <div className="text-danger small mt-1">
                    {errors["user.phone"].join(" ")}
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
                  value={leadData.source || ""}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  <option value="REFERRAL">Referral</option>
                  <option value="ONLINE_AD">Online Ad</option>
                  <option value="SOCIAL_MEDIA">Social Media</option>
                  <option value="WALK_IN">Walk-in</option>
                  <option value="OTHER">Other</option>
                </Input>
                {errors.source && (
                  <div className="text-danger small mt-1">
                    {errors.source.join(" ")}
                  </div>
                )}
              </FormGroup>
            </Col>
            {leadData.source === "OTHER" && (
              <Col md={6}>
                <FormGroup>
                  <Label for="other_source">Other Source</Label>
                  <Input
                    id="other_source"
                    name="other_source"
                    type="text"
                    value={leadData.other_source || ""}
                    onChange={handleChange}
                  />
                  {errors.other_source && (
                    <div className="text-danger small mt-1">
                      {errors.other_source.join(" ")}
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
                  value={leadData.enquiry_type || ""}
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
                {errors.enquiry_type && (
                  <div className="text-danger small mt-1">
                    {errors.enquiry_type.join(" ")}
                  </div>
                )}
              </FormGroup>
            </Col>
            {leadData.enquiry_type === "OTHER" && (
              <Col md={6}>
                <FormGroup>
                  <Label for="other_enquiry_type">Other Enquiry</Label>
                  <Input
                    id="other_enquiry_type"
                    name="other_enquiry_type"
                    type="text"
                    value={leadData.other_enquiry_type || ""}
                    onChange={handleChange}
                  />
                  {errors.other_enquiry_type && (
                    <div className="text-danger small mt-1">
                      {errors.other_enquiry_type.join(" ")}
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
                  value={leadData.note || ""}
                  onChange={handleChange}
                  placeholder="Additional information about the lead..."
                />
                {errors.note && (
                  <div className="text-danger small mt-1">
                    {errors.note.join(" ")}
                  </div>
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
export default UpdateLeadModal;
