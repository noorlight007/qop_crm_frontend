import { useAddClientDetailsMutation } from "@/Redux/Reducers/Common/CommonUsers/ClientsApi";
import { AddClientModalProps } from "@/Types/Common/CommonUsers/ClientTypes";
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

const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, toggle }) => {
  const [addClientDetails, { isLoading }] = useAddClientDetailsMutation();
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    source: "",
    other_source: "",
    enquiry_type: "",
    other_enquiry_type: "",
    note: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    let payload = {
      user: {
        title: formData.title,
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone || "",
        password: formData.password,
      },
      source: formData.source || "",
      other_source: formData.other_source || "",
      enquiry_type: formData.enquiry_type || "",
      other_enquiry_type: formData.other_enquiry_type || "",
      note: formData.note || "",
    };

    try {
      const result = await addClientDetails({ payload });
      if (result.data) {
        toast.success("Client added successfully.");
        // Reset form and close modal
        setFormData({
          title: "",
          firstName: "",
          middleName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          source: "",
          other_source: "",
          enquiry_type: "",
          other_enquiry_type: "",
          note: "",
        });
        toggle();
      } else if ("error" in result) {
        const errorMessage =
          (result.error as any)?.data?.user?.email?.[0] || "Invalid Request...";
        toast.error(errorMessage);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error creating client:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Add Client</span>
      </ModalHeader>
      <Form onSubmit={handleSaveClient}>
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
                <Label for="password">
                  Password<span className="text-danger">*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="number"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
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
              </FormGroup>
            </Col>
            {formData.enquiry_type === "OTHER" && (
              <Col md={6}>
                <FormGroup>
                  <Label for="other_enquiry">Other Enquiry</Label>
                  <Input
                    id="other_enquiry"
                    name="other_enquiry_type"
                    type="text"
                    value={formData.other_enquiry_type || ""}
                    onChange={handleInputChange}
                  />
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
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" type="submit">
            {isLoading ? "Saving..." : "Save Client"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddClientModal;
