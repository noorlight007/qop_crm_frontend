import { useAddLeadDetailsMutation } from "@/Redux/Reducers/CommonComponents/Directors/LeadDetalisApi";
import { AddLeadModalProps } from "@/Types/CommonComponents/Directors/LeadTypes";
import { getCaseUrl } from "@/utils/GetCaseUrl";
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
      } else if ("error" in result) {
        const errorMessage =
          (result.error as any)?.data?.user?.email?.[0] ||
          (result.error as any)?.data?.detail ||
          extractErrorDetail(result) ||
          "Invalid Request...";
        toast.error(errorMessage);
      } else {
        toast.error("Invalid Request...");
      }
    } catch (error: any) {
      const errorMessage =
        (error?.response?.data?.user?.email?.[0] as string) ||
        (error?.response?.data?.detail as string) ||
        extractErrorDetail(error) ||
        "An error occurred. Please try again.";
      toast.error(errorMessage);
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
        toggle(); // Close the modal
      } else if ("error" in result) {
        const errorMessage =
          (result.error as any)?.data?.user?.email?.[0] ||
          (result.error as any)?.data?.detail ||
          extractErrorDetail(result) ||
          "Invalid Request...";
        toast.error(errorMessage);
      } else {
        toast.error("Invalid Request...");
      }
    } catch (error: any) {
      const errorMessage =
        (error?.response?.data?.user?.email?.[0] as string) ||
        (error?.response?.data?.detail as string) ||
        extractErrorDetail(error) ||
        "An error occurred. Please try again.";
      toast.error(errorMessage);
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
              </FormGroup>
            </Col>
            <Col md={6}>
              <Label for="reasonForEnquiry">Reason For Enquiry</Label>
              <FormGroup>
                <Input
                  id="reasonForEnquiry"
                  name="reasonForEnquiry"
                  type="text"
                  className="rounded-end-0"
                  value={formData.reason_for_enquiry}
                  onChange={handleInputChange}
                />
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
            Save & Create Case
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
