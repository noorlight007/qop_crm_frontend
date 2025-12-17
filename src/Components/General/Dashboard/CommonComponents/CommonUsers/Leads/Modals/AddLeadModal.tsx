import { useAddLeadDetailsMutation } from "@/Redux/Reducers/CommonComponents/CommonUsers/LeadDetalisApi";
import { AddLeadModalProps } from "@/Types/CommonComponents/CommonUsers/LeadTypes";
import { getCaseUrl } from "@/utils/RedirectPaths";
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
import AddNewCaseModal from "../../../Cases/Modals/AddNewCaseModal";

const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, toggle }) => {
  const [addLeadDetails, { isLoading }] = useAddLeadDetailsMutation();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    reason_for_enquiry: "",
  });

  // Hold per-field validation errors returned from API
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Add state for AddNewCaseModal
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const toggleCaseModal = () => setIsCaseModalOpen((prev) => !prev);

  const [createdLeadId, setCreatedLeadId] = useState<number | null>(null);
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
    }

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

    // If API returns a detail/message, attach it as a general error under _general
    if (data?.detail && typeof data.detail === "string")
      newErrors._general = [data.detail];

    return newErrors;
  };

  const handleSaveAndCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      user: {
        title: formData.title,
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
      },
      gender: formData.gender,
      reason_for_enquiry: formData.reason_for_enquiry,
    };

    try {
      const result = await addLeadDetails({ payload });
      if (result.data) {
        toast.success("Lead added successfully.");
        const leadId = result.data.user?.id;
        setCreatedLeadId(leadId);
        setIsCaseModalOpen(true);
        // Clear any existing errors on success
        setErrors({});
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
    }
  };

  const handleCaseCreated = (caseAlias: string) => {
    setIsCaseModalOpen(false);
    toggle();
    router.push(getCaseUrl(caseAlias, userType as string));
  };

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      user: {
        title: formData.title,
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
      },
      gender: formData.gender,
      reason_for_enquiry: formData.reason_for_enquiry,
    };

    try {
      const result = await addLeadDetails({ payload });
      if (result.data) {
        toast.success("Lead added successfully.");
        // Clear form data
        setFormData({
          title: "",
          firstName: "",
          middleName: "",
          lastName: "",
          email: "",
          phone: "",
          gender: "",
          reason_for_enquiry: "",
        });
        // Clear any existing errors on success
        setErrors({});
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
    }
  };

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
                {errors.gender && (
                  <div className="text-danger small mt-1">
                    {errors.gender.join(" ")}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <Label for="reasonForEnquiry">Reason For Enquiry</Label>
              <FormGroup>
                <Input
                  id="reasonForEnquiry"
                  name="reason_for_enquiry"
                  type="text"
                  className="rounded-end-0"
                  value={formData.reason_for_enquiry}
                  onChange={handleInputChange}
                />
                {errors.reason_for_enquiry && (
                  <div className="text-danger small mt-1">
                    {errors.reason_for_enquiry.join(" ")}
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
            onClick={() => setSubmitType("lead")}
          >
            {isLoading ? "Saving..." : "Save Lead"}
          </Button>
          <Button
            type="submit"
            color="success"
            onClick={() => setSubmitType("case")}
          >
            {isLoading ? "Saving..." : "Save & Create Case"}
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
      <AddNewCaseModal
        isOpen={isCaseModalOpen}
        toggle={toggleCaseModal}
        leadId={createdLeadId || undefined}
        onCaseCreated={handleCaseCreated}
      />
    </Modal>
  );
};

export default AddLeadModal;
