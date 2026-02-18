import { useAddAuthUserMutation } from "@/Redux/Reducers/Common/CommonUsers/AuthUsersApi";
import { AddLeadModalProps } from "@/Types/Common/CommonUsers/LeadTypes";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
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
const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  toggle,
  onLeadCreated,
  onOpenCase,
}) => {
  const [addAuthUser, { isLoading }] = useAddAuthUserMutation();
  const router = useRouter();

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

  // Hold per-field validation errors returned from API
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [createdLeadId, setCreatedLeadId] = useState<number | null>(null);
  const [createdLeadData, setCreatedLeadData] = useState<any | null>(null);
  const [submitType, setSubmitType] = useState<"lead" | "case" | null>(null);

  const { data: session } = useSession();
  const userType = session?.user?.user_type;

  // Helper to extract an informative error message from RTK Query results or thrown errors
  const extractErrorDetail = (err: any): string => {
    // RTK Query error result (result.error)
    if (!err) return "An error occurred. Please try again.";
    // If it's an RTK Query result object containing .error
    if (err.error) {
      const data =
        (err.error as any).data ||
        (err.error as any).originalStatus ||
        (err.error as any);
      return (
        (data && (data.detail || data?.message)) ||
        (err.error as any).statusText ||
        JSON.stringify(err.error)
      );
    }
    // If it's an exception thrown
    const data = err?.response?.data || err?.data || err;
    return (
      (data && (data.detail || data?.message)) ||
      err.message ||
      "An error occurred. Please try again."
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear any existing error for this specific field when user edits it
    setErrors((prev) => {
      if (!prev) return prev;
      const copy = { ...prev };
      // input `name` uses camelCase for some fields and snake_case for others
      // remove both possible keys to be safe
      delete copy[name];
      // also try mapping snake_case to camelCase and vice-versa
      if (name === "firstName") delete copy["first_name"];
      if (name === "middleName") delete copy["middle_name"];
      if (name === "lastName") delete copy["last_name"];
      if (name === "reason_for_enquiry") delete copy["reason_for_enquiry"];
      return copy;
    });
  };

  const normalizeApiErrors = (err: any): Record<string, string[]> => {
    const newErrors: Record<string, string[]> = {};
    const data =
      (err?.error && (err.error as any).data) ||
      err?.response?.data ||
      err?.data ||
      err;

    // If nested user errors exist (e.g., data.user.email -> ["..."])
    if (data?.user && typeof data.user === "object") {
      const user = data.user as Record<string, any>;
      if (user.first_name)
        newErrors.firstName = Array.isArray(user.first_name)
          ? user.first_name
          : [String(user.first_name)];
      if (user.middle_name)
        newErrors.middleName = Array.isArray(user.middle_name)
          ? user.middle_name
          : [String(user.middle_name)];
      if (user.last_name)
        newErrors.lastName = Array.isArray(user.last_name)
          ? user.last_name
          : [String(user.last_name)];
      if (user.email)
        newErrors.email = Array.isArray(user.email)
          ? user.email
          : [String(user.email)];
      if (user.phone)
        newErrors.phone = Array.isArray(user.phone)
          ? user.phone
          : [String(user.phone)];
      if (user.title)
        newErrors.title = Array.isArray(user.title)
          ? user.title
          : [String(user.title)];
    }

    // Also support flat (non-nested) field errors returned by /auth/user-list/
    if (data?.first_name)
      newErrors.firstName = Array.isArray(data.first_name)
        ? data.first_name
        : [String(data.first_name)];
    if (data?.middle_name)
      newErrors.middleName = Array.isArray(data.middle_name)
        ? data.middle_name
        : [String(data.middle_name)];
    if (data?.last_name)
      newErrors.lastName = Array.isArray(data.last_name)
        ? data.last_name
        : [String(data.last_name)];
    if (data?.email)
      newErrors.email = Array.isArray(data.email)
        ? data.email
        : [String(data.email)];
    if (data?.phone)
      newErrors.phone = Array.isArray(data.phone)
        ? data.phone
        : [String(data.phone)];

    // Top-level field errors
    if (data?.gender)
      newErrors.gender = Array.isArray(data.gender)
        ? data.gender
        : [String(data.gender)];
    if (data?.reason_for_enquiry)
      newErrors.reason_for_enquiry = Array.isArray(data.reason_for_enquiry)
        ? data.reason_for_enquiry
        : [String(data.reason_for_enquiry)];
    if (data?.title)
      newErrors.title = Array.isArray(data.title)
        ? data.title
        : [String(data.title)];

    if (data?.source)
      newErrors.source = Array.isArray(data.source)
        ? data.source
        : [String(data.source)];
    if (data?.other_source)
      newErrors.other_source = Array.isArray(data.other_source)
        ? data.other_source
        : [String(data.other_source)];
    if (data?.enquiry_type)
      newErrors.enquiry_type = Array.isArray(data.enquiry_type)
        ? data.enquiry_type
        : [String(data.enquiry_type)];
    if (data?.other_enquiry_type)
      newErrors.other_enquiry_type = Array.isArray(data.other_enquiry_type)
        ? data.other_enquiry_type
        : [String(data.other_enquiry_type)];
    if (data?.note)
      newErrors.note = Array.isArray(data.note) ? data.note : [String(data.note)];

    // If API returns a detail/message, attach it as a general error under _general
    if (data?.detail && typeof data.detail === "string")
      newErrors._general = [data.detail];

    return newErrors;
  };

  const handleSaveAndCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      first_name: formData.firstName,
      middle_name: formData.middleName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone || null,
      role: "LEAD",
      source: formData.source || "",
      other_source: formData.other_source,
      enquiry_type: formData.enquiry_type,
      other_enquiry_type: formData.other_enquiry_type,
      note: formData.note,
    };

    try {
      const result = await addAuthUser({ payload });
      if (result.data) {
        toast.success("Lead added successfully.");
        const leadId = (result.data as any)?.id ?? (result.data as any)?.user?.id;
        setCreatedLeadId(leadId);
        setCreatedLeadData(result.data);
        // If a parent provided onLeadCreated, notify it as well
        // so it can update any dependent UI (e.g., lead dropdown).
        if (onLeadCreated && result.data) {
          onLeadCreated(result.data as any);
        }
        // Tell parent to open the Case modal (so it can render the case modal
        // outside this component) then clear + close the Add Lead modal.
        onOpenCase?.({
          leadId,
          leadName: computedLeadName,
          leadData: result.data,
        });
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
        const normalized = normalizeApiErrors(result);
        setErrors(normalized);
        const firstMsg =
          Object.values(normalized).flat()[0] ||
          extractErrorDetail(result) ||
          "Invalid Request...";
        toast.error(firstMsg);
      } else {
        toast.error("Invalid Request...");
      }
    } catch (error: any) {
      const normalized = normalizeApiErrors(error);
      setErrors(normalized);
      const firstMsg =
        Object.values(normalized).flat()[0] ||
        extractErrorDetail(error) ||
        "An error occurred. Please try again.";
      toast.error(firstMsg);
      console.error("Error creating lead:", error);
    } finally {
      // Clear which button was submitting so only clicked button shows loading while active
      setSubmitType(null);
    }
  };

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      first_name: formData.firstName,
      middle_name: formData.middleName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone || null,
      role: "LEAD",
      source: formData.source || "",
      other_source: formData.other_source,
      enquiry_type: formData.enquiry_type,
      other_enquiry_type: formData.other_enquiry_type,
      note: formData.note,
    };

    try {
      const result = await addAuthUser({ payload });
      if (result.data) {
        toast.success("Lead added successfully.");
        // Notify parent with the full created lead payload so it
        // can derive ID and display name as needed.
        if (onLeadCreated && result.data) {
          onLeadCreated(result.data as any);
        }
        // Clear form data
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
        // Clear any existing errors on success
        setErrors({});
        setCreatedLeadData(result.data);
        toggle(); // Close the modal
      } else if ("error" in result) {
        const normalized = normalizeApiErrors(result);
        setErrors(normalized);
        const firstMsg =
          Object.values(normalized).flat()[0] ||
          extractErrorDetail(result) ||
          "Invalid Request...";
        toast.error(firstMsg);
        // toast.error((result.error as any)?.data);
      } else {
        toast.error("Invalid Request...");
      }
    } catch (error: any) {
      const normalized = normalizeApiErrors(error);
      setErrors(normalized);
      const firstMsg =
        Object.values(normalized).flat()[0] ||
        extractErrorDetail(error) ||
        "An error occurred. Please try again.";
      toast.error(firstMsg);
      console.error("Error creating lead:", error);
    } finally {
      setSubmitType(null);
    }
  };

  // derive leadName to pass to AddNewCaseModal — prefer API-returned data so the name
  // remains available after we clear the form when opening the case modal.
  const computedLeadName = createdLeadData?.user
    ? [
        createdLeadData.user.title,
        createdLeadData.user.first_name,
        createdLeadData.user.middle_name,
        createdLeadData.user.last_name,
      ]
        .filter(Boolean)
        .join(" ")
    : createdLeadData
      ? [
          createdLeadData.title,
          createdLeadData.first_name,
          createdLeadData.middle_name,
          createdLeadData.last_name,
        ]
          .filter(Boolean)
          .join(" ")
    : formData.firstName || formData.lastName
      ? `${formData.title ? formData.title + " " : ""}${formData.firstName}${formData.middleName ? " " + formData.middleName : ""} ${formData.lastName}`.trim()
      : undefined;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Add Lead</span>
      </ModalHeader>
      <Form
        onSubmit={(e) => {
          if (submitType === "lead") {
            handleSaveLead(e);
          } else if (submitType === "case") {
            handleSaveAndCreateCase(e);
          }
        }}
      >
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
                {errors.title && (
                  <div className="text-danger small mt-1">
                    {errors.title.join(" ")}
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
                {errors.firstName && (
                  <div className="text-danger small mt-1">
                    {errors.firstName.join(" ")}
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
                {errors.middleName && (
                  <div className="text-danger small mt-1">
                    {errors.middleName.join(" ")}
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
                {errors.lastName && (
                  <div className="text-danger small mt-1">
                    {errors.lastName.join(" ")}
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
                {errors.email && (
                  <div className="text-danger small mt-1">
                    {errors.email.join(" ")}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="phone">
                  Mobile Number<span className="text-danger">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="number"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  required
                />
                {errors.phone && (
                  <div className="text-danger small mt-1">
                    {errors.phone.join(" ")}
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
                {errors.source && (
                  <div className="text-danger small mt-1">
                    {errors.source.join(" ")}
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
                {errors.enquiry_type && (
                  <div className="text-danger small mt-1">
                    {errors.enquiry_type.join(" ")}
                  </div>
                )}
              </FormGroup>
            </Col>
            {formData.enquiry_type === "OTHER" && (
              <Col md={6}>
                <FormGroup>
                  <Label for="other_enquiry_type">Other Enquiry</Label>
                  <Input
                    id="other_enquiry_type"
                    name="other_enquiry_type"
                    type="text"
                    value={formData.other_enquiry_type || ""}
                    onChange={handleInputChange}
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
                  value={formData.note || ""}
                  onChange={handleInputChange}
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
          <Button
            type="submit"
            color="primary"
            disabled={isLoading}
            onClick={() => setSubmitType("lead")}
          >
            {isLoading && submitType === "lead" ? "Saving..." : "Save Lead"}
          </Button>
          <Button
            type="submit"
            color="success"
            disabled={isLoading}
            onClick={() => setSubmitType("case")}
          >
            {isLoading && submitType === "case"
              ? "Saving..."
              : "Save & Create Case"}
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddLeadModal;
