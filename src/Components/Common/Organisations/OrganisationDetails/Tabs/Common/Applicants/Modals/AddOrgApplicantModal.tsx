import { useAddOrgApplicantMutation } from "@/Redux/Reducers/Common/Organisations/OrganisationDetails/OrgApplicantApi";
import { AddOrgApplicantModalProps } from "@/Types/Common/Organisations/OrgApplicantType";
import { useParams } from "next/navigation";
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

const AddOrgApplicantModal: React.FC<AddOrgApplicantModalProps> = ({
  isOpen,
  toggle,
  onApplicantCreated,
  onOpenCase,
  header,
  role,
}) => {
  const params = useParams();
  const { organisationslug } = params;

  const [addApplicants, { isLoading: isAddingApplicants }] =
    useAddOrgApplicantMutation();

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

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [createdApplicantData, setCreatedApplicantData] = useState<any | null>(
    null,
  );
  const [submitType, setSubmitType] = useState<"lead" | "case" | null>(null);

  const extractErrorDetail = (err: any): string => {
    if (!err) return "An error occurred. Please try again.";
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
    const data = err?.response?.data || err?.data || err;
    return (
      (data && (data.detail || data?.message)) ||
      err.message ||
      "An error occurred. Please try again."
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prev) => {
      if (!prev) return prev;
      const copy = { ...prev };
      delete copy[name];
      if (name === "firstName") delete copy["first_name"];
      if (name === "middleName") delete copy["middle_name"];
      if (name === "lastName") delete copy["last_name"];
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
      newErrors.note = Array.isArray(data.note)
        ? data.note
        : [String(data.note)];

    if (data?.detail && typeof data.detail === "string")
      newErrors._general = [data.detail];

    return newErrors;
  };

  const buildPayload = () => ({
    // /auth/user-list/ expects a flat payload.
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
  });

  const resetForm = () => {
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
  };

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = buildPayload();

    try {
      const result = await addApplicants({ organisationslug, payload });
      if (result.data) {
        toast.success("Applicant added successfully.");
        if (onApplicantCreated && result.data)
          onApplicantCreated(result.data as any);
        setCreatedApplicantData(result.data);
        resetForm();
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
      setSubmitType(null);
    }
  };

  const computedLeadName = createdApplicantData?.user
    ? [
        createdApplicantData.user.title,
        createdApplicantData.user.first_name,
        createdApplicantData.user.middle_name,
        createdApplicantData.user.last_name,
      ]
        .filter(Boolean)
        .join(" ")
    : createdApplicantData
      ? [
          createdApplicantData.title,
          createdApplicantData.first_name,
          createdApplicantData.middle_name,
          createdApplicantData.last_name,
        ]
          .filter(Boolean)
          .join(" ")
      : formData.firstName || formData.lastName
        ? `${formData.title ? formData.title + " " : ""}${formData.firstName}${formData.middleName ? " " + formData.middleName : ""} ${formData.lastName}`.trim()
        : undefined;

  const handleSaveAndCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = buildPayload();

    try {
      const result = await addApplicants({ organisationslug, payload });
      if (result.data) {
        toast.success("Lead added successfully.");
        const applicantId =
          (result.data as any)?.id ?? (result.data as any)?.user?.id;
        setCreatedApplicantData(result.data);
        if (onApplicantCreated && result.data)
          onApplicantCreated(result.data as any);

        const leadName = (() => {
          const d: any = result.data;
          const u = d?.user || d;
          return [u?.title, u?.first_name, u?.middle_name, u?.last_name]
            .filter(Boolean)
            .join(" ");
        })();

        onOpenCase?.({
          applicantId,
          applicantName: leadName || computedLeadName,
          applicantData: result.data,
        });
        resetForm();
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
      setSubmitType(null);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Add {header}</span>
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
                  <Label for="other_enquiry_type">Other Enquiry Type</Label>
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
            <Col md={12}>
              <FormGroup>
                <Label for="note">Note</Label>
                <Input
                  id="note"
                  name="note"
                  type="textarea"
                  value={formData.note || ""}
                  onChange={handleInputChange}
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
            disabled={isAddingApplicants}
            onClick={() => setSubmitType("lead")}
          >
            {isAddingApplicants && submitType === "lead"
              ? "Saving..."
              : `Save ${header}`}
          </Button>
          {header === "Lead" && (
            <Button
              type="submit"
              color="secondary"
              disabled={isAddingApplicants}
              onClick={() => setSubmitType("case")}
            >
              {isAddingApplicants && submitType === "case"
                ? "Saving..."
                : "Save & Create Case"}
            </Button>
          )}
          <Button color="danger" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddOrgApplicantModal;
