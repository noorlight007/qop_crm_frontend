import { useUpdateNetworkApplicantMutation } from "@/Redux/Reducers/SuperAdmin/Networks/NetworksApi";
import { UpdateNetworkApplicantModalProps } from "@/Types/SuperAdmin/Networks/NetworkTypes";
import { useParams } from "next/navigation";
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

const UpdateNetworkApplicantModal: React.FC<
  UpdateNetworkApplicantModalProps
> = ({ isOpen, toggle, applicantToUpdate, role }) => {
  const { networkslug } = useParams();

  const [updateApplicant, { isLoading: isUpdating }] =
    useUpdateNetworkApplicantMutation();

  const [formData, setFormData] = useState({
    title: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    phone: "",
    source: "",
    other_source: "",
    enquiry_type: "",
    other_enquiry_type: "",
    note: "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Populate form when lead data changes
  useEffect(() => {
    if (applicantToUpdate && isOpen) {
      setFormData({
        title: applicantToUpdate.title || "",
        first_name: applicantToUpdate.first_name || "",
        middle_name: applicantToUpdate.middle_name || "",
        last_name: applicantToUpdate.last_name || "",
        email: applicantToUpdate.email || "",
        phone: applicantToUpdate.phone || "",
        source: applicantToUpdate.source || "",
        other_source: applicantToUpdate.other_source || "",
        enquiry_type: applicantToUpdate.enquiry_type || "",
        other_enquiry_type: applicantToUpdate.other_enquiry_type || "",
        note: applicantToUpdate.note || "",
      });
      setErrors({});
    }
  }, [applicantToUpdate, isOpen]);

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

    if (data?.title)
      newErrors.title = Array.isArray(data.title)
        ? data.title
        : [String(data.title)];
    if (data?.first_name)
      newErrors.first_name = Array.isArray(data.first_name)
        ? data.first_name
        : [String(data.first_name)];
    if (data?.middle_name)
      newErrors.middle_name = Array.isArray(data.middle_name)
        ? data.middle_name
        : [String(data.middle_name)];
    if (data?.last_name)
      newErrors.last_name = Array.isArray(data.last_name)
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
    title: formData.title,
    first_name: formData.first_name,
    middle_name: formData.middle_name,
    last_name: formData.last_name,
    email: formData.email,
    phone: formData.phone || null,
    source: formData.source || "",
    other_source: formData.other_source,
    enquiry_type: formData.enquiry_type,
    other_enquiry_type: formData.other_enquiry_type,
    note: formData.note,
  });

  const handleUpdateLead = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!networkslug || !applicantToUpdate?.alias) {
      toast.error("Missing lead information.");
      return;
    }

    const payload = buildPayload();

    try {
      await updateApplicant({
        network_slug: networkslug,
        user_alias: applicantToUpdate.alias,
        payload,
      }).unwrap();
      toast.success(
        `${role === "LEAD" ? "Lead" : "Applicant"} updated successfully.`,
      );
      toggle();
    } catch (error: any) {
      const normalized = normalizeApiErrors(error);
      setErrors(normalized);
      const firstMsg =
        Object.values(normalized).flat()[0] ||
        (typeof error?.message === "string"
          ? error.message
          : "Failed to update " +
            (role === "LEAD" ? "lead" : "applicant") +
            ". Please try again.");
      toast.error(firstMsg);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">
          Update {role === "LEAD" ? "Lead" : "Applicant"}
        </span>
      </ModalHeader>
      <Form onSubmit={handleUpdateLead}>
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
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                />
                {errors.first_name && (
                  <div className="text-danger small mt-1">
                    {errors.first_name.join(" ")}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="middleName">Middle Name(s)</Label>
                <Input
                  id="middleName"
                  name="middle_name"
                  type="text"
                  value={formData.middle_name || ""}
                  onChange={handleInputChange}
                />
                {errors.middle_name && (
                  <div className="text-danger small mt-1">
                    {errors.middle_name.join(" ")}
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
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                />
                {errors.last_name && (
                  <div className="text-danger small mt-1">
                    {errors.last_name.join(" ")}
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
          <Button type="submit" color="primary" disabled={isUpdating}>
            {isUpdating
              ? `Updating ${role === "LEAD" ? "Lead" : "Applicant"}...`
              : `Update ${role === "LEAD" ? "Lead" : "Applicant"}`}
          </Button>
          <Button color="danger" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default UpdateNetworkApplicantModal;
