import { useUpdateClientDetailsMutation } from "@/Redux/Reducers/CommonComponents/CommonUsers/ClientsApi";
import {
  ClientInfoProps,
  UpdateClientModalProps,
} from "@/Types/CommonComponents/CommonUsers/ClientTypes";
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

  const [updateClientDetails, { isLoading }] = useUpdateClientDetailsMutation();

  useEffect(() => {
    setClientData(selectedClient);
    setIsModified(false);
  }, [selectedClient]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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

      // Deep clone and sanitize payload
      let payload: Partial<ClientInfoProps> = JSON.parse(
        JSON.stringify(clientData)
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
        toast.success("Client updated successfully.");
      } else if ("error" in result) {
        const errorMessage =
          (result.error as any)?.data?.user?.email?.[0] ||
          (result.error as any)?.data?.user?.nid?.[0] ||
          (result.error as any)?.data?.detail ||
          "Invalid Request...";
        // Custom error for duplicate email
        if (
          typeof errorMessage === "string" &&
          errorMessage.toLowerCase().includes("email") &&
          errorMessage.toLowerCase().includes("exist")
        ) {
          toast.error("User with this email already exists.");
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error("Failed to update client.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the client.");
      console.error("Error saving client:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleUpdateClient(clientData); // Pass the updated data to the server
    onSave(clientData); // Pass the updated data to the parent component
    toggle();
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
