import { useSubmitEnquiryMutation } from "@/Redux/Reducers/InitialEnquiry/InitialEnquiryApi";
import React, { useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { TbCircleX } from "react-icons/tb";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Progress,
  Row,
} from "reactstrap";

interface FormData {
  title: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  email: string;
  enquiry_type: string;
  other_enquiry_type: string;
  estimated_property_value?: string;
  approximate_mortgage_required?: string;
  approximate_deposit_available?: string;
  source?: string;
  other_source?: string;
  notes: string;
  contact_consent: boolean;
  privacy_notice_consent: boolean;
}

const InitialEnquiryForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const INITIAL_FORM_DATA: FormData = {
    title: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    phone: "",
    email: "",
    enquiry_type: "",
    other_enquiry_type: "",
    estimated_property_value: "",
    approximate_mortgage_required: "",
    approximate_deposit_available: "",
    source: "",
    other_source: "",
    notes: "",
    contact_consent: false,
    privacy_notice_consent: false,
  };

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  const [submitEnquiry, { isLoading, isError, isSuccess, error }] =
    useSubmitEnquiryMutation();

  const initialEnquiryTabTitleData = [
    {
      id: "1",
      nav: "Applicant Details",
    },
    {
      id: "2",
      nav: "Mortgage Requirements",
    },
    {
      id: "3",
      nav: "Additional Information",
    },
    {
      id: "4",
      nav: "Review & Confirm",
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleBlur = (fieldName: string, value: any) => {
    if (!value) {
      setErrors(prev => ({ ...prev, [fieldName]: 'This field is required' }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return Boolean(
          formData.title &&
          formData.first_name &&
          formData.last_name &&
          formData.email &&
          formData.phone
        );

      case 2:
        return Boolean(
          formData.enquiry_type &&
          formData.estimated_property_value &&
          formData.approximate_mortgage_required &&
          formData.approximate_deposit_available
        );

      case 3:
        return Boolean(
          formData.source
        );

      case 4:
        return formData.contact_consent && formData.privacy_notice_consent;

      default:
        return false;
    }
  };

  const getFirstInvalidStep = (): number | null => {
    for (let step = 1; step <= 4; step++) {
      if (!validateStep(step)) {
        return step;
      }
    }
    return null;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setCurrentStep(1);
    setFormData(INITIAL_FORM_DATA);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const invalidStep = getFirstInvalidStep();

    if (invalidStep) {
      setCurrentStep(invalidStep);
      return;
    }

    try {
      await submitEnquiry({ payload: formData }).unwrap();
      toast.success("Form submitted successfully");
      setShowSuccess(true);
    } catch (err) {
      console.error("Submission failed", err);
      toast.error("Submission failed");
    }
  };

  return (
    <>
      {showSuccess ? (
        <div className="d-flex align-items-center justify-content-center p-4">
          <div style={{ maxWidth: "500px", width: "100%" }}>
            {/* Success Card */}
            <Card className="border-0 shadow">
              <button
                onClick={handleCloseSuccess}
                className="btn btn-link position-absolute top-0 end-0 text-secondary p-3"
                style={{
                  fontSize: "1.25rem",
                  textDecoration: "none",
                  zIndex: 10,
                }}
                aria-label="Close"
              >
                <TbCircleX size={24} />
              </button>
              <CardBody className="text-center py-5 px-4">
                {/* Success Icon */}
                <div className="mb-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle border-success"
                    style={{ width: "100px", height: "100px" }}
                  >
                    <FaCheck className="text-success" size={30} />
                  </div>
                </div>

                {/* Title */}
                <h2 className="mb-3 fw-bold text-success">
                  Submission Successful
                </h2>

                {/* Description */}
                <p
                  className="text-primary mb-0"
                  style={{ fontSize: "1.05rem" }}
                >
                  Your enquiry has been received
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="shadow-sm border-0 justify-content-center">
          <CardBody className="p-4">
            <Nav className="mb-4 d-flex justify-content-center align-items-center gap-2 pb-2 p-0">
              {initialEnquiryTabTitleData.map((item, index) => {
                const step = index + 1;

                return (
                  <NavItem key={index}>
                    <NavLink
                      role="button"
                      onClick={() => setCurrentStep(step)}
                      className={`px-3 py-1 rounded-pill small ${
                        currentStep === step
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-dark border-primary"
                      }`}
                      style={{ cursor: "pointer" }}
                    >
                      {item.nav}
                    </NavLink>
                  </NavItem>
                );
              })}

              <Progress
                value={(currentStep / 4) * 100}
                color="primary"
                style={{ height: "8px", width: "100%" }}
              />
            </Nav>

            <Form innerRef={formRef} onSubmit={handleSubmit}>
              {/* STEP 1 */}
              {currentStep === 1 && (
                <>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Title *</Label>
                        <Input
                          type="select"
                          name="title"
                          value={formData.title}
                          onBlur={(e) => handleBlur('title', e.target.value)}
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
                        {errors.title && <small className="text-danger">{errors.title}</small>}
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label>First Name *</Label>
                        <Input
                          name="first_name"
                          value={formData.first_name}
                          onBlur={(e) => handleBlur('first_name', e.target.value)}
                          onChange={handleChange}
                          required
                        />
                        {errors.first_name && <small className="text-danger">{errors.first_name}</small>}
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label>Middle Name</Label>
                        <Input
                          name="middle_name"
                          value={formData.middle_name}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label>Last Name *</Label>
                        <Input
                          name="last_name"
                          value={formData.last_name}
                          onBlur={(e) => handleBlur('last_name', e.target.value)}
                          onChange={handleChange}
                          required
                        />
                        {errors.last_name && <small className="text-danger">{errors.last_name}</small>}
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onBlur={(e) => handleBlur('email', e.target.value)}
                          onChange={handleChange}
                          required
                        />
                        {errors.email && <small className="text-danger">{errors.email}</small>}
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label>Mobile Number *</Label>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onBlur={(e) => handleBlur('phone', e.target.value)}
                          onChange={handleChange}
                          required
                        />
                        {errors.phone && <small className="text-danger">{errors.phone}</small>}
                      </FormGroup>
                    </Col>
                  </Row>
                </>
              )}

              {/* STEP 2 */}
              {currentStep === 2 && (
                <>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Enquiry Type *</Label>
                        <Input
                          type="select"
                          name="enquiry_type"
                          value={formData.enquiry_type}
                          onBlur={(e) => handleBlur('enquiry_type', e.target.value)}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select...</option>
                          <option value="PURCHASE">Purchase</option>
                          <option value="REMORTGAGE">Remortgage</option>
                          <option value="BUY_TO_LET">Buy-to-Let</option>
                          <option value="FIRST_TIME_BUYER">
                            First-Time Buyer
                          </option>
                          <option value="PROTECTION">Protection</option>
                          <option value="GENERAL_INSURANCE">
                            General Insurance
                          </option>
                          <option value="OTHER">Other</option>
                        </Input>
                        {errors.enquiry_type && <small className="text-danger">{errors.enquiry_type}</small>}
                      </FormGroup>
                    </Col>
                    {formData.enquiry_type === "OTHER" && (
                      <Col md={6}>
                        <FormGroup>
                          <Label for="other_enquiry_type">
                            Other Enquiery Type
                          </Label>
                          <Input
                            id="other_enquiry_type"
                            name="other_enquiry_type"
                            type="text"
                            value={formData.other_enquiry_type || ""}
                            onBlur={(e) => handleBlur('enquiry_type', e.target.value)}
                            onChange={handleChange}
                          />
                          {errors.enquiry_type && <small className="text-danger">{errors.enquiry_type}</small>}
                        </FormGroup>
                      </Col>
                    )}

                    <Col md={6}>
                      <FormGroup>
                        <Label>Estimated Property Value (£) *</Label>
                        <Input
                          name="estimated_property_value"
                          type="number"
                          value={formData.estimated_property_value}
                          onBlur={(e) => handleBlur('estimated_property_value', e.target.value)}
                          onChange={handleChange}
                          required
                        />
                        {errors.estimated_property_value && <small className="text-danger">{errors.estimated_property_value}</small>}
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label>Approximate Mortgage Required (£) *</Label>
                        <Input
                          name="approximate_mortgage_required"
                          type="number"
                          value={formData.approximate_mortgage_required}
                          onBlur={(e) => handleBlur('approximate_mortgage_required', e.target.value)}
                          onChange={handleChange}
                          required
                        />
                        {errors.approximate_mortgage_required && <small className="text-danger">{errors.approximate_mortgage_required}</small>}
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label>Approximate Deposit Available (£ or %) *</Label>
                        <Input
                          name="approximate_deposit_available"
                          type="number"
                          value={formData.approximate_deposit_available}
                          onBlur={(e) => handleBlur('approximate_deposit_available', e.target.value)}
                          onChange={handleChange}
                          required
                        />
                        {errors.approximate_deposit_available && <small className="text-danger">{errors.approximate_deposit_available}</small>}
                      </FormGroup>
                    </Col>
                  </Row>
                </>
              )}

              {/* STEP 3 */}
              {currentStep === 3 && (
                <>
                  <Col>
                    <FormGroup>
                      <Label>How did you hear about us? *</Label>
                      <Input
                        type="select"
                        name="source"
                        required
                        value={formData.source}
                        onBlur={(e) => handleBlur('source', e.target.value)}
                        onChange={handleChange}
                      >
                        <option value="">Select...</option>
                        <option value="GOOGLE">Google</option>
                        <option value="SOCIAL_MEDIA">Social Media</option>
                        <option value="REFERRAL">Referral</option>
                        <option value="WEBSITE">Website</option>
                        <option value="OTHER">Other</option>
                      </Input>
                      {errors.source && <small className="text-danger">{errors.source}</small>}
                    </FormGroup>
                  </Col>
                  {formData.source === "OTHER" && (
                    <Col>
                      <FormGroup>
                        <Label for="other_source">Other Source</Label>
                        <Input
                          id="other_source"
                          name="other_source"
                          type="text"
                          value={formData.other_source || ""}
                          onBlur={(e) => handleBlur('source', e.target.value)}
                          onChange={handleChange}
                        />
                        {errors.source && <small className="text-danger">{errors.source}</small>}
                      </FormGroup>
                    </Col>
                  )}

                  <Col>
                    <FormGroup>
                      <Label>Notes / Additional Comments</Label>
                      <Input
                        type="textarea"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={4}
                      />
                    </FormGroup>
                  </Col>
                </>
              )}

              {/* STEP 4 */}
              {currentStep === 4 && (
                <>
                  <Row className="mb-4">
                    {/* PERSONAL INFO */}
                    <Col md={6}>
                      <div className="border rounded p-3 h-100">
                        <h6 className="fw-bold mb-3">Personal Information</h6>
                        <p>
                          <strong>Title:</strong> {formData.title}
                        </p>
                        <p>
                          <strong>Name:</strong> {formData.first_name}{" "}
                          {formData.middle_name} {formData.last_name}
                        </p>
                        <p>
                          <strong>Email:</strong> {formData.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {formData.phone}
                        </p>
                      </div>
                    </Col>

                    {/* Enquiry INFO */}
                    <Col md={6}>
                      <div className="border rounded p-3 h-100">
                        <h6 className="fw-bold mb-3">Enquiry Information</h6>
                        <p>
                          <strong>Enquiry Type:</strong> {formData.enquiry_type}
                        </p>
                        <p>
                          <strong>Property Value:</strong> £
                          {formData.estimated_property_value}
                        </p>
                        <p>
                          <strong>Mortgage Required:</strong> £
                          {formData.approximate_mortgage_required}
                        </p>
                        <p>
                          <strong>Deposit Available:</strong>{" "}
                          {formData.approximate_deposit_available}
                        </p>
                      </div>
                    </Col>
                  </Row>

                  {/* CONSENT */}
                  <div className="border rounded p-3">
                    <FormGroup check className="mb-2">
                      <Input
                        type="checkbox"
                        name="contact_consent"
                        checked={formData.contact_consent}
                        onChange={handleChange}
                      />
                      <Label check className="ms-2">
                        I consent to be contacted by telephone, email, or SMS in
                        relation to my mortgage enquiry.
                      </Label>
                    </FormGroup>

                    <FormGroup check>
                      <Input
                        type="checkbox"
                        name="privacy_notice_consent"
                        checked={formData.privacy_notice_consent}
                        onChange={handleChange}
                      />
                      <Label check className="ms-2">
                        I confirm that I have read and understood the Privacy
                        Notice and consent to my personal data being processed
                        in accordance with it.
                      </Label>
                    </FormGroup>
                  </div>
                </>
              )}

              <hr />

              <div className="d-flex justify-content-between">
                {currentStep > 1 && (
                  <Button color="secondary" outline onClick={handlePrev}>
                    Back
                  </Button>
                )}

                {currentStep < 4 ? (
                  <Button
                    color="primary"
                    className="ms-auto"
                    onClick={handleNext}
                    disabled={
                      (currentStep === 1 && !formData.first_name) ||
                      (currentStep === 2 && !formData.email)
                    }
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    className="ms-auto"
                    disabled={
                      !formData.contact_consent ||
                      !formData.privacy_notice_consent
                    }
                  >
                    Submit Application
                  </Button>
                )}
              </div>
            </Form>
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default InitialEnquiryForm;
